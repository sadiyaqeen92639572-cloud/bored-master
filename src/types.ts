export interface Activity {
  id: string;
  title: string;
  description: string;
  contexts: ('class' | 'home' | 'school' | 'work' | 'friends' | 'computer' | 'night')[];
  durations: ('30s' | '5m' | '15m' | '1h')[];
  moods: ('chill' | 'funny' | 'productive' | 'social' | 'secret')[];
  devices: ('phone' | 'computer' | 'paper' | 'offline')[];
  risk: 'safe' | 'medium' | 'loud';
  interactiveType?: 'doodle' | 'stealth' | 'bubbles' | 'truth_dare' | 'tictactoe' | 'connect4' | 'icecream' | 'soap_carver' | 'grass_cutter' | 'shake_decide' | 'tap_speed' | 'tilt_maze' | 'thumb_draw' | 'swipe_reaction';
  steps?: string[];
  externalLink?: string;
  author?: string;
  tags?: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  requirement: string;
}

export interface UserStats {
  boredSeconds: number;
  streak: number;
  lastVisit: string;
  completedActivities: string[];
  favorites: string[];
}

export interface GameRecord {
  id: string;
  gameId: string; // 'act-bubble-pop', 'act-tictactoe-ai', 'act-connect4', etc.
  username: string;
  score: number;
  playDurationSeconds: number;
  playedAt: string;
}
