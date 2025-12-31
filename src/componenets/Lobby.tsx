import React, { useState } from 'react';
import { Player } from '../types';
import { Users, QrCode, Play, UserPlus } from 'lucide-react';

interface LobbyProps {
  roomCode: string;
  players: Player[];
  onStartGame: () => void;
  onAddPlayer: (name: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ roomCode, players, onStartGame, onAddPlayer }) => {
  const [newName, setNewName] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddPlayer(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 relative z-10">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-500 drop-shadow-sm">
          EDWARDS FAMILY QUIZ
        </h1>
        <p className="text-xl text-yellow-100/60 uppercase tracking-[0.2em]">New Year's Eve Edition</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl flex flex-col items-center justify-center space-y-6">
          <div className="bg-white p-4 rounded-xl">
             <div className="w-48 h-48 bg-slate-100 flex items-center justify-center rounded-lg border-4 border-slate-200">
                <QrCode className="w-32 h-32 text-slate-800" />
             </div>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-1 uppercase font-bold tracking-widest">Room Code</p>
            <p className="text-6xl font-black text-white tracking-widest">{roomCode}</p>
          </div>
        </div>

        <div className="glass p-8 rounded-3xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="text-yellow-400" />
              Players ({players.length})
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[400px] pr-2">
            {players.length === 0 ? (
              <div className="text-center py-12 text-white/30 italic">Waiting for players to join...</div>
            ) : (
              players.map((player) => (
                <div key={player.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center font-bold text-slate-900">
                      {player.name[0].toUpperCase()}
                    </div>
                    <span className="font-semibold text-lg">{player.name}</span>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full border border-green-500/30">Ready</span>
                </div>
              ))
            )}
          </div>

          <button 
            disabled={players.length === 0}
            onClick={onStartGame}
            className={`mt-6 w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all ${
              players.length > 0 
              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:scale-[1.02] text-slate-900 cursor-pointer shadow-lg shadow-yellow-500/20' 
              : 'bg-white/10 text-white/20 cursor-not-allowed'
            }`}
          >
            <Play fill="currentColor" size={24} />
            START CELEBRATION
          </button>
        </div>
      </div>
    </div>
  );
};
export default Lobby;
