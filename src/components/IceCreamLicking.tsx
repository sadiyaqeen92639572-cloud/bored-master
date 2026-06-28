'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Zap, Play, Volume2, VolumeX } from 'lucide-react';
import { getStoredUsername, saveUsername, saveGameRecord } from '../utils/db';

interface IceCreamLickingProps {
  onGameFinished: (score: number, durationSeconds: number, summaryText: string) => void;
}

interface Drip {
  id: number;
  x: number;   // absolute pixels in canvas
  y: number;
  size: number;
  speed: number;
  color: string;
}

const FLAVORS = ['#FF6B9D', '#5BC4F5', '#FFD93D', '#7CFC00', '#FF8C42'];
const CONE_COLOR = '#C8935A';
const SCOOP1_COLOR = '#FF6B9D'; // top
const SCOOP2_COLOR = '#5BC4F5'; // bottom

export function IceCreamLicking({ onGameFinished }: IceCreamLickingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [canvasW, setCanvasW] = useState(480);
  const canvasH = Math.round(canvasW * 1.1);

  // Responsive width
  useEffect(() => {
    const update = () => {
      if (wrapperRef.current) {
        const w = Math.min(wrapperRef.current.clientWidth, 560);
        setCanvasW(w);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [meltProgress, setMeltProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [dripSpeedMode, setDripSpeedMode] = useState<'slow'|'normal'|'fast'|'chaos'>('normal');
  const [username, setUsernameState] = useState(getStoredUsername());
  const [tempName, setTempName] = useState(getStoredUsername());

  // Mutable refs for game loop
  const dripsRef = useRef<Drip[]>([]);
  const tongueRef = useRef({ x: -999, y: -999 });
  const scoreRef = useRef(0);
  const meltRef = useRef(0);
  const lickCountRef = useRef(0);
  const dripIdRef = useRef(0);
  const speedModeRef = useRef(dripSpeedMode);
  const gameOverRef = useRef(false);
  const startTimeRef = useRef<number|null>(null);
  const rafRef = useRef<number|null>(null);
  const timerRef = useRef<NodeJS.Timeout|null>(null);
  const isMutedRef = useRef(isMuted);

  // Scoop sizes (shrink as you lick)
  const scoop1R = useRef(0); // top scoop radius
  const scoop2R = useRef(0); // bottom scoop radius

  useEffect(() => { speedModeRef.current = dripSpeedMode; }, [dripSpeedMode]);
  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  // ── Derived geometry (all relative to canvasW) ────────────────────────────
  const geo = useCallback((w: number) => {
    const h = Math.round(w * 1.1);
    const cx = w / 2;
    const baseR = w * 0.16;
    const s2y = h * 0.38; // bottom scoop center Y
    const s1y = s2y - baseR * 1.55; // top scoop center Y
    const coneTop = s2y + baseR * 0.85;
    const coneTip = { x: cx, y: h * 0.93 };
    return { cx, baseR, s1y, s2y, coneTop, coneTip, h };
  }, []);

  // ── Audio ─────────────────────────────────────────────────────────────────
  const playLick = useCallback(() => {
    if (isMutedRef.current) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start(); osc.stop(ctx.currentTime + 0.12);
    } catch {}
  }, []);

  // ── Draw ──────────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    const { cx, baseR, s1y, s2y, coneTop, coneTip } = geo(w);
    const r1 = scoop1R.current;
    const r2 = scoop2R.current;
    // cone always uses initial baseR — never shrinks
    const coneW = baseR * 1.15;

    // Sky bg
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#FFF0F5');
    grad.addColorStop(1, '#FFF9E0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // ── Draw scoops FIRST so cone covers the bottom overlap ───────────────

    // Bottom scoop (blue)
    if (r2 > 2) {
      const g2 = ctx.createRadialGradient(cx - r2*0.3, s2y - r2*0.35, r2*0.05, cx, s2y, r2);
      g2.addColorStop(0, '#C5EEFF');
      g2.addColorStop(0.6, SCOOP2_COLOR);
      g2.addColorStop(1, '#2D88A8');
      ctx.beginPath();
      ctx.arc(cx, s2y, r2, 0, Math.PI * 2);
      ctx.fillStyle = g2;
      ctx.fill();
      ctx.strokeStyle = '#1A5F7A';
      ctx.lineWidth = 2;
      ctx.stroke();
      // shine highlight
      ctx.beginPath();
      ctx.arc(cx - r2*0.3, s2y - r2*0.35, r2*0.18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fill();
    }

    // Top scoop (pink)
    if (r1 > 2) {
      const g1 = ctx.createRadialGradient(cx - r1*0.3, s1y - r1*0.35, r1*0.05, cx, s1y, r1);
      g1.addColorStop(0, '#FFCCE0');
      g1.addColorStop(0.6, SCOOP1_COLOR);
      g1.addColorStop(1, '#C2185B');
      ctx.beginPath();
      ctx.arc(cx, s1y, r1, 0, Math.PI * 2);
      ctx.fillStyle = g1;
      ctx.fill();
      ctx.strokeStyle = '#8B2252';
      ctx.lineWidth = 2;
      ctx.stroke();
      // shine highlight
      ctx.beginPath();
      ctx.arc(cx - r1*0.3, s1y - r1*0.35, r1*0.18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fill();
    }

    // Sprinkles on top scoop
    if (r1 > 10) {
      const sprinkleColors = ['#FF6B6B','#FFD93D','#00CC44','#00BFFF','#FF69B4'];
      for (let i = 0; i < 14; i++) {
        const angle = (i / 14) * Math.PI * 2;
        const dist = r1 * (0.3 + (i % 3) * 0.18);
        const sx = cx + Math.cos(angle) * dist;
        const sy = s1y + Math.sin(angle) * dist * 0.7;
        // only draw if inside the scoop
        if (Math.hypot(sx - cx, sy - s1y) < r1 * 0.9) {
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(angle + 0.5);
          ctx.fillStyle = sprinkleColors[i % sprinkleColors.length];
          ctx.beginPath();
          ctx.roundRect(-w*0.013, -w*0.004, w*0.026, w*0.008, 3);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    // ── Cone drawn ON TOP of scoops to cover the bottom overlap ───────────
    ctx.beginPath();
    ctx.moveTo(cx - coneW, coneTop);
    ctx.lineTo(coneTip.x, coneTip.y);
    ctx.lineTo(cx + coneW, coneTop);
    ctx.closePath();
    // cone gradient: light top → darker bottom
    const coneGrad = ctx.createLinearGradient(cx - coneW, coneTop, cx + coneW, coneTip.y);
    coneGrad.addColorStop(0, '#E8A870');
    coneGrad.addColorStop(0.5, CONE_COLOR);
    coneGrad.addColorStop(1, '#7A4A20');
    ctx.fillStyle = coneGrad;
    ctx.fill();
    ctx.strokeStyle = '#5C3D11';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Waffle grid on cone
    ctx.save();
    ctx.clip(); // clip waffle lines inside cone triangle
    ctx.beginPath();
    ctx.moveTo(cx - coneW, coneTop);
    ctx.lineTo(coneTip.x, coneTip.y);
    ctx.lineTo(cx + coneW, coneTop);
    ctx.closePath();
    ctx.clip();
    ctx.strokeStyle = '#A06030';
    ctx.lineWidth = 1;
    const coneH = coneTip.y - coneTop;
    for (let i = 1; i < 5; i++) {
      const t = i / 5;
      const ly = coneTop + coneH * t;
      const hw = coneW * (1 - t) + 2;
      ctx.beginPath(); ctx.moveTo(cx - hw, ly); ctx.lineTo(cx + hw, ly); ctx.stroke();
    }
    // diagonal lines
    for (let i = -3; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo(cx + i * coneW * 0.5, coneTop);
      ctx.lineTo(coneTip.x, coneTip.y);
      ctx.stroke();
    }
    ctx.restore();

    // Drips
    dripsRef.current.forEach(drip => {
      const dg = ctx.createRadialGradient(drip.x - drip.size*0.3, drip.y - drip.size*0.3, 1, drip.x, drip.y, drip.size);
      dg.addColorStop(0, drip.color + 'DD');
      dg.addColorStop(1, drip.color + '99');
      ctx.beginPath();
      ctx.arc(drip.x, drip.y, drip.size, 0, Math.PI * 2);
      ctx.fillStyle = dg;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Tongue cursor
    const tx = tongueRef.current.x;
    const ty = tongueRef.current.y;
    if (tx > 0 && !gameOverRef.current) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(tx, ty, w*0.05, w*0.035, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FF69B4';
      ctx.fill();
      ctx.strokeStyle = '#C2185B';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Center line
      ctx.beginPath();
      ctx.moveTo(tx, ty - w*0.025);
      ctx.lineTo(tx, ty + w*0.025);
      ctx.strokeStyle = '#C2185B';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    }

    // Melt bar overlay at top
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, w, w * 0.055);
    ctx.fillStyle = `hsl(${120 - meltRef.current * 1.2}, 90%, 50%)`;
    ctx.fillRect(0, 0, w * (meltRef.current / 100), w * 0.055);
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${Math.round(w*0.025)}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(`🍦 MELT: ${Math.round(meltRef.current)}%  |  SCORE: ${scoreRef.current}`, w/2, w * 0.038);
  }, [geo]);

  // ── Game loop ─────────────────────────────────────────────────────────────
  const gameLoop = useCallback(() => {
    if (gameOverRef.current) return;

    const speedMult = { slow: 0.45, normal: 1.0, fast: 1.8, chaos: 2.8 }[speedModeRef.current];

    // Melt progress
    meltRef.current += 0.035 * speedMult;
    if (meltRef.current >= 100) {
      meltRef.current = 100;
      endGame();
      return;
    }

    // Move drips
    dripsRef.current = dripsRef.current
      .map(d => ({
        ...d,
        y: d.y + d.speed * speedMult,
        size: Math.min(d.size + 0.08, 28)
      }))
      .filter(d => d.y < canvasRef.current!.height * 0.92);

    // Spawn drip (inlined — avoids stale closure on spawnDrip)
    if (Math.random() < 0.012 * speedMult) {
      const sw = canvasRef.current?.width ?? 480;
      const sg = geo(sw);
      dripsRef.current.push({
        id: dripIdRef.current++,
        x: sg.cx + (Math.random() - 0.5) * sg.baseR * 1.6,
        y: sg.s2y - sg.baseR * 0.3,
        size: sw * 0.025 + Math.random() * sw * 0.018,
        speed: (0.6 + Math.random() * 0.8) * (sw / 480),
        color: FLAVORS[Math.floor(Math.random() * FLAVORS.length)]
      });
    }

    // Tongue collision
    const { cx, s1y, s2y } = geo(canvasRef.current?.width ?? canvasW);
    const tx = tongueRef.current.x;
    const ty = tongueRef.current.y;
    const tongueR = canvasW * 0.055;

    let hit = false;
    dripsRef.current = dripsRef.current.filter(d => {
      const dist = Math.hypot(tx - d.x, ty - d.y);
      if (dist < tongueR + d.size) {
        scoreRef.current += Math.round(d.size * 2);
        setScore(scoreRef.current);
        lickCountRef.current++;
        meltRef.current = Math.max(0, meltRef.current - 1.2);
        hit = true;
        return false;
      }
      return true;
    });

    // Lick scoops directly
    if (!hit) {
      const d1 = Math.hypot(tx - cx, ty - s1y);
      const d2 = Math.hypot(tx - cx, ty - s2y);
      if (d1 < scoop1R.current + tongueR * 0.6 || d2 < scoop2R.current + tongueR * 0.6) {
        if (Math.random() < 0.08) {
          scoreRef.current += 2;
          setScore(scoreRef.current);
          lickCountRef.current++;
          meltRef.current = Math.max(0, meltRef.current - 0.5);
          if (d1 < scoop1R.current + tongueR * 0.6) scoop1R.current = Math.max(4, scoop1R.current - 0.8);
          else scoop2R.current = Math.max(6, scoop2R.current - 0.8);
          hit = true;
        }
      }
    }

    if (hit) playLick();

    draw();
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [geo, canvasW, draw, playLick]);

  const endGame = useCallback(() => {
    gameOverRef.current = true;
    setGameOver(true);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    const duration = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 15;
    const finalScore = scoreRef.current;
    const text = `I scored ${finalScore} points licking a melting ice cream for ${duration}s with ${lickCountRef.current} licks on boredmaster.com!`;
    saveGameRecord('act-icecream', username, finalScore, duration);
    setTimeout(() => onGameFinished(finalScore, duration, text), 1000);
  }, [username, onGameFinished]);

  // ── Start ─────────────────────────────────────────────────────────────────
  const handleStart = () => {
    saveUsername(tempName);
    setUsernameState(tempName);

    const w = canvasRef.current?.width ?? canvasW;
    const { baseR } = geo(w);
    scoop1R.current = baseR;
    scoop2R.current = baseR * 1.1;

    dripsRef.current = [];
    scoreRef.current = 0;
    meltRef.current = 0;
    lickCountRef.current = 0;
    gameOverRef.current = false;
    startTimeRef.current = Date.now();

    setScore(0);
    setMeltProgress(0);
    setElapsedTime(0);
    setGameOver(false);
    setGameStarted(true);

    timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    rafRef.current = requestAnimationFrame(gameLoop);
  };

  // Restart
  const handleRestart = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setGameStarted(false);
    setGameOver(false);
  };

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  // Restart game loop when gameLoop reference changes (canvasW changes)
  useEffect(() => {
    if (gameStarted && !gameOver && !gameOverRef.current) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(gameLoop);
    }
  }, [gameLoop]);

  // ── Mouse / touch tracking ────────────────────────────────────────────────
  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    }
    return {
      x: ((e as React.MouseEvent).clientX - rect.left) * scaleX,
      y: ((e as React.MouseEvent).clientY - rect.top) * scaleY
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const p = getPos(e);
    if (p) tongueRef.current = p;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const p = getPos(e);
    if (p) tongueRef.current = p;
  };

  return (
    <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5 text-[#FF6B6B] animate-pulse" />
        <h3 className="text-sm font-black uppercase tracking-widest">Ice Cream Licking ASMR</h3>
      </div>

      {!gameStarted ? (
        <div className="w-full max-w-sm bg-[#E9E9E9] border-4 border-black p-5 flex flex-col gap-4 text-center">
          <div className="text-5xl">🍦👅</div>
          <h4 className="text-sm font-black uppercase">Enter Your Code Name</h4>
          <input
            type="text"
            value={tempName}
            onChange={e => setTempName(e.target.value.slice(0, 15))}
            placeholder="e.g. LickLegend"
            className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#00FF00] text-center"
          />
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-black uppercase text-black/60">Drip Speed</span>
            <div className="grid grid-cols-4 gap-1">
              {(['slow','normal','fast','chaos'] as const).map(m => (
                <button key={m} onClick={() => setDripSpeedMode(m)}
                  className={`border-2 border-black py-1.5 text-[10px] font-black uppercase cursor-pointer transition-all ${dripSpeedMode === m ? 'bg-[#FF6B6B] text-white' : 'bg-white text-black hover:bg-neutral-100'}`}>
                  {m === 'slow' ? '🐌' : m === 'normal' ? '🍦' : m === 'fast' ? '⚡' : '🔥'}<br/>{m}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleStart}
            className="w-full bg-[#FFD93D] border-2 border-black font-black uppercase text-xs py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none transition-all cursor-pointer flex items-center justify-center gap-2">
            <Play className="w-3.5 h-3.5 fill-black" /> Start Licking
          </button>
        </div>
      ) : (
        <div ref={wrapperRef} className="w-full flex flex-col items-center gap-2">
          {/* Controls bar */}
          <div className="w-full flex items-center justify-between text-xs font-black">
            <div className="flex gap-2">
              {(['slow','normal','fast','chaos'] as const).map(m => (
                <button key={m} onClick={() => setDripSpeedMode(m)}
                  className={`border border-black px-2 py-0.5 text-[9px] font-black uppercase cursor-pointer ${dripSpeedMode === m ? 'bg-[#FF6B6B] text-white' : 'bg-white text-black'}`}>
                  {m === 'slow' ? '🐌' : m === 'normal' ? '🍦' : m === 'fast' ? '⚡' : '🔥'}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono">{elapsedTime}s</span>
              <button onClick={() => setIsMuted(v => !v)} className="p-1 border border-black bg-white">
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
              <button onClick={handleRestart} className="p-1 border border-black bg-white">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas — full width */}
          <canvas
            ref={canvasRef}
            width={canvasW}
            height={canvasH}
            style={{ width: '100%', cursor: 'none', display: 'block', border: '3px solid black', borderRadius: 8, touchAction: 'none' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { tongueRef.current = { x: -999, y: -999 }; }}
            onTouchMove={handleTouchMove}
          />

          {gameOver && (
            <div className="w-full bg-[#FFD93D] border-2 border-black p-3 text-center font-black uppercase text-sm">
              🍦 Melted! Score: {score} pts — {lickCountRef.current} licks
            </div>
          )}
          <p className="text-[10px] text-black/40 uppercase tracking-widest font-bold">
            Move mouse/finger over drips to lick them 👅
          </p>
        </div>
      )}
    </div>
  );
}
