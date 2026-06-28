'use client'
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onGameFinished?: (score: number, durationSeconds: number, summaryText: string) => void
}

type GameState = 'idle' | 'counting' | 'finished';

function getRating(tapsPerSec: number): string {
  if (tapsPerSec < 5) return 'SLOW 🐢 Take a nap';
  if (tapsPerSec < 7) return 'AVERAGE 👍 Not bad';
  if (tapsPerSec < 9) return 'FAST ⚡ You\'re tapping!';
  return 'BEAST MODE 🔥 Legendary';
}

export function TapSpeedTest({ onGameFinished }: Props) {
  const [state, setState] = useState<GameState>('idle');
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const tapsRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function startGame() {
    setState('counting');
    setTaps(0);
    tapsRef.current = 0;
    setTimeLeft(10);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function finishGame() {
    setState('finished');
  }

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  useEffect(() => {
    if (state === 'finished') {
      const total = tapsRef.current;
      const tps = +(total / 10).toFixed(1);
      const rating = getRating(tps);
      const summary = `${total} taps in 10s (${tps}/s) — ${rating}`;
      onGameFinished?.(total, 10, summary);
    }
  }, [state]);

  function handleTap(e: React.MouseEvent | React.TouchEvent) {
    e.preventDefault();
    if (state === 'idle') {
      startGame();
    }
    if (state === 'counting') {
      tapsRef.current += 1;
      setTaps(tapsRef.current);
    }
  }

  function reset() {
    if (timerRef.current) clearInterval(timerRef.current);
    setState('idle');
    setTaps(0);
    tapsRef.current = 0;
    setTimeLeft(10);
  }

  const tps = state === 'finished' ? +(tapsRef.current / 10).toFixed(1) : 0;
  const rating = getRating(tps);

  return (
    <div className="bg-white border-4 border-black p-4 flex flex-col gap-4 select-none">
      <h2 className="font-black text-xl uppercase tracking-tight text-center">⚡ TAP SPEED TEST</h2>

      {state !== 'finished' ? (
        <>
          {state === 'counting' && (
            <div className="flex justify-between items-center border-2 border-black p-2 bg-[#F4F4F1]">
              <span className="font-black text-2xl">{taps}</span>
              <span className="font-mono text-xs uppercase">TAPS</span>
              <span className="font-black text-2xl text-[#FF6B6B]">{timeLeft}s</span>
            </div>
          )}

          <button
            onMouseDown={handleTap}
            onTouchStart={handleTap}
            className={`w-full border-4 border-black font-black text-2xl uppercase py-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all ${state === 'idle' ? 'bg-[#FFD93D]' : 'bg-[#00FF00]'}`}
          >
            {state === 'idle' ? 'TAP TO START' : 'TAP! TAP! TAP!'}
          </button>

          {state === 'idle' && (
            <p className="text-center text-xs font-mono uppercase text-gray-500">10 seconds. Maximum effort.</p>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="border-4 border-black p-4 bg-[#FFD93D] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black text-4xl text-center">{tapsRef.current}</p>
            <p className="text-center font-mono text-xs uppercase">TOTAL TAPS</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border-2 border-black p-3 text-center">
              <p className="font-black text-2xl">{tps}</p>
              <p className="font-mono text-xs uppercase">Taps/sec</p>
            </div>
            <div className="border-2 border-black p-3 text-center bg-[#00FF00]">
              <p className="font-black text-sm uppercase leading-tight">{rating}</p>
            </div>
          </div>
          <button
            onClick={reset}
            className="w-full bg-white border-4 border-black font-black text-lg uppercase py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            RETRY
          </button>
        </div>
      )}
    </div>
  );
}
