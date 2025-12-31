import React, { useState } from 'react';
import { Sparkles, UserPlus, Play } from 'lucide-react';

interface WelcomeScreenProps {
  onHost: () => void;
  onJoin: (name: string, code: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onHost, onJoin }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<'MAIN' | 'JOINING'>('MAIN');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && code) {
      onJoin(name.trim(), code.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-md w-full relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-yellow-400 rounded-2xl shadow-lg shadow-yellow-400/20 rotate-3">
              <Sparkles size={48} className="text-slate-950" />
            </div>
          </div>
          <div>
            <h1 className="text-5xl font-black font-display text-white uppercase italic tracking-tighter">
              Edwards Quiz
            </h1>
            <p className="text-white/40 font-bold tracking-widest uppercase text-sm mt-2">New Year's Eve Edition</p>
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-xl bg-black/40">
          {mode === 'MAIN' ? (
            <div className="space-y-4">
              <button
                onClick={onHost}
                className="w-full py-5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-2xl font-black text-xl shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
              >
                <Play fill="currentColor" /> HOST GAME
              </button>
              
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center"><span className="bg-slate-900 px-4 text-xs text-white/30 uppercase font-bold">Or</span></div>
              </div>

              <button
                onClick={() => setMode('JOINING')}
                className="w-full py-5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-black text-xl border border-white/10 transition-all hover:scale-[1.02] active:scale-95"
              >
                JOIN GAME
              </button>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-white/40 tracking-widest ml-4">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Name"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-lg font-bold text-white focus:outline-none focus:border-yellow-400 placeholder:text-white/20 text-center"
                  autoFocus
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-white/40 tracking-widest ml-4">Room Code</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="ABCD"
                  maxLength={4}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-black text-yellow-400 focus:outline-none focus:border-yellow-400 placeholder:text-white/10 text-center uppercase tracking-[0.5em]"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setMode('MAIN')}
                  className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/60 rounded-xl font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!name || code.length < 4}
                  className="flex-[2] py-4 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 rounded-xl font-black text-lg shadow-lg flex items-center justify-center gap-2"
                >
                  <UserPlus size={20} /> JOIN
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
