# MechCode — Makine Mühendisliği Eğitim & Portföy Platformu (MVP)

Mühendislik öğrencilerinin gerçek endüstriyel CAD görevlerini DFM (Üretim İçin
Tasarım) kurallarına göre analiz ettiği, skor ve rozet kazandığı, işverenlere
açık portföy oluşturduğu B2B SaaS platformu prototipi.

## Mimari

- **Frontend:** React 19 + Vite + Tailwind CSS 4 + Three.js (`src/`) — `localhost:3000`
- **Backend:** Python FastAPI (`backend/`) — `localhost:8000`
  - **Modül A** `file_parser.py` — `.step / .iges / .pdf` yükleme ve placeholder parse (`uploads/` klasörüne kaydeder)
  - **Modül B** `engineering_engine.py` — Hacim, Kütle, Minimum Et Kalınlığı, Tolerans Uygunluğu (mock geometri simülasyonu; OpenCASCADE'e hazır modüler arayüz)
  - **Modül C** `scoring.py` — 0-100 Mühendislik Skoru, "Geçti/Kaldı" raporu (JSON + PDF). Rapor başlıkları: **Ağırlık Hedefi**, **Tolerans Analizi**, **Üretim Kısıtı (DFM)**
  - `llm_analyzer.py` — ChatGPT (Vision-LLM) ile 2D teknik resim analizi (MVP'de mock yanıt)
- **Veri:** Tüm veriler mock'tur ve in-memory tutulur; kod yapısı OpenCASCADE ve gerçek LLM entegrasyonuna hazırdır.

## Kurulum

Önkoşullar: **Node.js 18+** ve **Python 3.11+**

```bash
# 1) Frontend bağımlılıkları
npm install

# 2) Backend bağımlılıkları
pip install -r requirements.txt
# Windows'ta birden fazla Python varsa 3.11+ sürümüyle kurun:
#   py -3.13 -m pip install -r requirements.txt
```

## API Anahtarı (.env)

Kök dizindeki `.env` dosyasına OpenAI API anahtarınızı girin:

```
OPENAI_API_KEY=sk-...
```

> Anahtar boşsa veya `.env` yoksa backend şu hatayla başlamaz:
> **"Lütfen .env dosyasına OPENAI_API_KEY ekleyin"**

## Çalıştırma

İki ayrı terminalde:

```bash
# Terminal 1 — Backend (proje kök dizininden)
uvicorn backend.main:app --reload --port 8000
# veya: py -3.13 -m uvicorn backend.main:app --reload --port 8000

# Terminal 2 — Frontend
npm run dev
```

Tarayıcıda **http://localhost:3000** adresini açın. Frontend, `/api` isteklerini
Vite proxy üzerinden backend'e (8000) yönlendirir.

## Sayfalar

| Sayfa | Adres | Açıklama |
|---|---|---|
| Görev Havuzu (Dashboard) | `/` | Görev listesi, skorlar, filtreler |
| Çalışma Masası | (görev seçince) | CAD yükleme → DFM analizi → skor raporu → PDF indirme |
| Mühendislik Portföyü | (üst menü) | Skorlar, yetkinlikler, başarı rozetleri |
| Public Portföy | `/public-portfolio/demo-user` | Şirketlerin incelediği herkese açık sayfa + Three.js 3D önizleme |

## API Özeti

- `POST /api/upload` — Dosya yükleme (Modül A), `uploads/` klasörüne kaydeder
- `POST /api/analyze` — Mühendislik hesapları + skorlama (Modül B + C)
- `GET /api/report/{id}/pdf` · `GET /api/report/{id}/json` — Geçti/Kaldı raporu
- `GET /api/tasks` · `GET /api/users/{id}` · `GET /api/users/{id}/portfolio`
- `POST /api/portfolio/save` — Skoru portföye işler, 90+ skorda rozet üretir

## Notlar

- Analizler mock verilerle çalışır; `EngineeringCalculationEngine.load_geometry`
  OpenCASCADE (pythonocc-core / OCP) ile değiştirilecek tek noktadır.
- `llm_analyzer.py` içinde `USE_REAL_API = True` yapılarak gerçek ChatGPT Vision
  çağrısı aktifleştirilebilir.
