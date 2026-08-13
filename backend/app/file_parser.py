"""Modul A - Dosya Yukleme ve Parse.

Yuklenen .step/.iges/.pdf dosyalarini uploads/ klasorune kaydeder ve dosyanin
mimari yapisini (header) okuyan placeholder bir parse fonksiyonu icerir.
Gercek OpenCASCADE entegrasyonunda `parse_cad_file` icerigi degistirilecek.
"""
import uuid
from pathlib import Path
from typing import Any, Dict

from fastapi import UploadFile

from .config import UPLOADS_DIR

ALLOWED_EXTENSIONS = {".step", ".stp", ".iges", ".igs", ".pdf"}
MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB


class InvalidFileError(Exception):
    pass


def save_upload(upload: UploadFile) -> Dict[str, Any]:
    """Dosyayi dogrula, benzersiz bir isimle uploads/ altina kaydet."""
    original_name = Path(upload.filename or "dosya").name
    ext = Path(original_name).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise InvalidFileError(
            f"Desteklenmeyen dosya türü: {ext}. İzin verilenler: {', '.join(sorted(ALLOWED_EXTENSIONS))}"
        )

    content = upload.file.read()
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise InvalidFileError("Dosya boyutu 50 MB sınırını aşıyor.")

    file_id = uuid.uuid4().hex
    stored_path = UPLOADS_DIR / f"{file_id}{ext}"
    stored_path.write_bytes(content)

    return {
        "fileId": file_id,
        "originalName": original_name,
        "storedPath": str(stored_path),
        "extension": ext,
        "sizeBytes": len(content),
        "message": "Dosya başarıyla alındı, analiz başlıyor",
        "parse": parse_cad_file(stored_path, ext),
    }


def find_stored_file(file_id: str) -> Path | None:
    for ext in ALLOWED_EXTENSIONS:
        candidate = UPLOADS_DIR / f"{file_id}{ext}"
        if candidate.exists():
            return candidate
    return None


def parse_cad_file(file_path: Path, ext: str) -> Dict[str, Any]:
    """PLACEHOLDER: Dosyanin mimari yapisini yuzeysel okur.

    OpenCASCADE entegrasyonunda STEPControl_Reader / IGESControl_Reader ile
    gercek B-Rep topolojisi buradan yuklenecek.
    """
    head = file_path.read_bytes()[:256]
    info: Dict[str, Any] = {"format": ext.lstrip("."), "validHeader": False}

    if ext in {".step", ".stp"}:
        info["validHeader"] = head.startswith(b"ISO-10303-21")
        info["standard"] = "ISO 10303-21 (STEP AP203/AP214)"
    elif ext in {".iges", ".igs"}:
        info["validHeader"] = len(head) > 72
        info["standard"] = "IGES 5.3"
    elif ext == ".pdf":
        info["validHeader"] = head.startswith(b"%PDF")
        info["standard"] = "PDF (2D Teknik Resim)"

    info["note"] = (
        "Placeholder parser: Tam geometri okuma OpenCASCADE entegrasyonu ile eklenecek. "
        "Şu an analiz mock geometri simülasyonu ile yürütülüyor."
    )
    return info
