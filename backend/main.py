"""Geriye donuk uyumluluk kabugu.

Uygulama `backend/app/main.py` icine tasindi. Bu dosya yalnizca eski
`backend.main:app` yolunu isaret eden dis yapilandirmalar (Railway/Render
panelindeki "Start Command", eski scriptler, dokumanlar) icin durur.

Yeni ve dogru yol:
    uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT

Dis yapilandirmayi guncelledikten sonra bu dosya silinebilir.
"""
from .app.main import app

__all__ = ["app"]
