"""Kalici depolama katmani.

Iki arka uc destekler ve calisma aninda hangisinin kullanilabilir oldugunu
kendisi secer:

1. **Firestore** (tercih edilen) — Firebase Admin SDK baslatilabildiyse.
   Railway/Render gibi ortamlarda dosya sistemi kalici DEGILDIR; her deploy'da
   silinir. Gorevler ve dogrulama kayitlari kalici olmak zorunda oldugu icin
   varsayilan budur.

2. **JSON dosyasi** (yedek) — Firestore yoksa `backend/data/<isim>.json`.
   Yerel gelistirmede internet/Firebase gerektirmeden calismayi surdurur.

Cagiran taraf hangisinin aktif oldugunu bilmek zorunda degildir; yalnizca
`backend_name()` ile durumu raporlayabilir.
"""
from __future__ import annotations

import json
import threading
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, TypeVar

from .config import BACKEND_DIR

FILE_STORE_DIR = BACKEND_DIR / "data"

_T = TypeVar("_T")

_lock = threading.Lock()
_firestore_client: Any = None
_firestore_checked = False
_firestore_error: Optional[str] = None


def _get_firestore() -> Any:
    """Firestore istemcisini bir kez kurar. Kurulamazsa None doner."""
    global _firestore_client, _firestore_checked, _firestore_error

    if _firestore_checked:
        return _firestore_client

    _firestore_checked = True
    try:
        from firebase_admin import firestore

        from .auth import ensure_firebase_ready

        error = ensure_firebase_ready()
        if error:
            _firestore_error = error
            return None

        _firestore_client = firestore.client()
    except Exception as exc:  # noqa: BLE001 - Firestore acilmazsa dosyaya duseriz
        _firestore_error = f"Firestore kullanılamıyor: {exc}"
        _firestore_client = None

    return _firestore_client


def _disable_firestore(exc: Exception) -> None:
    """Calisma aninda Firestore hatasi olursa kalici olarak dosyaya gec.

    Istemci nesnesi ag baglantisi kurmadan olusur; API'nin projede kapali
    oldugu ancak ILK SORGUDA anlasilir. Bu durumda istegi hata ile
    dondurmek yerine dosya yedegine dusuyoruz — uygulama ayakta kalir.
    """
    global _firestore_client, _firestore_error
    if _firestore_client is None:
        return
    _firestore_client = None

    detail = str(exc)
    if "has not been used in project" in detail or "SERVICE_DISABLED" in detail:
        _firestore_error = (
            "Cloud Firestore API bu projede etkin değil. Firebase Console → "
            "Firestore Database → 'Veritabanı oluştur' adımını tamamlayın."
        )
    elif "PERMISSION_DENIED" in detail:
        _firestore_error = "Firestore erişimi reddedildi: service account yetkilerini kontrol edin."
    else:
        _firestore_error = f"Firestore hatası: {detail[:200]}"

    print(f"[db] Firestore devre disi birakildi, dosya yedegine gecildi: {_firestore_error}")


def backend_name() -> str:
    """Aktif arka ucun adi — /api/health ve admin panelinde gosterilir."""
    return "firestore" if _get_firestore() is not None else "file"


def backend_warning() -> Optional[str]:
    """Dosya arka ucuna dusuldiyse nedenini aciklar."""
    if _get_firestore() is not None:
        return None
    detail = _firestore_error or "Firebase kimlik bilgisi yok."
    return (
        f"Kalıcı veritabanı devre dışı ({detail}) — kayıtlar yerel dosyada tutuluyor. "
        "Railway/Render gibi ortamlarda dosya sistemi her deploy'da silinir."
    )


# --------------------------------------------------------------- dosya yedegi

def _file_path(collection: str) -> Path:
    return FILE_STORE_DIR / f"{collection}.json"


def _file_read(collection: str) -> Dict[str, Any]:
    path = _file_path(collection)
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        # Bozuk dosya uygulamayi cokertmemeli.
        return {}


def _file_write(collection: str, data: Dict[str, Any]) -> None:
    FILE_STORE_DIR.mkdir(parents=True, exist_ok=True)
    tmp = _file_path(collection).with_suffix(".json.tmp")
    tmp.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
    tmp.replace(_file_path(collection))  # atomik: yarim yazilmis dosya kalmaz


# ------------------------------------------------------------- ortak arayuz

def _try_firestore(operation: Callable[[Any], _T]) -> tuple[bool, Optional[_T]]:
    """Islemi Firestore'da dener.

    (basarili_mi, sonuc) doner. Firestore yoksa ya da islem sirasinda hata
    verirse (False, None) doner ve cagiran dosya yedegine gecer.
    """
    client = _get_firestore()
    if client is None:
        return False, None
    try:
        return True, operation(client)
    except Exception as exc:  # noqa: BLE001 - her Firestore hatasinda dosyaya duseriz
        _disable_firestore(exc)
        return False, None


def put(collection: str, doc_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
    """Belgeyi yazar (varsa uzerine yazar)."""
    ok, _ = _try_firestore(lambda c: c.collection(collection).document(doc_id).set(data))
    if ok:
        return data

    with _lock:
        store = _file_read(collection)
        store[doc_id] = data
        _file_write(collection, store)
    return data


def get(collection: str, doc_id: str) -> Optional[Dict[str, Any]]:
    def read(client: Any) -> Optional[Dict[str, Any]]:
        snapshot = client.collection(collection).document(doc_id).get()
        return snapshot.to_dict() if snapshot.exists else None

    ok, result = _try_firestore(read)
    if ok:
        return result

    return _file_read(collection).get(doc_id)


def delete(collection: str, doc_id: str) -> bool:
    """Belgeyi siler. Zaten yoksa False doner."""
    def remove(client: Any) -> bool:
        ref = client.collection(collection).document(doc_id)
        if not ref.get().exists:
            return False
        ref.delete()
        return True

    ok, result = _try_firestore(remove)
    if ok:
        return bool(result)

    with _lock:
        store = _file_read(collection)
        if doc_id not in store:
            return False
        store.pop(doc_id)
        _file_write(collection, store)
    return True


def list_all(collection: str) -> List[Dict[str, Any]]:
    ok, result = _try_firestore(
        lambda c: [doc.to_dict() for doc in c.collection(collection).stream()]
    )
    if ok:
        return result or []

    return list(_file_read(collection).values())


def replace_all(collection: str, docs: Dict[str, Dict[str, Any]]) -> None:
    """Koleksiyonun tamamini degistirir (varsayilanlara sifirlama icin)."""
    def swap(client: Any) -> None:
        batch = client.batch()
        col = client.collection(collection)
        for doc in col.stream():
            batch.delete(doc.reference)
        for doc_id, data in docs.items():
            batch.set(col.document(doc_id), data)
        batch.commit()

    ok, _ = _try_firestore(swap)
    if ok:
        return

    with _lock:
        _file_write(collection, docs)


def count(collection: str) -> int:
    ok, result = _try_firestore(lambda c: sum(1 for _ in c.collection(collection).stream()))
    if ok:
        return result or 0
    return len(_file_read(collection))
