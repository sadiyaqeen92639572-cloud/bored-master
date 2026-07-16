'use client'
import { useState, useEffect, useMemo } from 'react';
import { Sparkles, Heart, Trophy, RefreshCw, Terminal, Search, HelpCircle, AlertCircle, Share2, Compass, Zap, HelpCircle as HelpIcon, Smile, Award, Shield } from 'lucide-react';
import { activities, contextLabels, durationLabels, moodLabels } from './data/activities';
import { getRecommendation } from './utils/recommend';
import { ActivityCard } from './components/ActivityCard';
import { BoredomTracker } from './components/BoredomTracker';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { DailySpin } from './components/DailySpin';
import { StealthMode } from './components/StealthMode';
import { Activity, UserStats } from './types';
import { getStoredUsername, saveUsername, getPopularGameIds } from './utils/db';

export default function App() {
  const [finishedGameData, setFinishedGameData] = useState<{ score: number; duration: number; text: string; gameTitle: string } | null>(null);
  const [popularIds, setPopularIds] = useState<{ mostPlayed: string[], longestPlayed: string[] }>(() => getPopularGameIds());
  const [globalUsername, setGlobalUsername] = useState(() => getStoredUsername());
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsernameInput, setNewUsernameInput] = useState(globalUsername);

  // Sync state when game ends
  const handleGameFinished = (score: number, duration: number, summaryText: string) => {
    setFinishedGameData({
      score,
      duration,
      text: summaryText,
      gameTitle: selectedActivity?.title || 'Game'
    });
    // Refresh popularity stats
    setPopularIds(getPopularGameIds());
  };

  // Query parameters parsing
  const getInitialActivity = (): Activity | null => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    const actId = params.get('activity');
    if (actId) {
      return activities.find(a => a.id === actId) || null;
    }
    return null;
  };

  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(getInitialActivity());
  const [isStealthActive, setIsStealthActive] = useState(false);

  // Auto-scroll to activity card when loaded via ?activity= URL param
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('activity')) {
      setTimeout(() => {
        document.getElementById('main-activity-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 600);
      // Share-link deep-link URLs (?activity=) are content-identical to the
      // homepage — noindex them so they don't compete with "/" in search results.
      let robotsTag = document.querySelector('meta[name="robots"]');
      if (!robotsTag) {
        robotsTag = document.createElement('meta');
        robotsTag.setAttribute('name', 'robots');
        document.head.appendChild(robotsTag);
      }
      robotsTag.setAttribute('content', 'noindex, follow');
    }
  }, []);

  // Filter States
  const [activeContext, setActiveContext] = useState<string>('all');
  const [activeDuration, setActiveDuration] = useState<string>('all');
  const [activeMood, setActiveMood] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Tab control
  const [activeTab, setActiveTab] = useState<'hub' | 'favorites' | 'stats'>('hub');

  // User Stats state
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const defaultStats: UserStats = {
      boredSeconds: 0,
      streak: 1,
      lastVisit: new Date().toDateString(),
      completedActivities: [],
      favorites: []
    };

    if (typeof window === 'undefined') return defaultStats;
    try {
      const stored = localStorage.getItem('boredom_os_stats');
      if (stored) {
        const parsed = JSON.parse(stored) as UserStats;
        // Check streak
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        let newStreak = parsed.streak || 1;
        if (parsed.lastVisit === yesterday) {
          newStreak += 1;
        } else if (parsed.lastVisit !== today) {
          newStreak = 1; // reset streak if missed a day
        }

        return {
          ...parsed,
          streak: newStreak,
          lastVisit: today
        };
      }
    } catch (e) {
      console.warn('Could not read user stats from localStorage', e);
    }
    return defaultStats;
  });

  // Save Stats to localStorage
  useEffect(() => {
    localStorage.setItem('boredom_os_stats', JSON.stringify(userStats));
  }, [userStats]);

  // Update Stats Helper
  const handleUpdateStats = (update: Partial<UserStats>) => {
    setUserStats(prev => ({
      ...prev,
      ...update
    }));
  };

  // Toggle favorite helper
  const handleToggleFavorite = (id: string) => {
    const isFav = userStats.favorites.includes(id);
    const nextFavs = isFav
      ? userStats.favorites.filter(fId => fId !== id)
      : [...userStats.favorites, id];
    handleUpdateStats({ favorites: nextFavs });
  };

  // Main filter engine logic
  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      // 1. Context Filter
      if (activeContext !== 'all' && !activity.contexts.includes(activeContext as any)) {
        return false;
      }
      // 2. Duration Filter
      if (activeDuration !== 'all' && !activity.durations.includes(activeDuration as any)) {
        return false;
      }
      // 3. Mood Filter
      if (activeMood !== 'all' && !activity.moods.includes(activeMood as any)) {
        return false;
      }
      // 4. Text Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = activity.title.toLowerCase().includes(query);
        const matchesDesc = activity.description.toLowerCase().includes(query);
        const matchesSteps = activity.steps?.some(step => step.toLowerCase().includes(query)) || false;
        if (!matchesTitle && !matchesDesc && !matchesSteps) {
          return false;
        }
      }
      return true;
    });
  }, [activeContext, activeDuration, activeMood, searchQuery]);

  // Pick a random activity from currently filtered subset
  const handleRandomize = () => {
    if (filteredActivities.length === 0) {
      // If none match filters, pick from entire database
      const randomIdx = Math.floor(Math.random() * activities.length);
      setSelectedActivity(activities[randomIdx]);
      return;
    }
    const currentId = selectedActivity?.id;
    const available = filteredActivities.filter(a => a.id !== currentId);

    // Fallback if only 1 matches
    const pool = available.length > 0 ? available : filteredActivities;
    const randomIdx = Math.floor(Math.random() * pool.length);
    setSelectedActivity(pool[randomIdx]);

    // Quick vibration on random roll
    if (navigator.vibrate) {
      navigator.vibrate(20);
    }
  };

  // Weighted scoring recommendation — picks best activity for current context
  const handleSmartPick = () => {
    const pool = filteredActivities.length > 0 ? filteredActivities : activities;
    const pick = getRecommendation(pool, {
      activeContext,
      activeDuration,
      activeMood,
      favorites: userStats.favorites,
      completedActivities: userStats.completedActivities,
      mostPlayedIds: popularIds.mostPlayed,
    });
    if (pick) {
      setSelectedActivity(pick);
      if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
      document.getElementById('main-activity-view')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Unified filter-change handler — runs selection algo on every filter button click
  const handleFilterChange = (
    type: 'context' | 'duration' | 'mood',
    value: string
  ) => {
    // Update the right state
    if (type === 'context') setActiveContext(value);
    else if (type === 'duration') setActiveDuration(value);
    else setActiveMood(value);

    // "all" reset → no auto-pick
    if (value === 'all') return;

    // Resolve current filter state + apply the new value
    const ctx      = type === 'context'  ? value : activeContext;
    const dur      = type === 'duration' ? value : activeDuration;
    const mood     = type === 'mood'     ? value : activeMood;
    const currentId = selectedActivity?.id;

    // Helper: filter pool by given constraints
    const filtered = (c: string, d: string, m: string) =>
      activities.filter(a =>
        a.id !== currentId &&
        (c === 'all' || a.contexts.includes(c as any)) &&
        (d === 'all' || a.durations.includes(d as any)) &&
        (m === 'all' || a.moods.includes(m as any))
      );

    // Fallback chain: all 3 → drop mood → drop duration → drop context → anything
    const pool =
      filtered(ctx, dur, mood).length > 0 ? filtered(ctx, dur, mood) :
      filtered(ctx, dur, 'all').length > 0 ? filtered(ctx, dur, 'all') :
      filtered(ctx, 'all', mood).length > 0 ? filtered(ctx, 'all', mood) :
      filtered(ctx, 'all', 'all').length > 0 ? filtered(ctx, 'all', 'all') :
      activities.filter(a => a.id !== currentId);

    const pick = getRecommendation(pool, {
      activeContext: ctx,
      activeDuration: dur,
      activeMood: mood,
      favorites: userStats.favorites,
      completedActivities: userStats.completedActivities,
      mostPlayedIds: popularIds.mostPlayed,
    });

    if (pick) {
      setSelectedActivity(pick);
      if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
      setTimeout(() => {
        document.getElementById('main-activity-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // Initial selection of a random activity if none preloaded from query
  useEffect(() => {
    if (!selectedActivity && activities.length > 0) {
      const randomIdx = Math.floor(Math.random() * activities.length);
      setSelectedActivity(activities[randomIdx]);
    }
  }, [selectedActivity]);

  // Spin result handler
  const handleSpinResult = (moodValue: string) => {
    // 1. Update filters to reflect won mood
    setActiveMood(moodValue);
    
    // 2. Filter list and pick a matching activity
    const matches = activities.filter(a => a.moods.includes(moodValue as any));
    if (matches.length > 0) {
      const randomIdx = Math.floor(Math.random() * matches.length);
      // Give a tiny delay for high-fidelity feel after spin animation halts
      setTimeout(() => {
        setSelectedActivity(matches[randomIdx]);
        // Scroll smoothly to the activity
        document.getElementById('main-activity-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  };

  // Loaded favorite handler
  const handleLoadFavorite = (id: string) => {
    const act = activities.find(a => a.id === id);
    if (act) {
      setSelectedActivity(act);
      setActiveTab('hub');
      document.getElementById('main-activity-view')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setActiveContext('all');
    setActiveDuration('all');
    setActiveMood('all');
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#F4F4F1] text-[#1A1A1A] font-sans antialiased pb-12 selection:bg-[#00FF00] selection:text-black border-8 border-black">
      {/* Stealth Mode absolute fullscreen overlay */}
      {isStealthActive && (
        <StealthMode onClose={() => setIsStealthActive(false)} />
      )}

      {/* Sticky Stealth Button — always visible, bottom-right */}
      {!isStealthActive && (
        <button
          onClick={() => setIsStealthActive(true)}
          title="Activate Stealth Mode (fake spreadsheet) — Press Escape to exit"
          className="fixed bottom-5 right-5 z-50 group flex items-center gap-2 bg-black/80 hover:bg-black text-white border-2 border-white/20 hover:border-[#00FF00] px-3 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-200 shadow-lg hover:shadow-[0_0_12px_rgba(0,255,0,0.3)] cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-white/60 group-hover:text-[#00FF00] transition-colors" />
          <span className="hidden sm:inline text-white/60 group-hover:text-white transition-colors">Stealth</span>
        </button>
      )}

      {/* Top Header / Retro Console Panel */}
      <header className="border-b-4 border-black bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00FF00] border-2 border-black flex items-center justify-center font-bold text-xl italic shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Terminal className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <div className="text-xl font-black uppercase tracking-tighter italic underline decoration-[#00FF00] decoration-2">
                  Bored <span className="text-black">Master</span>
                </div>
                <span className="text-[10px] font-mono bg-white text-black border-2 border-black px-1.5 py-0.2 font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  v2.0
                </span>
              </div>
              <p className="text-[10px] text-black font-semibold uppercase opacity-60 mt-0.5">
                The Smart, Fast, and Discreet Anti-Boredom Remedy
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center flex-wrap gap-1.5 bg-white p-1 border-2 border-black">
            <button
              onClick={() => setActiveTab('hub')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black uppercase transition-all cursor-pointer border-2 ${
                activeTab === 'hub'
                  ? 'bg-[#00FF00] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'border-transparent text-black hover:bg-black hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Challenges & Activities</span>
            </button>
            
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black uppercase transition-all cursor-pointer border-2 relative ${
                activeTab === 'favorites'
                  ? 'bg-[#FF6B6B] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'border-transparent text-black hover:bg-black hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5 text-black fill-current" />
              <span>Favorites</span>
              {userStats.favorites.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-[#00FF00] text-[9px] font-mono font-black w-4.5 h-4.5 border border-black flex items-center justify-center">
                  {userStats.favorites.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-black uppercase transition-all cursor-pointer border-2 ${
                activeTab === 'stats'
                  ? 'bg-[#FFD93D] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'border-transparent text-black hover:bg-black hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-black" />
              <span>Trophy Room</span>
            </button>
          </nav>

          {/* User Nickname edit badge */}
          <div className="flex items-center gap-2 border-2 border-black bg-[#E9E9E9] px-3 py-1 font-mono text-[11px] font-black">
            <Smile className="w-3.5 h-3.5 text-black" />
            {isEditingUsername ? (
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={newUsernameInput}
                  onChange={(e) => setNewUsernameInput(e.target.value.slice(0, 15))}
                  className="w-24 border border-black bg-white px-1 py-0.5 text-[10px] focus:outline-none"
                />
                <button
                  onClick={() => {
                    const finalName = newUsernameInput.trim() || 'Anonym';
                    saveUsername(finalName);
                    setGlobalUsername(finalName);
                    setNewUsernameInput(finalName);
                    setIsEditingUsername(false);
                  }}
                  className="bg-black text-white px-1.5 py-0.5 text-[9px] uppercase cursor-pointer"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <span>Player: <strong className="underline">{globalUsername}</strong></span>
                <button
                  onClick={() => {
                    setNewUsernameInput(globalUsername);
                    setIsEditingUsername(true);
                  }}
                  className="text-black/50 hover:text-black hover:underline cursor-pointer text-[9px]"
                >
                  [Edit]
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Core Container */}
      <main className="max-w-6xl mx-auto px-4 mt-6">
        
        {/* Banner Announcement / Action Hero */}
        <div className="bg-white border-4 border-black p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest">
              <Sparkles className="w-3 h-3 text-[#FFD93D] fill-[#FFD93D]" />
              1 Click = 1 Instant Idea
            </span>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-black leading-tight">
              What to Do When Bored
            </h1>
            <p className="text-xs md:text-sm text-black/80 font-medium leading-relaxed">
              Whether you are stuck in math class, sitting at your desk in front of an endless spreadsheet, or home alone at night, activate a mode tailored to your environment and let our engine instantly reignite your creativity.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={handleRandomize}
              className="w-full sm:w-auto h-auto min-h-[4.5rem] py-4 px-10 bg-[#FFD93D] text-black border-4 border-black text-xl font-black uppercase tracking-tight hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-black fill-black shrink-0" />
              <span>SURPRISE ME!</span>
            </button>
            <button
              onClick={handleSmartPick}
              className="w-full sm:w-auto h-auto min-h-[4.5rem] py-4 px-10 bg-[#00FF00] text-black border-4 border-black text-xl font-black uppercase tracking-tight hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] cursor-pointer whitespace-nowrap flex items-center justify-center gap-2"
              title="Scored pick: considers your filters, favorites, play history, and time of day"
            >
              <Zap className="w-5 h-5 text-black fill-black shrink-0" />
              <span>SMART PICK</span>
            </button>
          </div>
        </div>

        {/* Tab view switching router */}
        {activeTab === 'hub' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Filter controls panel (span 4) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Daily lucky wheel container */}
              <div className="bg-white border-4 border-black p-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <DailySpin onSpinResult={handleSpinResult} />
              </div>

              {/* Filters card */}
              <div className="bg-[#E9E9E9] border-4 border-black p-5 space-y-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center justify-between border-b-2 border-black pb-3">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-black" />
                    <span className="text-xs font-black uppercase tracking-widest text-black">Context Filters</span>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] text-black font-black uppercase hover:underline flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                </div>

                {/* 1. Context Selector */}
                <div className="space-y-2">
                  <label className="text-[10px] text-black font-black uppercase tracking-widest block">
                    1. Where are you right now?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleFilterChange('context', 'all')}
                      className={`px-2.5 py-1.5 border-2 border-black font-bold text-xs uppercase transition-all cursor-pointer ${
                        activeContext === 'all'
                           ? 'bg-[#00FF00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      🌐 All Places
                    </button>
                    {Object.entries(contextLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleFilterChange('context', key)}
                        className={`px-2.5 py-1.5 border-2 border-black font-bold text-xs uppercase transition-all cursor-pointer ${
                          activeContext === key
                            ? 'bg-[#00FF00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Duration Selector */}
                <div className="space-y-2 pt-3 border-t-2 border-black/25">
                  <label className="text-[10px] text-black font-black uppercase tracking-widest block">
                    2. Time Available
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleFilterChange('duration', 'all')}
                      className={`px-2.5 py-1.5 border-2 border-black font-bold text-xs uppercase transition-all cursor-pointer ${
                        activeDuration === 'all'
                          ? 'bg-[#00FF00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      ⏱️ Any Time
                    </button>
                    {Object.entries(durationLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleFilterChange('duration', key)}
                        className={`px-2.5 py-1.5 border-2 border-black font-bold text-xs uppercase transition-all cursor-pointer ${
                          activeDuration === key
                            ? 'bg-[#00FF00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Mood Selector */}
                <div className="space-y-2 pt-3 border-t-2 border-black/25">
                  <label className="text-[10px] text-black font-black uppercase tracking-widest block">
                    3. Desired Mood
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => handleFilterChange('mood', 'all')}
                      className={`px-2.5 py-1.5 border-2 border-black font-bold text-xs uppercase transition-all cursor-pointer ${
                        activeMood === 'all'
                          ? 'bg-[#00FF00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-white text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      🌈 All Moods
                    </button>
                    {Object.entries(moodLabels).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleFilterChange('mood', key)}
                        className={`px-2.5 py-1.5 border-2 border-black font-bold text-xs uppercase transition-all cursor-pointer ${
                          activeMood === key
                            ? 'bg-[#00FF00] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                            : 'bg-white text-black hover:bg-black hover:text-white'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Text Search input */}
                <div className="space-y-2 pt-3 border-t-2 border-black/25 relative">
                  <label className="text-[10px] text-black font-black uppercase tracking-widest block">
                    Search by keyword (e.g., paper, pen)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Filter by keyword or title..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-white border-2 border-black rounded-none px-3.5 py-2 pl-9 text-xs font-bold focus:outline-none focus:bg-[#00FF00] transition-colors text-black placeholder-black/50"
                    />
                    <Search className="w-3.5 h-3.5 text-black absolute left-3 top-3" />
                  </div>
                </div>

              </div>

            </div>

            {/* Right Side: Active Activity view / Results grid (span 8) */}
            <div className="lg:col-span-8 flex flex-col gap-6" id="main-activity-view">
              
              {/* Filter alert bar info */}
              <div className="bg-white border-4 border-black px-4 py-3 text-xs text-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-black animate-pulse" />
                  <span>
                    Active Filters: found <b className="underline">{filteredActivities.length} activities</b> out of {activities.length} total.
                  </span>
                </div>
                {filteredActivities.length === 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-[10px] font-black uppercase text-[#FF6B6B] hover:underline cursor-pointer"
                  >
                    Clear filters
                  </button>
                )}
              </div>

              {/* Show selected activity card */}
              {selectedActivity ? (
                <ActivityCard
                  activity={selectedActivity}
                  isFavorite={userStats.favorites.includes(selectedActivity.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onTryAnother={handleRandomize}
                  onTriggerStealth={() => setIsStealthActive(true)}
                  onGameFinished={handleGameFinished}
                />
              ) : (
                <div className="bg-white border-4 border-black p-12 text-center flex flex-col items-center justify-center gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <HelpCircle className="w-12 h-12 text-black" />
                  <div>
                    <h3 className="text-base font-black uppercase text-black">No activities match your filters</h3>
                    <p className="text-xs text-black/60 font-medium mt-1 max-w-sm">
                      Disable some filters (place or mood) or run our universal "Surprise Me" generator!
                    </p>
                  </div>
                  <button
                    onClick={handleResetFilters}
                    className="bg-[#FF6B6B] text-black font-black text-xs uppercase border-2 border-black px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Grid lists of other suggestions under current filter pool */}
              {filteredActivities.length > 1 && (
                <div className="bg-white border-4 border-black p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <h3 className="text-xs font-black uppercase tracking-widest text-black mb-3.5">
                    Other matching suggestions
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredActivities
                      .filter(a => a.id !== selectedActivity?.id)
                      .slice(0, 4)
                      .map(act => {
                        const isMostPlayed = popularIds.mostPlayed[0] === act.id;
                        const isLongestPlayed = popularIds.longestPlayed[0] === act.id;

                        return (
                          <button
                            key={act.id}
                            onClick={() => {
                              setSelectedActivity(act);
                              document.getElementById('main-activity-view')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="w-full text-left bg-[#E9E9E9] hover:bg-black hover:text-white border-2 border-black p-3.5 transition-all flex items-center justify-between gap-3 cursor-pointer group relative overflow-hidden"
                          >
                            <div className="min-w-0 flex-1 font-sans">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="text-xs font-black text-black group-hover:text-[#00FF00] truncate transition-colors">
                                  {act.title}
                                </h4>
                                {isMostPlayed && (
                                  <span className="bg-red-500 text-white font-mono text-[8px] px-1 font-black uppercase tracking-tight">
                                    🔥 POPULAR
                                  </span>
                                )}
                                {isLongestPlayed && !isMostPlayed && (
                                  <span className="bg-blue-600 text-white font-mono text-[8px] px-1 font-black uppercase tracking-tight">
                                    ⏱️ ADDICTIVE
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-black/60 group-hover:text-white/85 truncate mt-0.5">{act.description}</p>
                            </div>
                            <span className="shrink-0 p-1 bg-white text-black border-2 border-black group-hover:bg-white group-hover:text-black transition-colors">
                              <Sparkles className="w-3.5 h-3.5" />
                            </span>
                          </button>
                        );
                      })}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* Tab: Favorites list */}
        {activeTab === 'favorites' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2 mb-8">
              <Heart className="w-10 h-10 text-[#FF6B6B] fill-current mx-auto animate-bounce" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Your Emergency Idea Library</h2>
              <p className="text-xs text-black/70 font-bold">
                Instantly find your favorite activities to counter any boredom emergency.
              </p>
            </div>

            {userStats.favorites.length === 0 ? (
              <div className="bg-white border-4 border-black p-12 text-center flex flex-col items-center justify-center gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <HelpIcon className="w-10 h-10 text-black" />
                <div>
                  <h3 className="text-xs font-black text-black uppercase tracking-widest">No saved favorites</h3>
                  <p className="text-[11px] text-black/60 font-semibold mt-1 max-w-sm mx-auto">
                    Browse activities in the main tab and click the star ⭐ icon to save an idea.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('hub')}
                  className="bg-[#FFD93D] text-black border-2 border-black font-black text-xs uppercase px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
                >
                  Discover ideas
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3.5">
                {activities
                  .filter(a => userStats.favorites.includes(a.id))
                  .map(favAct => (
                    <div
                      key={favAct.id}
                      className="bg-white border-4 border-black p-4.5 flex items-center justify-between gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {favAct.contexts.slice(0, 2).map(ctx => (
                            <span key={ctx} className="bg-[#E9E9E9] text-black text-[9px] font-mono px-2 py-0.5 border border-black font-bold uppercase">
                              {contextLabels[ctx] || ctx}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-sm font-black text-black leading-snug truncate">{favAct.title}</h3>
                        <p className="text-xs text-black/60 font-semibold mt-1 line-clamp-1">{favAct.description}</p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleLoadFavorite(favAct.id)}
                          className="bg-[#00FF00] border-2 border-black text-black font-black text-xs px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 transition-all cursor-pointer"
                        >
                          Launch
                        </button>
                        <button
                          onClick={() => handleToggleFavorite(favAct.id)}
                          className="text-[#FF6B6B] hover:scale-115 transition-transform p-2 cursor-pointer"
                          title="Remove from favorites"
                        >
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Badges and stats */}
        {activeTab === 'stats' && (
          <div className="max-w-xl mx-auto flex flex-col gap-6">
            <GlobalLeaderboard />
            <BoredomTracker stats={userStats} onUpdateStats={handleUpdateStats} />
          </div>
        )}

      </main>

      {/* Humorous Scorecard / Congratulations Modal */}
      {finishedGameData && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white border-4 border-black p-6 md:p-8 max-w-md w-full relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-black">
            <div className="absolute -top-4 -right-4 bg-[#00FF00] text-black border-4 border-black px-3 py-1 font-mono text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-6">
              CONGRATS! 🎉
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-[#FFD93D] border-4 border-black flex items-center justify-center mx-auto rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Award className="w-8 h-8 text-black animate-bounce" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-black text-black/60 uppercase">
                  Official Bored Master Scorecard
                </span>
                <h3 className="text-xl font-black uppercase text-black mt-1">
                  {finishedGameData.gameTitle}
                </h3>
                <p className="text-xs font-semibold text-black/70 mt-1">
                  Played by: <strong className="underline decoration-2 decoration-[#00FF00]">{globalUsername}</strong>
                </p>
              </div>

              {/* Dynamic humorous scorecard summary */}
              <div className="bg-[#E9E9E9] p-4 border-2 border-black font-mono text-xs font-bold leading-relaxed text-left text-black relative">
                <span className="absolute top-1.5 right-1.5 text-[9px] font-mono text-black/40">v2.0</span>
                "{finishedGameData.text}"
                <div className="text-[10px] text-[#00FF00] font-black uppercase mt-3 bg-black px-2 py-1 text-center border border-black inline-block">
                  boredmaster.com
                </div>
              </div>

              {/* Scores stats grid */}
              <div className="grid grid-cols-2 gap-3.5 font-mono text-xs">
                <div className="bg-white p-2.5 border-2 border-black text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-[10px] text-black/50 font-black uppercase">Points Earned</div>
                  <div className="text-lg font-black text-[#FF6B6B]">{finishedGameData.score}</div>
                </div>
                <div className="bg-white p-2.5 border-2 border-black text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <div className="text-[10px] text-black/50 font-black uppercase">Time Bored</div>
                  <div className="text-lg font-black text-blue-600">
                    {finishedGameData.duration}s
                  </div>
                </div>
              </div>

              {/* Social Sharing division */}
              <div className="space-y-2 border-t-2 border-black pt-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-black flex items-center justify-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Score on Socials</span>
                </h4>
                
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(finishedGameData.text)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-black hover:bg-[#FFD93D] hover:text-black text-white border-2 border-black py-1 px-2 text-[10px] font-black uppercase tracking-tight text-center transition-colors"
                  >
                    X (Twitter)
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=https://boredmaster.com&quote=${encodeURIComponent(finishedGameData.text)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-[#00FF00] hover:text-black text-white border-2 border-black py-1 px-2 text-[10px] font-black uppercase tracking-tight text-center transition-colors"
                  >
                    Facebook
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(finishedGameData.text);
                      alert("Scorecard copied! Share it on Snapchat stories! 🚀");
                    }}
                    className="bg-[#FFD93D] hover:bg-black hover:text-white text-black border-2 border-black py-1 px-2 text-[10px] font-black uppercase tracking-tight text-center transition-colors cursor-pointer"
                  >
                    Snapchat
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(finishedGameData.text);
                      alert("Scorecard copied! Paste it in your Instagram Reels/Stories! 📸");
                    }}
                    className="bg-pink-500 hover:bg-[#00FF00] hover:text-black text-white border-2 border-black py-1 px-2 text-[10px] font-black uppercase tracking-tight text-center transition-colors cursor-pointer"
                  >
                    Instagram
                  </button>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=https://boredmaster.com`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#0077b5] hover:bg-[#00FF00] hover:text-black text-white border-2 border-black py-1 px-2 text-[10px] font-black uppercase tracking-tight text-center transition-colors"
                  >
                    LinkedIn
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(finishedGameData.text);
                      alert("Copied full scorecard text to clipboard! 📋");
                    }}
                    className="bg-white hover:bg-black hover:text-white text-black border-2 border-black py-1 px-2 text-[10px] font-black uppercase tracking-tight text-center transition-colors cursor-pointer"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Close CTA */}
              <button
                onClick={() => setFinishedGameData(null)}
                className="w-full bg-[#00FF00] hover:bg-black hover:text-white text-black font-black uppercase text-xs py-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer mt-2"
              >
                🔥 Stay Bored & Play More
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
