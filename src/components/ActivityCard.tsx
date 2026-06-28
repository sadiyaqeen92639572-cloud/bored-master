'use client'
import { useState } from 'react';
import { Star, Share2, ArrowRight, CheckCircle2, ChevronRight, Laptop, Sparkles, BookOpen } from 'lucide-react';
import { Activity } from '../types';
import { contextLabels, durationLabels, moodLabels, deviceLabels, riskLabels } from '../data/activities';
import { DoodleCanvas } from './DoodleCanvas';
import { BubblePopper } from './BubblePopper';
import { GroupGames } from './GroupGames';
import { TicTacToe } from './TicTacToe';
import { Connect4 } from './Connect4';
import { IceCreamLicking } from './IceCreamLicking';
import { SoapCarver } from './SoapCarver';
import { GrassCutter } from './GrassCutter';

interface ActivityCardProps {
  activity: Activity;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onTryAnother: () => void;
  onTriggerStealth: () => void;
  onGameFinished?: (score: number, durationSeconds: number, summaryText: string) => void;
}

export function ActivityCard({
  activity,
  isFavorite,
  onToggleFavorite,
  onTryAnother,
  onTriggerStealth,
  onGameFinished
}: ActivityCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?activity=${activity.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border-4 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all duration-300">
      {/* Activity Heading bar */}
      <div className="p-5 border-b-4 border-black bg-[#E9E9E9] flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {activity.contexts.map(ctx => (
              <span key={ctx} className="bg-black text-white border border-black text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5">
                {contextLabels[ctx] || ctx}
              </span>
            ))}
            {activity.durations.map(dur => (
              <span key={dur} className="bg-[#00FF00] text-black border-2 border-black text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                {durationLabels[dur] || dur}
              </span>
            ))}
          </div>

          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black mb-2 leading-snug">
            {activity.title}
          </h2>
        </div>

        {/* Favorite & Share controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onToggleFavorite(activity.id)}
            className={`p-2.5 border-2 border-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none ${
              isFavorite
                ? 'bg-[#FFD93D] text-black'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
            title="Add to favorites"
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleShare}
            className={`p-2.5 border-2 border-black transition-all cursor-pointer relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none ${
              copied
                ? 'bg-[#00FF00] text-black'
                : 'bg-white text-black hover:bg-black hover:text-white'
            }`}
            title="Copy share link"
          >
            <Share2 className="w-4 h-4" />
            {copied && (
              <span className="absolute bottom-[-28px] right-0 bg-white text-black text-[9px] font-black uppercase px-1.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                Copied!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Core Body */}
      <div className="p-5 md:p-6 flex flex-col gap-6">
        <div>
          <p className="text-black text-sm md:text-base font-medium leading-relaxed">
            {activity.description}
          </p>
        </div>

        {/* Embedded Interactive Widget Area (if available) */}
        {activity.interactiveType && (
          <div className="border-4 border-black overflow-hidden p-2 bg-white">
            {activity.interactiveType === 'stealth' && (
              <div className="p-6 bg-[#E9E9E9] text-black text-center flex flex-col items-center gap-3">
                <Laptop className="w-10 h-10 text-black animate-pulse" />
                <div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-black">Boss Detector (Looks Busy)</h4>
                  <p className="text-xs text-black/70 font-semibold mt-1">
                    Make your boss believe you are working hard on essential enterprise documents.
                  </p>
                </div>
                <button
                  onClick={onTriggerStealth}
                  className="mt-2 bg-[#00FF00] text-black border-2 border-black font-black text-xs uppercase px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2"
                >
                  <span>Launch Stealth Interface 💻</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {activity.interactiveType === 'doodle' && <DoodleCanvas />}
            {activity.interactiveType === 'bubbles' && <BubblePopper onGameFinished={(score, duration, summary) => onGameFinished?.(score, duration, summary)} />}
            {activity.interactiveType === 'truth_dare' && <GroupGames />}
            {activity.interactiveType === 'tictactoe' && <TicTacToe />}
            {activity.interactiveType === 'connect4' && (
              <Connect4 onGameFinished={(score, duration, summary) => onGameFinished?.(score, duration, summary)} />
            )}
            {activity.interactiveType === 'icecream' && (
              <IceCreamLicking onGameFinished={(score, duration, summary) => onGameFinished?.(score, duration, summary)} />
            )}
            {activity.interactiveType === 'soap_carver' && (
              <SoapCarver onGameFinished={(score, duration, summary) => onGameFinished?.(score, duration, summary)} />
            )}
            {activity.interactiveType === 'grass_cutter' && (
              <GrassCutter onGameFinished={(score, duration, summary) => onGameFinished?.(score, duration, summary)} />
            )}
          </div>
        )}

        {/* Step-by-Step Instructions */}
        {activity.steps && activity.steps.length > 0 && (
          <div className="bg-[#F4F4F1] p-4 border-2 border-black">
            <h3 className="text-xs font-black uppercase tracking-wider text-black mb-3 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-black" />
              <span>How to do it?</span>
            </h3>
            <ul className="flex flex-col gap-2">
              {activity.steps.map((step, idx) => (
                <li key={idx} className="flex gap-2.5 items-start text-xs text-black font-medium leading-relaxed">
                  <span className="flex items-center justify-center bg-black text-white text-[10px] font-mono font-black w-5 h-5 shrink-0 mt-0.5 border border-black">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Technical Metadata / Redirect buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-t-2 border-black pt-5">
          {/* Metadata pills */}
          <div className="flex flex-wrap gap-3 text-[11px] font-mono font-bold text-black uppercase">
            <div className="flex items-center gap-1">
              <span>Device:</span>
              <strong className="text-black underline decoration-2 decoration-[#00FF00]">{activity.devices.map(d => deviceLabels[d] || d).join(', ')}</strong>
            </div>
            <div className="hidden sm:inline text-black font-bold">•</div>
            <div className="flex items-center gap-1">
              <span>Risk Level:</span>
              <strong className="text-black underline decoration-2 decoration-[#FF6B6B]">{riskLabels[activity.risk]}</strong>
            </div>
          </div>

          {/* Core CTAs */}
          <div className="flex items-center gap-3 self-end sm:self-auto">
            {activity.externalLink && (
              <a
                href={activity.externalLink}
                target="_blank"
                rel="noreferrer"
                className="bg-white border-2 border-black hover:bg-black hover:text-white text-black font-black text-xs uppercase px-4 py-2.5 flex items-center gap-1.5 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <span>Visit Site</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              onClick={onTryAnother}
              className="bg-[#00FF00] text-black border-2 border-black hover:bg-black hover:text-white font-black text-xs uppercase px-4.5 py-2.5 flex items-center gap-1.5 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none cursor-pointer"
            >
              <span>Find another idea</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
