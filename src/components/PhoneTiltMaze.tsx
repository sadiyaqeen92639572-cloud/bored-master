'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Props {
  onGameFinished?: (score: number, durationSeconds: number, summaryText: string) => void
}

const CANVAS_SIZE = 300;
const BALL_RADIUS = 12;
const TARGET_SIZE = 32;

interface Obstacle { x: number; y: number; w: number; h: number; }
interface Level {
  targetCorner: 'tl' | 'tr' | 'bl' | 'br';
  obstacles: Obstacle[];
}

const LEVELS: Level[] = [
  { targetCorner: 'tr', obstacles: [] },
  { targetCorner: 'bl', obstacles: [{ x: 100, y: 80, w: 100, h: 16 }] },
  { targetCorner: 'br', obstacles: [{ x: 60, y: 140, w: 16, h: 100 }, { x: 180, y: 60, w: 16, h: 100 }] },
  { targetCorner: 'tl', obstacles: [{ x: 80, y: 100, w: 130, h: 16 }, { x: 80, y: 100, w: 16, h: 80 }] },
  { targetCorner: 'tr', obstacles: [{ x: 60, y: 80, w: 16, h: 120 }, { x: 140, y: 120, w: 120, h: 16 }, { x: 200, y: 60, w: 16, h: 80 }] },
];

function getTargetPos(corner: Level['targetCorner']) {
  const margin = 20;
  switch (corner) {
    case 'tl': return { x: margin, y: margin };
    case 'tr': return { x: CANVAS_SIZE - margin - TARGET_SIZE, y: margin };
    case 'bl': return { x: margin, y: CANVAS_SIZE - margin - TARGET_SIZE };
    case 'br': return { x: CANVAS_SIZE - margin - TARGET_SIZE, y: CANVAS_SIZE - margin - TARGET_SIZE };
  }
}

function rectsOverlap(x: number, y: number, r: number, obs: Obstacle) {
  return x + r > obs.x && x - r < obs.x + obs.w && y + r > obs.y && y - r < obs.y + obs.h;
}

export function PhoneTiltMaze({ onGameFinished }: Props) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [levelIdx, setLevelIdx] = useState(0);
  const [won, setWon] = useState(false);
  const [allDone, setAllDone] = useState(false);
  const [levelTime, setLevelTime] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballRef = useRef({ x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 });
  const tiltRef = useRef({ beta: 0, gamma: 0 });
  const startTimeRef = useRef(Date.now());
  const totalTimeRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const wonRef = useRef(false);
  const levelIdxRef = useRef(0);

  const currentLevel = LEVELS[levelIdx];
  const targetPos = getTargetPos(currentLevel.targetCorner);

  async function requestPermission() {
    try {
      // @ts-ignore
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        // @ts-ignore
        const res = await DeviceOrientationEvent.requestPermission();
        if (res === 'granted') {
          setPermissionGranted(true);
        } else {
          setPermissionDenied(true);
        }
      } else if (typeof DeviceOrientationEvent !== 'undefined') {
        setPermissionGranted(true);
      } else {
        setPermissionDenied(true);
      }
    } catch {
      setPermissionDenied(true);
    }
  }

  function handleOrientation(e: DeviceOrientationEvent) {
    tiltRef.current = { beta: e.beta ?? 0, gamma: e.gamma ?? 0 };
  }

  useEffect(() => {
    if (!permissionGranted) return;
    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [permissionGranted]);

  // Keyboard fallback
  const keysRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => keysRef.current.add(e.key);
    const onUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, []);

  const startLevel = useCallback((idx: number) => {
    wonRef.current = false;
    levelIdxRef.current = idx;
    ballRef.current = { x: CANVAS_SIZE / 2, y: CANVAS_SIZE / 2 };
    startTimeRef.current = Date.now();
    setWon(false);
    setLevelIdx(idx);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function draw() {
      const level = LEVELS[levelIdxRef.current];
      const target = getTargetPos(level.targetCorner);
      // Update ball position
      if (!wonRef.current) {
        const speed = 3;
        let dx = 0, dy = 0;
        // Tilt
        dx += tiltRef.current.gamma * 0.15;
        dy += tiltRef.current.beta * 0.15;
        // Keyboard
        const keys = keysRef.current;
        if (keys.has('ArrowLeft')) dx -= speed;
        if (keys.has('ArrowRight')) dx += speed;
        if (keys.has('ArrowUp')) dy -= speed;
        if (keys.has('ArrowDown')) dy += speed;

        let nx = ballRef.current.x + dx;
        let ny = ballRef.current.y + dy;
        // Clamp to canvas
        nx = Math.max(BALL_RADIUS, Math.min(CANVAS_SIZE - BALL_RADIUS, nx));
        ny = Math.max(BALL_RADIUS, Math.min(CANVAS_SIZE - BALL_RADIUS, ny));
        // Obstacle collision
        let blocked = false;
        for (const obs of level.obstacles) {
          if (rectsOverlap(nx, ny, BALL_RADIUS, obs)) { blocked = true; break; }
        }
        if (!blocked) {
          ballRef.current = { x: nx, y: ny };
        }
        // Check win
        const bx = ballRef.current.x, by = ballRef.current.y;
        if (bx > target.x && bx < target.x + TARGET_SIZE && by > target.y && by < target.y + TARGET_SIZE) {
          wonRef.current = true;
          const elapsed = Math.round((Date.now() - startTimeRef.current) / 1000);
          totalTimeRef.current += elapsed;
          setLevelTime(elapsed);
          setWon(true);
        }
      }

      // Draw
      ctx!.fillStyle = '#111';
      ctx!.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
      // Target
      ctx!.fillStyle = '#00FF00';
      ctx!.fillRect(target.x, target.y, TARGET_SIZE, TARGET_SIZE);
      ctx!.strokeStyle = '#00FF00';
      ctx!.lineWidth = 2;
      ctx!.strokeRect(target.x - 2, target.y - 2, TARGET_SIZE + 4, TARGET_SIZE + 4);
      // Obstacles
      ctx!.fillStyle = '#ffffff';
      for (const obs of level.obstacles) {
        ctx!.fillRect(obs.x, obs.y, obs.w, obs.h);
      }
      // Ball
      ctx!.beginPath();
      ctx!.arc(ballRef.current.x, ballRef.current.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx!.fillStyle = '#FFD93D';
      ctx!.fill();
      ctx!.strokeStyle = '#000';
      ctx!.lineWidth = 2;
      ctx!.stroke();

      animFrameRef.current = requestAnimationFrame(draw);
    }

    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [levelIdx, permissionGranted, permissionDenied]);

  function nextLevel() {
    const next = levelIdx + 1;
    if (next >= LEVELS.length) {
      setAllDone(true);
      onGameFinished?.(LEVELS.length, totalTimeRef.current, `Beat all ${LEVELS.length} levels in ${totalTimeRef.current}s`);
    } else {
      startLevel(next);
    }
  }

  function restart() {
    totalTimeRef.current = 0;
    startLevel(0);
    setAllDone(false);
  }

  return (
    <div className="bg-white border-4 border-black p-4 flex flex-col gap-3 select-none">
      <div className="flex justify-between items-center">
        <h2 className="font-black text-lg uppercase">🕹️ TILT MAZE</h2>
        <span className="border-2 border-black px-2 py-0.5 font-mono text-xs">LVL {levelIdx + 1}/{LEVELS.length}</span>
      </div>

      {!permissionGranted && !permissionDenied && (
        <button
          onClick={requestPermission}
          className="w-full bg-[#FFD93D] border-4 border-black font-black text-base uppercase py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          ENABLE TILT SENSOR
        </button>
      )}

      {permissionDenied && (
        <p className="text-xs font-bold text-[#FF6B6B] border-2 border-[#FF6B6B] p-2 text-center">
          Motion sensor unavailable — use arrow keys!
        </p>
      )}

      {!allDone ? (
        <>
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="border-4 border-black w-full"
            style={{ maxWidth: CANVAS_SIZE, alignSelf: 'center' }}
          />

          <p className="text-[10px] font-mono text-center text-gray-500 uppercase">
            {permissionGranted ? 'Tilt phone to move • ' : ''}Arrow keys also work
          </p>

          {won && (
            <div className="border-4 border-black bg-[#00FF00] p-3 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="font-black text-lg uppercase">Level {levelIdx + 1} Clear! ✅</p>
              <p className="font-mono text-xs">{levelTime}s</p>
              <button
                onClick={nextLevel}
                className="mt-2 bg-black text-white font-black text-sm uppercase px-4 py-2 border-2 border-black"
              >
                {levelIdx + 1 < LEVELS.length ? 'NEXT LEVEL →' : 'FINISH 🏆'}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="border-4 border-black bg-[#FFD93D] p-4 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <p className="font-black text-2xl uppercase">YOU WIN! 🏆</p>
          <p className="font-mono text-sm">All {LEVELS.length} levels in {totalTimeRef.current}s</p>
          <button
            onClick={restart}
            className="mt-3 bg-black text-white font-black text-sm uppercase px-4 py-2"
          >
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
