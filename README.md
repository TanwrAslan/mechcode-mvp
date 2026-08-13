# MechStudio — Mühendislik Pratik & Portföy Platformu

> *Gerçek mühendislik görevleri. Gerçek pratik. Gerçek portföy.*

Makine mühendisliği öğrencileri için hands-on pratik platformu. Öğrenci hazır bir 3B
modeli kopyalamaz; **gerçek teknik resimden** okuyup kendi CAD yazılımında modeller,
STEP dosyasını yükler, otomatik DFM analizini ve açıklamalı referans çözümü görür,
kendini değerlendirir ve sonucu **işverenlere gönderilebilir portföyüne** ekler.

---

## Dizin yapısı

```
mechcode/
├── frontend/                  React 19 + Vite 6 + Tailwind 4 (TypeScript)
│   ├── src/
│   │   ├── app/               App.tsx — router, uygulama durumu, ekran/URL eşlemesi
│   │   ├── components/
│   │   │   ├── layout/        Header, Footer, FlowBreadcrumb, TaskStatusBar
│   │   │   ├── screens/       Landing, TaskCatalog, TaskDetail, ExampleSolution,
│   │   │   │                  SelfEvaluation, Portfolio, Pricing, Admin, Login
│   │   │   ├── viewers/       TechnicalDrawingViewer (2D SVG pafta),
│   │   │   │                  Isometric3DViewer (açıklamalı referans),
│   │   │   │                  StepMeshViewer (three.js + occt-import-js)
│   │   │   └── ui/            ProUpgradeModal
│   │   ├── features/
│   │   │   ├── auth/          AuthContext (Firebase), ProtectedRoute
│   │   │   └── i18n/          LanguageContext — TR/EN ikili dil katmanı
│   │   ├── lib/               api.ts, cadGeometry.ts, firebase.ts, appInfo.ts
│   │   ├── data/              tasks.ts (görev kataloğu tohum verisi)
│   │   ├── types/             ortak TypeScript tipleri
│   │   ├── index.css          tasarım sistemi (renk token'ları, blueprint grid)
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts         build çıktısı → ../backend/static
│   └── package.json
│
├── backend/                   FastAPI (Python 3.10+)
│   ├── app/
│   │   ├── main.py            API rotaları + SPA fallback
│   │   ├── auth.py            Firebase ID token doğrulama middleware'i
│   │   ├── config.py          yol yapılandırması ve .env yüklemesi
│   │   ├── data.py            görev/kullanıcı tohum verisi
│   │   ├── file_parser.py     yükleme doğrulama + uploads/ kaydı
│   │   ├── engineering_engine.py  hacim/kütle/bbox hesapları
│   │   ├── scoring.py         DFM skorlama + PDF rapor
│   │   └── llm_analyzer.py    teknik resim (PDF) LLM geri bildirimi
│   └── static/                `npm run build` çıktısı (FastAPI buradan servis eder)
│
├── docs/
│   ├── KURULUM.txt
│   ├── TEKNIK_OZELLIKLER.txt
│   └── design-reference/      tasarımın kaynak referansı (uygulanan tasarım)
│
├── scripts/                   start-backend.bat · start-backend.sh
├── uploads/                   yüklenen STEP/PDF dosyaları (git'e girmez)
└── .env                       gizli anahtarlar (git'e girmez)
```

---

## Kurulum

### 1. Backend (Python 3.10+)

```bash
pip install -r requirements.txt
```

`.env` dosyasını `.env.example` üzerinden oluşturun.

**Çalıştırma** — proje kök dizininden:

```bash
# Windows
scripts\start-backend.bat

# Linux / macOS
./scripts/start-backend.sh

# veya doğrudan
python -m uvicorn backend.app.main:app --reload --port 8000
```

> Windows'ta varsayılan `python` 3.7 ise `py -3.13` kullanın — `start-backend.bat`
> bunu zaten yapıyor.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev          # http://localhost:3000  (/api istekleri :8000'e proxy'lenir)
```

**Production build:**

```bash
cd frontend
npm run build        # çıktı doğrudan ../backend/static/ içine yazılır
```

Ardından yalnızca backend'i çalıştırmak yeterlidir; FastAPI hem API'yi hem de
derlenmiş arayüzü aynı porttan servis eder (SPA fallback dahil).

---

## Tasarım sistemi

Tüm arayüz `frontend/src/index.css` içindeki token'lar üzerine kurulu:

| Rol | Değer | Kullanım |
|---|---|---|
| `--color-canvas` | `#0f1f3d` | sayfa zemini |
| `--color-panel` | `#0a162b` | panel / kart dış yüzeyi |
| `--color-card` | `#162a4e` | kart iç yüzeyi |
| `--color-accent` | `#e05a00` | birincil vurgu (mühendislik turuncusu) |
| `--color-blueprint` | `#22d3ee` | teknik resim çizgileri |

Yardımcı sınıflar: `.bg-blueprint-grid` (teknik ızgara), `.bg-drawing-grid`
(açık zeminli pafta), `.glow-orange`, `.glow-cyan`, `.animate-fadeIn`.

Referans tasarım `docs/design-reference/` altında saklanır.

---

## Kontrol mekanizması

Yüklenen CAD dosyası **gerçekten ölçülür** — hiçbir değer tahmin edilmez.

**1. Ölçüm** (`frontend/src/lib/measure.ts`, tarayıcıda çalışır)
STEP/IGES → üçgen mesh → şunlar çıkarılır:

| Büyüklük | Yöntem | Güvenilirlik |
|---|---|---|
| Hacim | işaretli tetrahedron toplamı | kapalı mesh'te kesin |
| Sınır kutusu | min/max köşe | kesin |
| Yüzey alanı | üçgen alanları toplamı | kesin |
| Kapalılık | kenar-manifold sayımı | kesin |
| Min. et kalınlığı | yüzeyden içeri ışın izleme | ±%1 |
| Delik sayısı/çapı | eksene paralel silindir tespiti + çember fit | ±0.05 mm |

Doğrulama testi (`80×60×8 mm plaka, Ø10 delik`): bbox tam, hacim tam,
et kalınlığı 7.99/8.00, delik Ø9.99/10.00 → **9/9 geçti**.

**2. Karşılaştırma** (`backend/app/verification.py`)
Ölçüm, görevin teknik resminden girilen şartnameyle madde madde karşılaştırılır.
İki kural sistemi dürüst tutar:

- Ölçülemeyen madde `ölçülemedi` işaretlenir, **ağırlığı paydadan düşülür** —
  uydurulmuş bir değerle puanlanmaz.
- Ağırlığın **%60'ından azı** ölçülebildiyse sonuç `Değerlendirilemedi` olur;
  kısmi kanıtla "Geçti" belgesi verilmez.

**3. Belgeleme** (`backend/app/store.py`)
Her rapor `MS-XXXX-XXXX` biçiminde bir kodla sunucuda saklanır ve
`backend/data/verifications.json` içinde kalıcıdır.

### Dışarıdan kontrol — `/dogrula`

Oturum **gerektirmez** (`auth.PUBLIC_API_PREFIXES`). İki işlevi var:

- **Dosya kontrolü:** dışarıdan biri görev seçip kendi STEP dosyasını
  denetletebilir. Dosya tarayıcıda ölçülür; sunucuya yalnızca ölçüm sonuçları
  gider, CAD dosyası yüklenmez.
- **Kod sorgulama:** `/dogrula/MS-XXXX-XXXX` — işveren adayın verdiği kodla
  raporun aslını görür. Rapor sunucuda saklandığı için sonradan değiştirilemez.
  PDF çıktısı `/api/verification/<kod>/pdf` üzerinden alınır.

### Görev ekleme (admin)

`/admin` → **Yeni Görev Ekle** formunda:

1. **Görev PDF'i** yüklenir (öğrenci görev ekranından açar).
2. **Otomatik Kontrol Şartnamesi** bölümüne PDF'teki *"Temel ölçüler (özet)"*
   satırı yapıştırılıp **Künyeyi Ayrıştır** denir — dış ölçüler, et kalınlığı,
   delik sayısı/çapı, iç kavis ve malzeme otomatik doldurulur, sonra elle
   kontrol edilir.
3. Hedef **kütle** referans çözümün CAD'inden (Mass Properties) okunup girilir.
   Form, dolu prizma yaklaşımını yalnızca üst sınır olarak önerir.

Her maddenin ağırlığı ve toleransı ayarlanabilir. Toleranslar ölçüm
hassasiyetine göre seçilmeli: delikler için **≥0.2 mm** (üçgenleme daireyi
içten yaklaşıklar).

> Şu an şartname istemciden gönderiliyor; görevler tarayıcı belleğinde
> tutulduğu için. Görevler veritabanına taşındığında `/api/verify` şartnameyi
> sunucudan okumalı (kodda not düşüldü).

## Dil desteği

`features/i18n/LanguageContext` TR/EN ikili dil katmanını sağlar. Bileşenlerde:

```tsx
const { t } = useLanguage();
t({ tr: 'Görevler', en: 'Tasks' })
```

Seçim `localStorage` içinde saklanır, header'daki 🌐 düğmesiyle değiştirilir.

---

## Güvenlik notları

- `serviceAccountKey.json` ve `.env` **asla** commit edilmez (`.gitignore` içinde).
- `firebase.ts` içindeki `apiKey` bir sır değildir; Firebase web yapılandırması
  tasarımı gereği herkese açıktır. Asıl koruma Firebase Security Rules +
  `backend/app/auth.py` içindeki ID token doğrulamasıdır.
- Admin yetkisi `MECHCODE_ADMIN_EMAILS` ortam değişkeni ile belirlenir.
