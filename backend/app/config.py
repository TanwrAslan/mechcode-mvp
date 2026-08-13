"""Ortam değişkenleri ve yol yapılandırması."""
import os
from pathlib import Path

from dotenv import load_dotenv

# Dizin duzeni:  <root>/backend/app/config.py
#   parents[0] = backend/app   parents[1] = backend   parents[2] = <root>
APP_DIR = Path(__file__).resolve().parent
BACKEND_DIR = APP_DIR.parent
ROOT_DIR = BACKEND_DIR.parent

ENV_FILE = ROOT_DIR / ".env"
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# `npm run build` ciktisi buraya duser (frontend/vite.config.ts -> build.outDir).
STATIC_DIR = BACKEND_DIR / "static"

# Eğer lokal ortamda çalışıyorsak .env dosyasını yükle
if ENV_FILE.exists():
    load_dotenv(ENV_FILE)

# OpenAI API Key'i al (Bulamazsa boş döner, uygulama çökmez)
OPENAI_API_KEY = (os.getenv("OPENAI_API_KEY") or "").strip()

def require_openai_key() -> str:
    """Anahtarı döndürür, yoksa boş döner."""
    return OPENAI_API_KEY