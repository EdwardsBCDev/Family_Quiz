import React, { useState } from 'react';
import { GameState, Question } from '../types';
import { CheckCircle2, Trophy, Wifi } from 'lucide-react';

interface PlayerControllerProps {
  gameState: GameState;
  currentQuestion?: Question;
  currentScore: number;
  onSendAnswer: (index: number) => void;
  connected: boolean;
  playerName: string;
}

const PlayerController: React.FC<PlayerControllerProps> = ({ 
  gameState, currentQuestion, currentScore, onSendAnswer, connected, playerName 
}) => {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    onSendAnswer(idx);
  };

  React.useEffect(() => { setSelected(null); }, [currentQuestion?.id]);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center space-y-4">
        <Wifi className="w-12 h-12 text-red-500 animate-pulse" />
        <h2 className="text-xl font-bold">Connecting...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 flex flex-col space-y-4">
      <header className="flex justify-between items-center p-2 bg-white/5 rounded-xl border border-white/10">
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 font-black uppercase">Player</span>
          <span className="font-bold text-yellow-400">{playerName || 'Guest'}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-white/40 font-black uppercase">Points</span>
          <span className="font-bold">{currentScore}</span>
        </div>
      </header>

      {gameState === 'LOBBY' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
          <h2 className="text-2xl font-black">YOU'RE IN!</h2>
          <p className="text-white/60">Watch the big screen.</p>
        </div>
      )}

      {gameState === 'QUESTION' && currentQuestion && (
        <div className="flex-1 flex flex-col space-y-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-2xl text-center">
             <p className="text-sm font-bold text-yellow-400 uppercase tracking-widest">Select Your Answer</p>
          </div>
          <div className="grid grid-cols-1 gap-3 flex-1">
            {['A', 'B', 'C', 'D'].map((label, idx) => (
              <button key={idx} disabled={selected !== null} onClick={() => handleSelect(idx)} className={`flex-1 rounded-2xl text-4xl font-black transition-all border-4 flex items-center justify-center ${selected === idx ? 'bg-yellow-400 border-yellow-200 text-slate-950 scale-95 shadow-inner' : selected === null ? 'bg-white/5 border-white/10 text-white active:scale-95 active:bg-white/10' : 'bg-white/5 border-white/5 text-white/20'}`}>
                {label}
              </button>
            ))}
          </div>
          {selected !== null && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-2xl text-center animate-pulse">
               <p className="text-sm font-bold text-green-400 uppercase tracking-widest">Locked In!</p>
            </div>
          )}
        </div>
      )}

      {(gameState === 'REVEAL' || gameState === 'LEADERBOARD') && (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <Trophy className="w-16 h-16 text-yellow-400" />
          <h2 className="text-2xl font-black uppercase">Round Over</h2>
          <p className="text-white/60">Check the main screen!</p>
        </div>
      )}
    </div>
  );
};
export default PlayerController;
