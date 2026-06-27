CREATE TABLE IF NOT EXISTS game_scores (
  id TEXT PRIMARY KEY,
  game_id TEXT NOT NULL,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  play_duration_seconds INTEGER NOT NULL,
  played_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_game_scores_game_id ON game_scores (game_id);
CREATE INDEX IF NOT EXISTS idx_game_scores_rank ON game_scores (game_id, score DESC);
