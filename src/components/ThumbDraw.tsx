'use client'
import React, { useRef, useState, useEffect } from 'react';

const COLORS = [
  { label: 'Black', value: '#000000' },
  { label: 'White', value: '#FFFFFF' },
  { label: 'Red', value: '#FF6B6B' },
  { label: 'Yellow', value: '#FFD93D' },
  { label: 'Green', value: '#00FF00' },
  { label: 'Blue', value: '#1D4ED8' },
  { label: 'Purple', value: '#A855F7' },
  { label: 'Orange', value: '#F97316' },
];

const BRUSH_SIZES = [
  { label: 'S', size: 8 },
  { label: 'M', size: 16 },
  { label: 'L', size: 28 },
];

export function ThumbDraw() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(16);
  const [eraser, setEraser] = useState(false);
  const isDrawingRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  function getPos(e: React.TouchEvent | React.MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: ((e as React.MouseEvent).clientX - rect.left) * scaleX, y: ((e as React.MouseEvent).clientY - rect.top) * scaleY };
  }

  function draw(from: { x: number; y: number } | null, to: { x: number; y: number }) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = eraser ? '#FFFFFF' : color;
    ctx.beginPath();
    if (from) {
      ctx.moveTo(from.x, from.y);
    } else {
      ctx.moveTo(to.x, to.y);
    }
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }

  function handleStart(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawingRef.current = true;
    const pos = getPos(e, canvas);
    lastPosRef.current = pos;
    draw(null, pos);
  }

  function handleMove(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pos = getPos(e, canvas);
    draw(lastPosRef.current, pos);
    lastPosRef.current = pos;
  }

  function handleEnd() {
    isDrawingRef.current = false;
    lastPosRef.current = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  function downloadCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'thumb-masterpiece.png';
    link.href = canvas.toDataURL();
    link.click();
  }

  useEffect(() => {
    clearCanvas();
  }, []);

  const activeColor = eraser ? '#FFFFFF' : color;

  return (
    <div className="bg-white border-4 border-black flex flex-col select-none" style={{ userSelect: 'none' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b-2 border-black">
        <h2 className="font-black text-base uppercase">👍 THUMB DRAW</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono uppercase">Color:</span>
          <div className="w-6 h-6 border-2 border-black" style={{ background: activeColor }} />
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={520}
        className="w-full touch-none"
        style={{ background: '#fff', display: 'block', height: '260px', cursor: 'crosshair' }}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      />

      {/* Controls at bottom (thumb-reachable) */}
      <div className="border-t-4 border-black p-2 flex flex-col gap-2">
        {/* Color palette */}
        <div className="flex gap-1 justify-between">
          {COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => { setColor(c.value); setEraser(false); }}
              className="flex-1 aspect-square rounded-full border-2 border-black"
              style={{
                background: c.value,
                outline: (!eraser && color === c.value) ? '3px solid #000' : 'none',
                outlineOffset: '2px',
                minWidth: 28,
                minHeight: 28,
              }}
              title={c.label}
            />
          ))}
        </div>

        {/* Brush size + eraser + actions */}
        <div className="flex gap-2">
          {BRUSH_SIZES.map(b => (
            <button
              key={b.label}
              onClick={() => { setBrushSize(b.size); setEraser(false); }}
              className={`flex-1 border-2 border-black font-black text-xs uppercase py-2 ${!eraser && brushSize === b.size ? 'bg-[#FFD93D]' : 'bg-white'}`}
            >
              {b.label}
            </button>
          ))}
          <button
            onClick={() => setEraser(e => !e)}
            className={`flex-1 border-2 border-black font-black text-xs uppercase py-2 ${eraser ? 'bg-[#FF6B6B]' : 'bg-white'}`}
          >
            ✏️ ERASE
          </button>
        </div>

        {/* Clear + download */}
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="flex-1 border-2 border-black font-black text-xs uppercase py-2 bg-white hover:bg-gray-100"
          >
            🗑️ CLEAR
          </button>
          <button
            onClick={downloadCanvas}
            className="flex-1 border-2 border-black font-black text-xs uppercase py-2 bg-[#00FF00] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            💾 SAVE
          </button>
        </div>
      </div>
    </div>
  );
}
