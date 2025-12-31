export type GameState = 
  | 'LOBBY' 
  | 'ROUND_INTRO' 
  | 'QUESTION' 
  | 'REVEAL' 
  | 'LEADERBOARD' 
  | 'FINAL_RESULTS';

export enum Category {
  DISNEY = 'Disney Magic',
  MUSIC = 'Music Trivia',
  GENERAL = 'General Knowledge'
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

export interface Question {
  id: string;
  category: Category;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  isBonus: boolean;
}

export type PeerMessage = 
  | { type: 'JOIN'; name: string }
  | { type: 'SUBMIT_ANSWER'; index: number }
  | { type: 'GAME_STATE'; state: GameState; question?: Question }
  | { type: 'SCORE_UPDATE'; score: number };
