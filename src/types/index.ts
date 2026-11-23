export interface FormOption {
  label: string;
  points: number;
  value: string;
  key?: string;
  hint?: string;
}

export type QuestionType = 'single' | 'multiple' | 'text' | 'textarea' | 'contact';

export interface Question {
  id: number;
  questionNumber: string;
  title: string;
  subtitle?: string;
  type: QuestionType;
  placeholder?: string;
  options?: FormOption[];
  minSelections?: number;
  whyItMatters?: string;
}

export interface FormResponses {
  q1_productType: string;
  q2_stage: string;
  q3_targetCustomer: string;
  q4_problem: string;
  q5_currentSolution: string[];
  q6_mainOutcome: string;
  q7_userJourney: string;
  q8_features: string[];
  q9_timeline: string;
  q10_investment: string;
  firstName: string;
  email: string;
  phone?: string;
}

export interface DeferItem {
  feature: string;
  reason: string;
}

export interface BlueprintResult {
  totalScore: number;
  scoreBand: 'low' | 'medium' | 'high';
  bandTitle: string;
  bandMessage: string;
  ctaText: string;
  calendlyUrl: string;
  productSummary: string;
  coreWorkflowSummary: string;
  buildFirstList: string[];
  deferList: DeferItem[];
  biggestRisk: string;
  isHighFit: boolean;
  scoreBreakdown: {
    category: string;
    score: number;
    maxScore: number;
  }[];
}

