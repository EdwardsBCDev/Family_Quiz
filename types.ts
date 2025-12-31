
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  SUPER_HARD = 'super_hard'
}

export enum Category {
  DISNEY = 'Disney Trivia',
  MUSIC = 'Music (60s to Now)',
  GENERAL = 'General Knowledge'
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
  category: Category;
  isBonus: boolean;
}

export interface Player {
  id: string;
  peerId: string;
  name: string;
  score: number;
  streak: number;
  hasAnswered: boolean;
  selectedIdx: number | null;
  lastAnswerCorrect: boolean;
}

export type GameState = 'LOBBY' | 'ROUND_INTRO' | 'QUESTION' | 'REVEAL' | 'LEADERBOARD' | 'FINAL_RESULTS';

export type PeerMessage = 
  | { type: 'JOIN'; name: string }
  | { type: 'SUBMIT_ANSWER'; index: number }
  | { type: 'GAME_STATE'; state: GameState; question?: Question; questionNumber?: number; totalQuestions?: number }
  | { type: 'REVEAL_RESULT'; correct: boolean; explanation: string; correctIndex: number }
  | { type: 'SCORE_UPDATE'; score: number };
