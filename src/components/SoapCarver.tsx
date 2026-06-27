import { useState, useEffect, useRef } from 'react';
import { Award, RefreshCw, Sparkles, Play, ShieldAlert, Volume2, VolumeX } from 'lucide-react';
import { getStoredUsername, saveUsername, saveGameRecord } from '../utils/db';

interface SoapCarverProps {
  onGameFinished: (score: number, durationSeconds: number, summaryText: string) => void;
}

// A grid cell of the soap bar
interface SoapCell {
  id: string;
  row: number;
  col: number;
  layer: number; // 3 layers of shaving: 3 (pristine), 2, 1, 0 (fully carved/cleared)
  color: string;
}

const LAYER_COLORS = ['#ECECEC', '#FF80A0', '#00FF00', '#FFD93D']; // layers 0 to 3

export function SoapCarver({ onGameFinished }: SoapCarverProps) {
  const [grid, setGrid] = useState<SoapCell[][]>([]);
  const [carvedPercent, setCarvedPercent] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [username, setUsernameState] = useState(getStoredUsername());
  const [tempName, setTempName] = useState(getStoredUsername());
  const [toyFound, setToyFound] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  // Hidden toys underneath the soap
  const TOYS = ['💎 Diamond', '🦖 Mini Dino', '🦄 Unicorn', '👾 Alien Robot', '👑 Gold Crown', '🦊 Sleeping Fox'];
  const [hiddenToy, setHiddenToy] = useState('');

  // Time tracking
  const startTimeRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (gameStarted && !toyFound) {
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
  }, [gameStarted, toyFound]);

  // Initialize Soap Bar
  const handleStartGame = () => {
    saveUsername(tempName);
    setUsernameState(tempName);
    setHiddenToy(TOYS[Math.floor(Math.random() * TOYS.length)]);
    setToyFound(null);
    setCarvedPercent(0);
    setElapsedTime(0);
    startTimeRef.current = Date.now();

    // Generate grid: 7 rows by 10 columns
    const initialGrid: SoapCell[][] = [];
    const colors = ['#FF6B6B', '#00FFFF', '#FFD93D', '#FF8B94', '#9B5DE5', '#F15BB5'];
    
    for (let r = 0; r < 6; r++) {
      const rowCells: SoapCell[] = [];
      const rowColor = colors[r % colors.length];
      for (let c = 0; c < 10; c++) {
        rowCells.push({
          id: `cell-${r}-${c}`,
          row: r,
          col: c,
          layer: 3, // starts at max thickness
          color: rowColor,
        });
      }
      initialGrid.push(rowCells);
    }

    setGrid(initialGrid);
    setGameStarted(true);
  };

  // Synthesizer click/pop sound when shaving soap
  const playCarveSound = (pitch: number) => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.7, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch (e) {
      // Audio fallback
    }
  };

  // Handle slice action
  const handleCellInteraction = (r: number, c: number) => {
    if (!gameStarted || toyFound) return;

    const currentCell = grid[r][c];
    if (currentCell.layer > 0) {
      const newGrid = grid.map(row => 
        row.map(cell => {
          if (cell.row === r && cell.col === c) {
            const nextLayer = cell.layer - 1;
            // Play a satisfying pitch based on coordinates for therapeutic feedback
            playCarveSound(180 + (r * 15) + (c * 8));
            return { ...cell, layer: nextLayer };
          }
          return cell;
        })
      );

      setGrid(newGrid);

      // Recalculate percent carved
      const totalCells = 6 * 10;
      const totalLayers = totalCells * 3;
      let layersShaved = 0;

      newGrid.forEach(row => {
        row.forEach(cell => {
          layersShaved += (3 - cell.layer);
        });
      });

      const percent = Math.round((layersShaved / totalLayers) * 100);
      setCarvedPercent(percent);

      // If soap is fully carved, reveal the toy and win!
      if (percent >= 100) {
        handleGameOver();
      }
    }
  };

  const handleGameOver = () => {
    setToyFound(hiddenToy);
    if (timerRef.current) clearInterval(timerRef.current);

    const duration = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 10;
    const finalScore = 100; // Perfect shave score

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const humorousText = `I carved a virtual ASMR rainbow soap bar for ${timeString} with 100% perfection on boredmaster.com and unearthed a secret [${hiddenToy}]! My stress has evaporated.`;

    saveGameRecord('act-soap-carver', username, finalScore, duration);

    setTimeout(() => {
      onGameFinished(finalScore, duration, humorousText);
    }, 1800);
  };

  return (
    <div className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-full text-black flex flex-col items-center">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
        <h3 className="text-sm font-black uppercase tracking-widest text-black">Rainbow Soap Carver</h3>
      </div>

      <p className="text-xs text-black/70 font-semibold max-w-md text-center mb-4">
        Hold and drag your mouse across the soap blocks to shave layers off! Reveal the hidden toy locked deep inside the core.
      </p>

      {!gameStarted ? (
        <div className="w-full max-w-[320px] bg-[#E9E9E9] border-4 border-black p-5 flex flex-col gap-4 text-center">
          <div className="text-4xl animate-bounce">🧼🔪</div>
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
            <span>Launch ASMR Carver</span>
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          
          {/* Top Panel */}
          <div className="w-full max-w-[340px] flex items-center justify-between mb-3 text-xs font-black uppercase font-mono">
            <span className="flex items-center gap-1">
              Shaved: <b className="bg-[#00FF00] px-1.5 py-0.5 border border-black">{carvedPercent}%</b>
            </span>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 border border-black bg-white hover:bg-black hover:text-white"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <span className="text-[10px] text-black/60">
              Timer: {elapsedTime}s
            </span>
          </div>

          {/* Core Interactive Sandbox */}
          <div
            onMouseDown={() => { isDraggingRef.current = true; }}
            onMouseUp={() => { isDraggingRef.current = false; }}
            onMouseLeave={() => { isDraggingRef.current = false; }}
            onTouchStart={() => { isDraggingRef.current = true; }}
            onTouchEnd={() => { isDraggingRef.current = false; }}
            className="w-full max-w-[340px] aspect-[10/7] bg-neutral-900 border-4 border-black relative overflow-hidden select-none p-4 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-crosshair"
          >
            {/* Embedded Hidden Toy in background */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl animate-pulse font-bold">{toyFound || '🎁 ?'}</span>
              <span className="text-[9px] text-white/50 font-black tracking-widest uppercase mt-2">
                {toyFound ? 'TOY UNCOVERED!' : 'CARVING CORE'}
              </span>
            </div>

            {/* Render Soap Layer Grid on top of the toy */}
            {!toyFound && (
              <div className="absolute inset-2 grid grid-cols-10 grid-rows-6 gap-0.5 bg-neutral-950/20">
                {grid.map((row) =>
                  row.map((cell) => {
                    // Decide opacity and scale depending on the active shaved layer
                    const layersLeft = cell.layer;
                    const isFullyCarved = layersLeft === 0;

                    return (
                      <div
                        key={cell.id}
                        onMouseEnter={() => {
                          if (isDraggingRef.current) {
                            handleCellInteraction(cell.row, cell.col);
                          }
                        }}
                        onMouseDown={() => handleCellInteraction(cell.row, cell.col)}
                        onTouchMove={(e) => {
                          const touch = e.touches[0];
                          const element = document.elementFromPoint(touch.clientX, touch.clientY);
                          if (element && element.getAttribute('data-cell-id') === cell.id) {
                            handleCellInteraction(cell.row, cell.col);
                          }
                        }}
                        data-cell-id={cell.id}
                        className="transition-all duration-150 relative cursor-pointer border border-black/10 flex items-center justify-center overflow-hidden"
                        style={{
                          backgroundColor: isFullyCarved ? 'transparent' : cell.color,
                          opacity: isFullyCarved ? 0 : layersLeft === 1 ? 0.35 : layersLeft === 2 ? 0.7 : 1,
                          transform: isFullyCarved ? 'scale(0)' : `scale(${0.8 + (layersLeft * 0.06)})`,
                          boxShadow: isFullyCarved ? 'none' : 'inset 1px 1px 2px rgba(255,255,255,0.4), inset -1px -1px 2px rgba(0,0,0,0.3)',
                          borderRadius: layersLeft === 3 ? '4px' : '2px',
                        }}
                      >
                        {/* Shaved curly visual textures */}
                        {!isFullyCarved && (
                          <div className="absolute w-1.5 h-1.5 rounded-full bg-white/20 top-0.5 left-0.5" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Visual Congrats Popover if toy discovered */}
            {toyFound && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4 z-20">
                <div className="text-[#00FF00] font-black text-sm uppercase tracking-wider animate-bounce">
                  ✨ TOY DISCOVERED! ✨
                </div>
                <div className="text-white text-2xl font-black mt-2">{toyFound}</div>
                <div className="text-zinc-300 text-[10px] font-semibold mt-1">
                  Saved score card: {carvedPercent}% carved soap!
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleStartGame}
            className="mt-4 flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#00FF00] hover:bg-black hover:text-white text-black font-black uppercase transition-all text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Remount Soap Bar</span>
          </button>
        </div>
      )}
    </div>
  );
}
