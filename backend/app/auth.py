"""Firebase Admin SDK ile ID token dogrulama.

Kurulum
-------
1) Firebase Console > Project settings > Service accounts > "Generate new private key"
2) Inen JSON dosyasini proje kokune `serviceAccountKey.json` adiyla kaydedin
   (bu dosya .gitignore'da; ASLA repoya commit etmeyin).
3) Alternatif olarak .env icinde yol veya JSON verebilirsiniz:
       FIREBASE_SERVICE_ACCOUNT=C:/yol/serviceAccountKey.json
       FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
   Google Cloud uzerinde calisiyorsaniz hicbiri gerekmez; ADC kullanilir.

Yerel gelistirmede dogrulamayi tamamen kapatmak icin:
       MECHCODE_AUTH_REQUIRED=false
"""
from __future__ import annotations

import json
import os
import time
from typing import Any, Dict, Optional

from .config import ROOT_DIR

# --------------------------------------------------------------- Yapilandirma
AUTH_REQUIRED = (os.getenv("MECHCODE_AUTH_REQUIRED") or "true").strip().lower() not in (
    "false",
    "0",
    "no",
)

# Admin yetkisi verilen e-postalar. Frontend'deki ADMIN_EMAILS ile ayni olmali
# (src/firebase.ts). Istemci tarafi yalnizca UI icindir; baglayici kontrol burasidir.
ADMIN_EMAILS = {
    e.strip().lower()
    for e in (os.getenv("MECHCODE_ADMIN_EMAILS") or "aslantaner194@gmail.com").split(",")
    if e.strip()
}

# Oturum gerektirmeyen yollar (saglik kontrolu ve CORS preflight).
#
# Gorev katalogunun OKUNMASI da aciktir: acilis sayfasi ve bagimsiz dogrulama
# ekrani (/dogrula) oturum acmadan gorev listesine ihtiyac duyar. Katalog
# icerigi zaten ogrenciye gosterilen gorev tanimidir, gizli degildir. YAZMA
# uclari (/api/admin/catalog/...) yonetici yetkisi ister — bu onek "/api/catalog"
# ile eslesmez.
PUBLIC_API_PATHS = {"/api/health", "/api/catalog"}

# Oturum gerektirmeyen yol ONEKLERI.
#
# Dis dogrulama akisi kasitli olarak aciktir: bir isveren ya da akademisyen
# hesap acmadan bir dosyayi kontrol ettirebilmeli veya elindeki dogrulama
# kodunu sorgulayabilmelidir.
PUBLIC_API_PREFIXES = ("/api/verify", "/api/verification/", "/api/catalog/")


def is_public_path(path: str) -> bool:
    return path in PUBLIC_API_PATHS or path.startswith(PUBLIC_API_PREFIXES)

DEFAULT_KEY_FILE = ROOT_DIR / "serviceAccountKey.json"


class AuthError(Exception):
    """Kimlik dogrulama hatasi. `status` HTTP kodunu tasir."""

    def __init__(self, status: int, detail: str) -> None:
        super().__init__(detail)
        self.status = status
        self.detail = detail


# ------------------------------------------------------------- SDK baslatma
_init_error: Optional[str] = None
_initialized = False
_last_attempt_at = 0.0

# Basarisiz init'ten sonra yeniden denemeden once beklenecek sure. Hatayi kalici
# olarak kilitlemiyoruz: sunucu calisirken serviceAccountKey.json eklenirse
# uygulama yeniden baslatmaya gerek kalmadan kendini toparlamali.
_RETRY_COOLDOWN_SECONDS = 5.0


def _init_firebase() -> None:
    """firebase-admin uygulamasini baslatir (basarili olana kadar tekrar dener).

    Hata durumunda exception yerine `_init_error` doldurulur; boylece backend
    ayaga kalkar ve istek geldiginde net bir 503 mesaji dondurebiliriz.
    """
    global _initialized, _init_error, _last_attempt_at
    if _initialized:
        return

    # Yanlis yapilandirmada her istekte yeniden denemeyelim (ADC aramasi yavas
    # olabilir); kisa bir bekleme suresi koyuyoruz.
    now = time.monotonic()
    if _init_error and (now - _last_attempt_at) < _RETRY_COOLDOWN_SECONDS:
        return

    _last_attempt_at = now
    _init_error = None

    try:
        import firebase_admin
        from firebase_admin import credentials
    except ImportError:
        _init_error = (
            "firebase-admin kurulu degil. Kurulum: py -3.13 -m pip install firebase-admin"
        )
        return

    if firebase_admin._apps:  # baska bir modul zaten baslatmis
        _initialized = True
        return

    inline_json = (os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON") or "").strip()
    key_path = (os.getenv("FIREBASE_SERVICE_ACCOUNT") or "").strip()

    try:
        if inline_json:
            cred = credentials.Certificate(json.loads(inline_json))
        elif key_path:
            if not os.path.isfile(key_path):
                _init_error = f"FIREBASE_SERVICE_ACCOUNT dosyasi bulunamadi: {key_path}"
                return
            cred = credentials.Certificate(key_path)
        elif DEFAULT_KEY_FILE.is_file():
            cred = credentials.Certificate(str(DEFAULT_KEY_FILE))
        else:
            # Google Cloud ortaminda Application Default Credentials calisir.
            cred = credentials.ApplicationDefault()

        fb_app = firebase_admin.initialize_app(cred)

        # ADC bulunamadiginda initialize_app hata vermez ama proje kimligi bos
        # kalir ve token dogrulamasi anlasilmaz bir ValueError ile patlar.
        # Bunu simdi yakalayip kurulum talimatini gosterelim.
        if not fb_app.project_id:
            # Bozuk app kaydini sil; aksi halde sonraki denemede yukaridaki
            # `if firebase_admin._apps` kontrolu bunu basarili sanardi.
            firebase_admin.delete_app(fb_app)
            _init_error = (
                "Firebase proje kimliği belirlenemedi (geçerli kimlik bilgisi yok). "
                "serviceAccountKey.json dosyasını proje köküne koyun veya "
                "FIREBASE_SERVICE_ACCOUNT ortam değişkenini ayarlayın. "
                "Ayrıntı için .env.example dosyasına bakın."
            )
            return

        _initialized = True
    except Exception as exc:  # noqa: BLE001 - sebebi kullaniciya aynen gosterilecek
        _init_error = (
            "Firebase Admin SDK baslatilamadi: {}. "
            "serviceAccountKey.json dosyasini proje kokune koyun veya "
            "FIREBASE_SERVICE_ACCOUNT ortam degiskenini ayarlayin.".format(exc)
        )


def ensure_firebase_ready() -> Optional[str]:
    """Firebase Admin SDK'yi baslatir.

    Basarili olursa None, aksi halde hata metni doner. `db.py` Firestore
    istemcisini acmadan once bunu cagirir — Firestore ayni uygulama ornegini
    kullanir, ikinci kez kimlik dogrulamak gerekmez.
    """
    _init_firebase()
    return _init_error


def verify_id_token(authorization_header: Optional[str]) -> Dict[str, Any]:
    """Authorization basligindaki Firebase ID token'i dogrular.

    Basarili olursa cozulmus token (uid, email, ...) doner; aksi halde AuthError.
    """
    if not authorization_header:
        raise AuthError(401, "Oturum gerekli: Authorization başlığı yok.")

    scheme, _, token = authorization_header.partition(" ")
    if scheme.lower() != "bearer" or not token.strip():
        raise AuthError(401, "Geçersiz Authorization başlığı. Beklenen biçim: 'Bearer <token>'.")

    _init_firebase()
    if _init_error:
        raise AuthError(503, _init_error)

    from firebase_admin import auth as fb_auth

    try:
        return fb_auth.verify_id_token(token.strip())
    except fb_auth.ExpiredIdTokenError:
        raise AuthError(401, "Oturum süresi doldu. Lütfen tekrar giriş yapın.")
    except fb_auth.RevokedIdTokenError:
        raise AuthError(401, "Oturum iptal edilmiş. Lütfen tekrar giriş yapın.")
    except Exception:  # noqa: BLE001 - gecersiz/bozuk token
        raise AuthError(401, "Geçersiz oturum anahtarı.")


def is_admin(decoded_token: Dict[str, Any]) -> bool:
    """Kullanicinin admin olup olmadigi.

    Su an e-posta listesine bakiyor. Kullanici sayisi artinca dogru yontem
    Firebase custom claim'dir (`admin: true`); o zaman once claim'e bakilmali.
    """
    if decoded_token.get("admin") is True:
        return True
    email = (decoded_token.get("email") or "").lower()
    return bool(email) and email in ADMIN_EMAILS
