'use client'
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onGameFinished?: (score: number, durationSeconds: number, summaryText: string) => void
}

const TOTAL_ROUNDS = 15;

type Direction = 'left' | 'right';
type GameState = 'idle' | 'playing' | 'feedback' | 'finished';

interface Round {
  prompt: Direction;
  startTime: number;
}

function getAccuracyLabel(pct: number) {
  if (pct >= 90) return 'FLAWLESS 🏆';
  if (pct >= 70) return 'SHARP ⚡';
  if (pct >= 50) return 'DECENT 👍';
  return 'NEEDS PRACTICE 🐢';
}

export function SwipeReactionGame({ onGameFinished }: Props) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [round, setRound] = useState<Round | null>(null);
  const [roundNum, setRoundNum] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; fast: boolean } | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const startGameTimeRef = useRef(Date.now());
  const scoreRef = useRef(0);
  const roundNumRef = useRef(0);
  const gameStateRef = useRef<GameState>('idle');

  function nextRound(currentScore: number, currentRound: number) {
    if (currentRound >= TOTAL_ROUNDS) {
      setGameState('finished');
      gameStateRef.current = 'finished';
      const duration = Math.round((Date.now() - startGameTimeRef.current) / 1000);
      const pct = Math.round((currentScore / TOTAL_ROUNDS) * 100);
      const label = getAccuracyLabel(pct);
      onGameFinished?.(currentScore, duration, `${currentScore}/${TOTAL_ROUNDS} — ${pct}% — ${label}`);
      return;
    }
    const prompt: Direction = Math.random() < 0.5 ? 'left' : 'right';
    setRound({ prompt, startTime: Date.now() });
    setRoundNum(currentRound + 1);
    roundNumRef.current = currentRound + 1;
    setGameState('playing');
    gameStateRef.current = 'playing';
  }

  function startGame() {
    scoreRef.current = 0;
    roundNumRef.current = 0;
    setScore(0);
    setFeedback(null);
    startGameTimeRef.current = Date.now();
    nextRound(0, 0);
  }

  function handleSwipe(direction: Direction) {
    if (gameStateRef.current !== 'playing' || !round) return;
    const elapsed = Date.now() - round.startTime;
    const correct = direction === round.prompt;
    const fast = elapsed < 500;
    let gained = 0;
    if (correct) gained += 1;
    if (correct && fast) gained += 0.5;
    const newScore = scoreRef.current + gained;
    scoreRef.current = newScore;
    setScore(newScore);
    setFeedback({ correct, fast: fast && correct });
    setGameState('feedback');
    gameStateRef.current = 'feedback';
    setTimeout(() => {
      setFeedback(null);
      nextRound(newScore, roundNumRef.current);
    }, 500);
  }

  // Touch swipe detection
  function onTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (Math.abs(dx) < 50) return;
    handleSwipe(dx < 0 ? 'left' : 'right');
  }

  // Keyboard
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') handleSwipe('left');
      if (e.key === 'ArrowRight') handleSwipe('right');
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [round]);

  const totalScore = Math.round(score * 10) / 10;
  const pct = Math.round((scoreRef.current / TOTAL_ROUNDS) * 100);
  const accuracyLabel = getAccuracyLabel(pct);

  return (
    <div className="bg-white border-4 border-black p-4 flex flex-col gap-3 select-none">
      <div className="flex justify-between items-center">
        <h2 className="font-black text-lg uppercase">👈👉 SWIPE REACTION</h2>
        {gameState !== 'idle' && gameState !== 'finished' && (
          <span className="font-mono text-xs border-2 border-black px-2 py-0.5">{roundNum}/{TOTAL_ROUNDS}</span>
        )}
      </div>

      {gameState === 'idle' && (
        <div className="flex flex-col gap-3">
          <p className="text-sm font-bold text-center">Swipe left or right when you see the direction. 15 rounds. Go fast.</p>
          <p className="text-xs font-mono text-center text-gray-500">Also works with ← → arrow keys</p>
          <button
            onClick={startGame}
            className="w-full bg-[#FFD93D] border-4 border-black font-black text-xl uppercase py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            START
          </button>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'feedback') && round && (
        <div
          className="relative border-4 border-black flex flex-col items-center justify-center gap-4 overflow-hidden"
          style={{
            minHeight: 200,
            background: round.prompt === 'left' ? '#DBEAFE' : '#FED7AA',
            transition: 'background 0.15s',
          }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {gameState === 'feedback' && feedback ? (
            <div className={`flex flex-col items-center gap-1 ${feedback.correct ? 'text-[#00a000]' : 'text-[#CC0000]'}`}>
              <span className="font-black text-4xl">{feedback.correct ? '✅' : '❌'}</span>
              <span className="font-black text-xl uppercase">{feedback.correct ? 'CORRECT!' : 'WRONG!'}</span>
              {feedback.fast && <span className="font-black text-base text-yellow-600">⚡ FAST BONUS +0.5</span>}
            </div>
          ) : (
            <>
              <p className="font-black text-4xl uppercase tracking-widest">
                {round.prompt === 'left' ? '← SWIPE LEFT' : 'SWIPE RIGHT →'}
              </p>
              <p className="text-xs font-mono uppercase text-gray-500">Swipe or use arrow keys</p>
            </>
          )}

          {/* Swipe buttons for desktop fallback */}
          <div className="flex gap-3 mt-2">
            <button
              onMouseDown={() => handleSwipe('left')}
              className="bg-white border-2 border-black font-black text-sm px-4 py-2"
            >
              ← LEFT
            </button>
            <button
              onMouseDown={() => handleSwipe('right')}
              className="bg-white border-2 border-black font-black text-sm px-4 py-2"
            >
              RIGHT →
            </button>
          </div>
        </div>
      )}

      {gameState !== 'idle' && gameState !== 'finished' && (
        <div className="flex justify-between items-center border-2 border-black p-2 bg-[#F4F4F1]">
          <span className="font-mono text-xs uppercase">Score</span>
          <span className="font-black text-lg">{totalScore}</span>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="flex flex-col gap-3">
          <div className="border-4 border-black bg-[#FFD93D] p-4 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-3xl">{totalScore}<span className="text-base">/{TOTAL_ROUNDS}</span></p>
            <p className="font-mono text-xs uppercase">Final Score</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-2 border-black p-3 text-center">
              <p className="font-black text-xl">{pct}%</p>
              <p className="font-mono text-xs uppercase">Accuracy</p>
            </div>
            <div className="border-2 border-black p-3 text-center bg-[#00FF00]">
              <p className="font-black text-sm uppercase">{accuracyLabel}</p>
            </div>
          </div>
          <button
            onClick={startGame}
            className="w-full bg-white border-4 border-black font-black text-lg uppercase py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
