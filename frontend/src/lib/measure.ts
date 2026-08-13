/**
 * Gercek olcum katmani.
 *
 * Yuklenen STEP/IGES dosyasi occt-import-js ile ucgen mesh'e cevrilir; bu modul
 * o mesh'ten OLCULEBILIR buyuklukleri cikarir. Hicbir deger tahmin edilmez ya da
 * uydurulmaz — olculemeyen buyukluk `null` doner ve rapor bunu "ölçülemedi"
 * olarak gosterir.
 *
 * Guvenilirlik notu
 * -----------------
 * - Hacim ve kutle YALNIZCA kapali (watertight) mesh'te dogrudur. Acik kenar
 *   varsa `watertight=false` doner ve dogrulama motoru hacim/kutle maddelerini
 *   puanlamaz.
 * - Delik capi ve et kalinligi ucgen tessellation'dan olculur; occt varsayilan
 *   sapma degeriyle ~%1 mertebesinde hata tasir. Tolerans secerken bunu hesaba
 *   katin (delikler icin >=0.2 mm onerilir).
 */
import type { OcctMesh } from './cadGeometry';

export type Axis = 'x' | 'y' | 'z';

export interface DetectedCylinder {
  axis: Axis;
  /** Olculen cap (mm). */
  diameterMm: number;
  /** Eksen boyunca uzunluk (mm) — delik derinligi. */
  depthMm: number;
  /** Eksen merkezinin diger iki koordinati (mm). */
  center: { u: number; v: number };
  /** Ic bukey (delik) mi dis bukey (silindirik cikinti/boss) mi. */
  kind: 'hole' | 'boss';
  /** Cember fitinin ortalama sapmasi (mm) — buyukse tespit zayiftir. */
  fitErrorMm: number;
}

export interface Measurement {
  /** Kapali mesh ise hacim guvenilirdir. */
  volumeCm3: number;
  surfaceAreaMm2: number;
  boundingBoxMm: { x: number; y: number; z: number };
  triangleCount: number;
  vertexCount: number;
  /** Her kenar tam iki ucgen tarafindan paylasiliyorsa mesh kapalidir. */
  watertight: boolean;
  openEdgeCount: number;
  /** Ray-cast ile olculen minimum et kalinligi; olculemezse null. */
  minWallThicknessMm: number | null;
  /**
   * Et kalinliginin 5. yuzdeligi. Tek bir gurultulu ornek minimumu asagi
   * cekebildigi icin rapor "en ince nokta" ile "yaygin incelik"i ayirir.
   */
  wallThicknessP5Mm: number | null;
  wallThicknessSamples: number;
  /** Tespit edilen silindirik yuzeyler. */
  cylinders: DetectedCylinder[];
  /** Ic bukey silindir sayisi = delik sayisi. */
  holeCount: number;
  holeDiametersMm: number[];
  /** En kucuk ic bukey (kavis/fillet) yaricapi; tespit edilemezse null. */
  minConcaveRadiusMm: number | null;
  /** Olcum sirasinda olusan uyarilar (kullaniciya aynen gosterilir). */
  warnings: string[];
}

// ---------------------------------------------------------------- yardimcilar

const AXES: Axis[] = ['x', 'y', 'z'];
const AXIS_INDEX: Record<Axis, number> = { x: 0, y: 1, z: 2 };
/** Her eksen icin dik duzlemi olusturan diger iki eksen indeksleri. */
const PLANE_INDEX: Record<Axis, [number, number]> = { x: [1, 2], y: [0, 2], z: [0, 1] };

const round = (v: number, digits = 2): number => {
  const f = 10 ** digits;
  return Math.round(v * f) / f;
};

interface FlatMesh {
  /** Duzlestirilmis kose koordinatlari (x,y,z uclu). */
  positions: Float64Array;
  /** Ucgen kose indeksleri (uclu). */
  indices: Uint32Array;
}

/** Tum mesh parcalarini tek bir indeks uzayinda birlestirir. */
function flatten(meshes: OcctMesh[]): FlatMesh {
  let posLen = 0;
  let idxLen = 0;
  for (const m of meshes) {
    posLen += m.attributes.position.array.length;
    idxLen += m.index.array.length;
  }

  const positions = new Float64Array(posLen);
  const indices = new Uint32Array(idxLen);
  let posOffset = 0;
  let idxOffset = 0;
  let vertexOffset = 0;

  for (const m of meshes) {
    const p = m.attributes.position.array;
    const i = m.index.array;
    for (let k = 0; k < p.length; k++) positions[posOffset + k] = p[k];
    for (let k = 0; k < i.length; k++) indices[idxOffset + k] = i[k] + vertexOffset;
    posOffset += p.length;
    idxOffset += i.length;
    vertexOffset += p.length / 3;
  }

  return { positions, indices };
}

interface Tri {
  /** Kose koordinatlari. */
  a: [number, number, number];
  b: [number, number, number];
  c: [number, number, number];
  /** Birim normal (saat yonune gore disariya bakar). */
  n: [number, number, number];
  /** Agirlik merkezi. */
  centroid: [number, number, number];
  area: number;
}

function buildTriangles(mesh: FlatMesh): Tri[] {
  const { positions, indices } = mesh;
  const tris: Tri[] = [];

  for (let i = 0; i < indices.length; i += 3) {
    const ia = indices[i] * 3;
    const ib = indices[i + 1] * 3;
    const ic = indices[i + 2] * 3;

    const a: [number, number, number] = [positions[ia], positions[ia + 1], positions[ia + 2]];
    const b: [number, number, number] = [positions[ib], positions[ib + 1], positions[ib + 2]];
    const c: [number, number, number] = [positions[ic], positions[ic + 1], positions[ic + 2]];

    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2];
    const vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];

    const nx = uy * vz - uz * vy;
    const ny = uz * vx - ux * vz;
    const nz = ux * vy - uy * vx;
    const len = Math.hypot(nx, ny, nz);
    if (len < 1e-12) continue; // dejenere ucgen

    tris.push({
      a, b, c,
      n: [nx / len, ny / len, nz / len],
      centroid: [(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3],
      area: len / 2,
    });
  }

  return tris;
}

// ------------------------------------------------------------- su gecirmezlik

/**
 * Kenar-manifold kontrolu: kapali bir katinin her kenari tam iki ucgende gecer.
 * Tessellation'da ayni koordinat farkli indekslerde tekrarlanabildigi icin
 * kenarlar indekse degil, yuvarlanmis koordinata gore eslestirilir.
 */
function countOpenEdges(tris: Tri[]): number {
  const key = (p: [number, number, number]) =>
    `${Math.round(p[0] * 1000)},${Math.round(p[1] * 1000)},${Math.round(p[2] * 1000)}`;

  const edges = new Map<string, number>();
  const addEdge = (p: [number, number, number], q: [number, number, number]) => {
    const kp = key(p);
    const kq = key(q);
    const k = kp < kq ? `${kp}|${kq}` : `${kq}|${kp}`;
    edges.set(k, (edges.get(k) ?? 0) + 1);
  };

  for (const t of tris) {
    addEdge(t.a, t.b);
    addEdge(t.b, t.c);
    addEdge(t.c, t.a);
  }

  let open = 0;
  for (const count of edges.values()) if (count !== 2) open++;
  return open;
}

// --------------------------------------------------------- uzaysal indeksleme

/** Ray-cast'i O(n²) olmaktan cikaran basit duzenli izgara. */
class TriangleGrid {
  private cells = new Map<string, number[]>();
  private cell: number;
  private min: [number, number, number];

  constructor(private tris: Tri[], min: [number, number, number], size: [number, number, number]) {
    this.min = min;
    // Ucgen basina ~1 hucre hedefiyle kaba bir cozunurluk
    const diag = Math.max(size[0], size[1], size[2]);
    this.cell = Math.max(diag / 32, 1e-3);

    tris.forEach((t, i) => {
      for (const k of this.cellsOf(t)) {
        const bucket = this.cells.get(k);
        if (bucket) bucket.push(i);
        else this.cells.set(k, [i]);
      }
    });
  }

  private keyOf(x: number, y: number, z: number): string {
    return `${x},${y},${z}`;
  }

  private cellsOf(t: Tri): string[] {
    const lo = [0, 0, 0];
    const hi = [0, 0, 0];
    for (let a = 0; a < 3; a++) {
      const vmin = Math.min(t.a[a], t.b[a], t.c[a]);
      const vmax = Math.max(t.a[a], t.b[a], t.c[a]);
      lo[a] = Math.floor((vmin - this.min[a]) / this.cell);
      hi[a] = Math.floor((vmax - this.min[a]) / this.cell);
    }
    const out: string[] = [];
    for (let x = lo[0]; x <= hi[0]; x++)
      for (let y = lo[1]; y <= hi[1]; y++)
        for (let z = lo[2]; z <= hi[2]; z++) out.push(this.keyOf(x, y, z));
    return out;
  }

  /** Isinin gectigi hucrelerdeki ucgen indekslerini toplar (3D DDA yerine kaba yurume). */
  candidates(origin: [number, number, number], dir: [number, number, number], maxDist: number): number[] {
    const seen = new Set<number>();
    const steps = Math.ceil(maxDist / this.cell) + 1;
    for (let s = 0; s <= steps; s++) {
      const d = Math.min(s * this.cell, maxDist);
      const px = origin[0] + dir[0] * d;
      const py = origin[1] + dir[1] * d;
      const pz = origin[2] + dir[2] * d;
      const cx = Math.floor((px - this.min[0]) / this.cell);
      const cy = Math.floor((py - this.min[1]) / this.cell);
      const cz = Math.floor((pz - this.min[2]) / this.cell);
      // Tessellation gurultusune karsi 1 hucre komsulugu tara
      for (let dx = -1; dx <= 1; dx++)
        for (let dy = -1; dy <= 1; dy++)
          for (let dz = -1; dz <= 1; dz++) {
            const bucket = this.cells.get(this.keyOf(cx + dx, cy + dy, cz + dz));
            if (bucket) for (const i of bucket) seen.add(i);
          }
    }
    return [...seen];
  }

  triangle(i: number): Tri {
    return this.tris[i];
  }
}

/** Möller–Trumbore isin/ucgen kesisimi. Kesisim yoksa null. */
function rayTriangle(
  origin: [number, number, number],
  dir: [number, number, number],
  t: Tri
): number | null {
  const EPS = 1e-9;
  const e1 = [t.b[0] - t.a[0], t.b[1] - t.a[1], t.b[2] - t.a[2]];
  const e2 = [t.c[0] - t.a[0], t.c[1] - t.a[1], t.c[2] - t.a[2]];

  const px = dir[1] * e2[2] - dir[2] * e2[1];
  const py = dir[2] * e2[0] - dir[0] * e2[2];
  const pz = dir[0] * e2[1] - dir[1] * e2[0];

  const det = e1[0] * px + e1[1] * py + e1[2] * pz;
  if (Math.abs(det) < EPS) return null;

  const inv = 1 / det;
  const tx = origin[0] - t.a[0];
  const ty = origin[1] - t.a[1];
  const tz = origin[2] - t.a[2];

  const u = (tx * px + ty * py + tz * pz) * inv;
  if (u < -EPS || u > 1 + EPS) return null;

  const qx = ty * e1[2] - tz * e1[1];
  const qy = tz * e1[0] - tx * e1[2];
  const qz = tx * e1[1] - ty * e1[0];

  const v = (dir[0] * qx + dir[1] * qy + dir[2] * qz) * inv;
  if (v < -EPS || u + v > 1 + EPS) return null;

  const dist = (e2[0] * qx + e2[1] * qy + e2[2] * qz) * inv;
  return dist > EPS ? dist : null;
}

/**
 * Minimum et kalinligi: yuzeyden ICERI dogru isin gonderip karsi duvara olan
 * mesafeyi olcer. Ornekleme yuzey alanina gore agirliklidir; en kucuk gecerli
 * mesafe et kalinligi olarak raporlanir.
 */
function measureMinWallThickness(
  tris: Tri[],
  grid: TriangleGrid,
  maxDist: number,
  sampleTarget: number
): { value: number | null; p5: number | null; samples: number } {
  // Buyuk yuzeylerden daha cok ornek alalim
  const sorted = [...tris.keys()].sort((i, j) => tris[j].area - tris[i].area);
  const step = Math.max(1, Math.floor(sorted.length / sampleTarget));

  const hits: number[] = [];
  let best = Infinity;
  let samples = 0;

  for (let s = 0; s < sorted.length; s += step) {
    const t = tris[sorted[s]];
    // Yuzeyden az iceri kacip kendi ucgenine carpmayi onle
    const eps = Math.max(maxDist * 1e-4, 1e-4);
    const origin: [number, number, number] = [
      t.centroid[0] - t.n[0] * eps,
      t.centroid[1] - t.n[1] * eps,
      t.centroid[2] - t.n[2] * eps,
    ];
    const dir: [number, number, number] = [-t.n[0], -t.n[1], -t.n[2]];

    let nearest = Infinity;
    for (const idx of grid.candidates(origin, dir, maxDist)) {
      const other = grid.triangle(idx);
      if (other === t) continue;

      // Yalnizca KARSI duvari say. Isin iceri (-n) gidiyorsa karsi duvarin dis
      // normali de ayni yone bakar (n_hit . dir ~ +1). Yan yuzeyleri siyirip
      // gecen isinlar (n_hit . dir ~ 0) sahte ince duvar uretir; onlari eliyoruz.
      const facing = other.n[0] * dir[0] + other.n[1] * dir[1] + other.n[2] * dir[2];
      if (facing < 0.5) continue;

      const d = rayTriangle(origin, dir, other);
      if (d !== null && d < nearest) nearest = d;
    }

    samples++;
    if (Number.isFinite(nearest) && nearest > eps * 2) {
      hits.push(nearest);
      if (nearest < best) best = nearest;
    }
  }

  hits.sort((a, b) => a - b);
  const p5 = hits.length ? hits[Math.floor(hits.length * 0.05)] : null;

  return {
    value: Number.isFinite(best) ? round(best, 2) : null,
    p5: p5 === null ? null : round(p5, 2),
    samples,
  };
}

// -------------------------------------------------------- silindir/delik fiti

/** Kucuk kareler ile cember fiti (Kasa yontemi). */
function fitCircle(points: Array<[number, number]>): { cu: number; cv: number; r: number; err: number } | null {
  const n = points.length;
  if (n < 8) return null;

  let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, sxz = 0, syz = 0, sz = 0;
  for (const [x, y] of points) {
    const z = x * x + y * y;
    sx += x; sy += y; sz += z;
    sxx += x * x; syy += y * y; sxy += x * y;
    sxz += x * z; syz += y * z;
  }

  const a11 = 2 * (sxx - (sx * sx) / n);
  const a12 = 2 * (sxy - (sx * sy) / n);
  const a22 = 2 * (syy - (sy * sy) / n);
  const b1 = sxz - (sx * sz) / n;
  const b2 = syz - (sy * sz) / n;

  const det = a11 * a22 - a12 * a12;
  if (Math.abs(det) < 1e-12) return null;

  const cu = (b1 * a22 - b2 * a12) / det;
  const cv = (a11 * b2 - a12 * b1) / det;

  let rSum = 0;
  for (const [x, y] of points) rSum += Math.hypot(x - cu, y - cv);
  const r = rSum / n;

  let err = 0;
  for (const [x, y] of points) err += Math.abs(Math.hypot(x - cu, y - cv) - r);
  return { cu, cv, r, err: err / n };
}

/**
 * Ucgenleri ortak kose uzerinden komsuluk grafigine baglar.
 * Tessellation ayni koordinati farkli indekste tekrarlayabildigi icin
 * eslestirme yuvarlanmis koordinatla yapilir.
 */
function connectedComponents(subset: Tri[]): Tri[][] {
  const key = (p: [number, number, number]) =>
    `${Math.round(p[0] * 100)},${Math.round(p[1] * 100)},${Math.round(p[2] * 100)}`;

  const byVertex = new Map<string, number[]>();
  subset.forEach((t, i) => {
    for (const p of [t.a, t.b, t.c]) {
      const k = key(p);
      const bucket = byVertex.get(k);
      if (bucket) bucket.push(i);
      else byVertex.set(k, [i]);
    }
  });

  const seen = new Array(subset.length).fill(false);
  const components: Tri[][] = [];

  for (let i = 0; i < subset.length; i++) {
    if (seen[i]) continue;
    const stack = [i];
    seen[i] = true;
    const comp: Tri[] = [];

    while (stack.length) {
      const cur = stack.pop()!;
      comp.push(subset[cur]);
      const t = subset[cur];
      for (const p of [t.a, t.b, t.c]) {
        for (const nb of byVertex.get(key(p)) ?? []) {
          if (!seen[nb]) {
            seen[nb] = true;
            stack.push(nb);
          }
        }
      }
    }
    components.push(comp);
  }

  return components;
}

/**
 * Eksene paralel silindirik yuzeyleri bulur.
 *
 * Yontem:
 *   1. Normali eksene dik olan ucgenleri sec (silindir yuzeyi adayi).
 *   2. Kose komsulugu ile bagli bilesenlere ayir — mekansal yakinlik degil,
 *      gercek yuzey surekliligi.
 *   3. Her bilesene cember fitle ve UC SIKI TESTTEN gecir:
 *        a) her noktanin merkeze uzakligi yaricaptan cok sapmamali,
 *        b) yuzey normali radyal olmali (duz duvari eleyen asil test),
 *        c) merkez etrafinda yeterli aci kapsanmali (duz/az egri yuzeyi eler).
 *
 * Bu testler olmadan neredeyse duz bir duvar, cok buyuk yaricapli "cember"
 * olarak dusuk artikla fit olur ve Ø500 gibi sahte delikler uretir.
 *
 * Egik eksenli delikler bu yontemle bulunamaz; o durumda delik maddesi
 * "ölçülemedi" olarak raporlanir — asla tahmin edilmez.
 */
function detectCylinders(tris: Tri[], sizes: [number, number, number]): DetectedCylinder[] {
  const found: DetectedCylinder[] = [];
  const maxDim = Math.max(...sizes);

  for (const axis of AXES) {
    const ai = AXIS_INDEX[axis];
    const [pu, pv] = PLANE_INDEX[axis];

    const candidates = tris.filter(t => Math.abs(t.n[ai]) < 0.15);
    if (candidates.length < 12) continue;

    for (const cluster of connectedComponents(candidates)) {
      if (cluster.length < 12) continue;

      const pts = cluster.map(t => [t.centroid[pu], t.centroid[pv]] as [number, number]);
      const fit = fitCircle(pts);
      if (!fit) continue;

      // Fiziksel akil suzgeci: parcadan buyuk delik olamaz
      if (fit.r < 0.4 || fit.r > maxDim * 0.5) continue;

      // (a) Yaricap tutarliligi — ortalama degil EN KOTU sapma
      let maxDev = 0;
      for (const [x, y] of pts) {
        maxDev = Math.max(maxDev, Math.abs(Math.hypot(x - fit.cu, y - fit.cv) - fit.r));
      }
      if (maxDev > Math.max(fit.r * 0.06, 0.08)) continue;

      // (b) Normal radyalligi — silindirde yuzey normali merkezden disa/ice bakar.
      //     Duz duvarda bakmaz; asil ayirt edici test budur.
      let radialSum = 0;
      let inwardVotes = 0;
      for (const t of cluster) {
        const du = t.centroid[pu] - fit.cu;
        const dv = t.centroid[pv] - fit.cv;
        const len = Math.hypot(du, dv);
        if (len < 1e-9) continue;
        const ru = du / len;
        const rv = dv / len;
        const dot = t.n[pu] * ru + t.n[pv] * rv;
        radialSum += Math.abs(dot);
        if (dot < 0) inwardVotes++; // normal merkeze bakiyor => ic bukey
      }
      const radiality = radialSum / cluster.length;
      if (radiality < 0.9) continue;

      // (c) Aci kapsami — merkez etrafinda en az ~120 derece taranmali
      const bins = new Array(36).fill(false);
      for (const [x, y] of pts) {
        const ang = Math.atan2(y - fit.cv, x - fit.cu);
        bins[Math.floor(((ang + Math.PI) / (2 * Math.PI)) * 36) % 36] = true;
      }
      const coverageDeg = bins.filter(Boolean).length * 10;
      if (coverageDeg < 120) continue;

      const kind: 'hole' | 'boss' = inwardVotes > cluster.length / 2 ? 'hole' : 'boss';

      let lo = Infinity;
      let hi = -Infinity;
      for (const t of cluster) {
        lo = Math.min(lo, t.a[ai], t.b[ai], t.c[ai]);
        hi = Math.max(hi, t.a[ai], t.b[ai], t.c[ai]);
      }

      found.push({
        axis,
        diameterMm: round(fit.r * 2, 2),
        depthMm: round(hi - lo, 2),
        center: { u: round(fit.cu, 2), v: round(fit.cv, 2) },
        kind,
        fitErrorMm: round(maxDev, 3),
      });
    }
  }

  return dedupeCylinders(found);
}

function dedupeCylinders(list: DetectedCylinder[]): DetectedCylinder[] {
  const out: DetectedCylinder[] = [];
  for (const c of [...list].sort((a, b) => a.fitErrorMm - b.fitErrorMm)) {
    const duplicate = out.some(
      o =>
        o.axis === c.axis &&
        Math.abs(o.center.u - c.center.u) < 0.8 &&
        Math.abs(o.center.v - c.center.v) < 0.8 &&
        Math.abs(o.diameterMm - c.diameterMm) < 0.8
    );
    if (!duplicate) out.push(c);
  }
  return out;
}

// ------------------------------------------------------------- ana giris nokta

/**
 * Mesh'ten olculebilir tum buyuklukleri cikarir.
 *
 * @param meshes occt-import-js ciktisi
 * @param options.wallSamples et kalinligi icin ornek sayisi (varsayilan 220)
 */
export function measureMesh(
  meshes: OcctMesh[],
  options: { wallSamples?: number } = {}
): Measurement {
  const warnings: string[] = [];
  const flat = flatten(meshes);
  const tris = buildTriangles(flat);

  if (tris.length === 0) {
    return {
      volumeCm3: 0,
      surfaceAreaMm2: 0,
      boundingBoxMm: { x: 0, y: 0, z: 0 },
      triangleCount: 0,
      vertexCount: 0,
      watertight: false,
      openEdgeCount: 0,
      minWallThicknessMm: null,
      wallThicknessP5Mm: null,
      wallThicknessSamples: 0,
      cylinders: [],
      holeCount: 0,
      holeDiametersMm: [],
      minConcaveRadiusMm: null,
      warnings: ['Dosyadan geçerli üçgen geometri okunamadı.'],
    };
  }

  // --- sinir kutusu + hacim + alan ---
  const min: [number, number, number] = [Infinity, Infinity, Infinity];
  const max: [number, number, number] = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < flat.positions.length; i += 3) {
    for (let a = 0; a < 3; a++) {
      const v = flat.positions[i + a];
      if (v < min[a]) min[a] = v;
      if (v > max[a]) max[a] = v;
    }
  }
  const sizes: [number, number, number] = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];

  let volumeMm3 = 0;
  let areaMm2 = 0;
  for (const t of tris) {
    volumeMm3 +=
      (t.a[0] * (t.b[1] * t.c[2] - t.c[1] * t.b[2]) -
        t.b[0] * (t.a[1] * t.c[2] - t.c[1] * t.a[2]) +
        t.c[0] * (t.a[1] * t.b[2] - t.b[1] * t.a[2])) /
      6;
    areaMm2 += t.area;
  }
  volumeMm3 = Math.abs(volumeMm3);

  // --- kapalilik ---
  const openEdgeCount = countOpenEdges(tris);
  const watertight = openEdgeCount === 0;
  if (!watertight) {
    warnings.push(
      `Mesh kapalı değil (${openEdgeCount} açık kenar). Hacim ve kütle güvenilir değildir; ` +
        'STEP dosyasını katı (solid) olarak dışa aktarın.'
    );
  }

  // --- et kalinligi ---
  const grid = new TriangleGrid(tris, min, sizes);
  const wall = measureMinWallThickness(tris, grid, Math.max(...sizes), options.wallSamples ?? 220);
  if (wall.value === null) {
    warnings.push('Minimum et kalınlığı ölçülemedi (ışın hiçbir karşı yüzeye ulaşmadı).');
  }

  // --- silindirler / delikler ---
  const cylinders = detectCylinders(tris, sizes);
  const holes = cylinders.filter(c => c.kind === 'hole');
  // Ic bukey silindirlerin en kucugu, kavis (fillet) yaricapi adayidir.
  const concaveRadii = holes.map(h => h.diameterMm / 2);
  const minConcaveRadiusMm = concaveRadii.length ? round(Math.min(...concaveRadii), 2) : null;

  if (cylinders.length === 0) {
    warnings.push(
      'Eksene paralel silindirik yüzey bulunamadı. Delik sayısı/çapı bu dosyadan ölçülemedi.'
    );
  }

  return {
    volumeCm3: round(volumeMm3 / 1000, 2),
    surfaceAreaMm2: round(areaMm2, 1),
    boundingBoxMm: { x: round(sizes[0], 2), y: round(sizes[1], 2), z: round(sizes[2], 2) },
    triangleCount: tris.length,
    vertexCount: flat.positions.length / 3,
    watertight,
    openEdgeCount,
    minWallThicknessMm: wall.value,
    wallThicknessP5Mm: wall.p5,
    wallThicknessSamples: wall.samples,
    cylinders,
    holeCount: holes.length,
    holeDiametersMm: holes.map(h => h.diameterMm).sort((a, b) => a - b),
    minConcaveRadiusMm,
    warnings,
  };
}
