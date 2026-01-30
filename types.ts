
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
  alternatives?: string[];
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
