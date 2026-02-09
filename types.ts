
export type SectionId = 'fundamentals' | 'core-services' | 'architecture' | 'labs' | 'matcher' | 'review' | 'roadmap';

export interface AWSModule {
  title: string;
  architectWhy: string;
  serviceSynergy: string;
  costTip: string;
  tags: string[];
}

export interface ScenarioMatch {
  recommendedService: string;
  justification: string;
  implementationSteps: {
    phase: string;
    details: string;
  }[];
  mermaidDiagram: string;
  alternatives?: string[];
}

export interface SavedMatch {
  id: string;
  timestamp: number;
  prompt: string;
  match: ScenarioMatch;
}

export interface ArchitectureReview {
  pillarRatings: {
    pillar: string;
    rating: number; // 1-10
    feedback: string;
  }[];
  criticalFixes: string[];
  costOptimizationScore: string;
}

export interface StepExplanation {
  explanation: string;
  keyTerms: { term: string; definition: string }[];
  documentationLinks: { title: string; url: string }[];
  codeSnippets?: {
    title: string;
    language: string;
    code: string;
  }[];
}
