
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getMathExplanation = async (expression: string, result: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a mathematical expert. Explain the steps and the conceptual logic behind this calculation: "${expression} = ${result}". Keep the explanation concise, professional, and clear. Use markdown for formatting.`,
      config: {
        systemInstruction: "You are Nova, an AI math tutor. Your goal is to provide clear, step-by-step explanations for mathematical expressions.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching explanation from Gemini:", error);
    return "I couldn't generate an explanation at this moment. Please check your expression.";
  }
};
