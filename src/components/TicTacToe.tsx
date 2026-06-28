'use client'
import { useState, useEffect } from 'react';
import { RefreshCw, Play, Trophy, User } from 'lucide-react';

export function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true); // Player is X, AI is O
  const [winner, setWinner] = useState<string | null>(null);
  const [scores, setScores] = useState({ player: 0, ai: 0, ties: 0 });

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // Check for winner
  const checkWinner = (tempBoard: (string | null)[]) => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (tempBoard[a] && tempBoard[a] === tempBoard[b] && tempBoard[a] === tempBoard[c]) {
        return tempBoard[a];
      }
    }
    if (tempBoard.every(cell => cell !== null)) {
      return 'Tie';
    }
    return null;
  };

  // AI Move logic
  useEffect(() => {
    if (!isXNext && !winner) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500); // Small realistic thinking delay
      return () => clearTimeout(timer);
    }
  }, [isXNext, winner]);

  const makeAIMove = () => {
    const emptyCells = board.map((val, idx) => (val === null ? idx : null)).filter(val => val !== null) as number[];
    if (emptyCells.length === 0) return;

    let targetIndex = -1;

    // 1. Can AI win immediately?
    for (const cell of emptyCells) {
      const testBoard = [...board];
      testBoard[cell] = 'O';
      if (checkWinner(testBoard) === 'O') {
        targetIndex = cell;
        break;
      }
    }

    // 2. Can AI block player from winning?
    if (targetIndex === -1) {
      for (const cell of emptyCells) {
        const testBoard = [...board];
        testBoard[cell] = 'X';
        if (checkWinner(testBoard) === 'X') {
          targetIndex = cell;
          break;
        }
      }
    }

    // 3. Take center if available
    if (targetIndex === -1 && emptyCells.includes(4)) {
      targetIndex = 4;
    }

    // 4. Fallback: random cell
    if (targetIndex === -1) {
      const randomIdx = Math.floor(Math.random() * emptyCells.length);
      targetIndex = emptyCells[randomIdx];
    }

    const nextBoard = [...board];
    nextBoard[targetIndex] = 'O';
    setBoard(nextBoard);

    const gameResult = checkWinner(nextBoard);
    if (gameResult) {
      setWinner(gameResult);
      updateScores(gameResult);
    } else {
      setIsXNext(true);
    }
  };

  const handleCellClick = (index: number) => {
    if (board[index] || !isXNext || winner) return;

    const nextBoard = [...board];
    nextBoard[index] = 'X';
    setBoard(nextBoard);

    const gameResult = checkWinner(nextBoard);
    if (gameResult) {
      setWinner(gameResult);
      updateScores(gameResult);
    } else {
      setIsXNext(false);
    }
  };

  const updateScores = (result: string) => {
    if (result === 'X') {
      setScores(prev => ({ ...prev, player: prev.player + 1 }));
    } else if (result === 'O') {
      setScores(prev => ({ ...prev, ai: prev.ai + 1 }));
    } else if (result === 'Tie') {
      setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
  };

  return (
    <div className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-full text-black flex flex-col md:flex-row gap-6 items-center">
      {/* Tic Tac Toe Grid */}
      <div className="w-[200px] h-[200px] grid grid-cols-3 gap-2 bg-black p-2 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        {board.map((cell, idx) => (
          <button
            key={idx}
            onClick={() => handleCellClick(idx)}
            disabled={cell !== null || !isXNext || !!winner}
            className={`w-full h-full flex items-center justify-center font-mono text-2xl font-black cursor-pointer transition-all duration-150 border-2 border-black select-none ${
              cell === 'X'
                ? 'bg-[#00FFFF] text-black shadow-inner'
                : cell === 'O'
                ? 'bg-[#FF6B6B] text-black shadow-inner'
                : 'bg-white text-transparent hover:bg-[#FFD93D]'
            }`}
          >
            {cell || ''}
          </button>
        ))}
      </div>

      {/* Stats and instructions */}
      <div className="flex-1 w-full text-center md:text-left flex flex-col justify-between self-stretch py-1">
        <div>
          <h3 className="text-sm font-black uppercase tracking-widest text-black">Tic-Tac-Toe vs AI</h3>
          <p className="text-xs text-black/70 font-semibold mt-1">
            Play against a smart AI in a minimalist, discreet, and 100% silent game of tic-tac-toe.
          </p>
        </div>

        {/* Score Board */}
        <div className="grid grid-cols-3 gap-2 bg-[#E9E9E9] p-2.5 border-2 border-black text-xs font-mono my-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-black font-black uppercase">Player (X)</span>
            <span className="text-sm font-black text-black">{scores.player}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-black font-black uppercase">Ties</span>
            <span className="text-sm font-black text-black">{scores.ties}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-black font-black uppercase">AI (O)</span>
            <span className="text-sm font-black text-black">{scores.ai}</span>
          </div>
        </div>

        {/* Dynamic status */}
        <div className="flex items-center justify-between gap-4 mt-1">
          <div className="text-xs">
            {winner ? (
              <span className="font-black text-black uppercase text-xs flex items-center gap-1 bg-[#FFD93D] px-2.5 py-1 border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                <Trophy className="w-3.5 h-3.5 text-black animate-bounce" />
                {winner === 'X' ? 'You won! 🎉' : winner === 'O' ? 'AI won! 🤖' : "It's a tie! 🤝"}
              </span>
            ) : (
              <span className="text-black font-bold uppercase text-xs flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-black" />
                {isXNext ? 'Your turn...' : 'AI thinking...'}
              </span>
            )}
          </div>

          <button
            onClick={resetGame}
            className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-black bg-[#00FF00] hover:bg-black hover:text-white text-black font-black uppercase transition-all text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
