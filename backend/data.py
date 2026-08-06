"""Mock veri katmani (in-memory 'veritabani').

Ileride gercek bir veritabanina (PostgreSQL vb.) tasinacak. Anahtar isimleri
frontend TypeScript tipleriyle (camelCase) birebir uyumludur.
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
        "id": "task-001",
        "code": "Görev 001",
        "title": "EV Batarya Modülü Taşıyıcı Braketi",
        "category": "Otomotiv",
        "difficulty": "Kolay",
        "material": "6061-T6 Alüminyum Alaşımı",
        "densityGcm3": 2.70,
        "yieldStrengthMpa": 276,
        "targetWeightGrams": 185,
        "minWeightGrams": 120,
        "maxWeightGrams": 185,
        "boundingBoxMax": "120 x 80 x 45 mm",
        "boundingBoxLimits": {"x": 120, "y": 80, "z": 45},
        "minWallThicknessMm": 3.0,
        "minInnerRadiusMm": 3.0,
        "manufacturingProcess": "3-Eksen CNC Talaşlı Frezeleme",
        "scenario": (
            "Elektrikli şehir aracının alt şasisine monte edilecek LFP batarya modülünün "
            "sarsıntılara karşı sabitlenmesi için hafif ama mukavemetli bir Alüminyum braket "
            "tasarlanmalıdır. Parçanın üretilebilirliği için CNC frezeleme kurallarına uyulmalı "
            "ve ağırlık optimize edilmelidir."
        ),
        "requirements": [
            "Toplanmış kütle maksimum 185 gram olmalıdır (Minimum mukavemet sınırı: 120 gram).",
            "Ham malzeme kütüğü maks. 120 x 80 x 45 mm boyutlarına sığmalıdır.",
            "4 adet M6 cıvata deliği (Ø6.6 mm) ve 2 adet Ø10 mm merkezleme pimi yuvası barındırmalıdır.",
            "3-eksen CNC takım erişilebilirliği için dik açı altı (undercut) geometrilerden kaçınılmalıdır.",
            "Tüm iç köşe yarıçapları (fillet) standart Ø6mm parmak freze için en az R3.0 mm olmalıdır.",
        ],
        "status": "not_started",
        "sampleFileName": "EV_Battery_Bracket_6061.step",
    },
    {
        "id": "task-002",
        "code": "Görev 002",
        "title": "İHA Gimbal Optik Kamera Adaptör Flanşı",
        "category": "Havacılık",
        "difficulty": "Orta",
        "material": "7075-T6 Alüminyum Alaşımı",
        "densityGcm3": 2.81,
        "yieldStrengthMpa": 505,
        "targetWeightGrams": 95,
        "minWeightGrams": 60,
        "maxWeightGrams": 95,
        "boundingBoxMax": "90 x 90 x 25 mm",
        "boundingBoxLimits": {"x": 90, "y": 90, "z": 25},
        "minWallThicknessMm": 2.0,
        "minInnerRadiusMm": 2.0,
        "manufacturingProcess": "3/5-Eksen CNC Frezeleme",
        "scenario": (
            "Otonom keşif drone'unun gövde altı karbon fiber tüp şasisine EO/IR optik kamera "
            "gimbal sistemini bağlayacak bir adaptör flanşı tasarlanması istenmektedir. Titreşim "
            "dampinği ve havacılık kütle tasarrufu önceliklidir."
        ),
        "requirements": [
            "Toplanmış kütle maksimum 95 gram olmalıdır (Minimum kütle sınırı: 60 gram).",
            "Ham kütük zarfı maksimum 90 x 90 x 25 mm boyutlarını aşmamalıdır.",
            "Ø70 mm cıvata dairesi (PCD) üzerinde 4 adet M4 havşa başlı vida deliği bulundurmalıdır.",
            "Ağırlık düşürme amaçlı dairesel hafifletme cepleri tasarlanmalıdır (Cep L/D < 3.5).",
            "Minimum et kalınlığı 2.0 mm altında olmamalıdır.",
        ],
        "status": "completed",
        "score": 92,
        "sampleFileName": "UAV_Gimbal_Flange_7075.step",
    },
    {
        "id": "task-003",
        "code": "Görev 003",
        "title": "Egzoz Sıcaklık Sensörü Muhafazası & Spacer",
        "category": "Otomotiv",
        "difficulty": "Orta",
        "material": "Paslanmaz Çelik AISI 304",
        "densityGcm3": 8.00,
        "yieldStrengthMpa": 215,
        "targetWeightGrams": 140,
        "minWeightGrams": 85,
        "maxWeightGrams": 140,
        "boundingBoxMax": "60 x 60 x 35 mm",
        "boundingBoxLimits": {"x": 60, "y": 60, "z": 35},
        "minWallThicknessMm": 2.0,
        "minInnerRadiusMm": 2.0,
        "manufacturingProcess": "CNC Torna + Dik İşleme",
        "scenario": (
            "Hibrit araç egzoz manifold çıkışındaki yüksek sıcaklık sensörünü taş sıçramalarından "
            "ve radyant ısıdan koruyacak paslanmaz çelik muhafaza spacer parçası tasarlanacaktır."
        ),
        "requirements": [
            "Toplanmış kütle maksimum 140 gram olmalıdır (Minimum kütle sınırı: 85 gram).",
            "Ham kütük zarfı maksimum 60 x 60 x 35 mm boyutlarını aşmamalıdır.",
            "Eksenel M18x1.5 sensör dişi geçiş deliği (Ø16.5 mm matkap deliği) bulundurmalıdır.",
            "Dış yüzeyde ısı dağıtıcı radyal soğutma kanatçıkları veya kanalları yer almalıdır.",
            "Paslanmaz çelik işlenebilirliği için keskin iç köşelerden kaçınılmalı, min R2.0 mm radüs verilmeli.",
        ],
        "status": "in_progress",
        "score": 85,
        "sampleFileName": "Exhaust_Sensor_Spacer_304.step",
    },
]


def get_task(task_id: str) -> Dict[str, Any] | None:
    return next((t for t in TASKS if t["id"] == task_id), None)


def get_user(user_id: str) -> Dict[str, Any] | None:
    return USERS.get(user_id)
