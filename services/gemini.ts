
import { GoogleGenAI, Type } from "@google/genai";
import { ScenarioMatch, ArchitectureReview } from "../types";

export const matchAWSService = async (scenario: string): Promise<ScenarioMatch> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    // Upgrading to gemini-3-pro-preview for board-level reasoning tasks
    model: 'gemini-3-pro-preview',
    contents: `You are a Principal AWS Solutions Architect. For the following scenario, provide a Board-Level architectural design: "${scenario}". 
    
    Requirements:
    1. A clear 'recommendedService'.
    2. A deep 'justification' explaining the 2026-era benefits.
    3. A multi-phase 'implementationSteps' list (Phase name + Technical details).
    4. A Mermaid.js diagram (graph TD or sequenceDiagram) representing the service flow. Ensure valid Mermaid syntax.
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
          mermaidDiagram: { type: Type.STRING, description: "A valid Mermaid.js diagram string" },
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
    throw new Error("Architecture generation failed. Please try again.");
  }
};

export const reviewArchitecture = async (description: string): Promise<ArchitectureReview> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Review the following AWS architecture against the 6 Pillars of the Well-Architected Framework: "${description}". 
    Be critical, professional, and focus on 2026 standards.`,
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
    const text = response.text;
    if (!text) throw new Error("No response text found");
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Failed to parse architect review");
  }
};
