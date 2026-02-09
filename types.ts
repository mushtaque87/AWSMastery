
export type SectionId = 'fundamentals' | 'core-services' | 'architecture' | 'labs' | 'matcher' | 'review' | 'roadmap';

export interface ModuleResource {
  type: 'doc' | 'video' | 'blog';
  title: string;
  url: string;
}

export interface ModuleTopic {
  title: string;
  description: string;
  keyPoints: string[];
  resources: ModuleResource[];
}

export interface AWSModule {
  id: string;
  title: string;
  architectWhy: string;
  masterSummary?: string; // New field for 300-500 word deep dive
  serviceSynergy: string;
  costTip: string;
  tags: string[];
  documentationUrl: string;
  detailedTopics?: ModuleTopic[];
  useCases?: {
    title: string;
    description: string;
  }[];
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

export interface RoadmapTopic {
  title: string;
  summary: string;
  level: 'associate' | 'principal';
  tutorial?: {
    content: string;
    keyPoints: string[];
    resources: {
      type: 'doc' | 'video' | 'blog';
      title: string;
      url: string;
    }[];
  };
}

export interface RoadmapDetail {
  summary: string;
  topics: RoadmapTopic[];
  useCases: {
    title: string;
    description: string;
  }[];
  resources: {
    type: 'doc' | 'video' | 'blog';
    title: string;
    url: string;
  }[];
}
