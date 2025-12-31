import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Category, GameState, Question, PeerMessage } from './types';
import { getRandomQuestions } from './quizService';
import Lobby from './components/Lobby';
import QuestionCard from './components/QuestionCard';
import Leaderboard from './components/Leaderboard';
import PlayerController from './components/PlayerController';
import Fireworks from './components/Fireworks';
import { Sparkles, Trophy, ChevronRight, Info, CheckCircle, XCircle, Share2, Timer } from 'lucide-react';

const CATEGORIES = [Category.DISNEY, Category.MUSIC, Category.GENERAL];
const ROUND_TIME = 60; // Seconds

const App: React.FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const roomFromUrl = urlParams.get('room');
  const [role] = useState<'HOST' | 'PLAYER'>(roomFromUrl ? 'PLAYER' : 'HOST');

  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [players, setPlayers] = useState<Player[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [loading, setLoading] = useState(false);
  const [myScore, setMyScore] = useState(0);
  const [myName, setMyName] = useState('');
  const [connected, setConnected] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);

  const peerRef = useRef<any>(null);
  const connectionsRef = useRef<Map<string, any>>(new Map());
  const [hostPeerId, setHostPeerId] = useState<string>(roomFromUrl || '');

  useEffect(() => {
    const initPeer = () => {
      const PeerClass = (window as any).Peer;
      if (!PeerClass) { setTimeout(initPeer, 500); return; }
      peerRef.current = new PeerClass();
      peerRef.current.on('open', (id: string) => {
        if (role === 'HOST') { setHostPeerId(id); setConnected(true); } 
        else if (role === 'PLAYER' && hostPeerId) { joinRoom(hostPeerId); }
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

  useEffect(() => {
    let interval: any;
    if (gameState === 'QUESTION' && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { handleReveal(); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeLeft]);

  const joinRoom = (targetId: string) => {
    const name = prompt("Enter your name:") || "Guest";
    setMyName(name);
    const conn = peerRef.current.connect(targetId);
    conn.on('open', () => { setConnected(true); conn.send({ type: 'JOIN', name }); });
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
      if (data.question) { setQuestions([data.question]); setCurrentQuestionIndex(0); setTimeLeft(ROUND_TIME); }
    } else if (data.type === 'SCORE_UPDATE') { setMyScore(data.score); }
  };

  const startNextRound = useCallback(async () => {
    if (currentRound >= CATEGORIES.length) { setGameState('FINAL_RESULTS'); connectionsRef.current.forEach(c => c.send({ type: 'GAME_STATE', state: 'FINAL_RESULTS' })); return; }
    setLoading(true); setGameState('ROUND_INTRO'); connectionsRef.current.forEach(c => c.send({ type: 'GAME_STATE', state: 'ROUND_INTRO' }));
    try {
      const newQuestions = await getRandomQuestions(CATEGORIES[currentRound], 6);
      setQuestions(newQuestions); setCurrentQuestionIndex(0);
      setTimeout(() => { 
        setLoading(false); setGameState('QUESTION'); setTimeLeft(ROUND_TIME); 
        connectionsRef.current.forEach(c => c.send({ type: 'GAME_STATE', state: 'QUESTION', question: newQuestions[0] })); 
      }, 3000);
    } catch (error) { setLoading(false); }
  }, [currentRound]);

  const handleReveal = () => {
    if (gameState === 'REVEAL') return;
    const currentQ = questions[currentQuestionIndex];
    if (!currentQ) return;
    const correctIdx = currentQ.correctIndex;
    const updatedPlayers = players.map(p => ({ ...p, lastAnswerCorrect: p.selectedIdx === correctIdx }));
    setPlayers(updatedPlayers); setGameState('REVEAL'); 
    connectionsRef.current.forEach(c => c.send({ type: 'GAME_STATE', state: 'REVEAL' }));
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
      setCurrentQuestionIndex(prev => prev + 1); setGameState('QUESTION'); setTimeLeft(ROUND_TIME); 
      connectionsRef.current.forEach(c => c.send({ type: 'GAME_STATE', state: 'QUESTION', question: nextQ }));
    } else {
      setGameState('LEADERBOARD'); connectionsRef.current.forEach(c => c.send({ type: 'GAME_STATE', state: 'LEADERBOARD' })); setCurrentRound(prev => prev + 1);
    }
  };

  if (role === 'PLAYER') {
    return <PlayerController gameState={gameState} currentQuestion={questions[0]} currentScore={myScore} onSendAnswer={(index) => { const conn = connectionsRef.current.get('HOST'); if (conn) conn.send({ type: 'SUBMIT_ANSWER', index }); }} connected={connected} playerName={myName} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden relative">
      <Fireworks />
      <div className="max-w-7xl mx-auto p-6 relative z-10">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Sparkles className="text-yellow-400" size={32} />
            <h1 className="text-3xl font-black uppercase">Edwards Family Quiz</h1>
          </div>
          {gameState === 'QUESTION' && <div className="text-3xl font-mono text-yellow-400 flex gap-2"><Timer /> {timeLeft}s</div>}
        </header>
        <main className="min-h-[600px] flex flex-col justify-center">
          {gameState === 'LOBBY' && <Lobby roomCode={hostPeerId} players={players} onStartGame={startNextRound} onAddPlayer={() => {}} />}
          {gameState === 'ROUND_INTRO' && <div className="text-center"><h2 className="text-9xl font-black">{CATEGORIES[currentRound]}</h2></div>}
          {gameState === 'QUESTION' && questions[currentQuestionIndex] && <QuestionCard question={questions[currentQuestionIndex]} questionNumber={currentQuestionIndex + 1} totalQuestions={questions.length} players={players} onToggleReady={() => {}} onReveal={handleReveal} />}
          {gameState === 'REVEAL' && (
            <div className="text-center max-w-4xl mx-auto space-y-12">
              <div className="bg-green-500 text-white p-8 rounded-3xl text-5xl font-black">{questions[currentQuestionIndex].options[questions[currentQuestionIndex].correctIndex]}</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{players.map(p => (<div key={p.id} className={`p-4 rounded-xl border flex items-center justify-between ${p.lastAnswerCorrect ? 'bg-green-500/20 border-green-500' : 'bg-red-500/10 border-red-500/20'}`}><span className="font-bold">{p.name}</span>{p.lastAnswerCorrect ? <CheckCircle size={24} className="text-green-500" /> : <XCircle size={24} className="text-red-500/50" />}</div>))}</div>
              <button onClick={commitPoints} className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-2xl hover:bg-yellow-400">NEXT</button>
            </div>
          )}
          {(gameState === 'LEADERBOARD' || gameState === 'FINAL_RESULTS') && <Leaderboard players={players} onNext={gameState === 'FINAL_RESULTS' ? () => window.location.reload() : startNextRound} title={gameState === 'FINAL_RESULTS' ? "WINNERS" : "LEADERBOARD"} isFinal={gameState === 'FINAL_RESULTS'} />}
        </main>
      </div>
    </div>
  );
};
export default App;
