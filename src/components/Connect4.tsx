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
  const [hoverCell, setHoverCell] = useState<{ r: number; c: number } | null>(null);
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

  // Responsive canvas sizing — fires on mount and when game starts (wrapperRef becomes visible)
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
    hover: { r: number; c: number } | null,
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
    const r = cell * 0.38;

    // Board background
    ctx.fillStyle = '#1D4ED8';
    ctx.beginPath();
    ctx.roundRect(0, pad, cw, ch - pad, 12);
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Cells
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const cx = pad + col * cell + cell / 2;
        const cy = pad + row * cell + cell / 2 + pad;

        const isWin = wCells.some(([wr, wc]) => wr === row && wc === col);
        const isHover = hover?.r === row && hover?.c === col;
        const cellVal = b[row][col];
        const isEmpty = cellVal === null;

        // Shadow
        ctx.beginPath();
        ctx.arc(cx + 2, cy + 2, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fill();

        // Main circle
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        if (cellVal === 'Player') {
          ctx.fillStyle = isWin ? '#FF2222' : '#FF6B6B';
        } else if (cellVal === 'AI') {
          ctx.fillStyle = isWin ? '#FFB800' : '#FFD93D';
        } else if (isHover && playerTurn && !win) {
          // Preview player piece on hover
          ctx.fillStyle = 'rgba(255,107,107,0.55)';
        } else {
          ctx.fillStyle = '#E8EAF0';
        }
        ctx.fill();
        ctx.strokeStyle = isHover && isEmpty && playerTurn && !win ? '#FF6B6B' : '#000';
        ctx.lineWidth = isHover && isEmpty && playerTurn && !win ? 3 : 2;
        ctx.stroke();

        // Shine on filled coins
        if (cellVal) {
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

        // Hover cursor dot on empty cell
        if (isHover && isEmpty && playerTurn && !win) {
          ctx.beginPath();
          ctx.arc(cx, cy, r * 0.25, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,107,107,0.9)';
          ctx.fill();
        }
      }
    }
  }, []);

  useEffect(() => {
    draw(board, hoverCell, winner, winningCells, isPlayerTurn, canvasSize.w, canvasSize.h);
  }, [board, hoverCell, winner, winningCells, isPlayerTurn, canvasSize, draw]);

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

  // Score a cell for AI (higher = better for `player`)
  const scoreCell = (b: Cell[][], row: number, col: number, player: Cell): number => {
    const opp = player === 'AI' ? 'Player' : 'AI';
    const dirs = [[0,1],[1,0],[1,1],[1,-1]];
    let score = 0;
    for (const [dr, dc] of dirs) {
      let mine = 1, empties = 0;
      for (let i = 1; i < 4; i++) {
        const nr = row + dr*i, nc = col + dc*i;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;
        if (b[nr][nc] === player) mine++;
        else if (b[nr][nc] === null) { empties++; break; }
        else break;
      }
      for (let i = 1; i < 4; i++) {
        const nr = row - dr*i, nc = col - dc*i;
        if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS) break;
        if (b[nr][nc] === player) mine++;
        else if (b[nr][nc] === null) { empties++; break; }
        else break;
      }
      if (mine + empties >= 4) score += mine * mine * mine;
    }
    // Center bonus
    score += (3 - Math.abs(row - 2.5)) * 2;
    score += (3 - Math.abs(col - 3)) * 2;
    return score;
  };

  const handleGameOver = useCallback((winType: string, cells: [number, number][]) => {
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

  // Direct cell placement — no gravity
  const makeMove = useCallback((row: number, col: number) => {
    if (!isPlayerTurn || winner) return;
    const b = boardRef.current;
    if (b[row][col] !== null) return; // already occupied

    const next = b.map(r => [...r]) as Cell[][];
    next[row][col] = 'Player';
    setBoard(next);
    setPlayerMoves(p => p + 1);

    const res = checkWin(next);
    if (res) {
      handleGameOver(res.winner as string, res.cells);
    } else {
      setIsPlayerTurn(false);
      setTimeout(() => makeAIMove(next), 400);
    }
  }, [isPlayerTurn, winner, handleGameOver]);

  const makeAIMove = useCallback((b: Cell[][]) => {
    const emptyCells: [number, number][] = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        if (b[r][c] === null) emptyCells.push([r, c]);

    if (emptyCells.length === 0) return;

    // 1. Win immediately
    for (const [r, c] of emptyCells) {
      const t = b.map(row => [...row]) as Cell[][];
      t[r][c] = 'AI';
      if (checkWin(t)?.winner === 'AI') { commitAI(r, c, b); return; }
    }
    // 2. Block player's winning move
    for (const [r, c] of emptyCells) {
      const t = b.map(row => [...row]) as Cell[][];
      t[r][c] = 'Player';
      if (checkWin(t)?.winner === 'Player') { commitAI(r, c, b); return; }
    }
    // 3. Score all empty cells — pick best
    let best = -Infinity, bestR = -1, bestC = -1;
    for (const [r, c] of emptyCells) {
      const s = scoreCell(b, r, c, 'AI') + scoreCell(b, r, c, 'Player') * 0.8;
      if (s > best) { best = s; bestR = r; bestC = c; }
    }
    commitAI(bestR, bestC, b);
  }, [handleGameOver]);

  const commitAI = useCallback((row: number, col: number, b: Cell[][]) => {
    const next = b.map(r => [...r]) as Cell[][];
    next[row][col] = 'AI';
    setBoard(next);
    const res = checkWin(next);
    if (res) handleGameOver(res.winner as string, res.cells);
    else setIsPlayerTurn(true);
  }, [handleGameOver]);

  // ── Canvas interaction — pixel-perfect cell detection ────────────────────
  const getCellFromEvent = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { r: -1, c: -1 };
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e) { clientX = e.touches[0].clientX; clientY = e.touches[0].clientY; }
    else { clientX = (e as React.MouseEvent).clientX; clientY = (e as React.MouseEvent).clientY; }
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    // pad scales proportionally to CSS pixels
    const padCss = 12 * (rect.width / canvas.width);
    const cellW = (rect.width - padCss * 2) / COLS;
    // cells are square — same size in both directions
    const c = Math.floor((x - padCss) / cellW);
    const r = Math.floor((y - padCss * 2) / cellW); // board starts at 2*pad from top
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return { r: -1, c: -1 };
    return { r, c };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameStarted || !isPlayerTurn || winner) return;
    const { r, c } = getCellFromEvent(e);
    if (r >= 0 && c >= 0) makeMove(r, c);
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { r, c } = getCellFromEvent(e);
    setHoverCell(r >= 0 && c >= 0 ? { r, c } : null);
  };

  const handleCanvasTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!gameStarted || !isPlayerTurn || winner) return;
    const { r, c } = getCellFromEvent(e);
    if (r >= 0 && c >= 0) makeMove(r, c);
  };

  // ── Start / Restart ──────────────────────────────────────────────────────
  const handleStart = () => {
    saveUsername(tempName);
    setUsernameState(tempName);
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningCells([]);
    setHoverCell(null);
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
    setHoverCell(null);
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
              style={{ width: '100%', cursor: winner || !isPlayerTurn ? 'default' : 'crosshair', display: 'block', borderRadius: 8, border: '3px solid black' }}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMove}
              onMouseLeave={() => setHoverCell(null)}
              onTouchStart={handleCanvasTouch}
            />
            <p className="text-center text-[10px] font-bold text-black/50 uppercase tracking-widest mt-1">
              {winner
                ? (winner === 'Player' ? '🎉 You won!' : winner === 'AI' ? '🤖 AI wins!' : '🤝 Draw!')
                : isPlayerTurn
                  ? 'Click any empty cell to place your piece'
                  : 'AI thinking…'}
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
                <span>AI: <b>BoredBot v1.2</b></span>
              </div>
              <div className="flex justify-between pt-1 border-t border-black/10 text-[10px]">
                <span>Moves made:</span>
                <span className="font-black">{playerMoves}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Status:</span>
                <span className={`font-black ${winner ? 'text-[#FF6B6B]' : isPlayerTurn ? 'text-green-600' : 'text-yellow-600'}`}>
                  {winner ? (winner === 'Draw' ? 'DRAW' : winner.toUpperCase() + ' WINS') : isPlayerTurn ? 'YOUR TURN' : 'AI TURN'}
                </span>
              </div>
            </div>

            <div className="bg-[#F4F4F4] border-2 border-black p-3 text-[10px] text-black/60 leading-relaxed">
              <b className="text-black block mb-1">Free placement mode</b>
              Click any empty cell — no gravity. Align 4 coins horizontally, vertically, or diagonally!
            </div>

            <button
              onClick={handleRestart}
              className="flex items-center justify-center gap-1.5 bg-white border-2 border-black px-3 py-2 text-[10px] font-black uppercase hover:bg-[#FFD93D] transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <RefreshCw className="w-3 h-3" /> Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
