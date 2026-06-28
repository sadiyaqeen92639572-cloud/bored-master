'use client'
import React, { useRef, useState, useEffect } from 'react';
import { Palette, Trash2, ShieldAlert, Download, Undo } from 'lucide-react';

export function DoodleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000'); // black by default
  const [brushSize, setBrushSize] = useState(4);
  const [history, setHistory] = useState<string[]>([]);

  // Initialize canvas with proper high-DPI scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = Math.min(350, window.innerHeight * 0.4);

      // Restore some settings
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;

      // Fill light background
      ctx.fillStyle = '#ffffff'; // white
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Update canvas state when stroke properties change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  // Save history state
  const saveHistoryState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory(prev => [...prev.slice(-10), canvas.toDataURL()]);
  };

  // Drawing event handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveHistoryState();
    setIsDrawing(true);

    const pos = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pos = getCoordinates(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    saveHistoryState();
    ctx.fillStyle = '#ffffff'; // white
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const undo = () => {
    if (history.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = history[history.length - 1];
    const img = new Image();
    img.src = previousState;
    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistory(prev => prev.slice(0, -1));
    };
  };

  const downloadDoodle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `boredom_os_doodle_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div ref={containerRef} className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-full">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b-4 border-black pb-3">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-black" />
          <span className="text-xs font-black uppercase tracking-widest text-black">Doodle Tools</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Colors palette */}
          <div className="flex items-center gap-1.5 bg-white p-1 border-2 border-black">
            {['#000000', '#FF6B6B', '#00FF00', '#00FFFF', '#FFD93D', '#FF00FF'].map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                  color === c ? 'scale-110 ring-2 ring-black ring-offset-2 ring-offset-white border border-black' : 'hover:scale-110 border border-black/40'
                }`}
              />
            ))}
          </div>

          {/* Brush thickness */}
          <div className="flex items-center gap-2 bg-[#E9E9E9] px-2 py-1 border-2 border-black text-black">
            <span className="text-[10px] font-black uppercase">Thin</span>
            <input
              type="range"
              min="1"
              max="15"
              value={brushSize}
              onChange={e => setBrushSize(Number(e.target.value))}
              className="w-16 accent-black h-1 bg-black/20 cursor-pointer"
            />
            <span className="text-[10px] font-black uppercase">Thick</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={undo}
            disabled={history.length === 0}
            className="flex items-center justify-center p-1.5 border-2 border-black bg-[#E9E9E9] text-black hover:bg-black hover:text-white transition-colors disabled:opacity-30"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={downloadDoodle}
            className="flex items-center justify-center p-1.5 border-2 border-black bg-[#FFD93D] text-black hover:bg-black hover:text-white transition-colors"
            title="Download Doodle"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={clearCanvas}
            className="flex items-center gap-1 bg-[#FF6B6B] text-black px-2.5 py-1.5 border-2 border-black hover:bg-black hover:text-white transition-all text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px]"
            title="Clear Canvas"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Canvas board */}
      <div className="relative overflow-hidden border-4 border-black bg-white cursor-crosshair shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="block w-full touch-none"
        />

        {/* Furtive indicator overlay */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] text-black bg-white/95 px-2 py-1 border-2 border-black font-black uppercase select-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <ShieldAlert className="w-3 h-3 text-black animate-pulse" />
          <span>Stealth Board: No server logs</span>
        </div>
      </div>
    </div>
  );
}
