import { Activity } from '../types';

export interface RecommendContext {
  activeContext: string;
  activeDuration: string;
  activeMood: string;
  favorites: string[];
  completedActivities: string[];
  mostPlayedIds: string[];
}

function getTimeSlot(): 'night' | 'morning' | 'work' | 'evening' {
  const h = new Date().getHours();
  if (h >= 22 || h < 6) return 'night';
  if (h < 9) return 'morning';
  if (h < 17) return 'work';
  return 'evening';
}

export function scoreActivity(
  activity: Activity,
  ctx: RecommendContext
): number {
  let score = 50;
  const timeSlot = getTimeSlot();

  // Filter alignment — hard boost when user has active filters
  if (ctx.activeContext !== 'all') {
    score += activity.contexts.includes(ctx.activeContext as any) ? 30 : -40;
  }
  if (ctx.activeDuration !== 'all') {
    score += activity.durations.includes(ctx.activeDuration as any) ? 20 : -30;
  }
  if (ctx.activeMood !== 'all') {
    score += activity.moods.includes(ctx.activeMood as any) ? 20 : -30;
  }

  // Favorite boost
  if (ctx.favorites.includes(activity.id)) score += 25;

  // Recently done penalty — last 5 completed
  const recentlyDone = ctx.completedActivities.slice(-5);
  if (recentlyDone.includes(activity.id)) score -= 35;

  // Popularity rank (top 3 most played get a small boost)
  const popRank = ctx.mostPlayedIds.indexOf(activity.id);
  if (popRank === 0) score += 12;
  else if (popRank === 1) score += 8;
  else if (popRank === 2) score += 4;

  // Time-of-day heuristic
  if (timeSlot === 'night') {
    if (activity.moods.includes('chill')) score += 15;
    if (activity.contexts.includes('night')) score += 10;
    if (activity.risk === 'loud') score -= 15;
  } else if (timeSlot === 'morning') {
    if (activity.moods.includes('productive')) score += 12;
  } else if (timeSlot === 'work') {
    if (activity.moods.includes('secret')) score += 10;
    if (activity.risk === 'safe') score += 8;
    if (activity.risk === 'loud') score -= 20;
  } else {
    // evening
    if (activity.moods.includes('funny')) score += 10;
    if (activity.moods.includes('social')) score += 8;
  }

  // Risk penalty when in professional/school context
  const cautiousContexts = ['work', 'class', 'school'];
  if (
    ctx.activeContext !== 'all' &&
    cautiousContexts.includes(ctx.activeContext) &&
    activity.risk === 'loud'
  ) {
    score -= 25;
  }

  // Small random tiebreaker so same score doesn't always pick same activity
  score += Math.random() * 5;

  return score;
}

export function getRecommendation(
  activities: Activity[],
  ctx: RecommendContext
): Activity | null {
  if (activities.length === 0) return null;

  const scored = activities.map(a => ({ activity: a, score: scoreActivity(a, ctx) }));
  scored.sort((a, b) => b.score - a.score);

  return scored[0].activity;
}
