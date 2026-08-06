"""Vision-LLM 2D Teknik Resim Analizi (OpenAI / ChatGPT API).

Kullanici PDF teknik resim yuklediginde eksik olculendirmeleri tespit etmek
icin OpenAI API'sine istek hazirlar. API anahtari .env'den okunur, koda
yazilmaz. MVP'de gercek cagri yerine mock yanit doner; USE_REAL_API=True
yapildiginda gercek Vision cagrisi calisir.
"""
import base64
import json
from pathlib import Path
from typing import Any, Dict, List

from .config import require_openai_key

USE_REAL_API = True

MAX_PDF_PAGES = 3
RENDER_DPI = 150

SYSTEM_PROMPT = (
    "Sen kıdemli bir makine mühendisi ve teknik resim kontrolörüsün. "
    "Verilen 2D teknik resimde eksik ölçülendirmeleri, eksik toleransları ve "
    "ISO 128 / ISO 2768 standartlarına aykırılıkları tespit et. "
    "Yanıtı Türkçe ve şu JSON formatında ver: "
    '{"missingDimensions": ["..."], "missingTolerances": ["..."], "suggestions": ["..."]}'
)

MOCK_RESPONSE: Dict[str, Any] = {
    "provider": "mock",
    "model": "gpt-4o (mock)",
    "missingDimensions": [
        "Sol yan görünüşte cep derinliği ölçüsü verilmemiş.",
        "Ø10 mm merkezleme pimi deliğinin konum ölçüsü (datum referansı) eksik.",
    ],
    "missingTolerances": [
        "Kritik geçme deliklerinde ISO H7 tolerans sembolü bulunamadı.",
        "Genel tolerans bloğu (ISO 2768-m) antetde belirtilmemiş.",
    ],
    "suggestions": [
        "Antet bölümüne yüzey pürüzlülüğü (Ra) genel işareti ekleyin.",
        "Kesit görünüşü ekleyerek iç cep geometrisini netleştirin.",
    ],
    "note": "Bu yanıt MVP mock çıktısıdır; gerçek Vision-LLM çağrısı USE_REAL_API ile aktifleşir.",
}


def _pdf_pages_to_base64_pngs(file_path: Path) -> List[str]:
    import pymupdf

    images: List[str] = []
    with pymupdf.open(file_path) as doc:
        for page_index in range(min(doc.page_count, MAX_PDF_PAGES)):
            pix = doc[page_index].get_pixmap(dpi=RENDER_DPI)
            images.append(base64.b64encode(pix.tobytes("png")).decode("ascii"))
    return images


def analyze_technical_drawing(file_path: Path) -> Dict[str, Any]:
    """PDF teknik resmi GPT-4o Vision ile analiz eder; hata durumunda mock'a düşer."""
    api_key = require_openai_key()

    if not USE_REAL_API:
        return {**MOCK_RESPONSE, "analyzedFile": file_path.name}

    try:
        from openai import OpenAI

        images = _pdf_pages_to_base64_pngs(file_path)
        if not images:
            raise ValueError("PDF'ten görüntü üretilemedi")

        content: List[Dict[str, Any]] = [
            {
                "type": "text",
                "text": (
                    f"Teknik resim dosyası: {file_path.name}. "
                    "Ekteki sayfa görüntülerini incele ve istenen JSON'u üret."
                ),
            }
        ]
        for b64 in images:
            content.append({
                "type": "image_url",
                "image_url": {"url": f"data:image/png;base64,{b64}"},
            })

        client = OpenAI(api_key=api_key)
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": content},
            ],
            response_format={"type": "json_object"},
            max_tokens=900,
        )
        data = json.loads(response.choices[0].message.content or "{}")
        return {
            "provider": "openai",
            "model": response.model,
            "missingDimensions": data.get("missingDimensions", []),
            "missingTolerances": data.get("missingTolerances", []),
            "suggestions": data.get("suggestions", []),
            "analyzedFile": file_path.name,
        }
    except Exception as exc:  # Demo dayanıklılığı: LLM hatası analizi düşürmesin
        return {
            **MOCK_RESPONSE,
            "analyzedFile": file_path.name,
            "note": f"Gerçek LLM çağrısı başarısız oldu ({exc}); mock yanıt gösteriliyor.",
        }
