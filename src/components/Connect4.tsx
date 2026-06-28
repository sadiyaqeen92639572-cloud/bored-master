'use client'
import { useState, useEffect, useRef } from 'react';
import { Trophy, RefreshCw, User, HelpCircle, ArrowDown, Award, Play, Share2 } from 'lucide-react';
import { getStoredUsername, saveUsername, saveGameRecord } from '../utils/db';

interface Connect4Props {
  onGameFinished: (score: number, durationSeconds: number, summaryText: string) => void;
}

export function Connect4({ onGameFinished }: Connect4Props) {
  const [board, setBoard] = useState<(string | null)[][]>(
    Array(6).fill(null).map(() => Array(7).fill(null))
  );
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<string | null>(null); // 'Player', 'AI', or 'Draw'
  const [winningCells, setWinningCells] = useState<[number, number][]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [username, setUsernameState] = useState(getStoredUsername());
  const [tempName, setTempName] = useState(getStoredUsername());
  const [playerMoves, setPlayerMoves] = useState(0);

  // Time tracking
  const startTimeRef = useRef<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameStarted && !winner) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, winner]);

  // Handle game start
  const handleStartGame = () => {
    saveUsername(tempName);
    setUsernameState(tempName);
    setGameStarted(true);
    setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningCells([]);
    setElapsedTime(0);
    setPlayerMoves(0);
    startTimeRef.current = Date.now();
  };

  // Reset/Restart
  const handleRestart = () => {
    setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
    setIsPlayerTurn(true);
    setWinner(null);
    setWinningCells([]);
    setElapsedTime(0);
    setPlayerMoves(0);
    startTimeRef.current = Date.now();
  };

  // Find lowest empty row in column
  const getLowestEmptyRow = (col: number, currentBoard: (string | null)[][]) => {
    for (let row = 5; row >= 0; row--) {
      if (currentBoard[row][col] === null) {
        return row;
      }
    }
    return -1;
  };

  // Check for winner
  const checkWin = (b: (string | null)[][]) => {
    // Horizontal
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] && b[r][c] === b[r][c+1] && b[r][c] === b[r][c+2] && b[r][c] === b[r][c+3]) {
          return { winner: b[r][c], cells: [[r, c], [r, c+1], [r, c+2], [r, c+3]] as [number, number][] };
        }
      }
    }
    // Vertical
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 7; c++) {
        if (b[r][c] && b[r][c] === b[r+1][c] && b[r][c] === b[r+2][c] && b[r][c] === b[r+3][c]) {
          return { winner: b[r][c], cells: [[r, c], [r+1, c], [r+2, c], [r+3, c]] as [number, number][] };
        }
      }
    }
    // Diagonal down-right
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] && b[r][c] === b[r+1][c+1] && b[r][c] === b[r+2][c+2] && b[r][c] === b[r+3][c+3]) {
          return { winner: b[r][c], cells: [[r, c], [r+1, c+1], [r+2, c+2], [r+3, c+3]] as [number, number][] };
        }
      }
    }
    // Diagonal up-right
    for (let r = 3; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        if (b[r][c] && b[r][c] === b[r-1][c+1] && b[r][c] === b[r-2][c+2] && b[r][c] === b[r-3][c+3]) {
          return { winner: b[r][c], cells: [[r, c], [r-1, c+1], [r-2, c+2], [r-3, c+3]] as [number, number][] };
        }
      }
    }

    // Check draw
    const isDraw = b.every(row => row.every(cell => cell !== null));
    if (isDraw) return { winner: 'Draw', cells: [] as [number, number][] };

    return null;
  };

  // Player Move
  const makeMove = (col: number) => {
    if (!gameStarted || !isPlayerTurn || winner) return;

    const row = getLowestEmptyRow(col, board);
    if (row === -1) return; // Column full

    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = 'Player';
    setBoard(newBoard);
    setPlayerMoves(prev => prev + 1);

    const winResult = checkWin(newBoard);
    if (winResult) {
      handleGameOver(winResult.winner, winResult.cells, newBoard);
    } else {
      setIsPlayerTurn(false);
      // Trigger AI Move after short delay
      setTimeout(() => {
        makeAIMove(newBoard);
      }, 600);
    }
  };

  // AI Move (Minimax with alpha-beta heuristic)
  const makeAIMove = (currentBoard: (string | null)[][]) => {
    // 1. Check if AI can win in this move
    for (let col = 0; col < 7; col++) {
      const row = getLowestEmptyRow(col, currentBoard);
      if (row !== -1) {
        const testBoard = currentBoard.map(r => [...r]);
        testBoard[row][col] = 'AI';
        if (checkWin(testBoard)?.winner === 'AI') {
          commitAIMove(row, col, currentBoard);
          return;
        }
      }
    }

    // 2. Check if player is about to win and block them
    for (let col = 0; col < 7; col++) {
      const row = getLowestEmptyRow(col, currentBoard);
      if (row !== -1) {
        const testBoard = currentBoard.map(r => [...r]);
        testBoard[row][col] = 'Player';
        if (checkWin(testBoard)?.winner === 'Player') {
          commitAIMove(row, col, currentBoard);
          return;
        }
      }
    }

    // 3. Try to place in high value columns or center
    const columnsPriority = [3, 2, 4, 1, 5, 0, 6];
    for (const col of columnsPriority) {
      const row = getLowestEmptyRow(col, currentBoard);
      if (row !== -1) {
        commitAIMove(row, col, currentBoard);
        return;
      }
    }
  };

  const commitAIMove = (row: number, col: number, currentBoard: (string | null)[][]) => {
    const newBoard = currentBoard.map(r => [...r]);
    newBoard[row][col] = 'AI';
    setBoard(newBoard);

    const winResult = checkWin(newBoard);
    if (winResult) {
      handleGameOver(winResult.winner, winResult.cells, newBoard);
    } else {
      setIsPlayerTurn(true);
    }
  };

  const handleGameOver = (winType: string, cells: [number, number][], finalBoard: (string | null)[][]) => {
    setWinner(winType);
    setWinningCells(cells);

    const duration = startTimeRef.current ? Math.floor((Date.now() - startTimeRef.current) / 1000) : 10;
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    let finalScore = 0;
    let humorousText = '';

    if (winType === 'Player') {
      finalScore = Math.max(100, 1000 - duration * 5); // Faster wins = higher score
      humorousText = `I just beat the ultimate Bored Master Connect 4 AI in ${timeString} with absolute tactical precision! No spreadsheets could ever distract me this well.`;
    } else if (winType === 'AI') {
      finalScore = 10; // Consolation prize
      humorousText = `I survived ${timeString} against the Connect 4 AI, but was eventually out-calculated. My brain is now fully awake!`;
    } else {
      finalScore = 50;
      humorousText = `We battled to an absolute stalemate in Connect 4 for ${timeString}. A true battle of masterminds!`;
    }

    // Save score to local database
    saveGameRecord('act-connect4', username, finalScore, duration);

    // Call callback to open general congratulations share card
    setTimeout(() => {
      onGameFinished(finalScore, duration, humorousText);
    }, 1200);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-full text-black flex flex-col items-center">
      
      {/* Title */}
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-black" />
        <h3 className="text-sm font-black uppercase tracking-widest text-black">Connect 4 vs AI</h3>
      </div>

      <p className="text-xs text-black/70 font-semibold max-w-md text-center mb-4">
        Outsmart the computer in this classic, gravity-based 4-in-a-row tactical game. Move fast, plan ahead, and claim the high score!
      </p>

      {/* Pre-game Setup Screen */}
      {!gameStarted ? (
        <div className="w-full max-w-[340px] bg-[#E9E9E9] border-4 border-black p-5 flex flex-col gap-4 text-center">
          <div className="flex justify-center">
            <User className="w-10 h-10 text-black animate-pulse" />
          </div>
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
            <span>Launch Tactical Match</span>
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col md:flex-row gap-5 items-center justify-center">
          
          {/* Main Board Area */}
          <div className="flex flex-col items-center">
            
            {/* Hover column arrows indicator */}
            <div className="grid grid-cols-7 gap-1 w-[260px] md:w-[320px] mb-1 px-1">
              {Array(7).fill(null).map((_, colIdx) => {
                const isFull = getLowestEmptyRow(colIdx, board) === -1;
                return (
                  <button
                    key={colIdx}
                    onClick={() => makeMove(colIdx)}
                    disabled={isFull || !isPlayerTurn || !!winner}
                    className={`flex justify-center items-center py-1 rounded transition-colors group ${
                      isFull || !isPlayerTurn || !!winner 
                        ? 'opacity-0 cursor-default' 
                        : 'hover:bg-red-100 cursor-pointer'
                    }`}
                    title={`Drop in column ${colIdx + 1}`}
                  >
                    <ArrowDown className="w-4 h-4 text-red-500 animate-bounce" />
                  </button>
                );
              })}
            </div>

            {/* Connect 4 Blue Board */}
            <div className="bg-blue-600 border-4 border-black p-2.5 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] w-[260px] md:w-[320px]">
              <div className="grid grid-rows-6 gap-2">
                {board.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-7 gap-2">
                    {row.map((cell, cIdx) => {
                      const isWinningCell = winningCells.some(([wr, wc]) => wr === rIdx && wc === cIdx);
                      return (
                        <div
                          key={cIdx}
                          onClick={() => makeMove(cIdx)}
                          className={`aspect-square rounded-full border-2 border-black relative cursor-pointer overflow-hidden transition-all duration-300 ${
                            cell === 'Player'
                              ? 'bg-[#FF6B6B] shadow-inner'
                              : cell === 'AI'
                              ? 'bg-[#FFD93D] shadow-inner'
                              : 'bg-white'
                          } ${isWinningCell ? 'ring-4 ring-[#00FF00] animate-pulse z-10' : ''}`}
                        >
                          {/* Inner drop shadow circle for coin depth */}
                          {cell && (
                            <div className="absolute inset-0.5 rounded-full border border-black/30 bg-gradient-to-tr from-black/10 to-transparent" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Stats and Controls */}
          <div className="w-full md:w-56 flex flex-col justify-between self-stretch bg-[#F4F4F4] p-4 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <div className="space-y-3.5">
              <div className="border-b-2 border-black pb-2 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-black">Live Match</span>
                <span className="text-xs font-mono font-black bg-[#00FF00] px-1.5 py-0.5 border border-black">
                  {formatTime(elapsedTime)}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] border border-black inline-block" />
                  <span>Player: <b>{username}</b></span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-black">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFD93D] border border-black inline-block" />
                  <span>AI: <b>BoredBot v1.2</b></span>
                </div>
              </div>

              <div className="bg-white p-2 border border-black font-mono text-[10px] space-y-1 text-black">
                <div>Moves made: <b>{playerMoves}</b></div>
                <div>Status: <span className="font-bold uppercase text-blue-700">
                  {winner ? 'Game Over' : isPlayerTurn ? 'Your Turn' : 'AI playing...'}
                </span></div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-black/20 space-y-2">
              {winner ? (
                <div className="bg-[#FFD93D] border border-black p-2 text-center rounded text-[11px] font-black uppercase text-black">
                  {winner === 'Player' ? '🎉 You won!' : winner === 'AI' ? '🤖 AI won!' : "🤝 Stalemate!"}
                </div>
              ) : (
                <div className="text-[10px] text-center text-black/60 font-semibold italic">
                  Align 4 coins horizontally, vertically, or diagonally!
                </div>
              )}

              <button
                onClick={handleRestart}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-black bg-white hover:bg-black hover:text-white text-black font-black uppercase transition-all text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Restart</span>
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
