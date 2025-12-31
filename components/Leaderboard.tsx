
import React from 'react';
import { Player } from '../types';
import { Trophy, ArrowRight, Medal } from 'lucide-react';

interface LeaderboardProps {
  players: Player[];
  onNext: () => void;
  title?: string;
  isFinal?: boolean;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players, onNext, title = "Round Standings", isFinal = false }) => {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 relative z-10">
      <div className="text-center">
        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4 drop-shadow-glow" />
        <h2 className="text-4xl font-black font-display text-white">{title}</h2>
        {isFinal && <p className="text-yellow-100/60 mt-2">What a way to end 2024!</p>}
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        {sortedPlayers.map((player, idx) => (
          <div 
            key={player.id} 
            className={`
              p-6 flex items-center justify-between border-b border-white/5 transition-all
              ${idx === 0 ? 'bg-yellow-400/10' : ''}
              ${idx === sortedPlayers.length - 1 ? 'border-b-0' : ''}
            `}
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                {idx < 3 ? (
                  <Medal className={`w-8 h-8 ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-slate-300' : 'text-amber-600'}`} />
                ) : (
                  <span className="text-white/40 font-bold w-8 text-center">{idx + 1}</span>
                )}
              </div>
              <div>
                <p className="text-xl font-bold">{player.name}</p>
                <p className="text-xs text-white/40 uppercase tracking-tighter">Current Streak: {player.streak} 🔥</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-yellow-400">{player.score.toLocaleString()}</p>
              <p className="text-xs text-white/40 uppercase">points</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-xl hover:bg-yellow-400 hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
      >
        {isFinal ? 'REPLAY QUIZ' : 'CONTINUE TO NEXT ROUND'}
        <ArrowRight size={24} />
      </button>
    </div>
  );
};

export default Leaderboard;
