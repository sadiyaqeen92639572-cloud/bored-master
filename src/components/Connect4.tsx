'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, RefreshCw, User, Play } from 'lucide-react';
import { getStoredUsername, saveUsername, saveGameRecord } from '../utils/db';

interface Connect4Props {
  onGameFinished: (score: number, durationSeconds: number, summaryText: string) => void;
}

type Cell = 'Player' | 'AI' | null;
const COLS = 7;
const ROWS = 6;

export function Connect4({ onGameFinished }: Connect4Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [board, setBoard] = useState<Cell[][]>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [hoverCol, setHoverCol] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [username, setUsernameState] = useState(getStoredUsername());
  const [tempName, setTempName] = useState(getStoredUsername());
  const [playerMoves, setPlayerMoves] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ w: 490, h: 435 });

  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const boardRef = useRef(board);
  boardRef.current = board;

  // Responsive canvas sizing — also fires when gameStarted changes (wrapperRef becomes visible)
  useEffect(() => {
    const resize = () => {
      if (!wrapperRef.current) return;
      const maxW = Math.min(wrapperRef.current.clientWidth, 560);
      const cell = Math.floor((maxW - 24) / COLS);
      setCanvasSize({ w: cell * COLS + 24, h: cell * ROWS + 24 });
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [gameStarted]);

  // ── Draw ────────────────────────────────────────────────────────────────────
  const draw = useCallback((
    b: Cell[][],
    hover: number | null,
    win: string | null,
    wCells: [number, number][],
    playerTurn: boolean,
    cw: number,
    ch: number
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pad = 12;
    const cell = Math.floor((cw - pad * 2) / COLS);
    const r = cell * 0.38; // circle radius

    // Board background
    ctx.fillStyle = '#1D4ED8';
    ctx.beginPath();
    ctx.roundRect(0, pad, cw, ch - pad, 12);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Hover drop indicator
    if (hover !== null && !win && playerTurn) {
      const hx = pad + hover * cell + cell / 2;
      ctx.beginPath();
      ctx.arc(hx, pad / 2, r * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,107,107,0.75)';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Cells
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cx = pad + col * cell + cell / 2;
        const cy = pad + row * cell + cell / 2 + pad;

        const isWin = wCells.some(([wr, wc]) => wr === row && wc === col);

        // Shadow
        ctx.beginPath();
        ctx.arc(cx + 2, cy + 2, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fill();

        // Main circle
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        const cell_val = b[row][col];
        if (cell_val === 'Player') {
          ctx.fillStyle = isWin ? '#FF2222' : '#FF6B6B';
        } else if (cell_val === 'AI') {
          ctx.fillStyle = isWin ? '#FFB800' : '#FFD93D';
        } else {
          // Hover column empty cell preview
          ctx.fillStyle = hover === col && playerTurn && !win
            ? 'rgba(255,200,200,0.4)'
            : '#E8EAF0';
        }
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Shine on filled coins
        if (cell_val) {
          ctx.beginPath();
          ctx.arc(cx - r * 0.28, cy - r * 0.28, r * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.35)';
          ctx.fill();
        }

        // Win ring
        if (isWin) {
          ctx.beginPath();
          ctx.arc(cx, cy, r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = '#00FF00';
          ctx.lineWidth = 4;
          ctx.stroke();
        }
      }
    }
  }, []);

  useEffect(() => {
    draw(board, hoverCol, winner, winningCells, isPlayerTurn, canvasSize.w, canvasSize.h);
  }, [board, hoverCol, winner, winningCells, isPlayerTurn, canvasSize, draw]);

  // Timer
  useEffect(() => {
    if (gameStarted && !winner) {
      timerRef.current = setInterval(() => setElapsedTime(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [gameStarted, winner]);

  // ── Game logic ───────────────────────────────────────────────────────────────
  const getLowestEmpty = (col: number, b: Cell[][]) => {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (b[row][col] === null) return row;
    }
    return -1;
  };

  const checkWin = (b: Cell[][]) => {
    const check4 = (cells: [number, number][]) => {
      const vals = cells.map(([r, c]) => b[r]?.[c]);
      if (vals[0] && vals.every(v => v === vals[0])) return { winner: vals[0], cells };
      return null;
    };
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const res =
          check4([[r,c],[r,c+1],[r,c+2],[r,c+3]]) ||
          check4([[r,c],[r+1,c],[r+2,c],[r+3,c]]) ||
          check4([[r,c],[r+1,c+1],[r+2,c+2],[r+3,c+3]]) ||
          check4([[r,c],[r+1,c-1],[r+2,c-2],[r+3,c-3]]);
        if (res) return res;
      }
    }
    if (b.every(row => row.every(c => c !== null))) return { winner: 'Draw', cells: [] as [number,number][] };
    return null;
  };

  const handleGameOver = useCallback((winType: string, cells: [number, number][], finalBoard: Cell[][]) => {
    setWinner(winType);
    setWinningCells(cells);
    const duration = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 10;
    const timeStr = `${Math.floor(duration/60)}m ${duration%60}s`;
    let score = 0, text = '';
    if (winType === 'Player') {
      score = Math.max(100, 1000 - duration * 5);
      text = `I just beat the Bored Master Connect 4 AI in ${timeStr}! Pure tactical genius.`;
    } else if (winType === 'AI') {
      score = 10;
      text = `The AI out-calculated me in ${timeStr}. My brain is now fully awake.`;
    } else {
      score = 50;
      text = `Absolute stalemate in ${timeStr}. A true battle of masterminds.`;
    }
    saveGameRecord('act-connect4', username, score, duration);
    setTimeout(() => onGameFinished(score, duration, text), 1200);
  }, [username, onGameFinished]);

  const makeMove = useCallback((col: number) => {
    if (!isPlayerTurn || winner) return;
    const b = boardRef.current;
    const row = getLowestEmpty(col, b);
    if (row === -1) return;

    const next = b.map(r => [...r]) as Cell[][];
    next[row][col] = 'Player';
    setBoard(next);
    setPlayerMoves(p => p + 1);

    const res = checkWin(next);
    if (res) {
      handleGameOver(res.winner as string, res.cells, next);
    } else {
      setIsPlayerTurn(false);
      setTimeout(() => makeAIMove(next), 500);
    }
  }, [isPlayerTurn, winner, handleGameOver]);

  const makeAIMove = useCallback((b: Cell[][]) => {
    // 1. Win if possible
    for (let c = 0; c < COLS; c++) {
      const row = getLowestEmpty(c, b);
      if (row !== -1) {
        const t = b.map(r => [...r]) as Cell[][];
        t[row][c] = 'AI';
        if (checkWin(t)?.winner === 'AI') { commitAI(row, c, b); return; }
      }
    }
    // 2. Block player
    for (let c = 0; c < COLS; c++) {
      const row = getLowestEmpty(c, b);
      if (row !== -1) {
        const t = b.map(r => [...r]) as Cell[][];
        t[row][c] = 'Player';
        if (checkWin(t)?.winner === 'Player') { commitAI(row, c, b); return; }
      }
    }
    // 3. Center preference
    for (const c of [3,2,4,1,5,0,6]) {
      const row = getLowestEmpty(c, b);
      if (row !== -1) { commitAI(row, c, b); return; }
    }
  }, [handleGameOver]);

  const commitAI = useCallback((row: number, col: number, b: Cell[][]) => {
    const next = b.map(r => [...r]) as Cell[][];
    next[row][col] = 'AI';
    setBoard(next);
    const res = checkWin(next);
    if (res) handleGameOver(res.winner as string, res.cells, next);
    else setIsPlayerTurn(true);
  }, [handleGameOver]);

  // ── Canvas interaction (pixel-perfect column detection) ───────────────────
  const getColFromEvent = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return -1;
    const rect = canvas.getBoundingClientRect();
    // Use rect.width directly — avoids stale canvasSize state and works regardless of DPR/scaling
    let clientX: number;
    if ('touches' in e) clientX = e.touches[0].clientX;
    else clientX = (e as React.MouseEvent).clientX;
    const x = clientX - rect.left; // position in CSS pixels within the canvas element
    const pad = 12 * (rect.width / canvas.width); // scale pad to CSS pixels
    const colW = (rect.width - pad * 2) / COLS;
    const col = Math.floor((x - pad) / colW);
    return col >= 0 && col < COLS ? col : -1;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameStarted || !isPlayerTurn || winner) return;
    const col = getColFromEvent(e);
    if (col >= 0) makeMove(col);
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const col = getColFromEvent(e);
    setHoverCol(col >= 0 ? col : null);
  };

  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!gameStarted || !isPlayerTurn || winner) return;
    const col = getColFromEvent(e);
    if (col >= 0) makeMove(col);
  };

  // ── Start / Restart ──────────────────────────────────────────────────────
  const handleStart = () => {
    saveUsername(tempName);
    setUsernameState(tempName);
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningCells([]);
    setHoverCol(null);
    setElapsedTime(0);
    setPlayerMoves(0);
    startTimeRef.current = Date.now();
    setGameStarted(true);
  };

  const handleRestart = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningCells([]);
    setHoverCol(null);
    setElapsedTime(0);
    setPlayerMoves(0);
    startTimeRef.current = Date.now();
  };

  const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

  return (
    <div className="bg-white p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <Trophy className="w-5 h-5" />
        <h3 className="text-sm font-black uppercase tracking-widest">Connect 4 vs AI</h3>
      </div>

      {!gameStarted ? (
        <div className="w-full max-w-xs bg-[#E9E9E9] border-4 border-black p-5 flex flex-col gap-4 text-center">
          <User className="w-10 h-10 mx-auto animate-pulse" />
          <div>
            <h4 className="text-sm font-black uppercase">Enter Your Code Name</h4>
            <p className="text-[10px] text-black/60 font-semibold mt-0.5">For the live leaderboard</p>
          </div>
          <input
            type="text"
            value={tempName}
            onChange={e => setTempName(e.target.value.slice(0, 15))}
            placeholder="e.g. Anonym123"
            className="w-full bg-white border-2 border-black px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#00FF00] text-center"
          />
          <button
            onClick={handleStart}
            className="w-full bg-[#FFD93D] border-2 border-black font-black uppercase text-xs py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-px hover:shadow-none transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            Launch Match
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col md:flex-row gap-4 items-start justify-center">
          {/* Canvas board */}
          <div ref={wrapperRef} className="w-full md:max-w-[520px]">
            <canvas
              ref={canvasRef}
              width={canvasSize.w}
              height={canvasSize.h}
              style={{ width: '100%', cursor: winner || !isPlayerTurn ? 'default' : 'pointer', display: 'block', borderRadius: 8, border: '3px solid black' }}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMove}
              onMouseLeave={() => setHoverCol(null)}
              onTouchStart={handleCanvasTouch}
            />
            <p className="text-center text-[10px] font-bold text-black/50 uppercase tracking-widest mt-1">
              {winner ? (winner === 'Player' ? '🎉 You won!' : winner === 'AI' ? '🤖 AI wins!' : '🤝 Draw!') : isPlayerTurn ? 'Click any column ↑' : 'AI thinking…'}
            </p>
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-48 shrink-0 flex flex-col gap-3">
            <div className="bg-[#F4F4F4] border-2 border-black p-3 space-y-2 text-xs font-semibold">
              <div className="flex justify-between border-b border-black/20 pb-1.5">
                <span className="font-black uppercase text-[10px]">Timer</span>
                <span className="font-mono font-black bg-[#00FF00] px-1.5 border border-black">{fmt(elapsedTime)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FF6B6B] border border-black inline-block shrink-0" />
                <span className="truncate">You: <b>{username}</b></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#FFD93D] border border-black inline-block shrink-0" />
                <span>AI: <b>BoredBot</b></span>
              </div>
              <div className="border-t border-black/20 pt-1.5 font-mono text-[10px] space-y-0.5">
                <div>Moves: <b>{playerMoves}</b></div>
                <div>Status: <b className="text-blue-700">{winner ? 'Game Over' : isPlayerTurn ? 'Your turn' : 'AI...'}</b></div>
              </div>
            </div>

            {winner && (
              <div className="bg-[#FFD93D] border-2 border-black p-2 text-center text-[11px] font-black uppercase">
                {winner === 'Player' ? '🎉 You won!' : winner === 'AI' ? '🤖 AI wins!' : '🤝 Draw!'}
              </div>
            )}

            <button
              onClick={handleRestart}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-black bg-white hover:bg-black hover:text-white font-black uppercase transition-all text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Restart
            </button>

            <p className="text-[10px] text-black/40 text-center font-medium italic">
              Align 4 coins to win
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
