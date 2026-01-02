
import { GoogleGenAI } from "@google/genai";

export const generateProductDescription = async (productName: string, category: string, keyFeatures: string): Promise<string> => {
  // Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a luxury, persuasive e-commerce product description for a product named "${productName}" in the category "${category}". 
      Include these key features: ${keyFeatures}. 
      The tone should be sophisticated, professional, and highlight quality. 
      Keep it under 150 words.`,
    });
    
    // Access the text property directly on the response object
    return response.text || "Could not generate description at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating content. Please check your API configuration.";
  }
};
