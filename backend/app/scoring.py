"""Modul C - Skorlama Sistemi.

Her analiz icin 0-100 arasi "Muhendislik Skoru" ve "Gecti/Kaldi" raporu uretir.
Rapor bolumleri: "Agirlik Hedefi", "Tolerans Analizi", "Uretim Kisiti (DFM)".
JSON cikti frontend EvaluationReport tipiyle birebir uyumludur; PDF cikti
fpdf2 ile uretilir.
"""
from io import BytesIO
from typing import Any, Dict

from fpdf import FPDF

from .engineering_engine import EngineeringCalculationEngine, GeometryData

PASS_THRESHOLD = 70

_TR_MAP = str.maketrans("çÇğĞıİöÖşŞüÜ", "cCgGiIoOsSuU")

# Rapor metinlerinde gecen ve latin-1'de karsiligi olmayan isaretler.
_SYMBOL_MAP = {
    "✓": "OK", "✗": "X", "✔": "OK", "✘": "X",
    "→": "->", "←": "<-", "•": "-", "·": "-",
    "≥": ">=", "≤": "<=", "±": "+/-", "×": "x",
    "–": "-", "—": "-", "’": "'", "‘": "'", "“": '"', "”": '"',
    "Ø": "O", "³": "3", "²": "2", "°": "deg",
}


def _ascii(text: str) -> str:
    """Metni fpdf2'nin latin-1 core fontlarinin kaldirabilecegi hale getirir.

    Turkce harfler sadelestirilir, bilinen isaretler karsiliklariyla degistirilir
    ve GERIYE KALAN her latin-1 disi karakter '?' olur. Son adim onemli: aksi
    halde rapora giren beklenmedik bir simge butun PDF uretimini cokertir.
    """
    text = text.translate(_TR_MAP)
    for symbol, replacement in _SYMBOL_MAP.items():
        text = text.replace(symbol, replacement)
    return text.encode("latin-1", errors="replace").decode("latin-1")


class ScoringEngine:
    """Agirlik (40p) + Tolerans (30p) + DFM (30p) agirlikli skor hesaplayici."""

    def build_report(
        self,
        task: Dict[str, Any],
        geometry: GeometryData,
        engine: EngineeringCalculationEngine,
        file_name: str,
    ) -> Dict[str, Any]:
        mass = engine.compute_mass_grams(geometry)
        volume = engine.compute_volume_cm3(geometry)
        min_wall = engine.compute_min_wall_thickness_mm(geometry)
        tolerance = engine.check_tolerance(geometry, task.get("minInnerRadiusMm", 3.0))

        max_w = task["maxWeightGrams"]
        min_w = task.get("minWeightGrams") or 0
        req_wall = task.get("minWallThicknessMm", 2.0)

        # --- Bolum 1: Agirlik Hedefi (40 puan) ---
        weight_ok = min_w <= mass <= max_w
        if weight_ok:
            weight_points = 40
            weight_detail = f"Hesaplanan kütle {mass} g, hedef aralık [{min_w}-{max_w} g] içinde."
        elif mass > max_w:
            overshoot = (mass - max_w) / max_w
            weight_points = max(0, round(40 * (1 - overshoot * 3)))
            weight_detail = f"Hesaplanan kütle {mass} g, {max_w} g üst sınırını aşıyor."
        else:
            weight_points = 15
            weight_detail = f"Hesaplanan kütle {mass} g, {min_w} g mukavemet alt sınırının altında."

        # --- Bolum 2: Tolerans Analizi (30 puan) ---
        tol_points = 30 if tolerance.compliant else (15 if tolerance.has_h7_tolerance else 10)
        tol_detail = tolerance.detail

        # --- Bolum 3: Uretim Kisiti / DFM (30 puan) ---
        dfm_points = 30
        dfm_notes = []
        if geometry.has_undercut:
            dfm_points -= 15
            dfm_notes.append("3-eksen CNC ile işlenemeyen undercut (dik açı altı) yüzey tespit edildi.")
        if min_wall < req_wall:
            dfm_points -= 10
            dfm_notes.append(
                f"Minimum et kalınlığı {min_wall} mm, gereken {req_wall} mm sınırının altında."
            )
        bbox_lim = task.get("boundingBoxLimits", {})
        bbox = geometry.bounding_box_mm
        bbox_ok = all(bbox[a] <= bbox_lim.get(a, 1e9) for a in ("x", "y", "z"))
        if not bbox_ok:
            dfm_points -= 10
            dfm_notes.append("Geometri ham kütük zarfının dışına taşıyor.")
        dfm_points = max(0, dfm_points)
        dfm_detail = " ".join(dfm_notes) or "Tüm üretim kısıtları (kütük zarfı, et kalınlığı, takım erişimi) uygundur."

        score = weight_points + tol_points + dfm_points
        passed = score >= PASS_THRESHOLD

        sections = [
            {"title": "Ağırlık Hedefi", "points": weight_points, "maxPoints": 40,
             "status": "success" if weight_points >= 30 else "error", "detail": weight_detail},
            {"title": "Tolerans Analizi", "points": tol_points, "maxPoints": 30,
             "status": "success" if tolerance.compliant else "warning", "detail": tol_detail},
            {"title": "Üretim Kısıtı (DFM)", "points": dfm_points, "maxPoints": 30,
             "status": "success" if dfm_points >= 25 else "warning", "detail": dfm_detail},
        ]

        success_checks = []
        warnings = []

        if weight_ok:
            success_checks.append({
                "id": "s-weight", "status": "success", "title": "Hacim ve Kütle Kontrolü",
                "description": weight_detail, "value": f"{mass} g / {max_w} g",
            })
        else:
            warnings.append({
                "id": "w-weight", "status": "error", "title": "Kritik: Kütle Hedefi Aşımı",
                "description": weight_detail, "value": f"{mass} g",
                "recommendation": "Hafifletme cepleri ekleyerek veya et kalınlıklarını optimize ederek kütleyi hedef aralığa çekin.",
            })

        if bbox_ok:
            success_checks.append({
                "id": "s-bbox", "status": "success", "title": "Ham Kütük Zarfı Kontrolü",
                "description": f"Geometri {bbox['x']}x{bbox['y']}x{bbox['z']} mm zarfına sığıyor ({task['boundingBoxMax']} sınırı).",
                "value": f"{bbox['x']}x{bbox['y']}x{bbox['z']} mm",
            })
        else:
            warnings.append({
                "id": "w-bbox", "status": "error", "title": "Kritik: Kütük Zarfı Aşımı",
                "description": "Parça izin verilen maksimum ham kütük boyutlarının dışına taşıyor.",
                "value": f"{bbox['x']}x{bbox['y']}x{bbox['z']} mm",
                "recommendation": f"Tasarımı {task['boundingBoxMax']} zarfı içinde kalacak şekilde ölçeklendirin.",
            })

        if tolerance.measured_min_radius_mm >= tolerance.required_min_radius_mm:
            success_checks.append({
                "id": "s-radius", "status": "success", "title": "Minimum Radyus Standardı",
                "description": f"Tüm iç köşe radyusları R{tolerance.measured_min_radius_mm} mm ve üzerindedir; standart parmak freze ile işlenebilir.",
                "value": f"R{tolerance.measured_min_radius_mm} mm",
            })
        else:
            warnings.append({
                "id": "w-radius", "status": "error", "title": "Kritik: İşlenemez İç Köşeler (Radyus Eksikliği)",
                "description": f"İç ceplerde R{tolerance.measured_min_radius_mm} mm köşeler tespit edildi. CNC freze ucu silindirik yapısı gereği keskin köşeleri kesemez.",
                "value": f"R{tolerance.measured_min_radius_mm} mm",
                "recommendation": f"Tüm iç ceplere en az R{tolerance.required_min_radius_mm} mm radüs ekleyerek tasarımı güncelleyin.",
            })

        if not tolerance.has_h7_tolerance:
            warnings.append({
                "id": "w-h7", "status": "warning", "title": "Uyarı: ISO H7 Tolerans İşareti Eksik",
                "description": "Merkezleme pimi / geçme deliklerinde H7 tolerans tanımı bulunamadı.",
                "value": "H7 Eksik",
                "recommendation": "Kritik geçme deliklerine ISO 286 H7 tolerans sembolü ekleyin.",
            })

        if min_wall < req_wall:
            warnings.append({
                "id": "w-wall", "status": "warning", "title": "Uyarı: Minimum Et Kalınlığı",
                "description": f"Ölçülen minimum et kalınlığı {min_wall} mm; işleme sırasında titreşim ve deformasyon riski oluşturur.",
                "value": f"{min_wall} mm",
                "recommendation": f"İnce cidarları en az {req_wall} mm olacak şekilde kalınlaştırın.",
            })
        else:
            success_checks.append({
                "id": "s-wall", "status": "success", "title": "Minimum Et Kalınlığı Kontrolü",
                "description": f"Ölçülen minimum et kalınlığı {min_wall} mm, gereken {req_wall} mm sınırının üzerinde.",
                "value": f"{min_wall} mm",
            })

        if geometry.has_undercut:
            warnings.append({
                "id": "w-undercut", "status": "error", "title": "Kritik: Undercut Geometri",
                "description": "3-eksen takım erişiminin mümkün olmadığı dik açı altı yüzeyler tespit edildi.",
                "value": "Undercut Var",
                "recommendation": "Geometriyi tek yönden erişilebilir olacak şekilde revize edin veya 5-eksen işleme talep edin.",
            })

        return {
            "score": score,
            "passed": passed,
            "verdict": "Geçti" if passed else "Kaldı",
            "calculatedWeightGrams": mass,
            "targetWeightGrams": max_w,
            "volumeCm3": volume,
            "minWallThicknessMm": min_wall,
            "boundingBox": {"lengthMm": bbox["x"], "widthMm": bbox["y"], "heightMm": bbox["z"]},
            "materialName": task["material"],
            "manufacturingType": task["manufacturingProcess"],
            "sections": sections,
            "successChecks": success_checks,
            "warnings": warnings,
            "cadMeshDetails": {
                "facesCount": geometry.faces_count,
                "edgesCount": geometry.edges_count,
                "minRadiusMm": tolerance.measured_min_radius_mm,
                "hasH7Tolerance": tolerance.has_h7_tolerance,
            },
            "analyzedFileName": file_name,
        }

    # ------------------------------------------------------------------
    def build_pdf(self, task: Dict[str, Any], report: Dict[str, Any]) -> bytes:
        pdf = FPDF()
        pdf.add_page()
        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, _ascii("MechStudio - DFM Mühendislik Raporu"), new_x="LMARGIN", new_y="NEXT")

        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 7, _ascii(f"Görev: {task['code']} - {task['title']}"), new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 7, _ascii(f"Analiz Edilen Dosya: {report['analyzedFileName']}"), new_x="LMARGIN", new_y="NEXT")
        pdf.cell(0, 7, _ascii(f"Malzeme: {report['materialName']}"), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(3)

        pdf.set_font("Helvetica", "B", 14)
        verdict = report["verdict"].upper()
        pdf.cell(0, 10, _ascii(f"MÜHENDISLIK SKORU: {report['score']} / 100  -  SONUÇ: {verdict}"),
                 new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)

        for section in report["sections"]:
            pdf.set_font("Helvetica", "B", 12)
            pdf.cell(0, 8, _ascii(f"{section['title']}  ({section['points']}/{section['maxPoints']} puan)"),
                     new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 10)
            pdf.multi_cell(0, 6, _ascii(section["detail"]))
            pdf.ln(1)

        pdf.set_font("Helvetica", "B", 12)
        pdf.cell(0, 8, _ascii("Hesaplanan Fiziksel Özellikler"), new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 10)
        bbox = report["boundingBox"]
        rows = [
            f"Kütle: {report['calculatedWeightGrams']} g (Hedef maks: {report['targetWeightGrams']} g)",
            f"Hacim: {report['volumeCm3']} cm3",
            f"Minimum Et Kalınlığı: {report['minWallThicknessMm']} mm",
            f"Bounding Box: {bbox['lengthMm']} x {bbox['widthMm']} x {bbox['heightMm']} mm",
        ]
        for row in rows:
            pdf.cell(0, 6, _ascii("- " + row), new_x="LMARGIN", new_y="NEXT")

        buffer = BytesIO()
        pdf.output(buffer)
        return buffer.getvalue()

    # ------------------------------------------------------------------
    def build_verification_pdf(self, record: Dict[str, Any]) -> bytes:
        """Dogrulama raporunun paylasilabilir PDF ciktisi.

        Kod ve dogrulama adresi ustte yer alir; isveren belgeyi elinde tutsa
        bile gercekligini `/dogrula/<kod>` uzerinden teyit edebilir.
        """
        status_line = {
            "Geçti": "SONUC: GECTI",
            "Kaldı": "SONUC: KALDI",
        }.get(record["verdict"], "SONUC: DEGERLENDIRILEMEDI")

        pdf = FPDF()
        pdf.add_page()

        def para(text: str, height: float = 5) -> None:
            """Paragraf yazar.

            `multi_cell(0, ...)` genisligi imlecin BULUNDUGU yerden sag kenara
            kadar olcer. Onceki cagri imleci saga birakmissa kalan genislik
            sifira duser ve fpdf2 "Not enough horizontal space" ile patlar.
            Bu yuzden her paragraftan once imleci sol kenara cekiyoruz.
            """
            pdf.set_x(pdf.l_margin)
            pdf.multi_cell(0, height, _ascii(text), new_x="LMARGIN", new_y="NEXT")

        pdf.set_font("Helvetica", "B", 16)
        pdf.cell(0, 10, _ascii("MechStudio - Bagimsiz Dogrulama Raporu"), new_x="LMARGIN", new_y="NEXT")

        pdf.set_font("Helvetica", "B", 11)
        pdf.cell(0, 7, _ascii(f"Dogrulama Kodu: {record['code']}"), new_x="LMARGIN", new_y="NEXT")
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(0, 6, _ascii("Teyit: mechstudio.app/dogrula/" + record["code"]), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)

        pdf.set_font("Helvetica", "", 10)
        for line in [
            f"Gorev: {record['taskTitle']}",
            f"Dosya: {record['fileName']}",
            f"Tarih: {record['createdAt']}",
            f"Gonderen: {'Ogrenci' if record.get('submittedBy') == 'student' else 'Misafir'}"
            + (f" ({record['submitterLabel']})" if record.get("submitterLabel") else ""),
        ]:
            pdf.cell(0, 6, _ascii(line), new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)

        pdf.set_font("Helvetica", "B", 14)
        pdf.cell(
            0, 10,
            _ascii(f"SKOR: {record['score']} / 100   -   {status_line}"),
            new_x="LMARGIN", new_y="NEXT",
        )

        pdf.set_font("Helvetica", "", 9)
        para(
            f"Skor, olculebilen {record['measuredWeight']:g} / {record['totalWeight']:g} agirlik "
            "uzerinden hesaplanmistir. Olculemeyen maddeler puanlamaya katilmaz."
        )
        pdf.ln(3)

        # --- madde tablosu ---
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(0, 8, _ascii("Kontrol Maddeleri"), new_x="LMARGIN", new_y="NEXT")

        label_map = {"pass": "[GECTI]", "fail": "[KALDI]", "warn": "[UYARI]", "unmeasured": "[OLCULEMEDI]"}
        for check in record["checks"]:
            pdf.set_font("Helvetica", "B", 9)
            para(f"{label_map.get(check['status'], '[?]')} {check['label']}  "
                 f"({check['earned']:g}/{check['weight']:g} puan)")
            pdf.set_font("Helvetica", "", 9)
            para(f"    beklenen: {check['expected']}   |   olculen: {check['measured']}"
                 + (f"   |   sapma: {check['deviation']}" if check.get("deviation") else ""))
            if check.get("note"):
                para(f"    not: {check['note']}")
            pdf.ln(1)

        if record.get("integrityWarnings"):
            pdf.ln(2)
            pdf.set_font("Helvetica", "B", 10)
            pdf.cell(0, 8, _ascii("Olcum Notlari"), new_x="LMARGIN", new_y="NEXT")
            pdf.set_font("Helvetica", "", 9)
            for warning in record["integrityWarnings"]:
                para(f"- {warning}")

        pdf.ln(3)
        pdf.set_font("Helvetica", "I", 8)
        para(
            "Bu rapor yuklenen CAD dosyasindan otomatik olarak olculmus degerlere dayanir. "
            "Olcumler ucgenleme (tessellation) uzerinden yapildigi icin ~%1 mertebesinde "
            "sapma tasiyabilir. Tolerans disi bir sonuc, tasarimin hatali oldugunu degil, "
            "verilen teknik resimle uyusmadigini gosterir.",
            4,
        )

        buffer = BytesIO()
        pdf.output(buffer)
        return buffer.getvalue()
