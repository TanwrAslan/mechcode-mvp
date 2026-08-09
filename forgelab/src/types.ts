export type ScreenType = 'landing' | 'catalog' | 'detail' | 'solution' | 'evaluation' | 'portfolio';

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
