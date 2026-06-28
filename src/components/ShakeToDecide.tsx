'use client'
import React, { useState, useEffect, useRef } from 'react';

interface Props {
  onGameFinished?: (score: number, durationSeconds: number, summaryText: string) => void
}

const YES_ANSWERS = ['YES! SEND IT 🔥', 'ABSOLUTELY YES', 'DO IT NOW', 'GO FOR IT 💪'];
const NO_ANSWERS = ['NO. PUT IT DOWN 🚫', 'HARD NO', "DON'T DO IT", 'STEP AWAY ✋'];

export function ShakeToDecide({ onGameFinished }: Props) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [isYes, setIsYes] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const lastAccelRef = useRef<{ x: number; y: number; z: number } | null>(null);
  const shakeCountRef = useRef(0);
  const finishedRef = useRef(false);

  function triggerResult() {
    const yes = Math.random() < 0.5;
    const answers = yes ? YES_ANSWERS : NO_ANSWERS;
    const answer = answers[Math.floor(Math.random() * answers.length)];
    setIsYes(yes);
    setResult(answer);
    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    if (!finishedRef.current) {
      finishedRef.current = true;
      onGameFinished?.(yes ? 1 : 0, duration, `Decision: ${answer}`);
    }
  }

  function handleMotion(e: DeviceMotionEvent) {
    const accel = e.accelerationIncludingGravity;
    if (!accel || accel.x == null || accel.y == null || accel.z == null) return;
    const prev = lastAccelRef.current;
    if (prev) {
      const delta = Math.abs(accel.x! - prev.x) + Math.abs(accel.y! - prev.y) + Math.abs(accel.z! - prev.z);
      if (delta > 25) {
        shakeCountRef.current += 1;
        setShakeCount(shakeCountRef.current);
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 300);
        if (shakeCountRef.current >= 3 && !finishedRef.current) {
          triggerResult();
        }
      }
    }
    lastAccelRef.current = { x: accel.x!, y: accel.y!, z: accel.z! };
  }

  async function requestPermission() {
    try {
      // @ts-ignore
      if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        // @ts-ignore
        const res = await DeviceMotionEvent.requestPermission();
        if (res === 'granted') {
          setPermissionGranted(true);
          startTimeRef.current = Date.now();
        } else {
          setPermissionDenied(true);
        }
      } else if (typeof DeviceMotionEvent !== 'undefined') {
        // Non-iOS: permission not required
        setPermissionGranted(true);
        startTimeRef.current = Date.now();
      } else {
        setPermissionDenied(true);
      }
    } catch {
      setPermissionDenied(true);
    }
  }

  useEffect(() => {
    if (!permissionGranted) return;
    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [permissionGranted]);

  function reset() {
    setResult(null);
    setShakeCount(0);
    shakeCountRef.current = 0;
    finishedRef.current = false;
    startTimeRef.current = Date.now();
  }

  return (
    <div className="bg-white border-4 border-black p-4 flex flex-col items-center gap-4 select-none">
      <h2 className="font-black text-xl uppercase tracking-tight text-center">📳 SHAKE TO DECIDE</h2>

      {!result && (
        <>
          {!permissionGranted && !permissionDenied && (
            <button
              onClick={requestPermission}
              className="w-full bg-[#FFD93D] border-4 border-black font-black text-lg uppercase py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
            >
              ENABLE SHAKE SENSOR
            </button>
          )}

          {permissionDenied && (
            <p className="text-center text-sm font-bold text-[#FF6B6B] border-2 border-[#FF6B6B] p-2">
              Motion sensor not available on this device.
            </p>
          )}

          {permissionGranted && (
            <div className="flex flex-col items-center gap-3">
              <div className={`text-7xl ${isShaking ? 'animate-bounce' : ''}`}>📱</div>
              <p className="font-black text-center text-sm uppercase">Think of your yes/no question, then shake!</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <div key={n} className={`w-8 h-8 border-2 border-black flex items-center justify-center font-black text-sm ${shakeCount >= n ? 'bg-[#00FF00]' : 'bg-white'}`}>
                    {n}
                  </div>
                ))}
              </div>
              <p className="text-xs font-mono">Shakes: {shakeCount} / 3</p>
            </div>
          )}

          <div className="w-full border-t-2 border-dashed border-black pt-3">
            <button
              onClick={() => { setPermissionGranted(true); triggerResult(); }}
              className="w-full border-2 border-black font-black text-xs uppercase py-2 bg-white hover:bg-gray-100"
            >
              CAN'T SHAKE? CLICK
            </button>
          </div>
        </>
      )}

      {result && (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className={`w-full border-4 border-black p-6 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${isYes ? 'bg-[#00FF00]' : 'bg-[#FF6B6B]'}`}>
            <p className="font-black text-2xl uppercase leading-tight">{result}</p>
          </div>
          <p className="text-xs font-mono text-center">The universe has spoken. No renegotiating.</p>
          <button
            onClick={reset}
            className="w-full bg-[#FFD93D] border-4 border-black font-black text-lg uppercase py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            ↺ SHAKE AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
