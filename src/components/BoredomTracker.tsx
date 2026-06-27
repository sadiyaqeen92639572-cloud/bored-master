import { useState, useEffect } from 'react';
import { Timer, Award, CheckCircle, Zap, ShieldCheck, Flame } from 'lucide-react';
import { Badge, UserStats } from '../types';

interface BoredomTrackerProps {
  stats: UserStats;
  onUpdateStats: (update: Partial<UserStats>) => void;
}

const ALL_BADGES: Badge[] = [
  { id: 'badge-10s', title: '⏱️ First Aid', description: 'Stay on the site for 10 seconds.', icon: 'Zap', requirement: '10s' },
  { id: 'badge-2m', title: '🧠 Curious Explorer', description: 'Stay for 2 minutes to cure boredom.', icon: 'Award', requirement: '2m' },
  { id: 'badge-5m', title: '🤫 Stealth Master', description: 'Stay for 5 minutes and explore stealth modes.', icon: 'ShieldCheck', requirement: '5m' },
  { id: 'badge-10m', title: '👑 Supreme Survivor', description: 'Accumulate more than 10 minutes of anti-boredom time.', icon: 'CheckCircle', requirement: '10m' }
];

export function BoredomTracker({ stats, onUpdateStats }: BoredomTrackerProps) {
  const [seconds, setSeconds] = useState(0);

  // Load initial duration or keep relative
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        const nextSec = prev + 1;
        // Also update globally in parent stats
        onUpdateStats({ boredSeconds: stats.boredSeconds + 1 });
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stats.boredSeconds, onUpdateStats]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Check which badges are unlocked
  const unlockedBadges = ALL_BADGES.filter(badge => {
    const totalSec = stats.boredSeconds;
    if (badge.id === 'badge-10s' && totalSec >= 10) return true;
    if (badge.id === 'badge-2m' && totalSec >= 120) return true;
    if (badge.id === 'badge-5m' && totalSec >= 300) return true;
    if (badge.id === 'badge-10m' && totalSec >= 600) return true;
    return false;
  });

  return (
    <div className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="w-5 h-5 text-black" />
          <h3 className="text-xs font-black uppercase tracking-widest text-black">Boredom Tracker</h3>
        </div>
        <div className="flex items-center gap-1 bg-[#FFD93D] text-black border-2 border-black px-2 py-0.5 text-[11px] font-mono font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Flame className="w-3.5 h-3.5 fill-current" />
          <span>Streak: <b>{stats.streak}d</b></span>
        </div>
      </div>

      {/* Large Digital clock showing time spent cured of boredom */}
      <div className="bg-[#E9E9E9] border-4 border-black p-5 text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-[10px] text-black uppercase font-black tracking-widest block mb-1">
          Time Spent Cured of Boredom
        </span>
        <div className="text-4xl font-mono font-black text-black tracking-wider">
          {formatTime(stats.boredSeconds)}
        </div>
        <p className="text-[10px] text-black/70 font-semibold mt-2">
          Every second spent here is a step toward creative awakening.
        </p>
      </div>

      {/* Unlocked Badges Summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-black font-black uppercase tracking-widest">Your Trophies</span>
          <span className="text-[10px] text-black font-black font-mono">
            {unlockedBadges.length} / {ALL_BADGES.length} unlocked
          </span>
        </div>

        {/* Badges Grid list */}
        <div className="flex flex-col gap-2">
          {ALL_BADGES.map(badge => {
            const isUnlocked = unlockedBadges.some(b => b.id === badge.id);
            return (
              <div
                key={badge.id}
                className={`flex items-center gap-3 p-2.5 border-2 border-black transition-all ${
                  isUnlocked
                    ? 'bg-[#00FF00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                    : 'bg-white text-black/40 opacity-60'
                }`}
              >
                <div
                  className={`p-2 border-2 border-black ${
                    isUnlocked ? 'bg-white text-black' : 'bg-[#E9E9E9] text-black/30'
                  }`}
                >
                  {badge.icon === 'Zap' && <Zap className="w-4 h-4" />}
                  {badge.icon === 'Award' && <Award className="w-4 h-4" />}
                  {badge.icon === 'ShieldCheck' && <ShieldCheck className="w-4 h-4" />}
                  {badge.icon === 'CheckCircle' && <CheckCircle className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[11px] font-black uppercase truncate flex items-center gap-1.5">
                    <span>{badge.title}</span>
                    {isUnlocked && (
                      <span className="text-[9px] bg-black text-[#00FF00] px-1 py-0.2 border border-black font-mono font-black uppercase">
                        OK
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-black/80 font-semibold truncate mt-0.5">{badge.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
