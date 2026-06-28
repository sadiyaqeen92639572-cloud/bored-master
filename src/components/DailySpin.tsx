'use client'
import { useState, useRef, useEffect } from 'react';
import { Sparkles, Play, Award } from 'lucide-react';

interface DailySpinProps {
  onSpinResult: (category: string) => void;
}

const SPIN_SECTORS = [
  { label: '🌸 CHILL & ZEN', color: '#FFD93D', value: 'chill' },     // Pop Yellow
  { label: '🤪 ABSURD', color: '#FF6B6B', value: 'funny' },          // Pop Coral/Red
  { label: '📈 PRODUCTIVE', color: '#00FF00', value: 'productive' },  // Pop Green
  { label: '🤝 SOCIAL', color: '#00FFFF', value: 'social' },         // Pop Cyan
  { label: '🤫 STEALTH', color: '#FFFFFF', value: 'secret' }         // Pop White
];

export function DailySpin({ onSpinResult }: DailySpinProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef(0);
  const velocityRef = useRef(0);

  // Draw the wheel
  useEffect(() => {
    drawWheel(rotationRef.current);
  }, []);

  const drawWheel = (currentRotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 8;

    ctx.clearRect(0, 0, size, size);

    // Outer neon ring shadow
    ctx.beginPath();
    ctx.arc(center, center, radius + 4, 0, 2 * Math.PI);
    ctx.strokeStyle = '#27272a'; // zinc-800
    ctx.lineWidth = 4;
    ctx.stroke();

    const sectorAngle = (2 * Math.PI) / SPIN_SECTORS.length;

    SPIN_SECTORS.forEach((sector, idx) => {
      const startAngle = idx * sectorAngle + currentRotation;
      const endAngle = startAngle + sectorAngle;

      // Draw Sector Pie
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();

      // Sector background color
      ctx.fillStyle = sector.color;
      ctx.fill();

      // Sector divider line
      ctx.strokeStyle = '#09090b'; // zinc-950
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw Text label
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + sectorAngle / 2);
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#09090b'; // Dark contrast text
      ctx.font = 'bold 11px ui-sans-serif, system-ui, sans-serif';
      
      // Rotate text nicely depending on angle
      const textX = radius - 20;
      ctx.fillText(sector.label, textX, 0);
      ctx.restore();
    });

    // Draw center core button backing
    ctx.beginPath();
    ctx.arc(center, center, 32, 0, 2 * Math.PI);
    ctx.fillStyle = '#09090b'; // zinc-950
    ctx.fill();
    ctx.strokeStyle = '#3f3f46'; // zinc-700
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw center glowing core circle
    ctx.beginPath();
    ctx.arc(center, center, 14, 0, 2 * Math.PI);
    ctx.fillStyle = isSpinning ? '#a78bfa' : '#8b5cf6';
    ctx.fill();
  };

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    // Initial velocity between 0.35 and 0.5 radians per frame
    velocityRef.current = 0.35 + Math.random() * 0.15;
    const friction = 0.985; // Natural dampening deceleration

    let animationId: number;

    const animateSpin = () => {
      rotationRef.current += velocityRef.current;
      velocityRef.current *= friction;

      drawWheel(rotationRef.current);

      if (velocityRef.current < 0.002) {
        // Stop spinning
        setIsSpinning(false);
        cancelAnimationFrame(animationId);

        // Calculate winning slice
        // The pointer is at 12 o'clock, which is -Math.PI / 2
        const normalizedRotation = (rotationRef.current % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
        const pointerAngle = (3 * Math.PI) / 2; // 12 o'clock in standard polar coordinates
        const sectorAngle = (2 * Math.PI) / SPIN_SECTORS.length;

        // Angle distance from start of rotation
        const winningAngle = (pointerAngle - normalizedRotation + 2 * Math.PI) % (2 * Math.PI);
        const winningIdx = Math.floor(winningAngle / sectorAngle);
        const winSector = SPIN_SECTORS[winningIdx];

        setWinner(winSector.label);
        onSpinResult(winSector.value);

        // Haptic or micro audio alert
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } else {
        animationId = requestAnimationFrame(animateSpin);
      }
    };

    animationId = requestAnimationFrame(animateSpin);
  };

  return (
    <div className="bg-white p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center max-w-[340px] mx-auto">
      {/* Indicator arrow */}
      <div className="relative">
        <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-6 h-6 bg-[#FF6B6B] border-4 border-black rotate-45 shadow-sm" />
        </div>
        <canvas
          ref={canvasRef}
          width={260}
          height={260}
          className="rounded-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        />
      </div>

      <div className="mt-5 w-full flex flex-col items-center">
        {!winner ? (
          <p className="text-xs text-black font-bold px-4 min-h-[32px] flex items-center justify-center">
            {isSpinning ? '🎡 The wheel is spinning... What is your destiny?' : 'Spin the anti-boredom wheel to pick a random mood!'}
          </p>
        ) : (
          <div className="min-h-[32px] flex items-center justify-center flex-col animate-bounce">
            <span className="text-[10px] text-black uppercase font-black tracking-widest">Selected Mood</span>
            <span className="text-sm font-black text-[#FF6B6B] flex items-center gap-1 uppercase">
              <Sparkles className="w-4 h-4 text-black fill-current" />
              {winner}
            </span>
          </div>
        )}

        <button
          onClick={spin}
          disabled={isSpinning}
          className={`mt-4 w-full flex items-center justify-center gap-2 font-black uppercase tracking-wider text-xs px-5 py-3 border-4 border-black transition-all cursor-pointer ${
            isSpinning
              ? 'bg-white text-black/40 border-black/30 cursor-not-allowed'
              : 'bg-[#00FF00] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isSpinning ? 'Spinning...' : 'Spin the Wheel'}</span>
        </button>
      </div>
    </div>
  );
}
