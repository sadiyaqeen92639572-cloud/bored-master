import { GameRecord } from '../types';
import { submitScore } from './api';

const USERNAME_KEY = 'bored_master_username';
const RECORDS_KEY = 'bored_master_game_records';

// Generates a funny default anonymous username
export function generateDefaultUsername(): string {
  const prefixes = ['Anonym', 'BoredPro', 'DoomScroller', 'ZenMaster', 'BossWatcher', 'FidgetKing', 'LazyDay', 'DeskWarrior', 'ClassSkipper'];
  const num = Math.floor(100 + Math.random() * 900);
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${randomPrefix}${num}`;
}

// Retrieves stored username or sets/returns a default one
export function getStoredUsername(): string {
  if (typeof window === 'undefined') return generateDefaultUsername();
  let name = localStorage.getItem(USERNAME_KEY);
  if (!name) {
    name = generateDefaultUsername();
    localStorage.setItem(USERNAME_KEY, name);
  }
  return name;
}

// Save custom username
export function saveUsername(name: string): void {
  if (typeof window === 'undefined') return;
  if (name.trim()) {
    localStorage.setItem(USERNAME_KEY, name.trim());
  }
}

// Default seed records to make the platform feel alive with global competition right away
const SEED_RECORDS: GameRecord[] = [
  // Bubble Popper scores
  { id: 'seed-1', gameId: 'act-bubble-pop', username: 'BossWatcher45', score: 142, playDurationSeconds: 120, playedAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'seed-2', gameId: 'act-bubble-pop', username: 'FidgetQueen', score: 285, playDurationSeconds: 310, playedAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'seed-3', gameId: 'act-bubble-pop', username: 'DoomScroller007', score: 95, playDurationSeconds: 90, playedAt: new Date(Date.now() - 12000000).toISOString() },

  // Tic-Tac-Toe scores
  { id: 'seed-4', gameId: 'act-tictactoe-ai', username: 'AI_Slayer', score: 5, playDurationSeconds: 180, playedAt: new Date(Date.now() - 5000000).toISOString() },
  { id: 'seed-5', gameId: 'act-tictactoe-ai', username: 'TicTacNoob', score: 1, playDurationSeconds: 60, playedAt: new Date(Date.now() - 15000000).toISOString() },

  // Connect 4 scores (Connect 4 vs AI, 1 point per win, or high score as speed/moves)
  { id: 'seed-6', gameId: 'act-connect4', username: 'GravityGuru', score: 3, playDurationSeconds: 240, playedAt: new Date(Date.now() - 8000000).toISOString() },
  { id: 'seed-7', gameId: 'act-connect4', username: 'ConnectMaster', score: 7, playDurationSeconds: 450, playedAt: new Date(Date.now() - 20000000).toISOString() },

  // Ice Cream Licking scores (based on successful licks before it drops completely!)
  { id: 'seed-8', gameId: 'act-icecream', username: 'LickLegend', score: 34, playDurationSeconds: 45, playedAt: new Date(Date.now() - 2400000).toISOString() },
  { id: 'seed-9', gameId: 'act-icecream', username: 'BrainFreeze', score: 18, playDurationSeconds: 30, playedAt: new Date(Date.now() - 11000000).toISOString() },

  // Soap Carver scores (percentage of soap shaved or layers)
  { id: 'seed-10', gameId: 'act-soap-carver', username: 'CleanShave', score: 100, playDurationSeconds: 85, playedAt: new Date(Date.now() - 4000000).toISOString() },
  { id: 'seed-11', gameId: 'act-soap-carver', username: 'ASMR_Addict', score: 92, playDurationSeconds: 150, playedAt: new Date(Date.now() - 14000000).toISOString() },

  // Grass Cutter scores (percentage or count of tiles mowed)
  { id: 'seed-12', gameId: 'act-grass-cutter', username: 'LawnKing', score: 100, playDurationSeconds: 52, playedAt: new Date(Date.now() - 1000000).toISOString() },
  { id: 'seed-13', gameId: 'act-grass-cutter', username: 'YardMower', score: 85, playDurationSeconds: 40, playedAt: new Date(Date.now() - 18000000).toISOString() },
];

// Gets all game records from localStorage, merging with seed data if none exist
export function getGameRecords(): GameRecord[] {
  if (typeof window === 'undefined') return SEED_RECORDS;
  const raw = localStorage.getItem(RECORDS_KEY);
  if (!raw) {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(SEED_RECORDS));
    return SEED_RECORDS;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return SEED_RECORDS;
  }
}

// Saves a new game score and duration record
export function saveGameRecord(gameId: string, username: string, score: number, durationSeconds: number): GameRecord {
  const records = getGameRecords();
  const newRecord: GameRecord = {
    id: `rec-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    gameId,
    username: username || getStoredUsername(),
    score,
    playDurationSeconds: durationSeconds,
    playedAt: new Date().toISOString()
  };
  
  records.push(newRecord);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  submitScore(newRecord); // fire-and-forget to D1
  return newRecord;
}

export interface GamePopularityStats {
  gameId: string;
  playCount: number;
  totalPlayTimeSeconds: number;
}

// Calculate popularity stats for each game (most played, played longest)
export function getGamePopularityStats(): Record<string, GamePopularityStats> {
  const records = getGameRecords();
  const stats: Record<string, GamePopularityStats> = {};

  // Initialize for all known interactive games
  const allGameIds = [
    'act-stealth-work',
    'act-doodle-creative',
    'act-bubble-pop',
    'act-truth-dare',
    'act-tictactoe-ai',
    'act-connect4',
    'act-icecream',
    'act-soap-carver',
    'act-grass-cutter'
  ];

  allGameIds.forEach(id => {
    stats[id] = { gameId: id, playCount: 0, totalPlayTimeSeconds: 0 };
  });

  records.forEach(rec => {
    if (!stats[rec.gameId]) {
      stats[rec.gameId] = { gameId: rec.gameId, playCount: 0, totalPlayTimeSeconds: 0 };
    }
    stats[rec.gameId].playCount += 1;
    stats[rec.gameId].totalPlayTimeSeconds += rec.playDurationSeconds;
  });

  return stats;
}

// Helper to check popular game IDs sorted by playCount or playTime
export function getPopularGameIds(): { mostPlayed: string[], longestPlayed: string[] } {
  const stats = Object.values(getGamePopularityStats());
  
  const sortedByCount = [...stats].sort((a, b) => b.playCount - a.playCount).map(s => s.gameId);
  const sortedByTime = [...stats].sort((a, b) => b.totalPlayTimeSeconds - a.totalPlayTimeSeconds).map(s => s.gameId);

  return {
    mostPlayed: sortedByCount,
    longestPlayed: sortedByTime
  };
}

// Gets the high score leaderboard for a specific game
export function getGameLeaderboard(gameId: string): GameRecord[] {
  const records = getGameRecords();
  return records
    .filter(rec => rec.gameId === gameId)
    // For some games, a lower time or higher score might be better. 
    // Here we sort descending by score first, then descending by date.
    .sort((a, b) => b.score - a.score || b.playDurationSeconds - a.playDurationSeconds)
    .slice(0, 10);
}
