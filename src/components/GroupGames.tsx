'use client'
import { useState } from 'react';
import { HelpCircle, Sparkles, RefreshCw, AlertCircle, PartyPopper } from 'lucide-react';

const TRUTHS = [
  "What is the most absurd lie you have told your parents to avoid a punishment?",
  "What is the worst song on your playlist that you secretly listen to?",
  "If you could trade lives with one of the players here for 24 hours, who would it be and why?",
  "What is the last search query in your Google history that you would be embarrassed to show?",
  "If you won $1 million tomorrow, what is the first useless silly thing you would buy?",
  "Have you ever faked being sick to skip class or work? Tell the truth!",
  "What is the weirdest habit you have when you are home alone?",
  "If you had to survive on a deserted island with only two players here, who would you choose?",
  "What is your worst memory of a first date or teenage flirtation?",
  "What is the most bizarre or absurd dream you can remember?"
];

const DARES = [
  "Do your best imitation of a chicken laying an egg for 30 seconds.",
  "Send a message to your third recent contact containing only: 'I know everything, let's talk soon.' with no explanation!",
  "Make a passionate declaration of love to an inanimate object in the room for 1 minute.",
  "Eat a teaspoon of a strange combination of ingredients chosen by the other players (e.g., mustard + jam).",
  "Speak with a funny foreign accent of the players' choice until your next turn.",
  "Try to lick your elbow for 20 seconds under the critical eyes of the group.",
  "Do 15 rapid pushups while singing a popular song or nursery rhyme.",
  "Become the Statue of Liberty for 2 full minutes: no movement or blinking allowed.",
  "Let another player style your hair or put on makeup in a ridiculous way.",
  "Do a silent and ridiculous belly dance in front of everyone."
];

export function GroupGames() {
  const [cardType, setCardType] = useState<'truth' | 'dare' | null>(null);
  const [content, setContent] = useState('');
  const [turn, setTurn] = useState(1);

  const generateCard = (type: 'truth' | 'dare') => {
    const list = type === 'truth' ? TRUTHS : DARES;
    const randomIndex = Math.floor(Math.random() * list.length);
    setCardType(type);
    setContent(list[randomIndex]);
    setTurn(prev => prev + 1);
  };

  const resetGame = () => {
    setCardType(null);
    setContent('');
    setTurn(1);
  };

  return (
    <div className="bg-white p-5 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-full text-black flex flex-col items-center text-center">
      <div className="flex items-center gap-2 mb-3">
        <PartyPopper className="w-5 h-5 text-black" />
        <h3 className="text-sm font-black uppercase tracking-widest text-black">Boredom Truth or Dare</h3>
      </div>

      <p className="text-xs text-black/70 font-semibold max-w-sm mb-5">
        The ultimate icebreaker to chase away boredom in a group. Perfect for parties at home or school with friends.
      </p>

      {/* Card Arena */}
      <div className="w-full max-w-[320px] min-h-[200px] flex items-center justify-center relative mb-5">
        {!cardType ? (
          <div className="w-full bg-[#E9E9E9] border-4 border-dashed border-black p-8 flex flex-col items-center justify-center gap-3">
            <HelpCircle className="w-10 h-10 text-black/60 animate-pulse" />
            <span className="text-xs text-black/70 font-semibold">Select a category below to get started</span>
          </div>
        ) : (
          <div
            className={`w-full p-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[200px] transition-all duration-300 transform scale-100 ${
              cardType === 'truth' ? 'bg-[#00FFFF]' : 'bg-[#FF6B6B]'
            }`}
          >
            {/* Tag label */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 border-2 border-black bg-white text-black">
                {cardType === 'truth' ? 'Truth 🔍' : 'Dare ⚡'}
              </span>
              <span className="text-[10px] text-black font-black uppercase font-mono">Round #{turn}</span>
            </div>

            {/* Core text */}
            <p className="text-sm md:text-base font-black leading-relaxed my-4 text-black">
              "{content}"
            </p>

            {/* Disclaimer */}
            <div className="flex items-center gap-1 text-[10px] text-black/80 font-bold uppercase justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>You have the right to one joker per game!</span>
            </div>
          </div>
        )}
      </div>

      {/* Buttons selectors */}
      <div className="flex flex-wrap items-center gap-3 justify-center">
        <button
          onClick={() => generateCard('truth')}
          className="bg-[#00FFFF] text-black border-2 border-black font-black uppercase text-xs px-4 py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Reveal a Truth</span>
        </button>

        <button
          onClick={() => generateCard('dare')}
          className="bg-[#FF6B6B] text-black border-2 border-black font-black uppercase text-xs px-4 py-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Take a Dare</span>
        </button>

        {cardType && (
          <button
            onClick={resetGame}
            className="text-black hover:text-[#FF6B6B] border-2 border-transparent hover:border-black bg-white p-1.5 font-bold transition-all cursor-pointer"
            title="Reset Game"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
