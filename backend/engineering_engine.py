"""Modul B - Muhendislik Hesaplama Motoru.

MVP'de geometri, dosya adindan uretilen deterministik bir tohumla (seed)
SIMULE edilir. Gercek entegrasyonda bu sinifin SADECE `load_geometry`
metodu OpenCASCADE (pythonocc-core / OCP) tabanli gercek B-Rep okumasi ile
degistirilecek; hesaplama arayuzu (hacim, kutle, et kalinligi, tolerans)
ayni kalacaktir.
"""
import hashlib
import random
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, Optional


@dataclass
class GeometryData:
    """OpenCASCADE'in TopoDS_Shape'inden cikarilacak ozet geometri verisi."""
    volume_cm3: float
    bounding_box_mm: Dict[str, float]  # {"x":..., "y":..., "z":...}
    min_wall_thickness_mm: float
    min_inner_radius_mm: float
    faces_count: int
    edges_count: int
    has_h7_tolerance: bool
    has_undercut: bool
    extra: Dict[str, Any] = field(default_factory=dict)


@dataclass
class ToleranceResult:
    compliant: bool
    detail: str
    measured_min_radius_mm: float
    required_min_radius_mm: float
    has_h7_tolerance: bool


class EngineeringCalculationEngine:
    """Hacim, kutle, minimum et kalinligi ve tolerans uygunlugu hesaplayici.

    Kullanim:
        engine = EngineeringCalculationEngine(density_g_cm3=2.70)
        geo = engine.load_geometry(file_path, task_constraints)
        mass = engine.compute_mass_grams(geo)
    """

    def __init__(self, density_g_cm3: float):
        self.density_g_cm3 = density_g_cm3

    # ------------------------------------------------------------------
    # GEOMETRI OKUMA (OpenCASCADE ile degistirilecek tek nokta)
    # ------------------------------------------------------------------
    def load_geometry(
        self,
        file_path: Optional[Path],
        constraints: Dict[str, Any],
        seed_name: str = "",
    ) -> GeometryData:
        """MOCK: Gorev kisitlarina gore rastgele ama deterministik geometri uretir.

        OpenCASCADE entegrasyonunda:
            from OCP.STEPControl import STEPControl_Reader
            reader.ReadFile(str(file_path)) -> TopoDS_Shape
            BRepGProp.VolumeProperties(shape, props) vb.
        """
        name = seed_name or (file_path.name if file_path else "sample")
        seed = int(hashlib.md5(name.encode("utf-8")).hexdigest(), 16)
        rng = random.Random(seed)

        limits = constraints.get("boundingBoxLimits", {"x": 100, "y": 80, "z": 40})
        min_w = constraints.get("minWeightGrams") or 50
        max_w = constraints.get("maxWeightGrams") or 200
        req_radius = constraints.get("minInnerRadiusMm", 3.0)

        # Kutle hedef araligina denk gelen hacim bandi: V = M / rho
        vol_low = min_w / self.density_g_cm3
        vol_high = max_w / self.density_g_cm3
        # %85 ihtimalle hedef aralikta, %15 ihtimalle hafif disinda bir hacim simule et
        if rng.random() < 0.85:
            volume = rng.uniform(vol_low * 1.05, vol_high * 0.95)
        else:
            volume = rng.uniform(vol_high * 1.0, vol_high * 1.15)

        bbox = {
            "x": round(limits["x"] * rng.uniform(0.85, 0.99), 1),
            "y": round(limits["y"] * rng.uniform(0.85, 0.99), 1),
            "z": round(limits["z"] * rng.uniform(0.82, 0.99), 1),
        }

        return GeometryData(
            volume_cm3=round(volume, 2),
            bounding_box_mm=bbox,
            min_wall_thickness_mm=round(rng.uniform(1.4, 4.2), 2),
            min_inner_radius_mm=round(rng.choice([0.0, 1.5, 2.0, req_radius, req_radius + 1.0]), 1),
            faces_count=rng.randint(60, 140),
            edges_count=rng.randint(160, 320),
            has_h7_tolerance=rng.random() < 0.7,
            has_undercut=rng.random() < 0.2,
        )

    # ------------------------------------------------------------------
    # HESAPLAMALAR (arayuz OpenCASCADE sonrasi degismeyecek)
    # ------------------------------------------------------------------
    def compute_volume_cm3(self, geometry: GeometryData) -> float:
        return geometry.volume_cm3

    def compute_mass_grams(self, geometry: GeometryData) -> float:
        return round(geometry.volume_cm3 * self.density_g_cm3, 1)

    def compute_min_wall_thickness_mm(self, geometry: GeometryData) -> float:
        return geometry.min_wall_thickness_mm

    def check_tolerance(
        self, geometry: GeometryData, required_min_radius_mm: float
    ) -> ToleranceResult:
        compliant = (
            geometry.min_inner_radius_mm >= required_min_radius_mm
            and geometry.has_h7_tolerance
        )
        if geometry.min_inner_radius_mm < required_min_radius_mm:
            detail = (
                f"İç köşe yarıçapı R{geometry.min_inner_radius_mm} mm, gereken minimum "
                f"R{required_min_radius_mm} mm değerinin altında."
            )
        elif not geometry.has_h7_tolerance:
            detail = "Kritik deliklerde ISO H7 tolerans işareti bulunamadı."
        else:
            detail = "Tüm yarıçap ve ISO H7 delik toleransları uygundur."
        return ToleranceResult(
            compliant=compliant,
            detail=detail,
            measured_min_radius_mm=geometry.min_inner_radius_mm,
            required_min_radius_mm=required_min_radius_mm,
            has_h7_tolerance=geometry.has_h7_tolerance,
        )
