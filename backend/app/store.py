"""Dogrulama kayit deposu.

Uretilen her dogrulama raporu bir kodla saklanir; disaridan biri (isveren,
akademisyen) bu kodla raporun gercekligini `/dogrula/<kod>` uzerinden
sorgulayabilir.

Depolama JSON dosyasidir: sunucu yeniden baslatilinca kodlar kaybolmaz.
Uretimde bunun yerine bir veritabani (Firestore/Postgres) kullanilmali;
arayuz (`save` / `get` / `recent`) ayni kalacak sekilde tasarlandi.
"""
from __future__ import annotations

import json
import threading
from pathlib import Path
from typing import Any, Dict, List, Optional

from .config import BACKEND_DIR

STORE_DIR = BACKEND_DIR / "data"
STORE_FILE = STORE_DIR / "verifications.json"

# En fazla bu kadar kayit tutulur (dosya siserse en eskiler dusurulur).
MAX_RECORDS = 5000

_lock = threading.Lock()


def _load() -> Dict[str, Any]:
    if not STORE_FILE.exists():
        return {}
    try:
        return json.loads(STORE_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        # Bozuk dosya yuzunden uygulama cokmemeli; bos depoyla devam et.
        return {}


def _write(data: Dict[str, Any]) -> None:
    STORE_DIR.mkdir(parents=True, exist_ok=True)
    tmp = STORE_FILE.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    tmp.replace(STORE_FILE)  # atomik degistirme — yarim yazilmis dosya kalmaz


def save(report: Dict[str, Any]) -> Dict[str, Any]:
    """Raporu kodu ile saklar ve aynen geri doner."""
    with _lock:
        data = _load()
        data[report["code"]] = report

        if len(data) > MAX_RECORDS:
            oldest = sorted(data.items(), key=lambda kv: kv[1].get("createdAt", ""))
            for code, _ in oldest[: len(data) - MAX_RECORDS]:
                data.pop(code, None)

        _write(data)
    return report


def get(code: str) -> Optional[Dict[str, Any]]:
    """Kodu buyuk/kucuk harf ve tire farkina bakmadan arar."""
    normalized = code.strip().upper().replace(" ", "")
    data = _load()
    if normalized in data:
        return data[normalized]
    # Kullanici tireleri unutmus olabilir: MS7K2F9QX4 -> MS-7K2F-9QX4
    stripped = normalized.replace("-", "")
    for stored_code, record in data.items():
        if stored_code.replace("-", "") == stripped:
            return record
    return None


def recent(limit: int = 20) -> List[Dict[str, Any]]:
    """Admin panelinde son gonderimleri listelemek icin."""
    data = _load()
    ordered = sorted(data.values(), key=lambda r: r.get("createdAt", ""), reverse=True)
    return ordered[:limit]
