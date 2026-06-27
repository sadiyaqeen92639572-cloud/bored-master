import React, { useState, useEffect, useRef } from 'react';
import { Award, RefreshCw, Zap, Play, Volume2, VolumeX } from 'lucide-react';
import { getStoredUsername, saveUsername, saveGameRecord } from '../utils/db';

interface IceCreamLickingProps {
  onGameFinished: (score: number, durationSeconds: number, summaryText: string) => void;
}

interface Drip {
  id: string;
  x: number; // percentage width 10-90
  y: number; // percentage height 30-80
  size: number;
  speed: number;
  flavor: string;
}

export function IceCreamLicking({ onGameFinished }: IceCreamLickingProps) {
  const [score, setScore] = useState(0);
  const [meltProgress, setMeltProgress] = useState(0); // 0 to 100% melted
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [username, setUsernameState] = useState(getStoredUsername());
  const [tempName, setTempName] = useState(getStoredUsername());
  const [isMuted, setIsMuted] = useState(false);

  // Dynamic shrinking scoop sizes
  const [topRadius, setTopRadius] = useState(38);
  const [bottomRadius, setBottomRadius] = useState(42);

  // Customizable drip falling speed selection
  const [dripSpeedMode, setDripSpeedMode] = useState<'slow' | 'normal' | 'fast' | 'chaos'>('normal');
  const speedMultiplierRef = useRef(1.0);

  useEffect(() => {
    switch (dripSpeedMode) {
      case 'slow': speedMultiplierRef.current = 0.5; break;
      case 'normal': speedMultiplierRef.current = 1.0; break;
      case 'fast': speedMultiplierRef.current = 1.8; break;
      case 'chaos': speedMultiplierRef.current = 2.8; break;
    }
  }, [dripSpeedMode]);

  // Tongue and licking collision tracking
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tonguePos, setTonguePos] = useState({ x: 150, y: 260 });
  const [drips, setDrips] = useState<Drip[]>([]);
  const lickCountRef = useRef(0);

  // Time tracking
  const startTimeRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Audio synthesizer for satisfying lick sounds
  const playLickSound = () => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      // Squishy, sliding sine wave
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(380, audioCtx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Start game
  const handleStartGame = () => {
    saveUsername(tempName);
    setUsernameState(tempName);
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setMeltProgress(0);
    setDrips([]);
    setTopRadius(38); // Reset top radius to pristine size
    setBottomRadius(42); // Reset bottom radius to pristine size
    lickCountRef.current = 0;
    setElapsedTime(0);
    startTimeRef.current = Date.now();

    // Spawn initial drips
    spawnDrip();

    // Set up game timer
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  // Spawn fresh drips
  const spawnDrip = () => {
    if (gameOver) return;
    const flavors = ['#FF6B6B', '#00FFFF', '#FFD93D']; // Strawberry, mint, vanilla
    const newDrip: Drip = {
      id: `drip-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      x: 30 + Math.random() * 40, // middle range
      y: 35, // starting at bottom of scoop
      size: 14 + Math.random() * 10,
      speed: 0.3 + Math.random() * 0.5,
      flavor: flavors[Math.floor(Math.random() * flavors.length)]
    };
    setDrips(prev => [...prev, newDrip]);
  };

  // Game loop for melt tracking and dripping physics
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let lastTime = performance.now();
    let dripTimer = 0;

    const updatePhysics = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // Slowly increase global melt progress
      setMeltProgress(prev => {
        const next = prev + delta * 2.2; // melts fully in about 45s
        if (next >= 100) {
          handleGameOver(true);
          return 100;
        }
        return next;
      });

      // Move drips downward
      setDrips(prevDrips => {
        return prevDrips
          .map(drip => ({
            ...drip,
            y: drip.y + drip.speed * speedMultiplierRef.current * delta * 50,
            size: drip.size + delta * 0.4 // slowly swells as it slides
          }))
          // Remove if slips below cone
          .filter(drip => drip.y < 85);
      });

      // Periodically spawn new drips
      dripTimer += delta;
      if (dripTimer > 1.8) {
        spawnDrip();
        dripTimer = 0;
      }

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted, gameOver]);

  // Track mouse and map to tongue movement
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!gameStarted || gameOver || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTonguePos({ x, y });

    // Collision detection with drips (lick them up!)
    setDrips(prevDrips => {
      let hitAny = false;
      const remainingDrips = prevDrips.filter(drip => {
        // Convert percentage coordinates of drip to absolute container pixels
        const dripX = (drip.x / 100) * rect.width;
        const dripY = (drip.y / 100) * rect.height;

        const dist = Math.hypot(x - dripX, y - dripY);
        const touchRadius = drip.size + 15; // padding for lick radius

        if (dist < touchRadius) {
          hitAny = true;
          setScore(prev => prev + Math.round(drip.size));
          lickCountRef.current += 1;
          // Gradually shrink scoop sizes slightly upon licking drops
          setTopRadius(r => Math.max(5, r - 0.4));
          setBottomRadius(r => Math.max(6, r - 0.3));
          return false; // remove drip (licked!)
        }
        return true;
      });

      if (hitAny) {
        playLickSound();
      }
      return remainingDrips;
    });

    // Also allow licking the main scoops directly for smaller score increments
    // Scoop centers: top is (midX, 110), bottom is (midX, 160).
    const containerWidth = rect.width;
    const midX = containerWidth / 2;
    const distToTopScoop = Math.hypot(x - midX, y - 110);
    const distToBottomScoop = Math.hypot(x - midX, y - 160);

    if (distToTopScoop < topRadius + 15 || distToBottomScoop < bottomRadius + 15) {
      if (Math.random() < 0.12) { // rate limit scoop licking
        setScore(prev => prev + 3);
        lickCountRef.current += 1;
        playLickSound();
        // Slightly delay melting when active licking scoop
        setMeltProgress(prev => Math.max(0, prev - 0.8));

        // Directly shrink the scoop being licked!
        if (distToTopScoop < topRadius + 15) {
          setTopRadius(r => Math.max(3, r - 1.2));
        } else {
          setBottomRadius(r => Math.max(4, r - 1.0));
        }
      }
    }
  };

  const handleGameOver = (meltedOut: boolean) => {
    setGameOver(true);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const duration = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 15;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const finalScore = score;
    const totalLicks = lickCountRef.current;
    const shrinkPercentage = Math.round(((38 - topRadius) + (42 - bottomRadius)) / (38 + 42) * 100);
    
    let humorousText = `I spent ${timeString} performing ASMR sensory therapy, licking and shrinking a virtual ice cream on boredmaster.com! I successfully ate ${shrinkPercentage}% of the scoop volumes, scoring ${finalScore} points with ${totalLicks} precise licks in ${dripSpeedMode.toUpperCase()} mode!`;

    // Save game record to local DB
    saveGameRecord('act-icecream', username, finalScore, duration);

    setTimeout(() => {
      onGameFinished(finalScore, duration, humorousText);
    }, 1500);
  };

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-full text-black flex flex-col items-center">
      
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-[#FF6B6B] animate-pulse" />
        <h3 className="text-sm font-black uppercase tracking-widest text-black">Satisfying Ice Cream Lick</h3>
      </div>

      <p className="text-xs text-black/70 font-semibold max-w-md text-center mb-4">
        Keep the ice cream from melting by licking the flowing drips! Move your mouse (the tongue 👅) across the scoops and drips to clear them with satisfying sounds.
      </p>

      {!gameStarted ? (
        <div className="w-full max-w-[320px] bg-[#E9E9E9] border-4 border-black p-5 flex flex-col gap-4 text-center">
          <div className="text-4xl">🍦👅</div>
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

          {/* Drip falling speed control */}
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-black uppercase text-black/60">Drip Falling Speed</span>
            <div className="grid grid-cols-4 gap-1">
              {(['slow', 'normal', 'fast', 'chaos'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setDripSpeedMode(mode)}
                  className={`border-2 border-black py-1 px-0.5 text-[9px] font-black uppercase text-center transition-all cursor-pointer ${
                    dripSpeedMode === mode
                      ? 'bg-[#FF6B6B] text-white shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                      : 'bg-white text-black hover:bg-neutral-100'
                  }`}
                >
                  {mode === 'slow' ? '🐌 Slow' : mode === 'normal' ? '🍦 Normal' : mode === 'fast' ? '⚡ Fast' : '🔥 Chaos'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartGame}
            className="w-full bg-[#FFD93D] text-black border-2 border-black font-black uppercase text-xs py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Start Licking Game</span>
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          
          {/* Top Panel stats */}
          <div className="w-full max-w-[320px] flex items-center justify-between mb-3 text-xs font-black uppercase font-mono">
            <span className="flex items-center gap-1">
              Score: <b className="bg-[#00FF00] px-1.5 py-0.5 border border-black">{score}</b>
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

          {/* Satisfying Melting Progress Bar */}
          <div className="w-full max-w-[320px] h-4 border-2 border-black bg-[#E9E9E9] mb-3 relative overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-100 ease-linear"
              style={{ width: `${meltProgress}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black uppercase tracking-wider text-black mix-blend-difference">
              Melting Progress: {Math.round(meltProgress)}%
            </span>
          </div>

          {/* Real-time Game Speed Modifier Panel */}
          <div className="w-full max-w-[320px] flex items-center justify-between gap-1 mb-4 bg-[#E9E9E9]/40 border-2 border-black p-1.5 font-mono text-[9px] font-black uppercase text-black">
            <span>Drip Speed:</span>
            <div className="flex gap-1">
              {(['slow', 'normal', 'fast', 'chaos'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDripSpeedMode(mode)}
                  className={`border-2 px-2 py-0.5 text-[8px] font-black uppercase transition-all cursor-pointer ${
                    dripSpeedMode === mode
                      ? 'bg-[#FF6B6B] text-white border-black shadow-[1px_1px_0px_rgba(0,0,0,1)]'
                      : 'bg-white border-black/40 text-black hover:bg-neutral-100'
                  }`}
                >
                  {mode === 'slow' ? '🐌 Slow' : mode === 'normal' ? '🍦 Normal' : mode === 'fast' ? '⚡ Fast' : '🔥 Chaos'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Sensory Canvas */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="w-full max-w-[320px] h-[340px] bg-sky-100 border-4 border-black relative overflow-hidden cursor-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            {/* Sky / Cloud atmosphere */}
            <div className="absolute top-2 left-3 text-[9px] font-black text-blue-400 select-none uppercase tracking-widest opacity-40">
              ASMR SENSORY LAB
            </div>

            {/* SVG Ice Cream Graphics */}
            <svg className="w-full h-full select-none pointer-events-none">
              {/* Cone */}
              <polygon
                points="160,280 120,190 200,190"
                fill="#D2B48C"
                stroke="black"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
              {/* Waffle grid inside cone */}
              <line x1="130" y1="212" x2="190" y2="212" stroke="black" strokeWidth="1.5" strokeDasharray="2,2" />
              <line x1="140" y1="235" x2="180" y2="235" stroke="black" strokeWidth="1.5" strokeDasharray="2,2" />
              <line x1="150" y1="258" x2="170" y2="258" stroke="black" strokeWidth="1.5" strokeDasharray="2,2" />
              <line x1="160" y1="190" x2="160" y2="280" stroke="black" strokeWidth="1" opacity="0.3" />

              {/* Melting cream overflow base */}
              <path
                d="M 115,190 Q 140,205 160,195 Q 180,205 205,190"
                fill="#FFD93D"
                stroke="black"
                strokeWidth="3.5"
              />

              {/* Bottom Scoop - Vanilla / Yellow */}
              <circle cx="160" cy="160" r={bottomRadius} fill="#FFD93D" stroke="black" strokeWidth="3.5" />

              {/* Top Scoop - Mint / Cyan */}
              <circle cx="160" cy="115" r={topRadius} fill="#00FFFF" stroke="black" strokeWidth="3.5" />

              {/* Cherry on top with dynamic position sliding down */}
              {topRadius > 5 && (
                <>
                  <circle cx="160" cy={115 - topRadius - 5} r={Math.max(3, topRadius * 0.26)} fill="#FF4B4B" stroke="black" strokeWidth="3" />
                  <path
                    d={`M 160,${115 - topRadius - 5 - 10} Q 165,${115 - topRadius - 5 - 24} 175,${115 - topRadius - 5 - 27}`}
                    fill="none"
                    stroke="black"
                    strokeWidth="2.5"
                  />
                </>
              )}

              {/* Dynamic falling drips rendered as SVG circles with trails */}
              {drips.map((drip) => {
                const absoluteX = (drip.x / 100) * 320;
                const absoluteY = (drip.y / 100) * 340;
                return (
                  <g key={drip.id}>
                    {/* Drip trail */}
                    <line
                      x1={absoluteX}
                      y1={absoluteY - drip.size}
                      x2={absoluteX}
                      y2={absoluteY}
                      stroke={drip.flavor}
                      strokeWidth={drip.size * 0.7}
                      strokeLinecap="round"
                    />
                    {/* Main drip head */}
                    <circle
                      cx={absoluteX}
                      cy={absoluteY}
                      r={drip.size / 2}
                      fill={drip.flavor}
                      stroke="black"
                      strokeWidth="2.5"
                    />
                  </g>
                );
              })}

              {/* Satisfying Tongue 👅 following mouse */}
              <g transform={`translate(${tonguePos.x}, ${tonguePos.y})`}>
                {/* Tongue shape */}
                <path
                  d="M -18,-15 C -18,-35 18,-35 18,-15 C 18,10 0,22 0,22 C 0,22 -18,10 -18,-15 Z"
                  fill="#FF80A0"
                  stroke="black"
                  strokeWidth="3"
                />
                {/* Tongue center fold line */}
                <line x1="0" y1="-26" x2="0" y2="4" stroke="black" strokeWidth="2" opacity="0.6" />
                {/* Saliva shines */}
                <ellipse cx="-6" cy="-18" rx="3" ry="5" fill="white" opacity="0.7" />
              </g>
            </svg>

            {/* Touch lick prompt */}
            {drips.length === 0 && !gameOver && (
              <div className="absolute inset-x-0 bottom-6 text-center select-none pointer-events-none text-[10px] font-black uppercase text-black bg-white/80 py-1 px-3 border border-black max-w-[200px] mx-auto">
                Move Tongue over scoops to lick!
              </div>
            )}

            {/* Game Over Panel overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black/75 flex flex-col items-center justify-center text-center p-4">
                <div className="text-white text-base font-black uppercase">Ice Cream Melted! 🫠</div>
                <div className="text-[#00FF00] font-mono text-xs font-black mt-1">Licks: {lickCountRef.current}</div>
                <div className="text-zinc-300 text-[10px] mt-1.5 max-w-xs">
                  Your score card has been recorded! Preparing scorecard...
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleStartGame}
            className="mt-4 flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#00FF00] hover:bg-black hover:text-white text-black font-black uppercase transition-all text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Cone</span>
          </button>
        </div>
      )}
    </div>
  );
}
