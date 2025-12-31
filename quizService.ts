
import { Category, Difficulty, Question } from "./types";
import { ALL_QUESTIONS } from "./questionsData";

export async function getRandomQuestions(category: Category, count: number = 6): Promise<Question[]> {
  const pool = ALL_QUESTIONS[category] || [];
  
  // Shuffle the pool
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  
  // Pick requested count
  const selection = shuffled.slice(0, count);
  
  return selection.map((q, index) => ({
    id: `local-${category}-${index}-${Date.now()}`,
    text: q.text || "Missing Question",
    options: q.options || ["A", "B", "C", "D"],
    correctIndex: q.correctIndex ?? 0,
    explanation: q.explanation || "No explanation provided.",
    category,
    isBonus: index === count - 1, // Last one is bonus
    difficulty: index === count - 1 ? Difficulty.SUPER_HARD : (index < 2 ? Difficulty.EASY : index < 4 ? Difficulty.MEDIUM : Difficulty.HARD)
  }));
}
