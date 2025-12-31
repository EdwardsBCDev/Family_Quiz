
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Category, GameState, Question, PeerMessage } from './types';
import { getRandomQuestions } from './quizService';
import Lobby from './components/Lobby';
import QuestionCard from './components/QuestionCard';
import Leaderboard from './components/Leaderboard';
import PlayerController from './components/PlayerController';
import Fireworks from './components/Fireworks';
import { Sparkles, Trophy, ChevronRight, Info, CheckCircle, XCircle, Share2 } from 'lucide-react';

const CATEGORIES = [Category.DISNEY, Category.MUSIC, Category.GENERAL];

const App: React.FC = () => {
  // Routing logic: If ?room=... then player mode
  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get('room');
  const [role] = useState<'HOST' | 'PLAYER'>(roomFromUrl ? 'PLAYER' : 'HOST');

  // Common State
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [myName, setMyName] = useState('');
  const [connected, setConnected] = useState(false);

  // PeerJS refs
  const peerRef = useRef<any>(null);
  const connectionsRef = useRef<Map<string, any>>(new Map());
  const [hostPeerId, setHostPeerId] = useState<string>(roomFromUrl || '');

  // Initialization
  useEffect(() => {
    const initPeer = () => {
      const PeerClass = (window as any).Peer;
      if (!PeerClass) {
        console.warn('PeerJS not loaded yet, retrying...');
        setTimeout(initPeer, 500);
        return;
      }

      peerRef.current = new PeerClass();

      peerRef.current.on('open', (id: string) => {
        console.log('Peer ID:', id);
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
          conn.on('open', () => {
            connectionsRef.current.set(conn.peer, conn);
          });
        });
      }
    };

    initPeer();

    return () => {
      peerRef.current?.destroy();
    };
  }, [role]);

  // Player Messaging
  const joinRoom = (targetId: string) => {
    const name = prompt("Enter your name for the Edwards Family Quiz:") || "Guest";
    setMyName(name);
    const conn = peerRef.current.connect(targetId);
    conn.on('open', () => {
      setConnected(true);
      conn.send({ type: 'JOIN', name });
    });
    conn.on('data', (data: PeerMessage) => handlePlayerMessage(data));
    connectionsRef.current.set('HOST', conn);
  };

  const sendToHost = (msg: PeerMessage) => {
    const conn = connectionsRef.current.get('HOST');
    if (conn) conn.send(msg);
  };

  const broadcastToPlayers = (msg: PeerMessage) => {
    connectionsRef.current.forEach(conn => conn.send(msg));
  };

  // Message Handlers
  const handleHostMessage = (conn: any, data: PeerMessage) => {
    if (data.type === 'JOIN') {
      setPlayers(prev => {
        if (prev.find(p => p.peerId === conn.peer)) return prev;
        const newPlayer: Player = {
          id: conn.peer,
          peerId: conn.peer,
          name: data.name,
          score: 0,
          streak: 0,
          hasAnswered: false,
          selectedIdx: null,
          lastAnswerCorrect: false
        };
        return [...prev, newPlayer];
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
      }
    } else if (data.type === 'SCORE_UPDATE') {
      setMyScore(data.score);
    }
  };

  // Game Logic (Host Only)
  const startNextRound = useCallback(async () => {
    if (currentRound >= CATEGORIES.length) {
      setGameState('FINAL_RESULTS');
      broadcastToPlayers({ type: 'GAME_STATE', state: 'FINAL_RESULTS' });
      return;
    }

    setLoading(true);
    setGameState('ROUND_INTRO');
    broadcastToPlayers({ type: 'GAME_STATE', state: 'ROUND_INTRO' });

    try {
      const category = CATEGORIES[currentRound];
      const newQuestions = await getRandomQuestions(category, 6);
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0);
      
      setTimeout(() => {
        setLoading(false);
        setGameState('QUESTION');
        broadcastToPlayers({ 
          type: 'GAME_STATE', 
          state: 'QUESTION', 
          question: newQuestions[0] 
        });
      }, 3000);
    } catch (error) {
      setLoading(false);
    }
  }, [currentRound]);

  const commitPoints = () => {
    const q = questions[currentQuestionIndex];
    const points = q.isBonus ? 20 : 10;

    const updatedPlayers = players.map(p => {
      if (p.lastAnswerCorrect) {
        const newScore = p.score + points;
        const conn = connectionsRef.current.get(p.peerId);
        if (conn) conn.send({ type: 'SCORE_UPDATE', score: newScore });
        return { ...p, score: newScore, streak: p.streak + 1, hasAnswered: false, lastAnswerCorrect: false };
      }
      return { ...p, streak: 0, hasAnswered: false, lastAnswerCorrect: false };
    });

    setPlayers(updatedPlayers);

    if (currentQuestionIndex < questions.length - 1) {
      const nextQ = questions[currentQuestionIndex + 1];
      setCurrentQuestionIndex(prev => prev + 1);
      setGameState('QUESTION');
      broadcastToPlayers({ type: 'GAME_STATE', state: 'QUESTION', question: nextQ });
    } else {
      setGameState('LEADERBOARD');
      broadcastToPlayers({ type: 'GAME_STATE', state: 'LEADERBOARD' });
      setCurrentRound(prev => prev + 1);
    }
  };

  const generateInviteLink = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('room', hostPeerId);
    return url.toString();
  };

  // Render
  if (role === 'PLAYER') {
    return (
      <PlayerController 
        gameState={gameState}
        currentQuestion={questions[0]}
        currentScore={myScore}
        onSendAnswer={(index) => sendToHost({ type: 'SUBMIT_ANSWER', index })}
        connected={connected}
        playerName={myName}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-slate-950 text-white pb-20 font-sans">
      <Fireworks />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-[80%] h-[80%] bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 -right-1/4 w-[80%] h-[80%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <header className="p-6 relative z-10 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-400 rounded-lg shadow-lg">
            <Sparkles className="text-slate-900" size={24} />
          </div>
          <span className="font-display font-black text-2xl tracking-tight uppercase">Edwards Family Quiz</span>
        </div>
        {gameState !== 'LOBBY' && (
          <div className="flex gap-4">
            {players.map(p => (
              <div key={p.id} className="flex flex-col items-end">
                <span className="text-[10px] text-white/40 font-bold uppercase">{p.name}</span>
                <span className="text-sm font-black text-yellow-400">{p.score}</span>
              </div>
            ))}
          </div>
        )}
      </header>

      <main className="container mx-auto mt-4 relative z-10 px-4">
        {gameState === 'LOBBY' && (
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 p-8">
            <div className="glass p-10 rounded-[3rem] flex flex-col items-center justify-center space-y-8 text-center border-2 border-yellow-400/20">
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-yellow-400">Join the Quiz</h2>
              <div id="qrcode-container" className="bg-white p-4 rounded-3xl shadow-2xl">
                {hostPeerId && (
                  <canvas id="invite-qr" ref={(node) => {
                    const QRCodeLib = (window as any).QRCode;
                    if (node && QRCodeLib) {
                      QRCodeLib.toCanvas(node, generateInviteLink(), { width: 280, margin: 2 });
                    }
                  }} />
                )}
              </div>
              <div className="space-y-2">
                 <p className="text-white/40 font-bold text-xs uppercase tracking-widest">Share this Link</p>
                 <div className="bg-white/5 px-6 py-3 rounded-full border border-white/10 flex items-center gap-4 text-sm font-mono text-yellow-100">
                    {generateInviteLink().substring(0, 30)}...
                    <Share2 size={16} className="cursor-pointer hover:text-white" onClick={() => navigator.clipboard.writeText(generateInviteLink())} />
                 </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex justify-between items-end">
                 <h2 className="text-4xl font-black font-display">Players Joined</h2>
                 <span className="text-4xl font-black text-yellow-400">{players.length}/4</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 {[0,1,2,3].map(i => (
                   <div key={i} className={`h-32 rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${players[i] ? 'bg-green-500/10 border-green-500 shadow-glow' : 'bg-white/5 border-white/10 opacity-30'}`}>
                      {players[i] ? (
                        <>
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center font-bold text-xl">
                            {players[i].name[0].toUpperCase()}
                          </div>
                          <span className="font-bold">{players[i].name}</span>
                        </>
                      ) : (
                        <span className="text-xs font-black text-white/20 uppercase tracking-widest">Empty Slot</span>
                      )}
                   </div>
                 ))}
              </div>
              <button 
                disabled={players.length === 0}
                onClick={startNextRound}
                className={`w-full py-6 rounded-[2rem] font-black text-3xl transition-all ${players.length > 0 ? 'bg-yellow-400 text-slate-900 shadow-2xl hover:scale-105 active:scale-95' : 'bg-white/5 text-white/20'}`}
              >
                START GAME
              </button>
            </div>
          </div>
        )}

        {gameState === 'ROUND_INTRO' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-in fade-in slide-in-from-top-12 duration-1000">
            <h1 className="text-yellow-400 font-bold uppercase tracking-[0.4em] text-sm">Round {currentRound + 1}</h1>
            <h2 className="text-8xl md:text-[10rem] font-black font-display text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">
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
            onToggleReady={() => {}} // Not used in real-time mode
            onReveal={() => setGameState('REVEAL')}
          />
        )}

        {gameState === 'REVEAL' && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="glass p-12 rounded-[3rem] text-center border-2 border-yellow-400/30 shadow-2xl">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
              <h2 className="text-sm uppercase tracking-[0.3em] text-yellow-400 font-black mb-2">The Correct Answer</h2>
              <h3 className="text-5xl font-black mb-8 font-display text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                {questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctIndex]}
              </h3>
              
              <div className="bg-white/5 p-8 rounded-2xl mb-8 flex gap-4 items-start text-left border border-white/5">
                <Info className="text-yellow-400 shrink-0 mt-1" />
                <p className="text-xl italic text-white/80 leading-relaxed">"{questions[currentQuestionIndex].explanation}"</p>
              </div>

              <h3 className="text-sm uppercase tracking-[0.3em] text-white/40 font-black mb-6 italic">Host: Confirm who got it right</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {players.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => setPlayers(prev => prev.map(p2 => p2.id === p.id ? {...p2, lastAnswerCorrect: !p2.lastAnswerCorrect} : p2))}
                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${p.lastAnswerCorrect ? 'bg-green-500/20 border-green-500' : 'bg-white/5 border-white/10 opacity-50'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${p.lastAnswerCorrect ? 'bg-green-500' : 'bg-white/10'}`}>
                      {p.lastAnswerCorrect ? <CheckCircle size={24} /> : <XCircle size={24} />}
                    </div>
                    <span className="font-bold">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={commitPoints} className="w-full py-6 bg-white text-slate-900 rounded-[2rem] font-black text-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-3">
              NEXT CHALLENGE <ChevronRight size={32} />
            </button>
          </div>
        )}

        {gameState === 'LEADERBOARD' && (
          <Leaderboard players={players} onNext={startNextRound} title={`Round Complete!`} />
        )}

        {gameState === 'FINAL_RESULTS' && (
          <Leaderboard players={players} onNext={() => window.location.reload()} title="NYE 2025 CHAMPIONS" isFinal={true} />
        )}
      </main>

      {loading && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center space-y-6">
          <div className="w-20 h-20 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-2xl font-black text-yellow-400 tracking-widest uppercase">Shuffling Question Pool...</p>
        </div>
      )}
    </div>
  );
};

export default App;
