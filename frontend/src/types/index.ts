export type ScreenType =
  | 'landing'
  | 'catalog'
  | 'detail'
  | 'evaluation'
  | 'portfolio'
  | 'pricing'
  | 'verify'
  | 'admin';

export type TaskDifficulty = 'Başlangıç' | 'Orta' | 'İleri';

export interface EvaluationCriterion {
  id: string;
  text: string;
  weight: number;
}

export interface DesignDecision {
  title: string;
  explanation: string;
  iconName?: string;
}

export interface CriticalValue {
  label: string;
  standardValue: string;
  optimizedValue: string;
  unit?: string;
  isImportant?: boolean;
}

export interface AnnotationPoint {
  id: string;
  x: number; // percentage in viewer
  y: number; // percentage in viewer
  title: string;
  description: string;
  tag: string;
}

export interface Task {
  id: string;
  title: string;
  shortDescription: string;
  difficulty: TaskDifficulty;
  skillTags: string[];
  estimatedTime: string;
  isPremium: boolean;
  status: 'available' | 'completed' | 'locked';
  
  // Detailed content
  context: {
    useCase: string;
    realWorldExample: string;
    engineeringReason: string;
    criticalFactor: string;
  };
  brief: {
    scenario: string;
    constraints: string[];
    requiredOutput: string;
    parameters: { label: string; value: string }[];
  };
  drawing: {
    dimensions: { code: string; value: string; note: string }[];
    material: string;
    scale: string;
    tolerance: string;
    svgType: 'bracket' | 'stepped_shaft' | 'control_arm' | 'flange' | 'housing' | 'fin';
  };
  steps: string[];

  /**
   * Görev PDF'i (teknik resim + brief). Admin panelinden yüklenir,
   * görev detayında öğrenciye sunulur.
   */
  briefPdf?: { fileId: string; originalName: string };

  /**
   * Örnek çözüm (cevap anahtarı): doğru tasarımın PDF'i ya da görseli.
   * Admin panelinden yüklenir, öz değerlendirme ekranında öğrenciye gösterilir.
   */
  solutionPdf?: { fileId: string; originalName: string };

  /**
   * Otomatik kontrol şartnamesi. Tanımlıysa yüklenen STEP gerçek ölçümle
   * bu hedeflere karşı denetlenir. Tanımsızsa görev yalnızca öz
   * değerlendirmeyle puanlanır.
   */
  verification?: VerificationSpec;

  exampleSolution: {
    title: string;
    material: string;
    weight: string;
    weightReduction: string;
    safetyFactor: string;
    maxStress: string;
    annotations: AnnotationPoint[];
    criticalValues: CriticalValue[];
    designDecisions: DesignDecision[];
  };
  criteria: EvaluationCriterion[];
}

// --------------------------------------------------------------------------
// Doğrulama şartnamesi (ground truth) — görev PDF'indeki ölçü künyesi
// --------------------------------------------------------------------------

/** Tek bir sayısal kontrol maddesi: hedef + tolerans + puan ağırlığı. */
export interface NumericRule {
  enabled: boolean;
  /** Teknik resimde verilen nominal değer. */
  target: number;
  /** Kabul edilen mutlak sapma (± mm / ± adet). */
  toleranceMm: number;
  /** Toplam puandaki ağırlığı. */
  weight: number;
}

/** Kütle kuralı toleransı yüzde olarak alır (yoğunluk ve tessellation payı). */
export interface MassRule {
  enabled: boolean;
  /** Hedef kütle (g). Boş bırakılırsa beklenen hacim × yoğunluktan hesaplanır. */
  target: number;
  tolerancePercent: number;
  weight: number;
}

export interface HoleRule {
  enabled: boolean;
  count: number;
  diameterMm: number;
  /** Çap toleransı — tessellation sapması için ≥0.2 mm önerilir. */
  toleranceMm: number;
  weight: number;
}

export interface VerificationSpec {
  /** Kapalıysa görev yalnızca öz değerlendirme ile puanlanır. */
  enabled: boolean;
  material: { name: string; densityGcm3: number };
  boundingBox: {
    enabled: boolean;
    x: number;
    y: number;
    z: number;
    toleranceMm: number;
    weight: number;
  };
  mass: MassRule;
  wallThickness: NumericRule;
  holes: HoleRule;
  minInnerRadius: NumericRule;
  /** Kapalı (watertight) katı zorunlu mu — açık mesh hacmi güvenilmezdir. */
  requireWatertight: boolean;
  /** Geçme eşiği (0-100). */
  passScore: number;
  /**
   * Ağırlığın en az bu kadarı ölçülebilmeli; altında kalırsa sonuç
   * "Değerlendirilemedi" olur. Kısmi kanıtla geçme kararı verilmez.
   * Belirtilmezse backend %60 uygular.
   */
  minCoveragePercent?: number;
}

/** Tek bir kontrol maddesinin sonucu. */
export interface VerificationCheck {
  id: string;
  label: string;
  /** unmeasured = ölçülemedi; puanlamaya KATILMAZ, uydurulmaz. */
  status: 'pass' | 'fail' | 'warn' | 'unmeasured';
  expected: string;
  measured: string;
  /** Nominalden sapma (varsa). */
  deviation?: string;
  weight: number;
  earned: number;
  note?: string;
}

export interface VerificationReport {
  /** Paylaşılabilir doğrulama kodu (ör. MS-7K2F-9QX4). */
  code: string;
  createdAt: string;
  taskId: string;
  taskTitle: string;
  fileName: string;
  /** 0-100; yalnızca ÖLÇÜLEBİLEN maddelerin ağırlığı üzerinden. */
  score: number;
  passed: boolean;
  verdict: 'Geçti' | 'Kaldı' | 'Değerlendirilemedi';
  checks: VerificationCheck[];
  /** Puanlanan / toplam ağırlık — kaç maddenin ölçülebildiğini gösterir. */
  measuredWeight: number;
  totalWeight: number;
  /** Ölçülebilen ağırlığın yüzdesi. */
  coveragePercent: number;
  measurement: MeasurementPayload;
  integrityWarnings: string[];
  /** Dış doğrulama için: bunu kimin gönderdiği. */
  submittedBy: 'student' | 'guest';
  submitterLabel?: string;
}

/** Tarayıcıda ölçülen ve backend'e gönderilen ham veri. */
export interface MeasurementPayload {
  volumeCm3: number;
  surfaceAreaMm2: number;
  boundingBoxMm: { x: number; y: number; z: number };
  triangleCount: number;
  watertight: boolean;
  openEdgeCount: number;
  minWallThicknessMm: number | null;
  wallThicknessP5Mm: number | null;
  holeCount: number;
  holeDiametersMm: number[];
  minConcaveRadiusMm: number | null;
  warnings: string[];
}

export interface UserProfile {
  name: string;
  title: string;
  university: string;
  grade: string;
  xp: number;
  level: number;
  completedTasksCount: number;
  badges: { name: string; icon: string; date: string }[];
  isPro: boolean;
  freeTasksRemaining: number;
}

export interface SubmissionState {
  taskId: string;
  uploadedFileName?: string;
  uploadedAt?: string;
  checkedCriteria: Record<string, boolean>;
  score?: number;
  feedback?: string;
  completedAt?: string;
}

// --------------------------------------------------------------------------
// Backend analysis report (MechCode /api/analyze response)
// --------------------------------------------------------------------------

export interface DfmCheckItem {
  id: string;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error';
  value?: string;
  recommendation?: string;
}

export interface ReportSection {
  title: string;
  points: number;
  maxPoints: number;
  status: 'success' | 'warning' | 'error';
  detail: string;
}

export interface LlmFeedback {
  provider: string;
  model: string;
  missingDimensions: string[];
  missingTolerances: string[];
  suggestions: string[];
  note?: string;
  analyzedFile?: string;
}

export interface EvaluationReport {
  score: number;
  passed?: boolean;
  verdict?: 'Geçti' | 'Kaldı';
  analysisId?: string;
  analyzedFileName?: string;
  minWallThicknessMm?: number;
  sections?: ReportSection[];
  llmFeedback?: LlmFeedback;
  calculatedWeightGrams: number;
  targetWeightGrams: number;
  volumeCm3: number;
  boundingBox: {
    lengthMm: number;
    widthMm: number;
    heightMm: number;
  };
  materialName: string;
  manufacturingType: string;
  successChecks: DfmCheckItem[];
  warnings: DfmCheckItem[];
  cadMeshDetails: {
    facesCount: number;
    edgesCount: number;
    minRadiusMm: number;
    hasH7Tolerance: boolean;
  };
  geometrySource?: 'real_mesh' | 'mock';
}

export interface UploadedCad {
  taskId: string;
  file: File;
  fileId?: string;
  geometry?: {
    volumeCm3: number;
    boundingBoxMm: { x: number; y: number; z: number };
    triangleCount: number;
  };
  /** Tarayıcıda çıkarılan tam ölçüm (bkz. lib/measure.ts). */
  measurement?: MeasurementPayload;
  /** Şartnameye karşı otomatik kontrol sonucu. */
  verification?: VerificationReport;
  report?: EvaluationReport;
  parseFailed?: boolean;
}
