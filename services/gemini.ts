
import { GoogleGenAI, Type } from "@google/genai";
import { ScenarioMatch, ArchitectureReview } from "../types";

export const matchAWSService = async (scenario: string): Promise<ScenarioMatch> => {
  // Use strictly named parameter for API key as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Acting as a Lead AWS Solutions Architect, recommend the best service for this scenario: "${scenario}". 
    Consider modern 2026 AWS practices (Serverless first, Event-driven, AI-integrated).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedService: { type: Type.STRING },
          justification: { type: Type.STRING },
          alternatives: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["recommendedService", "justification"]
      }
    }
  });

  try {
    // Accessing text property directly (not calling it as a method)
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return {
      recommendedService: "AWS Well-Architected Review",
      justification: "The requirement was ambiguous; consult the framework to refine your architecture."
    };
  }
};

export const reviewArchitecture = async (description: string): Promise<ArchitectureReview> => {
  // Use strictly named parameter for API key as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    // Use gemini-3-pro-preview for complex reasoning tasks like architectural reviews
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
    // Accessing text property directly (not calling it as a method)
    const text = response.text;
    if (!text) throw new Error("No response text found");
    return JSON.parse(text);
  } catch (e) {
    throw new Error("Failed to parse architect review");
  }
};
