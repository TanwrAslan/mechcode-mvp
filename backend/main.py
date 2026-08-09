"""MechCode FastAPI Backend.

Calistirma (proje kok dizininden):
    py -3.13 -m uvicorn backend.main:app --reload --port 8000

DIKKAT: Bu makinede varsayilan `python` 3.7'dir ve kod Python 3.10+ gerektirir.
Her zaman `py -3.13` kullanin (veya start-backend.bat).
"""
import sys

# Python 3.10+ sozdizimi (PEP 604 `X | None`) kullaniliyor. Eski surumde
# anlasilmaz bir TypeError yerine net bir mesaj verelim.
if sys.version_info < (3, 10):
    raise SystemExit(
        "\n[MechCode] Hatali Python surumu: {}.{}.{}\n"
        "Bu proje Python 3.10+ gerektirir (varsayilan `python` bu makinede 3.7).\n"
        "Dogru calistirma komutu:\n"
        "    py -3.13 -m uvicorn backend.main:app --reload --port 8000\n"
        "veya proje kokunden: start-backend.bat\n".format(*sys.version_info[:3])
    )

import uuid
from typing import Any, Dict, Optional

from fastapi import FastAPI, File, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel

from .auth import AUTH_REQUIRED, PUBLIC_API_PATHS, AuthError, is_admin, verify_id_token
from .config import require_openai_key
from .data import TASKS, get_task, get_user
from .engineering_engine import EngineeringCalculationEngine
from .file_parser import InvalidFileError, find_stored_file, save_upload
from .llm_analyzer import analyze_technical_drawing
from .scoring import ScoringEngine

# .env yoksa veya OPENAI_API_KEY bossa uygulama baslamadan hata ver:
# "Lütfen .env dosyasına OPENAI_API_KEY ekleyin"
require_openai_key()

app = FastAPI(title="MechCode API", version="0.1.0")


# ------------------------------------------------------- Kimlik dogrulama
# DIKKAT: Bu middleware CORS'tan ONCE tanimlanmali. Starlette en son eklenen
# middleware'i en disa koyar; boylece CORSMiddleware bunu sarmalar ve 401
# yanitlari da CORS basliklarini alir (aksi halde tarayici hatayi gizler).
@app.middleware("http")
async def firebase_auth_middleware(request: Request, call_next):
    """Her /api isteginde Firebase ID token'i dogrular.

    Muaf olanlar: CORS preflight (OPTIONS), /api/health ve API disi yollar
    (frontend statik dosyalari).
    """
    path = request.url.path

    if not AUTH_REQUIRED or request.method == "OPTIONS" or not path.startswith("/api"):
        return await call_next(request)

    if path in PUBLIC_API_PATHS:
        return await call_next(request)

    try:
        decoded = verify_id_token(request.headers.get("Authorization"))
        if path.startswith("/api/admin") and not is_admin(decoded):
            raise AuthError(403, "Bu işlem için yönetici yetkisi gerekiyor.")
    except AuthError as exc:
        return JSONResponse(status_code=exc.status, content={"detail": exc.detail})

    # Endpoint'ler kullaniciya erisebilsin diye istege ilistir.
    request.state.user = decoded
    return await call_next(request)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

scoring_engine = ScoringEngine()

# In-memory analiz deposu: analysis_id -> {taskId, report}
ANALYSES: Dict[str, Dict[str, Any]] = {}


class RealGeometry(BaseModel):
    """Frontend'de occt-import-js ile gerçek mesh'ten hesaplanan değerler."""
    volumeCm3: float
    boundingBoxMm: Dict[str, float]
    triangleCount: int


class AnalyzeRequest(BaseModel):
    taskId: str
    fileId: Optional[str] = None
    fileName: Optional[str] = None
    realGeometry: Optional[RealGeometry] = None


class SavePortfolioRequest(BaseModel):
    userId: str = "demo-user"
    taskId: str
    score: int


@app.get("/api/health")
def health() -> Dict[str, str]:
    return {"status": "ok", "service": "mechcode-api"}


# ---------------------------------------------------------------- Gorevler
@app.get("/api/tasks")
def list_tasks():
    return TASKS


@app.get("/api/tasks/{task_id}")
def task_detail(task_id: str):
    task = get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Görev bulunamadı")
    return task


# ---------------------------------------------------------------- Kullanici
@app.get("/api/users/{user_id}")
def user_profile(user_id: str):
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return user


@app.get("/api/users/{user_id}/portfolio")
def public_portfolio(user_id: str):
    """Sirketlerin inceleyebilecegi public portfoy verisi."""
    user = get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    completed = [t for t in TASKS if t["status"] == "completed"]
    return {"user": user, "completedTasks": completed}


# ---------------------------------------------------------------- Modul A: Upload
@app.post("/api/upload")
def upload_file(file: UploadFile = File(...)):
    try:
        result = save_upload(file)
    except InvalidFileError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return result


# ---------------------------------------------------------------- Modul B+C: Analiz
@app.post("/api/analyze")
def analyze(payload: AnalyzeRequest):
    task = get_task(payload.taskId)
    if not task:
        raise HTTPException(status_code=404, detail="Görev bulunamadı")

    stored = find_stored_file(payload.fileId) if payload.fileId else None
    file_name = payload.fileName or (stored.name if stored else task["sampleFileName"])

    engine = EngineeringCalculationEngine(density_g_cm3=task["densityGcm3"])
    geometry = engine.load_geometry(stored, task, seed_name=file_name)

    # Gercek mesh verisi geldiyse hacim/bbox mock degerlerini ezer;
    # et kalinligi, radyus ve H7 gibi B-Rep gerektiren alanlar mock kalir.
    if payload.realGeometry:
        rg = payload.realGeometry
        geometry.volume_cm3 = round(rg.volumeCm3, 2)
        geometry.bounding_box_mm = {
            "x": round(rg.boundingBoxMm.get("x", 0.0), 1),
            "y": round(rg.boundingBoxMm.get("y", 0.0), 1),
            "z": round(rg.boundingBoxMm.get("z", 0.0), 1),
        }
        geometry.faces_count = rg.triangleCount

    report = scoring_engine.build_report(task, geometry, engine, file_name)
    report["geometrySource"] = "real_mesh" if payload.realGeometry else "mock"

    # PDF teknik resim yuklendiyse Vision-LLM (mock) geri bildirimi ekle
    if stored and stored.suffix.lower() == ".pdf":
        report["llmFeedback"] = analyze_technical_drawing(stored)

    analysis_id = uuid.uuid4().hex
    ANALYSES[analysis_id] = {"taskId": task["id"], "report": report}
    report["analysisId"] = analysis_id

    return {"analysisId": analysis_id, "report": report}


# ---------------------------------------------------------------- Modul C: Rapor cikti
@app.get("/api/report/{analysis_id}/json")
def report_json(analysis_id: str):
    entry = ANALYSES.get(analysis_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Analiz bulunamadı")
    return JSONResponse(entry["report"])


@app.get("/api/report/{analysis_id}/pdf")
def report_pdf(analysis_id: str):
    entry = ANALYSES.get(analysis_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Analiz bulunamadı")
    task = get_task(entry["taskId"])
    pdf_bytes = scoring_engine.build_pdf(task, entry["report"])
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="mechcode_dfm_raporu_{analysis_id[:8]}.pdf"'},
    )


# ---------------------------------------------------------------- Portfoy kaydet
@app.post("/api/portfolio/save")
def save_to_portfolio(payload: SavePortfolioRequest):
    user = get_user(payload.userId)
    task = get_task(payload.taskId)
    if not user or not task:
        raise HTTPException(status_code=404, detail="Kullanıcı veya görev bulunamadı")

    first_completion = task["status"] != "completed"
    task["status"] = "completed"
    task["score"] = payload.score

    if first_completion:
        user["completedTasksCount"] += 1
    total = user["completedTasksCount"]
    user["portfolioScore"] = min(
        100, round((user["portfolioScore"] * max(total - 1, 1) + payload.score) / max(total, 1))
    )

    # Basit rozet kurali: 90+ skor yeni rozet kazandirir
    if payload.score >= 90 and first_completion:
        badge = {"name": f"{task['category']} Uzmanı", "icon": "award",
                 "earnedFor": f"{task['code']} - {payload.score} DFM Skoru"}
        if badge["name"] not in [b["name"] for b in user["badges"]]:
            user["badges"].append(badge)
            user["verifiedBadgesCount"] = len(user["badges"])

    return {"ok": True, "user": user, "task": task}


# ---------------------------------------------------------------- Frontend (statik)
# Frontend react-router (BrowserRouter) kullaniyor: /login, /admin, /dashboard
# gibi yollarin sunucuda karsiligi yok. Sayfa yenilendiginde 404 donmemesi icin
# eslesmeyen tum GET isteklerine index.html servis ediyoruz (SPA fallback).
import os

from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

static_dir = os.path.join(os.path.dirname(__file__), "static")
if os.path.exists(static_dir):
    assets_dir = os.path.join(static_dir, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    index_file = os.path.join(static_dir, "index.html")

    @app.get("/{full_path:path}")
    async def spa_fallback(full_path: str):
        # Tanimli /api rotalari bu noktaya ulasmaz; buraya duseni 404 yapalim ki
        # yanlis yazilmis bir API yolu sessizce HTML dondurmesin.
        if full_path.startswith("api/") or full_path == "api":
            raise HTTPException(status_code=404, detail="Bulunamadı")

        # favicon.svg, robots.txt gibi kokteki gercek dosyalar
        candidate = os.path.normpath(os.path.join(static_dir, full_path))
        if full_path and candidate.startswith(static_dir) and os.path.isfile(candidate):
            return FileResponse(candidate)

        return FileResponse(index_file)
else:
    @app.get("/")
    async def root():
        return {"message": "MechCode Backend çalışıyor. Frontend build ediliyor..."}
