import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Category, GameState, Question, PeerMessage } from './types';
import { getRandomQuestions } from './quizService';
import { generateRoomCode } from './utils';
import WelcomeScreen from './components/WelcomeScreen';
import Lobby from './components/Lobby';
import QuestionCard from './components/QuestionCard';
import Leaderboard from './components/Leaderboard';
import PlayerController from './components/PlayerController';
import Fireworks from './components/Fireworks';
import { Sparkles, Trophy, ChevronRight, Info, CheckCircle, XCircle, Share2, Timer } from 'lucide-react';

const CATEGORIES = [Category.DISNEY, Category.MUSIC, Category.GENERAL];
const ROUND_TIME = 60;

const App: React.FC = () => {
  // Application State
  const [role, setRole] = useState<'HOST' | 'PLAYER' | null>(null);
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [hostPeerId, setHostPeerId] = useState<string>('');
  
  // Game Data
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Player Specific Data
  const [myScore, setMyScore] = useState(0);
  const [myName, setMyName] = useState('');
  const [connected, setConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);

  // Networking
  const peerRef = useRef<any>(null);
  const connectionsRef = useRef<Map<string, any>>(new Map());

  // --- HOST FLOW: Start Game ---
  const startHost = () => {
    const code = generateRoomCode();
    setHostPeerId(code);
    setRole('HOST');
    initPeer(code);
  };

  // --- PLAYER FLOW: Join Game ---
  const startPlayer = (name: string, code: string) => {
    setMyName(name);
    setHostPeerId(code);
    setRole('PLAYER');
    initPeer(null, code, name);
  };

  // --- PEERJS INITIALIZATION ---
  const initPeer = (forceId: string | null, targetId?: string, playerName?: string) => {
    const PeerClass = (window as any).Peer;
    if (!PeerClass) return;

    // If Host, try to use the generated short code. If Player, use random ID.
    const peer = forceId ? new PeerClass(forceId) : new PeerClass();
    peerRef.current = peer;

    peer.on('open', (id: string) => {
      console.log('My Peer ID:', id);
      
      if (forceId && id !== forceId) {
        // Fallback: If 4-digit code is taken (rare), just use the random one
        setHostPeerId(id);
      } else if (!forceId) {
        // I am a player, connect to host
        if (targetId && playerName) {
          connectToHost(targetId, playerName);
        }
      }
      setConnected(true);
    });

    peer.on('connection', (conn: any) => {
      // HOST Logic: Receive connection
      conn.on('data', (data: PeerMessage) => handleHostMessage(conn, data));
      conn.on('open', () => {
        connectionsRef.current.set(conn.peer, conn);
        // Send current game state to new player immediately
        conn.send({ type: 'GAME_STATE', state: gameState });
      });
    });

    peer.on('error', (err: any) => {
      console.error(err);
      if (err.type === 'unavailable-id') {
        alert("Room code taken! Please try again.");
        window.location.reload();
      }
    });
  };

  const connectToHost = (hostId: string, name: string) => {
    if (!peerRef.current) return;
    const conn = peerRef.current.connect(hostId);
    
    conn.on('open', () => {
      setConnected(true);
      conn.send({ type: 'JOIN', name });
    });
    
    conn.on('data', (data: PeerMessage) => handlePlayerMessage(data));
    conn.on('error', () => {
      alert("Could not find room! Check the code.");
      setRole(null); // Go back to welcome screen
    });
    
    connectionsRef.current.set('HOST', conn);
  };

  // --- MESSAGE HANDLERS ---
  const handleHostMessage = (conn: any, data: PeerMessage) => {
    if (data.type === 'JOIN') {
      setPlayers(prev => {
        if (prev.find(p => p.peerId === conn.peer)) return prev;
        return [...prev, { 
          id: conn.peer, 
          peerId: conn.peer, 
          name: data.name, 
          score: 0, 
          streak: 0, 
          hasAnswered: false, 
          selectedIdx: null, 
          lastAnswerCorrect: false 
        }];
      });
    } else if (data.type === 'SUBMIT_ANSWER') {
      setPlayers(prev => prev.map(p => 
        p.peerId === conn.peer ? { ...p, hasAnswered: true, selectedIdx: data.index } : p
      ));
    }
  };

  const handlePlayerMessage = (data: PeerMessage) => {
    if (data.type === 'GAME_STATE') {
      setGameState(data.state);
      if (data.question) { 
        setQuestions([data.question]); 
        setCurrentQuestionIndex(0); 
        setTimeLeft(ROUND_TIME); 
      }
    } else if (data.type === 'SCORE_UPDATE') {
      setMyScore(data.score);
    }
  };

  const broadcast = (msg: PeerMessage) => {
    connectionsRef.current.forEach((conn: any) => conn.send(msg));
  };

  // --- GAME LOGIC ---
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
        setTimeLeft(ROUND_TIME);
        broadcast({ type: 'GAME_STATE', state: 'QUESTION', question: newQuestions[0] });
      }, 3000);
    } catch (error) {
      setLoading(false);
    }
  }, [currentRound]);

  const handleReveal = () => {
    if (gameState === 'REVEAL') return;
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;
    
    const correctIdx = currentQ.correctIndex;
    const updatedPlayers = players.map(p => ({
      ...p,
      lastAnswerCorrect: p.selectedIdx === correctIdx
    }));
    setPlayers(updatedPlayers);
    setGameState('REVEAL');
    broadcast({ type: 'GAME_STATE', state: 'REVEAL' });
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

  // --- TIMER ---
  useEffect(() => {
    let interval: any;
    if (gameState === 'QUESTION' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleReveal();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  // --- RENDER ---

  // 1. Landing Screen
  if (!role) {
    return <WelcomeScreen onHost={startHost} onJoin={startPlayer} />;
  }

  // 2. Player View
  if (role === 'PLAYER') {
    return (
      <PlayerController 
        gameState={gameState}
        currentQuestion={questions[0]}
        currentScore={myScore}
        onSendAnswer={(index) => {
          const conn = connectionsRef.current.get('HOST');
          if (conn) conn.send({ type: 'SUBMIT_ANSWER', index });
        }}
        connected={connected}
        playerName={myName}
      />
    );
  }

  // 3. Host View
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden relative selection:bg-yellow-400 selection:text-black">
      <Fireworks />
      <div className="fixed inset-0 pointer-events-none">
         <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
         <div className="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-400 rounded-lg shadow-lg">
              <Sparkles className="text-slate-950" size={24} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight hidden sm:block">Edwards Family Quiz</h1>
          </div>
          {gameState === 'QUESTION' && (
             <div className="flex gap-4 items-center">
                <div className="text-3xl font-mono font-black text-yellow-400 flex gap-2 items-center">
                  <Timer className="animate-pulse" /> {timeLeft}s
                </div>
                <button onClick={handleReveal} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold uppercase border border-white/20">
                  Skip
                </button>
             </div>
          )}
        </header>

        <main className="min-h-[600px] flex flex-col justify-center">
          {gameState === 'LOBBY' && (
            <Lobby 
              roomCode={hostPeerId} 
              players={players} 
              onStartGame={startNextRound} 
              onAddPlayer={(name) => {
                // Host can manually add players if needed, or mostly just for display
              }} 
            />
          )}

          {gameState === 'ROUND_INTRO' && (
            <div className="text-center space-y-6 animate-in zoom-in duration-500">
               <h3 className="text-2xl font-bold uppercase tracking-[0.5em] text-yellow-400">Next Round</h3>
               <h2 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">
                 {CATEGORIES[currentRound]}
               </h2>
            </div>
          )}

          {gameState === 'QUESTION' && questions[currentQuestionIndex] && (
            <QuestionCard 
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              players={players}
              onToggleReady={() => {}} 
              onReveal={handleReveal}
            />
          )}

          {gameState === 'REVEAL' && (
             <div className="text-center max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8">
                <div>
                   <h3 className="text-yellow-400 font-bold uppercase tracking-widest mb-4">Correct Answer</h3>
                   <div className="bg-green-500 text-white p-8 rounded-3xl text-4xl md:text-5xl font-black shadow-2xl shadow-green-500/20">
                      {questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctIndex]}
                   </div>
                </div>

                <div className="bg-white/10 p-8 rounded-2xl flex gap-4 items-start text-left border border-white/10">
                   <Info className="shrink-0 text-yellow-400" />
                   <p className="text-xl leading-relaxed italic text-white/80">"{questions[currentQuestionIndex].explanation}"</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   {players.map(p => (
                      <div key={p.id} className={`p-4 rounded-xl border flex items-center justify-between ${p.lastAnswerCorrect ? 'bg-green-500/20 border-green-500' : 'bg-red-500/10 border-red-500/20'}`}>
                         <span className="font-bold">{p.name}</span>
                         {p.lastAnswerCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500/50" />}
                      </div>
                   ))}
                </div>

                <button onClick={commitPoints} className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-2xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-3 mx-auto shadow-xl">
                   NEXT CHALLENGE <ChevronRight />
                </button>
             </div>
          )}

          {(gameState === 'LEADERBOARD' || gameState === 'FINAL_RESULTS') && (
             <Leaderboard 
               players={players} 
               onNext={gameState === 'FINAL_RESULTS' ? () => window.location.reload() : startNextRound} 
               title={gameState === 'FINAL_RESULTS' ? 'WINNERS' : 'LEADERBOARD'} 
               isFinal={gameState === 'FINAL_RESULTS'} 
             />
          )}
        </main>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-2xl font-black text-yellow-400 tracking-widest uppercase">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default App;
