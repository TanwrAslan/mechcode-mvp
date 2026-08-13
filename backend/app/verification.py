"""Dogrulama motoru.

Tarayicida olculen GERCEK geometriyi (bkz. frontend/src/lib/measure.ts) gorevin
teknik resminden girilen sartnameyle karsilastirir.

Tasarim ilkesi
--------------
Bu modul HICBIR degeri tahmin etmez. Bir buyukluk olculemediyse ilgili madde
`unmeasured` isaretlenir, agirligi paydadan DUSULUR ve rapor bunu acikca yazar.
Skor daima "olculebilen maddeler uzerinden" hesaplanir; boylece 70 puan her
zaman ayni anlami tasir.

(Eski `engineering_engine.load_geometry` rastgele tohumla sahte geometri
uretiyordu; bu motor onun yerini alir.)
"""
from __future__ import annotations

import secrets
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

PASS_SCORE_DEFAULT = 70

# Maddelerin en az bu kadari olculebilmeli; altinda kalirsa sonuc
# "Degerlendirilemedi" olur. Kismi kanitla gecme belgesi verilmez.
MIN_COVERAGE_DEFAULT = 60.0

# Tessellation ucgenlemesi daireyi ICTEN yaklasiklar; olculen cap nominalin
# birkac yuzdesi altinda cikar. Tolerans onerirken bunu hatirlatiyoruz.
TESSELLATION_NOTE = "Üçgenleme daireyi içten yaklaşıklar; ölçülen çap nominalden ~0.05 mm küçük çıkabilir."


def _code() -> str:
    """Paylasilabilir dogrulama kodu: MS-XXXX-XXXX (karisan harfler cikarildi)."""
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    part = lambda: "".join(secrets.choice(alphabet) for _ in range(4))
    return f"MS-{part()}-{part()}"


def _fmt(value: Optional[float], unit: str = "mm") -> str:
    return "ölçülemedi" if value is None else f"{value:g} {unit}"


class _CheckBuilder:
    """Maddeleri toplar ve agirlikli skoru hesaplar."""

    def __init__(self) -> None:
        self.checks: List[Dict[str, Any]] = []

    def add(
        self,
        check_id: str,
        label: str,
        *,
        expected: str,
        measured: Optional[float],
        weight: float,
        within: Optional[bool],
        deviation: Optional[str] = None,
        note: Optional[str] = None,
        unit: str = "mm",
        measured_text: Optional[str] = None,
    ) -> None:
        if measured is None and measured_text is None:
            status, earned = "unmeasured", 0.0
        elif within:
            status, earned = "pass", float(weight)
        else:
            status, earned = "fail", 0.0

        self.checks.append({
            "id": check_id,
            "label": label,
            "status": status,
            "expected": expected,
            "measured": measured_text if measured_text is not None else _fmt(measured, unit),
            "deviation": deviation,
            "weight": float(weight),
            "earned": round(earned, 2),
            "note": note,
        })

    def add_unmeasured(self, check_id: str, label: str, expected: str, weight: float, note: str) -> None:
        self.checks.append({
            "id": check_id,
            "label": label,
            "status": "unmeasured",
            "expected": expected,
            "measured": "ölçülemedi",
            "deviation": None,
            "weight": float(weight),
            "earned": 0.0,
            "note": note,
        })

    def totals(self) -> tuple[float, float, float]:
        """(kazanilan, olculebilen agirlik, toplam agirlik)"""
        earned = sum(c["earned"] for c in self.checks)
        measured_weight = sum(c["weight"] for c in self.checks if c["status"] != "unmeasured")
        total_weight = sum(c["weight"] for c in self.checks)
        return earned, measured_weight, total_weight


def verify(
    *,
    task_id: str,
    task_title: str,
    file_name: str,
    spec: Dict[str, Any],
    measurement: Dict[str, Any],
    submitted_by: str = "student",
    submitter_label: Optional[str] = None,
) -> Dict[str, Any]:
    """Olcum + sartname -> madde madde dogrulama raporu."""
    b = _CheckBuilder()
    integrity: List[str] = list(measurement.get("warnings") or [])

    watertight = bool(measurement.get("watertight"))
    require_watertight = bool(spec.get("requireWatertight", True))

    # ---------------------------------------------------------- 0) Katı bütünlüğü
    open_edges = int(measurement.get("openEdgeCount") or 0)
    b.add(
        "watertight",
        "Katı bütünlüğü (kapalı hacim)",
        expected="Kapalı katı, açık kenar yok",
        measured=None,
        measured_text="kapalı ✓" if watertight else f"{open_edges} açık kenar",
        weight=spec.get("watertightWeight", 10),
        within=watertight,
        note=None if watertight
        else "Model katı (solid) değil veya yüzeyler birleşmemiş. Hacim/kütle bu dosyadan güvenilir ölçülemez.",
    )

    # ------------------------------------------------------------ 1) Sınır kutusu
    bbox_spec = spec.get("boundingBox") or {}
    bbox = measurement.get("boundingBoxMm") or {}
    if bbox_spec.get("enabled"):
        tol = float(bbox_spec.get("toleranceMm", 1.0))
        weight_each = float(bbox_spec.get("weight", 15)) / 3.0
        for axis in ("x", "y", "z"):
            target = float(bbox_spec.get(axis, 0))
            actual = bbox.get(axis)
            if actual is None:
                b.add_unmeasured(
                    f"bbox-{axis}", f"Dış ölçü {axis.upper()}",
                    f"{target:g} ± {tol:g} mm", weight_each, "Sınır kutusu okunamadı.",
                )
                continue
            actual = float(actual)
            delta = actual - target
            b.add(
                f"bbox-{axis}",
                f"Dış ölçü {axis.upper()}",
                expected=f"{target:g} ± {tol:g} mm",
                measured=actual,
                weight=weight_each,
                within=abs(delta) <= tol,
                deviation=f"{delta:+.2f} mm",
            )

    # ------------------------------------------------------------------ 2) Kütle
    mass_spec = spec.get("mass") or {}
    if mass_spec.get("enabled"):
        density = float((spec.get("material") or {}).get("densityGcm3") or 0)
        volume = measurement.get("volumeCm3")
        target = float(mass_spec.get("target", 0))
        tol_pct = float(mass_spec.get("tolerancePercent", 5))
        weight = float(mass_spec.get("weight", 20))

        if not watertight and require_watertight:
            b.add_unmeasured(
                "mass", "Kütle (hacim × yoğunluk)",
                f"{target:g} g ± %{tol_pct:g}", weight,
                "Mesh kapalı olmadığı için hacim — dolayısıyla kütle — güvenilir değil. Bu madde puanlanmadı.",
            )
        elif not volume or not density or not target:
            b.add_unmeasured(
                "mass", "Kütle (hacim × yoğunluk)",
                f"{target:g} g ± %{tol_pct:g}" if target else "tanımsız", weight,
                "Hacim, yoğunluk veya hedef kütle eksik.",
            )
        else:
            mass = float(volume) * density
            tol_abs = target * tol_pct / 100.0
            delta = mass - target
            b.add(
                "mass",
                "Kütle (hacim × yoğunluk)",
                expected=f"{target:g} g ± %{tol_pct:g}  ({target - tol_abs:.1f}–{target + tol_abs:.1f} g)",
                measured=round(mass, 1),
                unit="g",
                weight=weight,
                within=abs(delta) <= tol_abs,
                deviation=f"{delta:+.1f} g (%{(delta / target * 100):+.1f})",
                note=f"Hacim {float(volume):g} cm³ × {density:g} g/cm³",
            )

    # ---------------------------------------------------------- 3) Et kalınlığı
    wall_spec = spec.get("wallThickness") or {}
    if wall_spec.get("enabled"):
        target = float(wall_spec.get("target", 0))
        tol = float(wall_spec.get("toleranceMm", 0.5))
        weight = float(wall_spec.get("weight", 15))
        measured = measurement.get("minWallThicknessMm")
        p5 = measurement.get("wallThicknessP5Mm")

        if measured is None:
            b.add_unmeasured(
                "wall", "Et kalınlığı", f"{target:g} ± {tol:g} mm", weight,
                "Işın hiçbir karşı yüzeye ulaşmadı; et kalınlığı ölçülemedi.",
            )
        else:
            measured = float(measured)
            delta = measured - target
            note = None
            # Tek gurultulu ornek minimumu asagi cekebilir; yaygin degeri de goster.
            if p5 is not None and abs(float(p5) - target) <= tol and abs(delta) > tol:
                note = (
                    f"En ince nokta {measured:g} mm, ancak yüzeyin %95'i {float(p5):g} mm ve üzerinde. "
                    "Tek bir keskin köşe/pah ölçümü aşağı çekmiş olabilir."
                )
            b.add(
                "wall",
                "Et kalınlığı (en ince nokta)",
                expected=f"{target:g} ± {tol:g} mm",
                measured=measured,
                weight=weight,
                within=abs(delta) <= tol,
                deviation=f"{delta:+.2f} mm",
                note=note,
            )

    # ---------------------------------------------------------------- 4) Delikler
    hole_spec = spec.get("holes") or {}
    if hole_spec.get("enabled"):
        want_count = int(hole_spec.get("count", 0))
        want_dia = float(hole_spec.get("diameterMm", 0))
        tol = float(hole_spec.get("toleranceMm", 0.3))
        weight = float(hole_spec.get("weight", 20))
        w_count, w_dia = weight * 0.5, weight * 0.5

        diameters = [float(d) for d in (measurement.get("holeDiametersMm") or [])]
        # Yalnizca hedef capa yakin olanlari say — kavis/boss yuzeyleri elenir
        matching = [d for d in diameters if abs(d - want_dia) <= max(tol * 3, 1.0)]
        found_count = len(matching)

        if not diameters:
            b.add_unmeasured(
                "hole-count", "Delik sayısı", f"{want_count} adet", w_count,
                "Eksene paralel silindirik yüzey bulunamadı. Delikler eğik eksenliyse bu yöntemle ölçülemez.",
            )
            b.add_unmeasured(
                "hole-dia", "Delik çapı", f"Ø{want_dia:g} ± {tol:g} mm", w_dia,
                "Delik tespit edilemediği için çap ölçülemedi.",
            )
        else:
            b.add(
                "hole-count",
                "Delik sayısı",
                expected=f"{want_count} adet",
                measured=float(found_count),
                unit="adet",
                weight=w_count,
                within=found_count == want_count,
                deviation=f"{found_count - want_count:+d} adet",
                note=None if found_count == want_count
                else f"Tespit edilen tüm silindirik çaplar: {', '.join(f'Ø{d:g}' for d in diameters)}",
            )

            if matching:
                worst = max(matching, key=lambda d: abs(d - want_dia))
                b.add(
                    "hole-dia",
                    "Delik çapı (en sapan)",
                    expected=f"Ø{want_dia:g} ± {tol:g} mm",
                    measured=round(worst, 2),
                    weight=w_dia,
                    within=all(abs(d - want_dia) <= tol for d in matching),
                    deviation=f"{worst - want_dia:+.2f} mm",
                    note=TESSELLATION_NOTE,
                )
            else:
                b.add(
                    "hole-dia",
                    "Delik çapı",
                    expected=f"Ø{want_dia:g} ± {tol:g} mm",
                    measured=None,
                    measured_text=f"hedefe yakın delik yok (bulunan: {', '.join(f'Ø{d:g}' for d in diameters)})",
                    weight=w_dia,
                    within=False,
                )

    # ------------------------------------------------------- 5) İç köşe yarıçapı
    radius_spec = spec.get("minInnerRadius") or {}
    if radius_spec.get("enabled"):
        target = float(radius_spec.get("target", 0))
        tol = float(radius_spec.get("toleranceMm", 0.5))
        weight = float(radius_spec.get("weight", 10))
        measured = measurement.get("minConcaveRadiusMm")

        if measured is None:
            b.add_unmeasured(
                "radius", "İç köşe yarıçapı", f"R{target:g} ± {tol:g} mm", weight,
                "İç bükey silindirik yüzey bulunamadı; kavis yarıçapı ölçülemedi.",
            )
        else:
            measured = float(measured)
            b.add(
                "radius",
                "En küçük iç yarıçap",
                expected=f"R{target:g} ± {tol:g} mm",
                measured=measured,
                weight=weight,
                within=abs(measured - target) <= tol,
                deviation=f"{measured - target:+.2f} mm",
            )

    # ------------------------------------------------------------------- toplam
    earned, measured_weight, total_weight = b.totals()
    coverage = (measured_weight / total_weight * 100) if total_weight else 0.0
    min_coverage = float(spec.get("minCoveragePercent") or MIN_COVERAGE_DEFAULT)

    if measured_weight <= 0:
        score, passed, verdict = 0, False, "Değerlendirilemedi"
        integrity.append(
            "Hiçbir madde ölçülemedi. Dosyanın katı (solid) STEP AP203/AP214 olarak "
            "dışa aktarıldığından emin olun."
        )
    else:
        score = round(earned / measured_weight * 100)
        pass_score = float(spec.get("passScore") or PASS_SCORE_DEFAULT)

        if coverage < min_coverage:
            # Kismi kanitla "Gecti" belgesi verilmez. Skor bilgi olarak kalir
            # ama sonuc kesinlestirilmez — aksi halde olculemeyen bir dosya
            # yuksek puan alabilirdi.
            passed = False
            verdict = "Değerlendirilemedi"
            integrity.append(
                f"Maddelerin yalnızca %{coverage:.0f}'i ölçülebildi (gereken en az %{min_coverage:g}). "
                "Sonuç kesinleştirilmedi: eksik ölçümlerle geçme kararı verilemez. "
                "Dosyayı katı STEP AP203/AP214 olarak yeniden dışa aktarıp tekrar deneyin."
            )
        else:
            passed = score >= pass_score
            verdict = "Geçti" if passed else "Kaldı"

    if measured_weight < total_weight:
        skipped = [c["label"] for c in b.checks if c["status"] == "unmeasured"]
        integrity.append(
            f"{len(skipped)} madde ölçülemediği için puanlamaya katılmadı: {', '.join(skipped)}. "
            "Skor yalnızca ölçülebilen maddeler üzerinden hesaplandı."
        )

    return {
        "code": _code(),
        "createdAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "taskId": task_id,
        "taskTitle": task_title,
        "fileName": file_name,
        "score": score,
        "passed": passed,
        "verdict": verdict,
        "checks": b.checks,
        "measuredWeight": round(measured_weight, 2),
        "totalWeight": round(total_weight, 2),
        "coveragePercent": round(coverage),
        "measurement": measurement,
        "integrityWarnings": integrity,
        "submittedBy": submitted_by,
        "submitterLabel": submitter_label,
    }
