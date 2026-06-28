import type React from 'react'
import { activities, moodLabels } from '../src/data/activities'
import App from '../src/App'

// ─── JSON-LD Schema ───────────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'Bored Master',
      url: 'https://bored-master.pages.dev',
      description: 'Instant anti-boredom ideas for any situation.',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'What to do when bored at home?', acceptedAnswer: { '@type': 'Answer', text: 'Try our ASMR Soap Carver, Lawn Mower Simulator, Origami Challenge, or 5-Item Speed Declutter. All free, no install needed.' } },
        { '@type': 'Question', name: 'What to do when bored in class?', acceptedAnswer: { '@type': 'Answer', text: 'Play our silent Tic-Tac-Toe vs AI, practice Finger Gym, draw a 3-Panel Comic Strip, or master the Pen Spin — all stealthy and screen-safe.' } },
        { '@type': 'Question', name: 'What to do when bored at school?', acceptedAnswer: { '@type': 'Answer', text: 'Try the Alphabet Mental Challenge, write an Exquisite Corpse story with a friend, or battle our Connect 4 AI during lunch.' } },
        { '@type': 'Question', name: 'What to do when bored at work?', acceptedAnswer: { '@type': 'Answer', text: 'Activate "Looks Busy" Mode (realistic fake spreadsheet), do Undetectable Desk Yoga, or run the Great Inbox Unsubscribe.' } },
        { '@type': 'Question', name: 'What to do when bored for girls?', acceptedAnswer: { '@type': 'Answer', text: 'Generate a random nail art combo, build a digital vision board, write a letter to future you, take a personality quiz marathon, or curate a mood playlist.' } },
        { '@type': 'Question', name: 'What to do when bored at night?', acceptedAnswer: { '@type': 'Answer', text: 'Try the 3D Binaural Sound Bath, watch Stars and Satellites, do Shadow Puppets Theater, or play the Scale of the Universe explorer.' } },
        { '@type': 'Question', name: 'What to do when bored on computer?', acceptedAnswer: { '@type': 'Answer', text: 'Play Quick Draw vs Google AI, fly over Global Live Radios, explore the Scale of the Universe, or lose hours in the Retro Physics Sandbox.' } },
        { '@type': 'Question', name: 'What to do when bored with friends?', acceptedAnswer: { '@type': 'Answer', text: 'Play Wink Assassin / Mafia, do Boredom Truth or Dare, try Voice Telepathy Mind-Match, or write an Exquisite Corpse story together.' } },
      ],
    },
  ],
}

// ─── Static activity data for SEO ─────────────────────────────────────────────
const activitySEOData: Record<string, { icon: string; joke: string; cta: string; href: string; external?: boolean }> = {
  'act-connect4':           { icon: '🤖', joke: 'Beat the robot. If you lose, it doesn\'t count.', cta: 'Play Connect 4 vs AI free', href: '/?activity=act-connect4' },
  'act-icecream':           { icon: '🍦', joke: 'Lick pixels. Zero calories. Infinite satisfaction.', cta: 'Play Ice Cream Licking ASMR', href: '/?activity=act-icecream' },
  'act-soap-carver':        { icon: '🧼', joke: 'Adult stress toy. Do not judge.', cta: 'Play Soap Carver free', href: '/?activity=act-soap-carver' },
  'act-grass-cutter':       { icon: '🌿', joke: 'The grass is always greener on your screen.', cta: 'Play Lawn Mower Simulator', href: '/?activity=act-grass-cutter' },
  'act-stealth-work':       { icon: '🕵️', joke: 'The fake spreadsheet that saved careers.', cta: 'Open Looks Busy Mode', href: '/?activity=act-stealth-work' },
  'act-doodle-creative':    { icon: '🎨', joke: 'Picasso also started in class. Probably.', cta: 'Open Stealthy Doodle Board', href: '/?activity=act-doodle-creative' },
  'act-bubble-pop':         { icon: '🫧', joke: 'Therapy. Free. No appointment needed.', cta: 'Play Bubble Popper free', href: '/?activity=act-bubble-pop' },
  'act-truth-dare':         { icon: '🔥', joke: 'Warning: friendships may not survive.', cta: 'Play Truth or Dare now', href: '/?activity=act-truth-dare' },
  'act-tictactoe-ai':       { icon: '❌', joke: 'The AI is unbeatable. Or is it?', cta: 'Play Tic-Tac-Toe vs AI free', href: '/?activity=act-tictactoe-ai' },
  'act-class-alphabet':     { icon: '🔤', joke: 'A, B, C... actually harder than it sounds.', cta: 'Try Alphabet Challenge', href: '/?activity=act-class-alphabet' },
  'act-class-doodle-story': { icon: '📝', joke: 'Shakespeare started somewhere. Probably a napkin.', cta: 'Try Collaborative Story', href: '/?activity=act-class-doodle-story' },
  'act-class-finger-gym':   { icon: '🖐️', joke: 'Become a hand wizard. Completely free skill.', cta: 'Try Finger Gym now', href: '/?activity=act-class-finger-gym' },
  'act-class-pen-spinning': { icon: '🖊️', joke: 'One trick away from becoming a classroom legend.', cta: 'Learn Pen Spinning free', href: '/?activity=act-class-pen-spinning' },
  'act-home-wikipedia':     { icon: '🌐', joke: 'Warning: you WILL learn extremely weird facts.', cta: 'Explore random Wikipedia', href: 'https://en.wikipedia.org/wiki/Special:Random', external: true },
  'act-home-museum':        { icon: '🏛️', joke: 'Free museum. No gift shop guilt.', cta: 'Open Google Arts & Culture', href: 'https://artsandculture.google.com/', external: true },
  'act-home-origami':       { icon: '📐', joke: 'Instructions included. You\'ll still mess up fold 3.', cta: 'Try Origami Challenge', href: '/?activity=act-home-origami' },
  'act-home-declutter':     { icon: '🧹', joke: 'Marie Kondo speedrun. 5 items. Go.', cta: 'Try 5-Item Declutter sprint', href: '/?activity=act-home-declutter' },
  'act-work-desk-stretch':  { icon: '🧘', joke: 'Your coworkers have absolutely no idea.', cta: 'Try Desk Yoga moves', href: '/?activity=act-work-desk-stretch' },
  'act-work-email-cleanup': { icon: '📥', joke: 'Digital cleanse. Extremely satisfying.', cta: 'Try Inbox Unsubscribe sprint', href: '/?activity=act-work-email-cleanup' },
  'act-work-type-racer':    { icon: '⌨️', joke: 'Type faster than your own thoughts.', cta: 'Play TypeRacer speed game', href: 'https://play.typeracer.com/', external: true },
  'act-friends-telepathy':  { icon: '🧠', joke: 'Are you psychic? Spoiler: maybe.', cta: 'Play Telepathy Mind-Match', href: '/?activity=act-friends-telepathy' },
  'act-friends-story':      { icon: '✍️', joke: 'Collaborative chaos. Guaranteed hilarious results.', cta: 'Try Exquisite Corpse story', href: '/?activity=act-friends-story' },
  'act-friends-wink-assassin': { icon: '👁️', joke: 'Trust no one. Especially Carl.', cta: 'Play Wink Assassin game', href: '/?activity=act-friends-wink-assassin' },
  'act-night-sky':          { icon: '🌌', joke: 'The sky is free. Just lie down and look up.', cta: 'Try Stars & Satellites watch', href: '/?activity=act-night-sky' },
  'act-night-shadow-puppets': { icon: '🐕', joke: 'Hollywood budget: $0. Entertainment value: priceless.', cta: 'Try Shadow Puppets Theater', href: '/?activity=act-night-shadow-puppets' },
  'act-night-ambient-sound': { icon: '🎧', joke: 'Your ears are about to go on a full vacation.', cta: 'Play 3D Binaural Sound Bath', href: 'https://mynoise.net/', external: true },
  'act-comp-quick-draw':    { icon: '🤖', joke: 'Teach a robot to recognize your terrible art.', cta: 'Play Quick Draw vs Google AI', href: 'https://quickdraw.withgoogle.com/', external: true },
  'act-comp-radio-garden':  { icon: '📻', joke: 'Morning in Tokyo. Evening in Berlin. Breakfast at your desk.', cta: 'Explore Radio Garden live', href: 'https://radio.garden/', external: true },
  'act-comp-scale-universe': { icon: '🔭', joke: 'You are very, very small. Very.', cta: 'Explore Scale of the Universe', href: 'https://htwins.net/scale2/', external: true },
  'act-comp-sandspiel':     { icon: '⏳', joke: 'Satisfying sand physics. For grown adults. No shame.', cta: 'Play Sandspiel sand game', href: 'https://sandspiel.club/', external: true },
  'act-girls-nail-art':     { icon: '💅', joke: 'Roll a random nail art combo. Your nails deserve better.', cta: 'Try Nail Art Combo Generator', href: '/?activity=act-girls-nail-art' },
  'act-girls-vision-board': { icon: '🌸', joke: 'Cut + paste your dream life. Pinterest but make it chaotic.', cta: 'Make Digital Vision Board', href: '/?activity=act-girls-vision-board' },
  'act-girls-journal':      { icon: '📔', joke: 'Aesthetic planning for people who never actually plan.', cta: 'Try Bullet Journal Layout', href: '/?activity=act-girls-journal' },
  'act-girls-grwm':         { icon: '🪞', joke: 'Randomize your get-ready vibe. Mystery outfit energy.', cta: 'Try GRWM Randomizer now', href: '/?activity=act-girls-grwm' },
  'act-girls-letter':       { icon: '💌', joke: 'Write to yourself in 1 year. Future-you will cringe. Worth it.', cta: 'Write Letter to Future Me', href: 'https://www.futureme.org/', external: true },
  'act-girls-quiz':         { icon: '🌟', joke: 'Which villain era are you in? (You already know.)', cta: 'Take Personality Quiz Marathon', href: 'https://uquiz.com/', external: true },
  'act-girls-playlist':     { icon: '🎵', joke: 'Name it something dramatic. No fillers allowed.', cta: 'Build Mood Playlist now', href: '/?activity=act-girls-playlist' },
  'act-girls-handlettering': { icon: '✨', joke: 'Make your handwriting Instagram-worthy in 10 minutes.', cta: 'Learn Hand Lettering free', href: '/?activity=act-girls-handlettering' },
}

export default function Page() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Interactive App (client-rendered) ─────────────────────────────── */}
      <App />

      {/* ══════════════════════════════════════════════════════════════════════
          ALL CONTENT BELOW IS SERVER-RENDERED → Googlebot sees it immediately
          ══════════════════════════════════════════════════════════════════════ */}

      {/* Browse All Activities — static HTML, indexed by Google */}
      <section
        className="mt-10 max-w-6xl mx-auto px-4"
        aria-label="Browse all anti-boredom activities"
        id="seo-browse-all"
      >
        <h2 className="text-xl font-black uppercase tracking-tight text-black bg-black text-white px-6 py-4 border-4 border-black">
          🗂️ Browse All 38 Activities — Fun Things To Do When Bored
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-x-4 border-b-4 border-black bg-[#F4F4F1]">
          {activities.map((activity) => {
            const seo = activitySEOData[activity.id]
            return (
              <article
                key={activity.id}
                className="p-4 border-r-2 border-b-2 border-black bg-white"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl shrink-0 mt-0.5" aria-hidden="true">
                    {seo?.icon ?? '🎯'}
                  </span>
                  <div>
                    <h3 className="text-[11px] font-black uppercase tracking-tight leading-tight mb-1 text-black">
                      {activity.title.replace(/^[\p{Emoji}\s]+/u, '').trim()}
                    </h3>
                    <p className="text-[10px] text-black/60 leading-relaxed mb-2">
                      {activity.description}
                    </p>
                    <p className="text-[9px] text-black/40 italic">{seo?.joke}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {activity.moods.slice(0, 2).map(m => (
                        <span
                          key={m}
                          className="text-[9px] font-black uppercase px-1.5 py-0.5 border border-black bg-[#E9E9E9] text-black"
                        >
                          {moodLabels[m as keyof typeof moodLabels] || m}
                        </span>
                      ))}
                    </div>
                    {seo?.href && (
                      <a
                        href={seo.href}
                        {...(seo.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                        className="mt-3 inline-flex items-center gap-1 bg-[#00FF00] border-2 border-black px-3 py-1.5 text-[9px] font-black uppercase tracking-wide text-black hover:bg-black hover:text-[#00FF00] transition-colors"
                      >
                        ▶ {seo.cta}
                      </a>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        <p className="text-center text-[11px] font-bold text-black/50 uppercase tracking-widest py-4 border-x-4 border-b-4 border-black bg-[#F4F4F1]">
          38 hand-picked activities • no install • no account • 100% free
        </p>
      </section>

      {/* SEO Guide Section */}
      <section className="mt-10 max-w-6xl mx-auto px-4 bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black mb-6 pb-4 border-b-4 border-black">
          The Ultimate Guide on What to Do When Bored
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-black/85">
          {([
            { emoji: '🏠', title: 'What to Do When Bored at Home', body: <>Stuck on the couch with zero plans? Try our sensory <a href="/?activity=act-soap-carver" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">ASMR Soap Carver</a>, <a href="/?activity=act-grass-cutter" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Lawn Mower Simulator</a>, or <a href="/?activity=act-home-origami" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Origami Challenge</a>. Offline: <a href="/?activity=act-home-declutter" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">5-Item Speed Declutter</a>, room rearranging, or a quick digital declutter sprint.</> },
            { emoji: '🏫', title: 'What to Do When Bored in Class', body: <>Trapped in a silent lecture? Play our quiet <a href="/?activity=act-tictactoe-ai" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Tic-Tac-Toe vs AI</a>, practice <a href="/?activity=act-class-finger-gym" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Finger Gym</a> (hand dexterity), draw a <a href="/?activity=act-class-doodle-story" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">3-Panel Comic Strip</a>, or master <a href="/?activity=act-class-pen-spinning" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Pen Spinning</a> — all completely stealthy.</> },
            { emoji: '🎒', title: 'What to Do When Bored at School', body: <>During lunch or study hall: try a mental <a href="/?activity=act-class-alphabet" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Alphabet Challenge</a>, write a silly <a href="/?activity=act-friends-story" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Collaborative Story</a>, or battle our <a href="/?activity=act-connect4" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Connect 4 vs AI</a> to turn passive hours into dynamic strategy training.</> },
            { emoji: '💼', title: 'What to Do When Bored at Work', body: <>Staring at an empty spreadsheet? Activate <a href="/?activity=act-stealth-work" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">"Looks Busy" Mode</a> — a mock corporate spreadsheet. Or do <a href="/?activity=act-work-desk-stretch" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">quick desk stretches</a>, run the <a href="/?activity=act-work-email-cleanup" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Great Inbox Unsubscribe</a>, or race on <a href="https://play.typeracer.com/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">TypeRacer</a>.</> },
            { emoji: '💻', title: 'What to Do When Bored on Computer', body: <>Dive into immersive digital activities: play <a href="/?activity=act-icecream" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Ice Cream Licking ASMR</a>, carve <a href="/?activity=act-soap-carver" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">neon digital soaps</a>, challenge <a href="https://quickdraw.withgoogle.com/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Google&apos;s Quick Draw AI</a>, or explore the <a href="https://htwins.net/scale2/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Scale of the Universe</a>.</> },
            { emoji: '👥', title: 'What to Do When Bored with Friends', body: <>Elevate your hangout: play <a href="/?activity=act-friends-wink-assassin" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Wink Assassin / Mafia</a>, run a <a href="/?activity=act-truth-dare" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Truth or Dare</a> session, try <a href="/?activity=act-friends-telepathy" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Voice Telepathy Mind-Match</a>, or write an <a href="/?activity=act-friends-story" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Exquisite Corpse story</a> together for instant chaos.</> },
            { emoji: '🌙', title: 'What to Do When Bored at Night', body: <>Awake at 3AM? Dim the lights and listen to the <a href="https://mynoise.net/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">3D Binaural Sound Bath</a>, watch stars and satellites, try <a href="/?activity=act-night-shadow-puppets" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Shadow Puppets Theater</a>, or explore <a href="https://htwins.net/scale2/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Scale of the Universe</a>.</> },
            { emoji: '👶', title: 'What to Do When Bored for 8, 9 or 10 Year Olds', body: <>Screen-free ideas: complex <a href="/?activity=act-home-origami" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">origami fold challenges</a>, building pillow castles, drawing stealth doodle cartoons, or pop infinite <a href="/?activity=act-bubble-pop" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Bubble Popper</a> bubbles on screen.</> },
            { emoji: '⚡', title: 'What to Do When Bored for 11 or 12 Year Olds', body: <>Pre-teen boredom cures: <a href="https://play.typeracer.com/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">keyboard speed races</a>, draw on the <a href="/?activity=act-doodle-creative" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Stealthy Doodle Board</a>, strategy in <a href="/?activity=act-connect4" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Connect 4 vs AI</a> or <a href="/?activity=act-tictactoe-ai" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Tic-Tac-Toe vs AI</a>.</> },
            { emoji: '💅', title: 'What to Do When Bored for Girls at Home', body: <>Make a digital vision board on Canva, generate a <a href="/?activity=act-girls-nail-art" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">random nail art combo</a>, start a <a href="/?activity=act-girls-journal" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">bullet journal spread</a>, or write a <a href="https://www.futureme.org/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">letter to future-you</a>. Take a <a href="https://uquiz.com/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">personality quiz marathon</a> on uquiz.com.</> },
            { emoji: '🌸', title: 'What to Do When Your Bored for Girls at Night', body: <>Can&apos;t sleep? Build a <a href="/?activity=act-girls-playlist" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">mood playlist</a> named something dramatic, do a <a href="/?activity=act-girls-grwm" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">GRWM aesthetic randomizer</a>, or practice <a href="/?activity=act-girls-handlettering" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">hand lettering</a> with just a pen and paper.</> },
          ] as { emoji: string; title: string; body: React.ReactNode }[]).map(({ emoji, title, body }) => (
            <div key={title} className="bg-[#E9E9E9] p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-sm uppercase tracking-tight mb-2 flex items-center gap-1.5 border-b border-black/20 pb-1.5">
                <span>{emoji}</span> {title}
              </h3>
              <p className="leading-relaxed font-medium">{body}</p>
            </div>
          ))}
        </div>

        {/* Girls FAQ */}
        <div className="mt-8 pt-6 border-t-4 border-black">
          <h3 className="font-black text-sm uppercase tracking-tight text-black mb-4">🎀 FAQ — What to Do When Bored for Girls</h3>
          <div className="space-y-3">
            {([
              { q: 'What can a girl do when bored at home alone?', a: <>Great solo activities for girls at home: generate a <a href="/?activity=act-girls-nail-art" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">random nail art combo</a>, start a <a href="/?activity=act-girls-journal" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">bullet journal</a>, build a <a href="/?activity=act-girls-vision-board" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">digital vision board</a>, take a <a href="https://uquiz.com/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">personality quiz marathon</a>, or write a <a href="https://www.futureme.org/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">letter to your future self</a>. On screen: try our <a href="/?activity=act-icecream" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">ASMR Ice Cream game</a>, the <a href="/?activity=act-doodle-creative" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Doodle Board</a>, or build a <a href="/?activity=act-girls-playlist" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">mood playlist</a>.</> },
              { q: 'What to do when your bored for girls at night?', a: <>Night boredom hits different. Best ideas for girls at night: dim your screen and play the <a href="https://mynoise.net/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">3D Binaural Sound Bath</a>, do a <a href="/?activity=act-girls-grwm" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">GRWM aesthetic randomizer</a>, write in your <a href="/?activity=act-girls-journal" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">bullet journal</a>, or take 3 <a href="https://uquiz.com/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">personality quizzes</a> back-to-back. Can&apos;t sleep: <a href="/?activity=act-bubble-pop" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Bubble Popper</a> and <a href="https://htwins.net/scale2/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Scale of the Universe</a> are perfect 3AM activities.</> },
              { q: 'What to do when bored for teenage girls?', a: <>Teenage girl boredom cures: start a <a href="/?activity=act-girls-vision-board" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">digital vision board</a> for your goals, practice <a href="/?activity=act-girls-handlettering" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">hand lettering</a> (impressive, 10 min), challenge a friend to <a href="/?activity=act-friends-telepathy" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Telepathy Mind-Match</a> or <a href="/?activity=act-truth-dare" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Truth or Dare</a>, build a <a href="/?activity=act-girls-playlist" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">breakup/hype-up playlist</a>, or write yourself a <a href="https://www.futureme.org/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">letter to open in one year</a>. Also: <a href="/?activity=act-connect4" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Connect 4 vs AI</a> is secretly addictive.</> },
            ] as { q: string; a: React.ReactNode }[]).map(({ q, a }) => (
              <details key={q} className="bg-[#F4F4F1] border-2 border-black p-4">
                <summary className="font-black uppercase text-xs cursor-pointer select-none">{q}</summary>
                <p className="mt-3 text-xs leading-relaxed font-medium text-black/80">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-16 border-t-4 border-black bg-[#00FF00] py-6 px-8 flex flex-col sm:flex-row justify-between items-center text-black text-xs font-black uppercase gap-4">
        <span>Bored Master — 38 activities, no install, no account, 100% free.</span>
        <p className="font-mono font-bold tracking-tight text-center">© 2026 Bored Master Inc. • Free your mind from boredom.</p>
      </footer>
    </>
  )
}
