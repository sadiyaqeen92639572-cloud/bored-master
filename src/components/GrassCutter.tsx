'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Award, RefreshCw, Sparkles, Play, ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { getStoredUsername, saveUsername, saveGameRecord } from '../utils/db';

interface GrassCutterProps {
  onGameFinished: (score: number, durationSeconds: number, summaryText: string) => void;
}

interface GrassTile {
  id: string;
  row: number;
  col: number;
  isMowed: boolean;
  height: number; // visual offset for grass length
}

export function GrassCutter({ onGameFinished }: GrassCutterProps) {
  const [grid, setGrid] = useState<GrassTile[][]>([]);
  const [progress, setProgress] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [username, setUsernameState] = useState(getStoredUsername());
  const [tempName, setTempName] = useState(getStoredUsername());
  const [lawnCompleted, setLawnCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Mower position tracking for animation
  const [mowerPos, setMowerPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Time tracking
  const startTimeRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (gameStarted && !lawnCompleted) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, lawnCompleted]);

  // Start & Initialize Game Grid
  const handleStartGame = () => {
    saveUsername(tempName);
    setUsernameState(tempName);
    setLawnCompleted(false);
    setProgress(0);
    setElapsedTime(0);
    startTimeRef.current = Date.now();

    // Generate 8x8 lawn grid
    const tempGrid: GrassTile[][] = [];
    for (let r = 0; r < 8; r++) {
      const row: GrassTile[] = [];
      for (let c = 0; c < 8; c++) {
        row.push({
          id: `grass-${r}-${c}`,
          row: r,
          col: c,
          isMowed: false,
          height: 12 + Math.floor(Math.random() * 8) // height variation
        });
      }
      tempGrid.push(row);
    }
    setGrid(tempGrid);
    setGameStarted(true);
  };

  // Sound Synthesizer for clipping lawn mower blades
  const playClipSound = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      // White noise style clip or a fast sawtooth brush
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(10, audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (e) {
      // Audio fallback
    }
  };

  // Mower action
  const handleMowCell = (r: number, c: number) => {
    if (!gameStarted || lawnCompleted) return;

    const cell = grid[r][c];
    if (!cell.isMowed) {
      const newGrid = grid.map(row =>
        row.map(tile => {
          if (tile.row === r && tile.col === c) {
            playClipSound();
            return { ...tile, isMowed: true };
          }
          return tile;
        })
      );

      setGrid(newGrid);

      // Recalculate progress percentage
      const totalTiles = 8 * 8;
      let mowedCount = 0;
      newGrid.forEach(row => {
        row.forEach(tile => {
          if (tile.isMowed) mowedCount++;
        });
      });

      const mowedPercent = Math.round((mowedCount / totalTiles) * 100);
      setProgress(mowedPercent);

      // Complete!
      if (mowedPercent >= 100) {
        handleGameOver();
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameStarted || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMowerPos({ x, y });
  };

  const handleGameOver = () => {
    setLawnCompleted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const duration = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 10;
    const finalScore = 100;

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const humorousText = `I spent ${timeString} zen mowing a lush pixel lawn in perfect rows on boredmaster.com! My inner gardener is completely satisfied.`;

    saveGameRecord('act-grass-cutter', username, finalScore, duration);

    setTimeout(() => {
      onGameFinished(finalScore, duration, humorousText);
    }, 1800);
  };

  return (
    <div className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-full text-black flex flex-col items-center">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
        <h3 className="text-sm font-black uppercase tracking-widest text-black">Satisfying Lawn Mower</h3>
      </div>

      <p className="text-xs text-black/70 font-semibold max-w-md text-center mb-4">
        Hold down your mouse click and guide the mower across the overgrown grid. Mow every single leaf of grass to achieve a perfectly clean, satisfying lawn!
      </p>

      {!gameStarted ? (
        <div className="w-full max-w-[320px] bg-[#E9E9E9] border-4 border-black p-5 flex flex-col gap-4 text-center">
          <div className="text-4xl">🌱🚜🌾</div>
          <div>
            <h4 className="text-sm font-black uppercase">Enter Your Code Name</h4>
            <p className="text-[10px] text-black/60 font-semibold mt-0.5">
              To record your score on the live leaderboards
            </p>
          </div>

          <input
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value.slice(0, 15))}
            placeholder="e.g. Anonym123"
            className="w-full bg-white border-2 border-black rounded-none px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#00FF00] text-black text-center"
          />

          <button
            onClick={handleStartGame}
            className="w-full bg-[#FFD93D] text-black border-2 border-black font-black uppercase text-xs py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Open Mowing Simulator</span>
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          
          {/* Status Indicators */}
          <div className="w-full max-w-[340px] flex items-center justify-between mb-3 text-xs font-black uppercase font-mono">
            <span className="flex items-center gap-1">
              Mowed: <b className="bg-[#00FF00] px-1.5 py-0.5 border border-black">{progress}%</b>
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 border border-black bg-white hover:bg-black hover:text-white"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] text-black/60">
              Time: {elapsedTime}s
            </span>
          </div>

          {/* Core Interactive lawn grass cutter board */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseDown={() => { isDraggingRef.current = true; }}
            onMouseUp={() => { isDraggingRef.current = false; }}
            onMouseLeave={() => { isDraggingRef.current = false; }}
            onTouchStart={() => { isDraggingRef.current = true; }}
            onTouchEnd={() => { isDraggingRef.current = false; }}
            className="w-full max-w-[340px] aspect-square bg-[#855e42] border-4 border-black relative overflow-hidden select-none p-2 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-none"
          >
            {/* Grid of grass cells */}
            <div className="absolute inset-2 grid grid-cols-8 grid-rows-8 gap-0.5">
              {grid.map((row) =>
                row.map((cell) => {
                  const isMowed = cell.isMowed;
                  return (
                    <div
                      key={cell.id}
                      onMouseEnter={() => {
                        if (isDraggingRef.current) {
                          handleMowCell(cell.row, cell.col);
                        }
                      }}
                      onMouseDown={() => handleMowCell(cell.row, cell.col)}
                      onTouchMove={(e) => {
                        const touch = e.touches[0];
                        const element = document.elementFromPoint(touch.clientX, touch.clientY);
                        if (element && element.getAttribute('data-grass-id') === cell.id) {
                          handleMowCell(cell.row, cell.col);
                        }
                      }}
                      data-grass-id={cell.id}
                      className="transition-all duration-300 relative border border-black/5 flex items-center justify-center"
                      style={{
                        backgroundColor: isMowed ? '#00FF00' : '#1E5E3A', // low-cut neon vs dark overgrown forest green
                        boxShadow: isMowed ? 'inset 1px 1px 2px rgba(0,0,0,0.1)' : 'inset 1px 1px 4px rgba(255,255,255,0.2)',
                      }}
                    >
                      {/* Overgrown high grass fibers */}
                      {!isMowed && (
                        <div
                          className="absolute bottom-1 w-2/3 bg-[#2D804E] rounded-full animate-bounce"
                          style={{
                            height: `${cell.height}px`,
                            animationDelay: `${(cell.row + cell.col) * 0.1}s`,
                            animationDuration: '1.5s',
                          }}
                        />
                      )}
                      
                      {/* Flowers/Daisies for added satisfying visuals */}
                      {!isMowed && (cell.row + cell.col) % 5 === 0 && (
                        <div className="absolute top-1 w-2 h-2 rounded-full bg-[#FFD93D] border border-white" />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Floating Lawn Mower 🚜 tracking the cursor */}
            <div
              className="absolute pointer-events-none select-none transition-transform duration-75"
              style={{
                left: `${mowerPos.x - 18}px`,
                top: `${mowerPos.y - 18}px`,
                transform: 'rotate(-5deg)',
              }}
            >
              <div className="w-10 h-10 border-2 border-black bg-orange-500 rounded-lg shadow-md flex items-center justify-center font-bold text-base relative">
                🚜
                {/* Visual wheel sparks */}
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-neutral-800 rounded-full border border-black" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-neutral-800 rounded-full border border-black" />
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-neutral-800 rounded-full border border-black" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-neutral-800 rounded-full border border-black" />
              </div>
            </div>

            {/* Grass mowed popover */}
            {lawnCompleted && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4 z-20">
                <div className="text-[#00FF00] font-black text-sm uppercase tracking-wider animate-bounce">
                  ✨ LAWN PERFECTLY CUT! ✨
                </div>
                <div className="text-white text-base font-black mt-2">Pruned & Neat! 🌸</div>
                <div className="text-zinc-300 text-[10px] font-semibold mt-1">
                  Saved score card: {progress}% grass cleared!
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleStartGame}
            className="mt-4 flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#00FF00] hover:bg-black hover:text-white text-black font-black uppercase transition-all text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Grow Fresh Grass</span>
          </button>
        </div>
      )}
    </div>
  );
}
