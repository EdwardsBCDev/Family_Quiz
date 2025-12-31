import { Question, Category } from './types';
import { questionsPool } from './questionsData';

// Fisher-Yates shuffle algorithm (The best way to randomise arrays)
function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// State to track which questions have been used so we don't repeat them
// This resets only when you run out of questions in a category
let usedQuestionIds: Set<string> = new Set();

export const getRandomQuestions = async (category: Category, count: number): Promise<Question[]> => {
  // 1. Get all questions for the requested category
  const categoryQuestions = questionsPool.filter(q => q.category === category);
  
  // 2. Filter out questions we've already used this session
  let available = categoryQuestions.filter(q => !usedQuestionIds.has(q.id));

  // 3. If we don't have enough unused questions, reset the pool for this category
  if (available.length < count) {
    console.log(`Resetting question pool for category: ${category}`);
    
    // Remove IDs of this category from the used set
    categoryQuestions.forEach(q => usedQuestionIds.delete(q.id));
    
    // Reset available to all questions in this category
    available = categoryQuestions;
  }

  // 4. Shuffle the available questions
  const shuffled = shuffle(available);

  // 5. Select the requested number (count)
  const selected = shuffled.slice(0, count);

  // 6. Mark these questions as used
  selected.forEach(q => usedQuestionIds.add(q.id));

  return selected;
};
