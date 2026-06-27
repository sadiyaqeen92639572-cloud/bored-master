import { useState, useEffect } from 'react';
import { Trophy, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { GameRecord } from '../types';
import { fetchLeaderboard } from '../utils/api';
import { getGameLeaderboard } from '../utils/db';

const GAMES = [
  { id: 'act-connect4',    label: '🔴 Connect 4',     unit: 'wins' },
  { id: 'act-soap-carver', label: '🧼 Soap Carver',   unit: 'pts' },
  { id: 'act-icecream',    label: '🍦 Ice Cream',      unit: 'licks' },
  { id: 'act-grass-cutter',label: '🌱 Lawn Mower',    unit: '%' },
];

function formatDuration(s: number): string {
  if (s < 60) return `${s}s`;
  return `${Math.floor(s / 60)}m${s % 60 ? (s % 60) + 's' : ''}`;
}

function getMedal(rank: number): string {
  if (rank === 0) return '🥇';
  if (rank === 1) return '🥈';
  if (rank === 2) return '🥉';
  return `#${rank + 1}`;
}

interface BoardState {
  records: GameRecord[];
  isGlobal: boolean;
  loading: boolean;
}

export function GlobalLeaderboard() {
  const [activeGame, setActiveGame] = useState(GAMES[0].id);
  const [boards, setBoards] = useState<Record<string, BoardState>>({});

  const loadBoard = async (gameId: string, force = false) => {
    if (boards[gameId] && !force) return;

    setBoards(prev => ({ ...prev, [gameId]: { records: prev[gameId]?.records ?? [], isGlobal: false, loading: true } }));

    const remote = await fetchLeaderboard(gameId);
    if (remote.length > 0) {
      setBoards(prev => ({ ...prev, [gameId]: { records: remote, isGlobal: true, loading: false } }));
    } else {
      // Fallback to localStorage
      const local = getGameLeaderboard(gameId);
      setBoards(prev => ({ ...prev, [gameId]: { records: local, isGlobal: false, loading: false } }));
    }
  };

  useEffect(() => { loadBoard(activeGame); }, [activeGame]);

  const current = boards[activeGame];
  const activeGameMeta = GAMES.find(g => g.id === activeGame)!;

  return (
    <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-black text-white px-4 py-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-[#FFD93D] fill-[#FFD93D]" />
          <span className="text-xs font-black uppercase tracking-widest">Global Leaderboard</span>
        </div>
        <div className="flex items-center gap-2">
          {current && (
            <span className={`flex items-center gap-1 text-[9px] font-black uppercase px-1.5 py-0.5 border ${current.isGlobal ? 'border-[#00FF00] text-[#00FF00]' : 'border-white/40 text-white/50'}`}>
              {current.isGlobal ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
              {current.isGlobal ? 'Live' : 'Local'}
            </span>
          )}
          <button
            onClick={() => loadBoard(activeGame, true)}
            className="text-white/70 hover:text-white transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${current?.loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Game Tabs */}
      <div className="flex border-b-4 border-black overflow-x-auto">
        {GAMES.map(g => (
          <button
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className={`px-3 py-2 text-[10px] font-black uppercase whitespace-nowrap border-r-2 border-black transition-all cursor-pointer ${
              activeGame === g.id
                ? 'bg-[#FFD93D] text-black'
                : 'bg-white text-black hover:bg-[#E9E9E9]'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="min-h-[220px]">
        {current?.loading ? (
          <div className="flex items-center justify-center h-[220px] text-xs font-black uppercase text-black/40">
            Loading…
          </div>
        ) : !current || current.records.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[220px] gap-2 text-center px-6">
            <Trophy className="w-8 h-8 text-black/20" />
            <p className="text-xs font-black uppercase text-black/40">No scores yet</p>
            <p className="text-[10px] text-black/30 font-semibold">Play {activeGameMeta.label} to claim the top spot!</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-black">
            {current.records.map((rec, i) => (
              <div
                key={rec.id}
                className={`flex items-center gap-3 px-4 py-2.5 ${i === 0 ? 'bg-[#FFD93D]' : i % 2 === 0 ? 'bg-[#F4F4F1]' : 'bg-white'}`}
              >
                <span className="text-sm font-black w-6 text-center shrink-0">{getMedal(i)}</span>
                <span className="text-xs font-black flex-1 truncate">{rec.username}</span>
                <span className="text-xs font-mono font-black text-black shrink-0">
                  {rec.score} <span className="text-[9px] font-semibold text-black/50">{activeGameMeta.unit}</span>
                </span>
                <span className="text-[9px] font-mono text-black/40 shrink-0 hidden sm:block">
                  {formatDuration(rec.playDurationSeconds)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
