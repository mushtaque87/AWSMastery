
import { GoogleGenAI, Type } from "@google/genai";
import { ScenarioMatch, ArchitectureReview, StepExplanation, GenericArchitecture, CloudMapping } from "../types";

export const matchAWSService = async (scenario: string): Promise<ScenarioMatch> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a Principal AWS Solutions Architect. For the following scenario, provide a Board-Level architectural design: "${scenario}". 
    
    Requirements:
    1. A clear 'recommendedService'.
    2. A deep 'justification' explaining the 2026-era benefits.
    3. A multi-phase 'implementationSteps' list. Each phase must be technically dense and specific.
    4. A Mermaid.js diagram representing the optimized system flow. Use valid Mermaid syntax.
    5. A complete Terraform configuration (.tf) and CloudFormation template (YAML) that implements this solution.
    6. 'alternatives' for trade-off discussions.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedService: { type: Type.STRING },
          justification: { type: Type.STRING },
          implementationSteps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                phase: { type: Type.STRING },
                details: { type: Type.STRING }
              },
              required: ["phase", "details"]
            }
          },
          mermaidDiagram: { type: Type.STRING },
          terraformCode: { type: Type.STRING },
          cloudFormationCode: { type: Type.STRING },
          alternatives: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["recommendedService", "justification", "implementationSteps", "mermaidDiagram", "terraformCode", "cloudFormationCode"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    throw new Error("Architecture generation failed.");
  }
};

export const explainStepDetail = async (phase: string, details: string, context: string): Promise<StepExplanation> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `You are a Lead Solutions Architect providing a Technical Execution Blueprint for a development team.
    
    Architecture Context: ${context}
    Implementation Phase: ${phase}
    Step Details: ${details}
    
    Provide:
    1. A deep-dive explanation of the technical "heavy lifting" involved.
    2. 1-2 production-ready code snippets (e.g., Python Boto3 or Node.js AWS SDK v3) that solve the core problem of this step.
       CRITICAL: Use multiple lines, proper indentation, and clear comments. DO NOT provide code in a single line. Format it for readability.
    3. Key technical terms definitions.
    4. Official AWS documentation links.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          explanation: { type: Type.STRING },
          codeSnippets: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                language: { type: Type.STRING },
                code: { type: Type.STRING }
              },
              required: ["title", "language", "code"]
            }
          },
          keyTerms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING }
              },
              required: ["term", "definition"]
            }
          },
          documentationLinks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING }
              },
              required: ["title", "url"]
            }
          }
        },
        required: ["explanation", "keyTerms", "documentationLinks", "codeSnippets"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse explanation", e);
    throw new Error("Could not fetch expert explanation.");
  }
};



export const reviewArchitecture = async (description: string): Promise<ArchitectureReview> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a Principal Cloud Architect. Review the following AWS architecture description against the 6 Pillars of the Well-Architected Framework: "${description}".
    
    In addition to the ratings and fixes, please provide:
    1. A complete Terraform configuration (.tf) that implements a best-practice version of this architecture. Use modern AWS provider syntax.
    2. A complete CloudFormation template (YAML) that implements the same best-practice architecture.
    3. A Mermaid.js diagram representing the optimized architecture. 
       IMPORTANT: Use valid Mermaid syntax. Use 'graph TD'. Avoid special characters in node labels. Use quotes for long labels.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pillarRatings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pillar: { type: Type.STRING },
                rating: { type: Type.NUMBER },
                feedback: { type: Type.STRING }
              },
              required: ["pillar", "rating", "feedback"]
            }
          },
          criticalFixes: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          costOptimizationScore: { type: Type.STRING },
          terraformCode: { type: Type.STRING },
          cloudFormationCode: { type: Type.STRING },
          mermaidDiagram: { type: Type.STRING }
        },
        required: ["pillarRatings", "criticalFixes", "costOptimizationScore", "terraformCode", "cloudFormationCode", "mermaidDiagram"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Failed to parse architect review");
  }
};

export const designGenericArchitecture = async (scenario: string): Promise<GenericArchitecture> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a Global Principal Architect. Design a cloud-agnostic solution for: "${scenario}".
    
    Guidelines:
    1. Use ONLY generic architecture terms (e.g., "Object Storage" instead of "S3").
    2. Provide market-preferred tool suggestions (e.g. "Snowflake", "Redis", "Kafka", "PostgreSQL").
    3. Generate a Mermaid.js diagram using 'graph TD' and generic labels.
    4. Focus on fundamental design patterns (Microservices, Event-Driven, Layered).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          solutionName: { type: Type.STRING },
          conceptJustification: { type: Type.STRING },
          genericComponents: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                bestFitType: { type: Type.STRING },
                marketPreferredTools: { type: Type.ARRAY, items: { type: Type.STRING } },
                purpose: { type: Type.STRING }
              },
              required: ["category", "bestFitType", "marketPreferredTools", "purpose"]
            }
          },
          mermaidDiagram: { type: Type.STRING }
        },
        required: ["solutionName", "conceptJustification", "genericComponents", "mermaidDiagram"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Generic architecture design failed.");
  }
};

export const mapToCloudProvider = async (genericDesign: GenericArchitecture, provider: 'AWS' | 'Azure' | 'GCP'): Promise<CloudMapping> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Translate this generic architecture into a specific implementation for ${provider}:
    
    ARCH: ${JSON.stringify(genericDesign)}
    
    Provide the service mapping and a matching Terraform snippet for this provider.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          provider: { type: Type.STRING },
          serviceMap: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                genericPath: { type: Type.STRING },
                targetService: { type: Type.STRING },
                specificBenefit: { type: Type.STRING }
              },
              required: ["genericPath", "targetService", "specificBenefit"]
            }
          },
          iascSnippet: { type: Type.STRING }
        },
        required: ["provider", "serviceMap", "iascSnippet"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text || "{}");
    return { ...data, provider };
  } catch (e) {
    throw new Error(`Cloud mapping to ${provider} failed.`);
  }
};
