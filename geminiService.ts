
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Difficulty, Question } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const questionSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      text: { type: Type.STRING, description: "The quiz question text." },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Exactly 4 multiple choice options."
      },
      correctIndex: { type: Type.INTEGER, description: "The 0-indexed position of the correct answer." },
      explanation: { type: Type.STRING, description: "A brief, fun fact about the answer." },
      isBonus: { type: Type.BOOLEAN, description: "True if this is the super difficult final question." }
    },
    required: ["text", "options", "correctIndex", "explanation", "isBonus"]
  }
};

export async function generateRoundQuestions(category: Category): Promise<Question[]> {
  const prompt = `Generate exactly 6 multiple-choice quiz questions for the category "${category}". 
  - The first 5 questions should scale from Easy to Hard.
  - The 6th question MUST be "isBonus: true" and be EXTREMELY difficult (Super Hard).
  - For Music, cover eras from the 1960s to 2024. 
  - For Disney, cover deep lore from both classic and modern films.
  Make the questions engaging for the Edwards family New Year's Eve party.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
      },
    });

    const data = JSON.parse(response.text.trim());
    return data.map((q: any, index: number) => ({
      ...q,
      id: Math.random().toString(36).substring(7),
      category,
      difficulty: q.isBonus ? Difficulty.SUPER_HARD : (index < 2 ? Difficulty.EASY : index < 4 ? Difficulty.MEDIUM : Difficulty.HARD)
    }));
  } catch (error) {
    console.error("Error generating questions:", error);
    return [{
      id: "fallback-1",
      text: "Who is the host of tonight's Edwards Family Quiz?",
      options: ["You", "Gemini", "Santa", "The TV"],
      correctIndex: 0,
      explanation: "You're doing a great job!",
      difficulty: Difficulty.EASY,
      category,
      isBonus: false
    }];
  }
}
