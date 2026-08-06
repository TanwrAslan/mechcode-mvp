"""Ortam degiskenleri ve yol yapilandirmasi.

OPENAI_API_KEY, proje kok dizinindeki .env dosyasindan okunur.
Anahtar koda ASLA gomulmez.
"""
import os
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = ROOT_DIR / ".env"
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(exist_ok=True)

load_dotenv(ENV_FILE)

OPENAI_API_KEY = (os.getenv("OPENAI_API_KEY") or "").strip()

MISSING_KEY_MESSAGE = "Lütfen .env dosyasına OPENAI_API_KEY ekleyin"


def require_openai_key() -> str:
    """.env dosyasi yoksa veya anahtar bossa uygulamayi calistirmayi reddet."""
    if not ENV_FILE.exists() or not OPENAI_API_KEY:
        raise RuntimeError(MISSING_KEY_MESSAGE)
    return OPENAI_API_KEY
