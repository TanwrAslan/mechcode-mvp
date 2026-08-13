"""Gorev katalogu deposu.

Gorevler onceden yalnizca tarayicinin localStorage'inda tutuluyordu; bu yuzden
admin'in ekledigi bir gorevi baska hicbir kullanici goremiyordu. Artik tek
dogruluk kaynagi SUNUCU: katalog `db` uzerinden kalici olarak saklanir.

Depo bosken `seed_tasks.json` ile bir kez tohumlanir; boylece temiz bir
kurulumda katalog bos gelmez.
"""
from __future__ import annotations

import json
import threading
from pathlib import Path
from typing import Any, Dict, List, Optional

from . import db

COLLECTION = "tasks"
SEED_FILE = Path(__file__).resolve().parent / "seed_tasks.json"

_seed_lock = threading.Lock()
_seed_done = False


def _load_seed() -> List[Dict[str, Any]]:
    if not SEED_FILE.exists():
        return []
    try:
        data = json.loads(SEED_FILE.read_text(encoding="utf-8"))
        return data if isinstance(data, list) else []
    except (json.JSONDecodeError, OSError):
        return []


def ensure_seeded() -> None:
    """Depo bossa varsayilan gorevleri bir kez yazar.

    Idempotent: dolu bir depoyu asla ezmez, admin'in sildigi gorevleri geri
    getirmez (silinmis katalog "bos" degilse tohumlama calismaz).
    """
    global _seed_done
    if _seed_done:
        return

    with _seed_lock:
        if _seed_done:
            return
        try:
            if db.count(COLLECTION) == 0:
                for task in _load_seed():
                    db.put(COLLECTION, task["id"], task)
            _seed_done = True
        except Exception:  # noqa: BLE001 - tohumlama basarisizsa API yine calissin
            _seed_done = True


def list_tasks() -> List[Dict[str, Any]]:
    ensure_seeded()
    tasks = db.list_all(COLLECTION)
    # Katalog sirasi kullaniciya tutarli gorunsun.
    return sorted(tasks, key=lambda t: str(t.get("order", "")) + str(t.get("id", "")))


def get_task(task_id: str) -> Optional[Dict[str, Any]]:
    ensure_seeded()
    return db.get(COLLECTION, task_id)


def save_task(task: Dict[str, Any]) -> Dict[str, Any]:
    if not task.get("id"):
        raise ValueError("Görev kimliği (id) zorunludur.")
    ensure_seeded()
    db.put(COLLECTION, task["id"], task)
    return task


def delete_task(task_id: str) -> bool:
    ensure_seeded()
    return db.delete(COLLECTION, task_id)


def reset_to_defaults() -> List[Dict[str, Any]]:
    """Katalogu paketlenmis varsayilanlara dondurur."""
    seed = _load_seed()
    db.replace_all(COLLECTION, {task["id"]: task for task in seed})
    return seed
