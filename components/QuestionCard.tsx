
import React from 'react';
import { Question, Player } from '../types';
import { HelpCircle, Star, CheckCircle2 } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  players: Player[];
  onToggleReady: (playerId: string) => void;
  onReveal: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  players, 
  onReveal 
}) => {
  const allAnswered = players.length > 0 && players.every(p => p.hasAnswered);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 px-4">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-yellow-500/60 font-bold tracking-widest uppercase text-sm">
            {question.isBonus ? '✨ BONUS QUESTION ✨' : `Question ${questionNumber} / ${totalQuestions}`}
          </p>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            {question.category}
            {question.isBonus && <Star className="text-yellow-400 fill-yellow-400 animate-pulse" />}
          </h2>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40 font-bold uppercase tracking-widest">Points</div>
          <div className="text-3xl font-black text-yellow-400">{question.isBonus ? '20' : '10'}</div>
        </div>
      </div>

      <div className={`glass p-12 rounded-[3.5rem] relative overflow-hidden group border-2 ${question.isBonus ? 'border-yellow-400/50 bg-gradient-to-br from-purple-900/10 to-yellow-900/10' : 'border-white/10'}`}>
        <HelpCircle className="absolute -top-12 -left-12 w-48 h-48 text-white/5 rotate-12" />
        <p className="text-4xl md:text-6xl font-black text-center leading-tight relative z-10 font-display">
          {question.text}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {question.options.map((option, idx) => (
          <div key={idx} className="p-8 rounded-3xl text-2xl font-bold border-2 bg-white/5 border-white/10 flex items-center gap-6">
            <span className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/10 text-xl font-black text-yellow-400">
              {String.fromCharCode(65 + idx)}
            </span>
            {option}
          </div>
        ))}
      </div>

      <div className="glass p-10 rounded-[2.5rem] border border-white/10">
        <h3 className="text-center text-sm font-black uppercase tracking-[0.4em] text-white/40 mb-10 italic">
          Automatic Submission Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {players.map(player => (
            <div key={player.id} className="flex flex-col items-center space-y-4">
              <div className={`
                w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-500
                ${player.hasAnswered 
                  ? 'bg-green-500/20 border-green-500 scale-110 shadow-[0_0_30px_rgba(34,197,94,0.3)]' 
                  : 'bg-white/5 border-white/20 animate-pulse'
                }
              `}>
                {player.hasAnswered ? (
                  <CheckCircle2 size={48} className="text-green-500" />
                ) : (
                  <span className="text-4xl font-black text-white/20">{player.name[0]}</span>
                )}
              </div>
              <span className={`font-black text-xl tracking-tight transition-colors ${player.hasAnswered ? 'text-white' : 'text-white/30'}`}>
                {player.name.toUpperCase()}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${player.hasAnswered ? 'text-green-400' : 'text-white/20'}`}>
                {player.hasAnswered ? 'LOCKED IN' : 'THINKING...'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onReveal}
          className={`px-24 py-8 rounded-[3rem] font-black text-4xl transition-all shadow-2xl ${
            allAnswered 
            ? 'bg-white text-slate-950 hover:bg-yellow-400 hover:scale-105 active:scale-95' 
            : 'bg-white/5 text-white/10 cursor-not-allowed grayscale'
          }`}
        >
          {allAnswered ? 'REVEAL ANSWER' : 'AWAITING ANSWERS...'}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
