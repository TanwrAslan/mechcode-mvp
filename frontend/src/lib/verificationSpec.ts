import { VerificationSpec } from '@/types';

/**
 * Yaygin muhendislik malzemeleri ve yogunluklari (g/cm³).
 * Kutle kontrolu hacim × yogunluk ile yapildigi icin dogru yogunluk sarttir.
 */
export const MATERIAL_PRESETS: Array<{ name: string; densityGcm3: number }> = [
  { name: 'Alüminyum 6061-T6', densityGcm3: 2.70 },
  { name: 'Alüminyum 7075-T6', densityGcm3: 2.81 },
  { name: 'Çelik S235 / St37', densityGcm3: 7.85 },
  { name: 'Çelik AISI 1045', densityGcm3: 7.87 },
  { name: 'Paslanmaz 304', densityGcm3: 8.00 },
  { name: 'Paslanmaz 316L', densityGcm3: 8.00 },
  { name: 'Dökme Demir GG25', densityGcm3: 7.20 },
  { name: 'Pirinç CuZn37', densityGcm3: 8.44 },
  { name: 'Titanyum Ti-6Al-4V', densityGcm3: 4.43 },
  { name: 'PLA (3B baskı)', densityGcm3: 1.24 },
  { name: 'ABS', densityGcm3: 1.04 },
];

/**
 * Varsayilan sartname.
 *
 * Toleranslar olcum yonteminin gercek hassasiyetine gore secildi:
 * - Sinir kutusu ucgenlemeden neredeyse hic etkilenmez  -> ±0.5 mm yeterli
 * - Delik capi daireyi ICTEN yaklasiklar (~0.05 mm dusuk) -> ±0.3 mm
 * - Et kalinligi isin ornekleme ile bulunur              -> ±0.5 mm
 */
export const defaultVerificationSpec = (): VerificationSpec => ({
  enabled: false,
  material: { name: 'Alüminyum 6061-T6', densityGcm3: 2.70 },
  boundingBox: { enabled: true, x: 0, y: 0, z: 0, toleranceMm: 0.5, weight: 25 },
  mass: { enabled: true, target: 0, tolerancePercent: 8, weight: 20 },
  wallThickness: { enabled: true, target: 0, toleranceMm: 0.5, weight: 15 },
  holes: { enabled: true, count: 0, diameterMm: 0, toleranceMm: 0.3, weight: 20 },
  minInnerRadius: { enabled: false, target: 0, toleranceMm: 0.5, weight: 10 },
  requireWatertight: true,
  passScore: 70,
});

/** Sartnamedeki toplam agirlik — admin panelinde canli gosterilir. */
export const totalSpecWeight = (spec: VerificationSpec): number => {
  let total = 10; // katı bütünlüğü maddesi sabit ağırlık taşır
  if (spec.boundingBox.enabled) total += spec.boundingBox.weight;
  if (spec.mass.enabled) total += spec.mass.weight;
  if (spec.wallThickness.enabled) total += spec.wallThickness.weight;
  if (spec.holes.enabled) total += spec.holes.weight;
  if (spec.minInnerRadius.enabled) total += spec.minInnerRadius.weight;
  return total;
};

// ---------------------------------------------------------------------------
// Görev PDF'indeki "Temel ölçüler (özet)" satırından otomatik doldurma
// ---------------------------------------------------------------------------

export interface ParsedSummary {
  dimensionsMm: number[];
  thicknessMm?: number;
  depthMm?: number;
  radiusMm?: number;
  holeCount?: number;
  holeDiameterMm?: number;
  material?: string;
  /** Hangi alanların yakalandığı — kullanıcıya geri bildirilir. */
  matched: string[];
}

/**
 * Gorev PDF'indeki kunye satirini ayristirir. Ornek:
 *
 *   "L kolları 80 × 80 mm · et kalınlığı 8 mm · genişlik (derinlik) 60 mm ·
 *    iç köşe kavisi R8 · 4 × Ø10 delik, kenarlardan 15 mm içeride"
 *
 * Yakalanamayan alan bos birakilir; admin elle tamamlar. Amac yazim yukunu
 * azaltmak, karar vermek degil — her deger kaydetmeden once formda gorunur.
 */
export function parseDimensionSummary(text: string): ParsedSummary {
  const out: ParsedSummary = { dimensionsMm: [], matched: [] };
  if (!text.trim()) return out;

  // Türkçe ondalık virgülünü noktaya çevir (8,5 mm -> 8.5 mm)
  const s = text.replace(/(\d),(\d)/g, '$1.$2');

  // "80 × 80" / "80x80" / "80 × 80 × 60"
  const dims = s.match(/(\d+(?:\.\d+)?)\s*[×xX*]\s*(\d+(?:\.\d+)?)(?:\s*[×xX*]\s*(\d+(?:\.\d+)?))?/);
  if (dims) {
    // "4 × Ø10" kalıbını ölçü sanmayalım
    const isHolePattern = /[×xX*]\s*Ø/.test(dims[0]);
    if (!isHolePattern) {
      out.dimensionsMm = [dims[1], dims[2], dims[3]].filter(Boolean).map(Number);
      out.matched.push('dış ölçüler');
    }
  }

  // "et kalınlığı 8 mm" / "t=8" / "kalınlık 8"
  const thickness = s.match(/(?:et\s*kal[ıi]nl[ıi][ğg][ıi]|kal[ıi]nl[ıi]k|\bt\s*=)\s*(\d+(?:\.\d+)?)/i);
  if (thickness) {
    out.thicknessMm = Number(thickness[1]);
    out.matched.push('et kalınlığı');
  }

  // "genişlik (derinlik) 60 mm" / "derinlik 60"
  const depth = s.match(/(?:geni[şs]lik|derinlik)[^\d]{0,12}(\d+(?:\.\d+)?)/i);
  if (depth) {
    out.depthMm = Number(depth[1]);
    out.matched.push('derinlik');
  }

  // "iç köşe kavisi R8" / "R8" / "yarıçap 8"
  const radius = s.match(/\bR\s*(\d+(?:\.\d+)?)/i) ?? s.match(/yar[ıi][çc]ap[^\d]{0,10}(\d+(?:\.\d+)?)/i);
  if (radius) {
    out.radiusMm = Number(radius[1]);
    out.matched.push('iç köşe yarıçapı');
  }

  // "4 × Ø10 delik" / "4 adet Ø10" / "4x Ø10"
  const holes = s.match(/(\d+)\s*(?:×|x|X|\*|adet)\s*Ø\s*(\d+(?:\.\d+)?)/);
  if (holes) {
    out.holeCount = Number(holes[1]);
    out.holeDiameterMm = Number(holes[2]);
    out.matched.push('delik sayısı ve çapı');
  } else {
    const singleHole = s.match(/Ø\s*(\d+(?:\.\d+)?)/);
    if (singleHole) {
      out.holeDiameterMm = Number(singleHole[1]);
      out.matched.push('delik çapı');
    }
  }

  // Malzeme adı — preset listesinden en iyi eşleşme
  const lower = s.toLocaleLowerCase('tr');
  for (const preset of MATERIAL_PRESETS) {
    const head = preset.name.split(/[\s-]/)[0].toLocaleLowerCase('tr');
    if (lower.includes(head)) {
      out.material = preset.name;
      out.matched.push('malzeme');
      break;
    }
  }

  return out;
}

/**
 * Ayristirilan kunyeyi sartnameye uygular.
 * Dis olculer 2 tane cikip ayrica "derinlik" verilmisse ucuncu eksen o olur
 * (L-braket kunyesindeki "80 × 80 mm ... genişlik 60 mm" kalibi).
 */
export function applySummaryToSpec(spec: VerificationSpec, parsed: ParsedSummary): VerificationSpec {
  const next: VerificationSpec = structuredClone(spec);
  const dims = [...parsed.dimensionsMm];
  if (dims.length === 2 && parsed.depthMm) dims.push(parsed.depthMm);

  if (dims.length >= 1) {
    next.boundingBox.enabled = true;
    next.boundingBox.x = dims[0] ?? next.boundingBox.x;
    next.boundingBox.y = dims[1] ?? next.boundingBox.y;
    next.boundingBox.z = dims[2] ?? next.boundingBox.z;
  }

  if (parsed.thicknessMm) {
    next.wallThickness.enabled = true;
    next.wallThickness.target = parsed.thicknessMm;
  }

  if (parsed.holeCount || parsed.holeDiameterMm) {
    next.holes.enabled = true;
    if (parsed.holeCount) next.holes.count = parsed.holeCount;
    if (parsed.holeDiameterMm) next.holes.diameterMm = parsed.holeDiameterMm;
  }

  if (parsed.radiusMm) {
    next.minInnerRadius.enabled = true;
    next.minInnerRadius.target = parsed.radiusMm;
  }

  if (parsed.material) {
    const preset = MATERIAL_PRESETS.find(m => m.name === parsed.material);
    if (preset) next.material = { ...preset };
  }

  return next;
}

/**
 * Hedef kutleyi basit bir prizma yaklasimiyla ONERIR.
 *
 * Bu yalnizca bir BASLANGIC degeridir: gercek parca dolu prizma degildir.
 * Dogru yol, referans cozumun kutlesini CAD'den okuyup buraya yazmaktir —
 * form bunu acikca soyler.
 */
export function suggestMassGrams(spec: VerificationSpec): number | null {
  const { x, y, z } = spec.boundingBox;
  if (!x || !y || !z || !spec.material.densityGcm3) return null;
  const volumeCm3 = (x * y * z) / 1000;
  return Math.round(volumeCm3 * spec.material.densityGcm3);
}
