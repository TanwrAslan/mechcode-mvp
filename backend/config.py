"""Ortam değişkenleri ve yol yapılandırması."""
import os
from pathlib import Path

from dotenv import load_dotenv

# Proje kök dizinini bul
ROOT_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT_DIR / ".env"
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

# Eğer lokal ortamda çalışıyorsak .env dosyasını yükle
if ENV_FILE.exists():
    load_dotenv(ENV_FILE)

# OpenAI API Key'i al (Bulamazsa boş döner, uygulama çökmez)
OPENAI_API_KEY = (os.getenv("OPENAI_API_KEY") or "").strip()

def require_openai_key() -> str:
    """Anahtarı döndürür, yoksa boş döner."""
    return OPENAI_API_KEY