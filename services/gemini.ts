
import { GoogleGenAI, Type } from "@google/genai";
import { ScenarioMatch, ArchitectureReview, StepExplanation } from "../types";

export const matchAWSService = async (scenario: string): Promise<ScenarioMatch> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `You are a Principal AWS Solutions Architect. For the following scenario, provide a Board-Level architectural design: "${scenario}". 
    
    Requirements:
    1. A clear 'recommendedService'.
    2. A deep 'justification' explaining the 2026-era benefits.
    3. A multi-phase 'implementationSteps' list. Each phase must be technically dense and specific (mentioning specific AWS features like Graviton3, S3 Express, EventBridge Pipes, DLQs, etc.).
    4. A Mermaid.js diagram representing the service flow. 
       IMPORTANT: Use valid Mermaid syntax. Avoid special characters in node labels unless quoted. Example: NodeA["Label with Space"]. Use 'graph TD'.
    5. 'alternatives' for trade-off discussions.`,
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
          alternatives: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["recommendedService", "justification", "implementationSteps", "mermaidDiagram"]
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
    contents: `Review the following AWS architecture against the 6 Pillars of the Well-Architected Framework: "${description}".`,
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
          costOptimizationScore: { type: Type.STRING }
        },
        required: ["pillarRatings", "criticalFixes", "costOptimizationScore"]
      }
    }
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    throw new Error("Failed to parse architect review");
  }
};
