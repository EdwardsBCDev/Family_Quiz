import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Category, GameState, Question, PeerMessage } from './types';
import { questionsPool } from './questionsData'; 
import { Sparkles, Trophy, ChevronRight, Info, CheckCircle, XCircle, Share2, Timer, Users } from 'lucide-react';

// --- HELPER TO SHUFFLE QUESTIONS ---
// Changed to standard function to fix the build error
function shuffle<T>(array: T[]): T[] {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
}

// --- SERVICE LOGIC ---
let usedQuestionIds: Set<string> = new Set();
const getRandomQuestions = async (category: Category, count: number): Promise<Question[]> => {
  const categoryQuestions = questionsPool.filter(q => q.category === category);
  let available = categoryQuestions.filter(q => !usedQuestionIds.has(q.id));
  if (available.length < count) {
    categoryQuestions.forEach(q => usedQuestionIds.delete(q.id));
    available = categoryQuestions;
  }
  const selected = shuffle(available).slice(0, count);
  selected.forEach(q => usedQuestionIds.add(q.id));
  return selected;
};

const CATEGORIES = [Category.DISNEY, Category.MUSIC, Category.GENERAL];
const ROUND_TIME = 60; // Seconds

const App: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get('room');
  const [role] = useState<'HOST' | 'PLAYER'>(roomFromUrl ? 'PLAYER' : 'HOST');

  // State
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [myName, setMyName] = useState('');
  const [connected, setConnected] = useState(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);

  const peerRef = useRef<any>(null);
  const connectionsRef = useRef<Map<string, any>>(new Map());
  const [hostPeerId, setHostPeerId] = useState<string>(roomFromUrl || '');

  // --- INIT PEER ---
  useEffect(() => {
    const initPeer = () => {
      const PeerClass = (window as any).Peer;
      if (!PeerClass) {
        setTimeout(initPeer, 500);
        return;
      }
      peerRef.current = new PeerClass();
      peerRef.current.on('open', (id: string) => {
        if (role === 'HOST') {
          setHostPeerId(id);
          setConnected(true);
        } else if (role === 'PLAYER' && hostPeerId) {
          joinRoom(hostPeerId);
        }
      });
      if (role === 'HOST') {
        peerRef.current.on('connection', (conn: any) => {
          conn.on('data', (data: PeerMessage) => handleHostMessage(conn, data));
          conn.on('open', () => connectionsRef.current.set(conn.peer, conn));
        });
      }
    };
    initPeer();
    return () => peerRef.current?.destroy();
  }, [role]);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: any;
    if (gameState === 'QUESTION' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleReveal(); // Auto reveal when time hits 0
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // --- MESSAGING ---
  const joinRoom = (targetId: string) => {
    const name = prompt("Enter your name:") || "Guest";
    setMyName(name);
    const conn = peerRef.current.connect(targetId);
    conn.on('open', () => {
      setConnected(true);
      conn.send({ type: 'JOIN', name });
    });
    conn.on('data', (data: PeerMessage) => handlePlayerMessage(data));
    connectionsRef.current.set('HOST', conn);
  };

  const handleHostMessage = (conn: any, data: PeerMessage) => {
    if (data.type === 'JOIN') {
      setPlayers(prev => {
        if (prev.find(p => p.peerId === conn.peer)) return prev;
        return [...prev, { id: conn.peer, peerId: conn.peer, name: data.name, score: 0, streak: 0, hasAnswered: false, selectedIdx: null, lastAnswerCorrect: false }];
      });
    } else if (data.type === 'SUBMIT_ANSWER') {
      setPlayers(prev => prev.map(p => p.peerId === conn.peer ? { ...p, hasAnswered: true, selectedIdx: data.index } : p));
    }
  };

  const handlePlayerMessage = (data: PeerMessage) => {
    if (data.type === 'GAME_STATE') {
      setGameState(data.state);
      if (data.question) {
        setQuestions([data.question]);
        setCurrentQuestionIndex(0);
        setTimeLeft(ROUND_TIME); // Reset timer on player side too for visuals
      }
    } else if (data.type === 'SCORE_UPDATE') {
      setMyScore(data.score);
    }
  };

  const broadcast = (msg: PeerMessage) => connectionsRef.current.forEach(conn => conn.send(msg));

  // --- GAMEPLAY ---
  const startNextRound = useCallback(async () => {
    if (currentRound >= CATEGORIES.length) {
      setGameState('FINAL_RESULTS');
      broadcast({ type: 'GAME_STATE', state: 'FINAL_RESULTS' });
      return;
    }
    setLoading(true);
    setGameState('ROUND_INTRO');
    broadcast({ type: 'GAME_STATE', state: 'ROUND_INTRO' });

    try {
      const newQuestions = await getRandomQuestions(CATEGORIES[currentRound], 6);
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      
      setTimeout(() => {
        setLoading(false);
        setGameState('QUESTION');
        setTimeLeft(ROUND_TIME); // Reset timer
        broadcast({ type: 'GAME_STATE', state: 'QUESTION', question: newQuestions[0] });
      }, 3000);
    } catch (error) { setLoading(false); }
  }, [currentRound]);

  const handleReveal = () => {
    if (gameState === 'REVEAL') return; // Prevent double trigger
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;
    
    const correctIdx = currentQ.correctIndex;
    const updatedPlayers = players.map(p => ({
      ...p,
      lastAnswerCorrect: p.selectedIdx === correctIdx
    }));
    setPlayers(updatedPlayers);
    setGameState('REVEAL');
    broadcast({ type: 'GAME_STATE', state: 'REVEAL' }); // Notify players round ended
  };

  const commitPoints = () => {
    const q = questions[currentQuestionIndex];
    const points = q.isBonus ? 20 : 10;
    const updatedPlayers = players.map(p => {
      if (p.lastAnswerCorrect) {
        const newScore = p.score + points;
        const conn = connectionsRef.current.get(p.peerId);
        if (conn) conn.send({ type: 'SCORE_UPDATE', score: newScore });
        return { ...p, score: newScore, streak: p.streak + 1, hasAnswered: false, selectedIdx: null, lastAnswerCorrect: false };
      }
      return { ...p, streak: 0, hasAnswered: false, selectedIdx: null, lastAnswerCorrect: false };
    });
    setPlayers(updatedPlayers);

    if (currentQuestionIndex < questions.length - 1) {
      const nextQ = questions[currentQuestionIndex + 1];
      setCurrentQuestionIndex(prev => prev + 1);
      setGameState('QUESTION');
      setTimeLeft(ROUND_TIME);
      broadcast({ type: 'GAME_STATE', state: 'QUESTION', question: nextQ });
    } else {
      setGameState('LEADERBOARD');
      broadcast({ type: 'GAME_STATE', state: 'LEADERBOARD' });
      setCurrentRound(prev => prev + 1);
    }
  };

  // --- RENDER PLAYER SCREEN ---
  if (role === 'PLAYER') {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center font-sans">
        {!connected ? (
          <div className="text-2xl animate-pulse">Connecting to Host...</div>
        ) : gameState === 'LOBBY' ? (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-black text-yellow-400">Welcome, {myName}!</h1>
            <p className="text-white/50 text-xl">Waiting for host to start...</p>
            <div className="p-8 bg-white/10 rounded-full animate-bounce">
              <Users size={48} />
            </div>
          </div>
        ) : gameState === 'QUESTION' ? (
          <div className="w-full max-w-md space-y-6">
            <div className="flex justify-between items-center text-sm font-bold uppercase tracking-widest text-white/50">
              <span>Q{currentQuestionIndex + 1}</span>
              <span className={timeLeft < 10 ? "text-red-500" : "text-white"}>{timeLeft}s</span>
            </div>
            <h2 className="text-2xl font-bold text-center leading-tight">{questions[0]?.text}</h2>
            <div className="grid gap-3">
              {questions[0]?.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const conn = connectionsRef.current.get('HOST');
                    if (conn) conn.send({ type: 'SUBMIT_ANSWER', index: idx });
                  }}
                  className="p-6 bg-white/10 border-2 border-white/10 rounded-xl text-lg font-bold active:bg-yellow-400 active:text-black transition-all hover:bg-white/20 text-left"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
             <div className="text-6xl font-black text-yellow-400">{myScore}</div>
             <div className="uppercase tracking-widest text-sm font-bold">Current Score</div>
             <p className="text-white/50 animate-pulse">Look at the big screen!</p>
          </div>
        )}
      </div>
    );
  }

  // --- RENDER HOST SCREEN ---
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden relative selection:bg-yellow-400 selection:text-black">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
         <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-400 rounded-xl shadow-lg shadow-yellow-400/20">
              <Sparkles className="text-slate-950" size={32} />
            </div>
            <h1 className="text-3xl font-black uppercase tracking-tight">Edwards Family Quiz</h1>
          </div>
          {gameState !== 'LOBBY' && (
             <div className="flex gap-2">
                <span className="px-4 py-2 bg-white/10 rounded-lg font-mono font-bold text-yellow-400">{timeLeft}s</span>
                <button onClick={handleReveal} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase">Skip Timer</button>
             </div>
          )}
        </header>

        <main className="min-h-[600px] flex flex-col justify-center">
          {gameState === 'LOBBY' && (
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="glass p-12 rounded-[3rem] text-center space-y-8 border border-white/10">
                <h2 className="text-xl font-black uppercase tracking-[0.5em] text-yellow-400">Join the Game</h2>
                <div className="bg-white p-4 rounded-3xl inline-block shadow-2xl">
                  {hostPeerId && (
                     <canvas ref={(node) => {
                       if(node && (window as any).QRCode) (window as any).QRCode.toCanvas(node, window.location.href + "?room=" + hostPeerId, { width: 300, margin: 2 });
                     }} />
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 text-white/40 font-mono text-sm bg-black/20 p-4 rounded-xl">
                  <Share2 size={16} /> Scan to join
                </div>
              </div>
              <div className="space-y-8">
                 <h2 className="text-5xl font-black">Who's Playing? <span className="text-yellow-400">({players.length})</span></h2>
                 <div className="grid grid-cols-2 gap-4">
                    {players.map(p => (
                       <div key={p.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 animate-in fade-in slide-in-from-right">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-slate-900 font-bold text-xl">
                            {p.name[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-xl truncate">{p.name}</span>
                       </div>
                    ))}
                    {players.length === 0 && <p className="text-white/30 italic">Waiting for players...</p>}
                 </div>
                 <button 
                   onClick={startNextRound} 
                   disabled={players.length === 0}
                   className="w-full py-8 bg-yellow-400 text-slate-950 rounded-2xl font-black text-4xl shadow-xl shadow-yellow-400/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                 >
                   START GAME
                 </button>
              </div>
            </div>
          )}

          {gameState === 'ROUND_INTRO' && (
            <div className="text-center space-y-6 animate-in zoom-in duration-500">
               <h3 className="text-2xl font-bold uppercase tracking-[0.5em] text-yellow-400">Next Round</h3>
               <h2 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">{CATEGORIES[currentRound]}</h2>
            </div>
          )}

          {gameState === 'QUESTION' && questions[currentQuestionIndex] && (
            <div className="max-w-5xl mx-auto w-full">
              <div className="mb-8 flex justify-between items-end">
                <span className="text-xl font-bold text-white/50">Question {currentQuestionIndex + 1} / {questions.length}</span>
                <div className="flex items-center gap-2 text-3xl font-mono font-black text-yellow-400">
                  <Timer /> {timeLeft}s
                </div>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold mb-12 leading-tight drop-shadow-lg">
                {questions[currentQuestionIndex].text}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {questions[currentQuestionIndex].options.map((opt, i) => (
                   <div key={i} className={`p-8 rounded-3xl border-2 border-white/10 bg-white/5 text-2xl font-bold flex items-center gap-4 ${i === questions[currentQuestionIndex].correctIndex && gameState === 'REVEAL' ? 'bg-green-500/20 border-green-500' : ''}`}>
                      <div className="w-12 h-12 rounded-full border-2 border-white/20 flex items-center justify-center text-sm font-black text-white/50">
                        {['A','B','C','D'][i]}
                      </div>
                      {opt}
                   </div>
                ))}
              </div>

              {/* Player Status Bar */}
              <div className="mt-12 flex gap-4 overflow-x-auto pb-4">
                 {players.map(p => (
                    <div key={p.id} className={`flex-shrink-0 flex flex-col items-center gap-2 transition-all ${p.hasAnswered ? 'opacity-100 scale-110' : 'opacity-50'}`}>
                       <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-slate-900 shadow-lg ${p.hasAnswered ? 'bg-yellow-400 shadow-yellow-400/50' : 'bg-white/20'}`}>
                          {p.name[0].toUpperCase()}
                       </div>
                       <span className="text-xs font-bold uppercase">{p.name}</span>
                    </div>
                 ))}
              </div>
            </div>
          )}

          {gameState === 'REVEAL' && (
             <div className="text-center max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8">
                <div>
                   <h3 className="text-yellow-400 font-bold uppercase tracking-widest mb-4">Correct Answer</h3>
                   <div className="bg-green-500 text-white p-8 rounded-3xl text-5xl font-black shadow-2xl shadow-green-500/20">
                      {questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctIndex]}
                   </div>
                </div>

                <div className="bg-white/10 p-8 rounded-2xl flex gap-4 items-start text-left">
                   <Info className="shrink-0 text-yellow-400" />
                   <p className="text-xl leading-relaxed">{questions[currentQuestionIndex].explanation}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {players.map(p => (
                      <div key={p.id} className={`p-4 rounded-xl border flex items-center justify-between ${p.lastAnswerCorrect ? 'bg-green-500/20 border-green-500' : 'bg-red-500/10 border-red-500/20'}`}>
                         <span className="font-bold">{p.name}</span>
                         {p.lastAnswerCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500/50" />}
                      </div>
                   ))}
                </div>

                <button onClick={commitPoints} className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-2xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-3 mx-auto">
                   NEXT <ChevronRight />
                </button>
             </div>
          )}

          {(gameState === 'LEADERBOARD' || gameState === 'FINAL_RESULTS') && (
             <div className="max-w-2xl mx-auto w-full">
                <div className="text-center mb-12">
                   <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
                   <h2 className="text-5xl font-black uppercase font-display">{gameState === 'FINAL_RESULTS' ? 'WINNERS' : 'LEADERBOARD'}</h2>
                </div>
                <div className="space-y-4">
                   {[...players].sort((a,b) => b.score - a.score).map((p, i) => (
                      <div key={p.id} className="bg-white/5 p-6 rounded-2xl flex items-center justify-between border border-white/10 hover:bg-white/10 transition-colors">
                         <div className="flex items-center gap-6">
                            <span className={`text-4xl font-black w-12 ${i===0 ? 'text-yellow-400' : i===1 ? 'text-gray-300' : i===2 ? 'text-orange-400' : 'text-white/20'}`}>#{i+1}</span>
                            <span className="text-2xl font-bold">{p.name}</span>
                         </div>
                         <span className="text-4xl font-black text-yellow-400">{p.score}</span>
                      </div>
                   ))}
                </div>
                <button onClick={gameState === 'FINAL_RESULTS' ? () => window.location.reload() : startNextRound} className="mt-12 w-full py-6 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-2xl font-bold text-xl transition-all">
                   {gameState === 'FINAL_RESULTS' ? 'PLAY AGAIN' : 'NEXT ROUND'}
                </button>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
