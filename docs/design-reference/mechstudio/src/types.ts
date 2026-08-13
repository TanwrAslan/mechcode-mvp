export type ScreenType = 
  | 'landing' 
  | 'catalog' 
  | 'detail' 
  | 'solution' 
  | 'evaluation' 
  | 'portfolio' 
  | 'pricing';

export type DifficultyLevel = 'Başlangıç' | 'Orta' | 'İleri';

export interface CriticalValue {
  labelTR: string;
  labelEN: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}

export interface DesignDecision {
  id: string;
  questionTR: string;
  questionEN: string;
  explanationTR: string;
  explanationEN: string;
}

export interface EvaluationCriterion {
  id: number;
  textTR: string;
  textEN: string;
  hintTR?: string;
  hintEN?: string;
}

export interface Task {
  id: number;
  code: string; // e.g. "ENG-001"
  titleTR: string;
  titleEN: string;
  difficulty: DifficultyLevel;
  difficultyColor: string; // hex or tailwind class
  skills: string[];
  estimatedTime: string;
  descriptionTR: string;
  descriptionEN: string;
  isPremium: boolean;
  
  // Section A: Context
  contextTR: string;
  contextEN: string;
  
  // Section B: Brief & Constraints
  briefScenarioTR: string;
  briefScenarioEN: string;
  constraintsTR: string[];
  constraintsEN: string[];
  deliverablesTR: string[];
  deliverablesEN: string[];

  // Section C: Drawing Specs
  drawingTitle: string;
  keyDimensions: { label: string; val: string }[];
  drawingSvgType: 'l-bracket' | 'stepped-shaft' | 'flanged-connector' | 'l-bracket-fea';

  // Section D: Steps
  stepsTR: string[];
  stepsEN: string[];

  // Section 4: Example Solution
  solutionData: {
    material: string;
    thickness: string;
    weight: string;
    loadCapacity: string;
    criticalValues: CriticalValue[];
    designDecisions: DesignDecision[];
    annotations: {
      x: number; // percentage on viewer
      y: number;
      labelTR: string;
      labelEN: string;
    }[];
  };

  // Section 5: Evaluation
  evaluationCriteria: EvaluationCriterion[];
}

export interface CompletedTaskRecord {
  taskId: number;
  completedDate: string;
  score: number;
  maxScore: number;
  badge: string;
  uploadedFileName?: string;
}

export interface UserState {
  completedTasks: CompletedTaskRecord[];
  xp: number;
  language: 'TR' | 'EN';
  activeTaskId: number;
}
