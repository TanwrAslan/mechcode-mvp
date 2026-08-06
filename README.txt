=====================================================
 MECHCODE - CALISTIRMA TALIMATI (README.txt)
=====================================================

GEREKLI PROGRAMLAR
------------------
1) Node.js 18 veya uzeri   -> https://nodejs.org
2) Python 3.11 veya uzeri  -> https://python.org
   (Bilgisayarinda Python 3.13 zaten kurulu, "py" komutuyla erisiliyor)


ILK KURULUM (sadece 1 kez yapilir)
----------------------------------
Proje klasorunde (C:\Users\aslan\Desktop\mechcode) bir terminal ac ve sirayla:

    npm install
    py -3.13 -m pip install -r requirements.txt

NOT: Bilgisayarindaki varsayilan "python" komutu eski (3.7).
     O yuzden "pip install" yerine mutlaka "py -3.13 -m pip install" kullan.


API ANAHTARI (.env) - ZORUNLU
-----------------------------
Proje klasorundeki .env dosyasini Not Defteri ile ac ve OpenAI anahtarini yaz:

    OPENAI_API_KEY=sk-....buraya-kendi-anahtarin....

Anahtar bos kalirsa backend acilmaz ve su hatayi verir:
    "Lütfen .env dosyasına OPENAI_API_KEY ekleyin"

Anahtar almak icin: https://platform.openai.com/api-keys
(MVP'de analizler mock calistigi icin anahtar gecerli olmasa bile
 bir deger yazilmis olmasi yeterlidir.)


CALISTIRMA (her seferinde)
--------------------------
2 ayri terminal acman gerekiyor (ikisi de proje klasorunde):

  TERMINAL 1 - BACKEND:
    py -3.13 -m uvicorn backend.main:app --reload --port 8000

  TERMINAL 2 - FRONTEND:
    npm run dev

Sonra tarayicida su adresi ac:

    http://localhost:3000


SAYFALAR
--------
- http://localhost:3000
    Ana uygulama: Gorev havuzu -> gorev sec -> CAD dosyasi yukle ->
    "Analiz Et" -> DFM skoru + Gecti/Kaldi raporu + PDF indirme

- http://localhost:3000/public-portfolio/demo-user
    Herkese acik portfoy sayfasi (sirketlerle paylasilan link,
    Three.js 3D onizleme + rozetler)


SORUN GIDERME
-------------
- "Backend'e baglanilamadi" uyarisi goruyorsan:
  Terminal 1'deki backend calismiyor demektir. Backend'i baslat.

- "Lütfen .env dosyasına OPENAI_API_KEY ekleyin" hatasi:
  .env dosyasina anahtar yazilmamis. Yukaridaki adimi yap.

- Port 3000 veya 8000 doluysa:
  Eski terminalleri kapat, tekrar baslat.

- Yuklenen dosyalar uploads\ klasorunde birikir, silinebilir.
=====================================================
