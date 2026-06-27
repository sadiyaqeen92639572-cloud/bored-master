import { GameRecord } from '../types';

interface RemoteScore {
  username: string;
  score: number;
  play_duration_seconds: number;
  played_at: string;
}

export async function submitScore(record: GameRecord): Promise<void> {
  try {
    await fetch('/api/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
  } catch {
    // fire-and-forget — localStorage already has it as fallback
  }
}

export async function fetchLeaderboard(gameId: string): Promise<GameRecord[]> {
  try {
    const res = await fetch(`/api/leaderboard/${gameId}`);
    if (!res.ok) throw new Error('fetch failed');
    const data: RemoteScore[] = await res.json();
    return data.map((r, i) => ({
      id: `remote-${gameId}-${i}`,
      gameId,
      username: r.username,
      score: r.score,
      playDurationSeconds: r.play_duration_seconds,
      playedAt: r.played_at,
    }));
  } catch {
    return [];
  }
}
