export interface DfmCheckItem {
  id: string;
  title: string;
  description: string;
  status: 'success' | 'warning' | 'error';
  value?: string;
  recommendation?: string;
}

export interface ReportSection {
  title: string; // "Ağırlık Hedefi" | "Tolerans Analizi" | "Üretim Kısıtı (DFM)"
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
  score: number; // 0 - 100
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
}

export interface Task {
  id: string;
  code: string;
  title: string;
  category: 'Otomotiv' | 'Havacılık' | 'İmalat' | 'Robotik' | 'Enerji' | 'EV';
  difficulty: 'Kolay' | 'Orta' | 'Zor' | 'İleri';
  material: string;
  densityGcm3: number;
  yieldStrengthMpa: number;
  targetWeightGrams: number;
  minWeightGrams?: number;
  maxWeightGrams: number;
  boundingBoxMax: string;
  manufacturingProcess: string;
  scenario: string;
  requirements: string[];
  mvpConstraints?: {
    materialDensity: string;
    targetWeightRange: string;
    maxBoundingBox: string;
    keyGeometryDetails: string[];
  };
  developerControlMatrix?: {
    volumeCheckFormula: string;
    volumeRangeCm3: string;
    boundingBoxCheck: string;
    brepCheckMetrics: string[];
  };
  status: 'not_started' | 'in_progress' | 'completed';
  score?: number;
  sampleFileName: string;
  defaultReport?: EvaluationReport;
}

export interface Badge {
  name: string;
  icon?: string;
  earnedFor?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  university: string;
  department: string;
  year: string;
  avatarUrl: string;
  studentId?: string;
  verificationCode?: string;
  portfolioScore: number;
  completedTasksCount: number;
  verifiedBadgesCount: number;
  skills: { name: string; level: number }[];
  badges: Badge[];
}
