"""Mock veri katmani (in-memory 'veritabani').

Frontend `src/data/tasks.ts` icindeki INITIAL_TASKS ile ID uyumludur
(task-1 ... task-6). Bu dosya backend `/api/analyze` icin gereken
muhendislik alanlarini (yogunluk, hedef kutle, bbox limitleri, min
et kalinligi, min ic radyus, uretim sureci) tutar. Zengin UI verisi
(annotations, kriterler, drawings) frontend tarafinda kalir.

Ileride gercek bir veritabanina (PostgreSQL vb.) tasinacak. Anahtar
isimleri frontend TypeScript tipleriyle (camelCase) birebir uyumludur.
"""
from typing import Any, Dict, List

USERS: Dict[str, Dict[str, Any]] = {
    "demo-user": {
        "id": "demo-user",
        "name": "Demo Öğrenci",
        "university": "Dokuz Eylül Üniversitesi",
        "department": "Makine Mühendisliği",
        "year": "1. Sınıf",
        "avatarUrl": "https://api.dicebear.com/9.x/initials/svg?seed=DO&backgroundColor=2563eb",
        "studentId": "108210342",
        "verificationCode": "MCODE-2026-DEU",
        "portfolioScore": 85,
        "completedTasksCount": 1,
        "verifiedBadgesCount": 2,
        "skills": [
            {"name": "3-Eksen CNC DFM", "level": 88},
            {"name": "Ağırlık Optimizasyonu (Topoloji)", "level": 82},
            {"name": "Tolerans Analizi (GD&T)", "level": 75},
            {"name": "Alüminyum Talaşlı İmalat", "level": 90},
        ],
        "badges": [
            {"name": "CNC Frezeleme Uzmanı", "icon": "wrench", "earnedFor": "Görev 002 - 90+ DFM Skoru"},
            {"name": "Havacılık Hafifletme Rozeti", "icon": "award", "earnedFor": "Ağırlık hedefini %18 aşan optimizasyon"},
        ],
    }
}

TASKS: List[Dict[str, Any]] = [
    {
        "id": "task-1",
        "code": "Görev 001",
        "title": "L-Braket Tasarımı ve Titreşim Dayanımı",
        "category": "Otomotiv / Şase Montaj",
        "difficulty": "Başlangıç",
        "material": "Alüminyum 6061-T6",
        "densityGcm3": 2.70,
        "yieldStrengthMpa": 276,
        "targetWeightGrams": 66,
        "minWeightGrams": 60,
        "maxWeightGrams": 75,
        "boundingBoxMax": "80 x 80 x 40 mm",
        "boundingBoxLimits": {"x": 80, "y": 80, "z": 40},
        "minWallThicknessMm": 3.0,
        "minInnerRadiusMm": 8.0,
        "manufacturingProcess": "3-Eksen CNC Frezeleme",
        "scenario": (
            "Bir raf ve motor montaj modülünü duvara/şaseye tutturacak yüksek "
            "dayanımlı L-braket. 500 N statik düşey yükü emniyetle taşımalı."
        ),
        "requirements": [
            "500 N statik düşey yükü emniyetli taşımalı (S ≥ 2.0).",
            "Toplam kütle hedefi < 75 gram, alt sınır 60 gram.",
            "Taban ve dikey yüzde toplam 4 adet Ø10 mm montaj deliği.",
            "Delik merkezleri kenardan en az 15 mm uzakta.",
            "İç köşede en az R8 mm fillet.",
        ],
        "status": "available",
        "sampleFileName": "LBracket_6061_T6.step",
    },
    {
        "id": "task-2",
        "code": "Görev 002",
        "title": "Kademeli Mil ve Toleranslı Teknik Resim",
        "category": "Güç Aktarımı / Redüktör Milleri",
        "difficulty": "Başlangıç",
        "material": "Ç45 (SAE 1045) Islah Çeliği",
        "densityGcm3": 7.85,
        "yieldStrengthMpa": 570,
        "targetWeightGrams": 1850,
        "minWeightGrams": 1650,
        "maxWeightGrams": 2050,
        "boundingBoxMax": "45 x 45 x 220 mm",
        "boundingBoxLimits": {"x": 45, "y": 45, "z": 220},
        "minWallThicknessMm": 2.0,
        "minInnerRadiusMm": 1.5,
        "manufacturingProcess": "CNC Torna + Dik İşleme",
        "scenario": (
            "Elektrik motorundan dişli kutusuna 15 kW güç aktaracak kademeli mil. "
            "İki adet 6206 rulman yatağı (Ø30 k6) ve dişli oturma faturası (Ø40)."
        ),
        "requirements": [
            "2 adet Ø30 k6 rulman oturma yüzeyi.",
            "DIN 6885-A 8x7 mm kama yuvası.",
            "Fatura geçişlerinde r=1.5 mm radüs.",
            "Mil uçlarında 2x45° imalat pahı.",
            "Rulman yüzeyinde Ra 0.8 µm yüzey pürüzlülük işareti.",
        ],
        "status": "available",
        "sampleFileName": "SteppedShaft_C45.step",
    },
    {
        "id": "task-3",
        "code": "Görev 003",
        "title": "Süspansiyon Salıncak Kolu Hafifletme (FEA)",
        "category": "Otomotiv / Ön Süspansiyon",
        "difficulty": "Orta",
        "material": "Alüminyum Al-356-T6 Döküm",
        "densityGcm3": 2.68,
        "yieldStrengthMpa": 185,
        "targetWeightGrams": 740,
        "minWeightGrams": 620,
        "maxWeightGrams": 850,
        "boundingBoxMax": "300 x 120 x 50 mm",
        "boundingBoxLimits": {"x": 300, "y": 120, "z": 50},
        "minWallThicknessMm": 6.0,
        "minInnerRadiusMm": 4.0,
        "manufacturingProcess": "Alüminyum Kum Döküm + CNC Freze",
        "scenario": (
            "1.4 kg döküm çelik salıncak kolunu Al-356-T6 döküm ile yeniden "
            "tasarla ve topoloji optimizasyonu ile hafiflet (Unsprung Mass)."
        ),
        "requirements": [
            "3000 N düşey kasis + 1500 N yanal frenleme yüküne dayanım.",
            "3 bağlantı noktası eksen mesafeleri sabit (A-B-C burçları).",
            "Toplam kütle < 850 g.",
            "Von Mises gerilmesi < 185 MPa (Al-356-T6 akma).",
            "Döküm için tüm iç geçişler R ≥ 4 mm.",
        ],
        "status": "available",
        "sampleFileName": "SuspensionArm_Al356_T6.step",
    },
    {
        "id": "task-4",
        "code": "Görev 004",
        "title": "Flanşlı Boru Bağlantısı & Sızdırmazlık (PN40)",
        "category": "Basınçlı Kap / Petrokimya",
        "difficulty": "Orta",
        "material": "P250GH Basınçlı Kap Çeliği",
        "densityGcm3": 7.85,
        "yieldStrengthMpa": 250,
        "targetWeightGrams": 4200,
        "minWeightGrams": 3800,
        "maxWeightGrams": 4600,
        "boundingBoxMax": "200 x 200 x 40 mm",
        "boundingBoxLimits": {"x": 200, "y": 200, "z": 40},
        "minWallThicknessMm": 20.0,
        "minInnerRadiusMm": 2.0,
        "manufacturingProcess": "CNC Torna + Freze (Kaynak Boyunlu)",
        "scenario": (
            "40 bar iç basınca maruz DN80 boru hattı için EN 1092-1 Type 11 "
            "PN40 standardında kaynak boyunlu flanş."
        ),
        "requirements": [
            "40 bar (4 MPa) iç basınç sızdırmazlığı.",
            "8 adet M16 cıvata deliği Ø160 mm daireye 45° açıyla.",
            "Raised Face (RF) sızdırmazlık yüzeyi.",
            "Kaynak ağzı 30° bevel.",
            "EN 1092-1 standart tolerans.",
        ],
        "status": "locked",
        "sampleFileName": "FlangePN40_DN80.step",
    },
    {
        "id": "task-5",
        "code": "Görev 005",
        "title": "Şanzıman Gövdesi Topoloji Optimizasyonu",
        "category": "Havacılık / Performans Şanzımanı",
        "difficulty": "İleri",
        "material": "AZ91D Magnezyum-Alüminyum Alaşımı",
        "densityGcm3": 1.81,
        "yieldStrengthMpa": 160,
        "targetWeightGrams": 980,
        "minWeightGrams": 800,
        "maxWeightGrams": 1200,
        "boundingBoxMax": "220 x 140 x 100 mm",
        "boundingBoxLimits": {"x": 220, "y": 140, "z": 100},
        "minWallThicknessMm": 3.0,
        "minInnerRadiusMm": 3.0,
        "manufacturingProcess": "Basınçlı Döküm (Magnezyum) + CNC Freze",
        "scenario": (
            "450 Nm tork aktaran helis dişli çiftini barındıran magnezyum "
            "alaşımlı hafif şanzıman gövdesi. Havacılık İHA uygulaması."
        ),
        "requirements": [
            "450 Nm sürekli reaksiyon torku dayanımı.",
            "Toplam gövde ağırlığı < 1.2 kg.",
            "Rulman eksenleri arası sehim < 0.05 mm.",
            "Generatif kaburga yapısı ile topoloji optimizasyonu.",
            "Modal frekans dişli çalışma frekansı üzerinde.",
        ],
        "status": "locked",
        "sampleFileName": "GearboxHousing_AZ91D.step",
    },
    {
        "id": "task-6",
        "code": "Görev 006",
        "title": "Isı Değiştirici Kanatçık & Soğutma Bloğu",
        "category": "Güç Elektroniği / Termal Yönetim",
        "difficulty": "İleri",
        "material": "Alüminyum 6063-T6 (Ekstrüzyon)",
        "densityGcm3": 2.70,
        "yieldStrengthMpa": 214,
        "targetWeightGrams": 410,
        "minWeightGrams": 340,
        "maxWeightGrams": 500,
        "boundingBoxMax": "120 x 100 x 55 mm",
        "boundingBoxLimits": {"x": 120, "y": 100, "z": 55},
        "minWallThicknessMm": 1.8,
        "minInnerRadiusMm": 0.8,
        "manufacturingProcess": "Alüminyum Ekstrüzyon + Dilme",
        "scenario": (
            "200 W ısı yayan MOSFET güç bloğu için Alüminyum ekstrüzyon "
            "kanatçıklı soğutucu blok tasarımı."
        ),
        "requirements": [
            "200 W termal kayıp gücü yayabilme.",
            "Maksimum yüzey sıcaklığı < 75 °C.",
            "Ekstrüzyon için min kanat kalınlığı 1.8 mm.",
            "14 adet kanatçık, 45 mm yükseklik.",
            "Kanat diplerinde en az R0.8 mm radüs.",
        ],
        "status": "locked",
        "sampleFileName": "HeatSink_6063_T6.step",
    },
]


def get_task(task_id: str) -> Dict[str, Any] | None:
    return next((t for t in TASKS if t["id"] == task_id), None)


def get_user(user_id: str) -> Dict[str, Any] | None:
    return USERS.get(user_id)
