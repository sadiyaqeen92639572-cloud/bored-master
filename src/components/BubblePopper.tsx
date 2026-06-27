import { useState } from 'react';
import { Volume2, VolumeX, RotateCcw, Award } from 'lucide-react';

interface BubblePopperProps {
  onPop?: () => void;
  onGameFinished?: (score: number, durationSeconds: number, summaryText: string) => void;
}

export function BubblePopper({ onPop, onGameFinished }: BubblePopperProps) {
  const [bubbles, setBubbles] = useState<boolean[]>(Array(36).fill(false)); // false = intact, true = popped
  const [isSilent, setIsSilent] = useState(false);
  const [totalPopped, setTotalPopped] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Synthesize a realistic popping sound using Web Audio API!
  const playPopSound = () => {
    if (isSilent) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Osc 1: short organic popping sine
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Fast pitch drop from 300Hz to 80Hz mimic plastic pop resonance
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      // Simple lowpass filter to remove metallic click
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } catch (err) {
      console.warn('Audio synthesis not allowed or supported yet', err);
    }
  };

  const handleBubbleClick = (index: number) => {
    if (bubbles[index]) return; // Already popped

    playPopSound();

    const nextBubbles = [...bubbles];
    nextBubbles[index] = true;
    setBubbles(nextBubbles);
    setTotalPopped(prev => prev + 1);

    if (onPop) onPop();

    // Trigger phone vibration if available
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }

    // Check complete
    const poppedCount = nextBubbles.filter(b => b).length;
    if (poppedCount === 36) {
      const duration = Math.max(3, Math.floor((Date.now() - startTime) / 1000));
      const summaryText = `I popped all 36 virtual bubble wraps in exactly ${duration} seconds of therapeutic popping on boredmaster.com! Extreme stress-relief achieved!`;
      setTimeout(() => {
        onGameFinished?.(120, duration, summaryText);
      }, 600);
    }
  };

  const resetBubbles = () => {
    setBubbles(Array(36).fill(false));
    setStartTime(Date.now());
  };

  return (
    <div className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-full text-black flex flex-col md:flex-row gap-6 items-center">
      {/* Bubble Wrap Board */}
      <div className="flex-1 w-full max-w-[280px]">
        <div className="grid grid-cols-6 gap-3 bg-[#E9E9E9] p-4 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          {bubbles.map((popped, idx) => (
            <button
              key={idx}
              onClick={() => handleBubbleClick(idx)}
              className={`w-9 h-9 md:w-10 md:h-10 rounded-full cursor-pointer transition-all duration-150 relative flex items-center justify-center outline-none ${
                popped
                  ? 'bg-white border-2 border-black/40 scale-90 shadow-inner'
                  : 'bg-[#FF00FF] border-2 border-black hover:bg-[#00FF00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95'
              }`}
            >
              {/* Inner bubble light reflection */}
              {!popped && (
                <span className="absolute top-1 left-1.5 w-2 h-1.5 bg-white/40 rounded-full blur-[0.5px]" />
              )}
              {popped && (
                <span className="w-1.5 h-1.5 rounded-full bg-black/40" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Popper Controls */}
      <div className="flex-1 w-full flex flex-col gap-4 text-center md:text-left">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-black">Fidget Bubble Popper</h3>
          <p className="text-xs text-black/70 font-semibold mt-1">
            Reusable stress-relief bubble wrap. Pop them all to calm fidgety energy.
          </p>
        </div>

        {/* Small stats banner */}
        <div className="flex items-center gap-3 bg-[#FFD93D] px-3 py-2 border-2 border-black justify-center md:justify-start shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Award className="w-4 h-4 text-black animate-pulse" />
          <span className="text-xs font-mono font-black text-black">
            Bubbles popped: <strong className="text-black underline decoration-2 decoration-[#00FF00]">{totalPopped}</strong>
          </span>
        </div>

        {/* Audio / Reset controls */}
        <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
          <button
            onClick={() => setIsSilent(!isSilent)}
            className={`flex items-center gap-1.5 px-3 py-1.5 border-2 border-black transition-all text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 cursor-pointer ${
              isSilent
                ? 'bg-[#FF6B6B] text-black'
                : 'bg-white text-black'
            }`}
          >
            {isSilent ? (
              <>
                <VolumeX className="w-4 h-4 text-black" />
                <span>Stealth Mode (Muted)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-black" />
                <span>Sound Effects Active</span>
              </>
            )}
          </button>

          <button
            onClick={resetBubbles}
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#00FF00] hover:bg-black hover:text-white text-black font-black uppercase transition-all text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate</span>
          </button>
        </div>
      </div>
    </div>
  );
}
