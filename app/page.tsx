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
const activitySEOData: Record<string, { icon: string; joke: string }> = {
  'act-connect4':           { icon: '🤖', joke: 'Beat the robot. If you lose, it doesn\'t count.' },
  'act-icecream':           { icon: '🍦', joke: 'Lick pixels. Zero calories. Infinite satisfaction.' },
  'act-soap-carver':        { icon: '🧼', joke: 'Adult stress toy. Do not judge.' },
  'act-grass-cutter':       { icon: '🌿', joke: 'The grass is always greener on your screen.' },
  'act-stealth-work':       { icon: '🕵️', joke: 'The fake spreadsheet that saved careers.' },
  'act-doodle-creative':    { icon: '🎨', joke: 'Picasso also started in class. Probably.' },
  'act-bubble-pop':         { icon: '🫧', joke: 'Therapy. Free. No appointment needed.' },
  'act-truth-dare':         { icon: '🔥', joke: 'Warning: friendships may not survive.' },
  'act-tictactoe-ai':       { icon: '❌', joke: 'The AI is unbeatable. Or is it?' },
  'act-class-alphabet':     { icon: '🔤', joke: 'A, B, C... actually harder than it sounds.' },
  'act-class-doodle-story': { icon: '📝', joke: 'Shakespeare started somewhere. Probably a napkin.' },
  'act-class-finger-gym':   { icon: '🖐️', joke: 'Become a hand wizard. Completely free skill.' },
  'act-class-pen-spinning': { icon: '🖊️', joke: 'One trick away from becoming a classroom legend.' },
  'act-home-wikipedia':     { icon: '🌐', joke: 'Warning: you WILL learn extremely weird facts.' },
  'act-home-museum':        { icon: '🏛️', joke: 'Free museum. No gift shop guilt.' },
  'act-home-origami':       { icon: '📐', joke: 'Instructions included. You\'ll still mess up fold 3.' },
  'act-home-declutter':     { icon: '🧹', joke: 'Marie Kondo speedrun. 5 items. Go.' },
  'act-work-desk-stretch':  { icon: '🧘', joke: 'Your coworkers have absolutely no idea.' },
  'act-work-email-cleanup': { icon: '📥', joke: 'Digital cleanse. Extremely satisfying.' },
  'act-work-type-racer':    { icon: '⌨️', joke: 'Type faster than your own thoughts.' },
  'act-friends-telepathy':  { icon: '🧠', joke: 'Are you psychic? Spoiler: maybe.' },
  'act-friends-story':      { icon: '✍️', joke: 'Collaborative chaos. Guaranteed hilarious results.' },
  'act-friends-wink-assassin': { icon: '👁️', joke: 'Trust no one. Especially Carl.' },
  'act-night-sky':          { icon: '🌌', joke: 'The sky is free. Just lie down and look up.' },
  'act-night-shadow-puppets': { icon: '🐕', joke: 'Hollywood budget: $0. Entertainment value: priceless.' },
  'act-night-ambient-sound': { icon: '🎧', joke: 'Your ears are about to go on a full vacation.' },
  'act-comp-quick-draw':    { icon: '🤖', joke: 'Teach a robot to recognize your terrible art.' },
  'act-comp-radio-garden':  { icon: '📻', joke: 'Morning in Tokyo. Evening in Berlin. Breakfast at your desk.' },
  'act-comp-scale-universe': { icon: '🔭', joke: 'You are very, very small. Very.' },
  'act-comp-sandspiel':     { icon: '⏳', joke: 'Satisfying sand physics. For grown adults. No shame.' },
  'act-girls-nail-art':     { icon: '💅', joke: 'Roll a random nail art combo. Your nails deserve better.' },
  'act-girls-vision-board': { icon: '🌸', joke: 'Cut + paste your dream life. Pinterest but make it chaotic.' },
  'act-girls-journal':      { icon: '📔', joke: 'Aesthetic planning for people who never actually plan.' },
  'act-girls-grwm':         { icon: '🪞', joke: 'Randomize your get-ready vibe. Mystery outfit energy.' },
  'act-girls-letter':       { icon: '💌', joke: 'Write to yourself in 1 year. Future-you will cringe. Worth it.' },
  'act-girls-quiz':         { icon: '🌟', joke: 'Which villain era are you in? (You already know.)' },
  'act-girls-playlist':     { icon: '🎵', joke: 'Name it something dramatic. No fillers allowed.' },
  'act-girls-handlettering': { icon: '✨', joke: 'Make your handwriting Instagram-worthy in 10 minutes.' },
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
          {[
            { emoji: '🏠', title: 'What to Do When Bored at Home', body: 'Stuck on the couch with zero plans? Try our sensory ASMR Soap Carver, Lawn Mower Simulator, or Origami Challenge right here. Offline ideas: 5-Item Speed Declutter, room rearranging, or a quick digital declutter sprint.' },
            { emoji: '🏫', title: 'What to Do When Bored in Class', body: 'Trapped in a silent lecture? Play our quiet Tic-Tac-Toe vs AI, practice Finger Gym (hand dexterity), draw a 3-Panel Comic Strip, or master the Pen Spin — all completely stealthy.' },
            { emoji: '🎒', title: 'What to Do When Bored at School', body: 'During lunch or study hall: try a mental Alphabet Challenge, write a silly collaborative story, or battle our Connect 4 AI to turn passive hours into dynamic strategy training.' },
            { emoji: '💼', title: 'What to Do When Bored at Work', body: 'Staring at an empty spreadsheet? Activate "Looks Busy" Mode — a mock corporate spreadsheet that updates as you type. Or do quick desk stretches, run the Great Inbox Unsubscribe, or practice ultra-fast typing.' },
            { emoji: '💻', title: 'What to Do When Bored on Computer', body: 'Dive into immersive digital activities: play Satisfying Ice Cream Licking ASMR, carve neon digital soaps, challenge Google\'s Quick Draw AI, or explore the Scale of the Universe.' },
            { emoji: '👥', title: 'What to Do When Bored with Friends', body: 'Elevate your hangout: play Wink Assassin / Mafia, run a Truth or Dare session, try Voice Telepathy Mind-Match, or write an Exquisite Corpse story together for instant chaos.' },
            { emoji: '🌙', title: 'What to Do When Bored at Night', body: 'Awake at 3AM? Dim the lights, listen to our 3D Binaural Sound Bath, watch stars and satellites, try Shadow Puppets Theater, or explore the observable universe in the Scale of the Universe tool.' },
            { emoji: '👶', title: 'What to Do When Bored for 8, 9 or 10 Year Olds', body: 'Screen-free ideas: complex origami fold challenges, building pillow castles, drawing stealth doodle cartoons, or an offline scavenger hunt around the house.' },
            { emoji: '⚡', title: 'What to Do When Bored for 11 or 12 Year Olds', body: 'Pre-teen boredom cures: keyboard speed races, pixel-sand designs, strategy against our local AI games, or starting a 1-minute stop-motion video using household toys.' },
            { emoji: '💅', title: 'What to Do When Bored for Girls at Home', body: 'Make a digital vision board on Canva, generate a random nail art combo, start a bullet journal spread, write a letter to future-you on futureme.org, or take a personality quiz marathon on uquiz.com.' },
            { emoji: '🌸', title: 'What to Do When Your Bored for Girls at Night', body: 'Can\'t sleep? Take 3 personality quizzes back-to-back, build a mood playlist named something dramatic, do a GRWM aesthetic randomizer, or practice hand lettering with just a pen and paper.' },
          ].map(({ emoji, title, body }) => (
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
            {[
              { q: 'What can a girl do when bored at home alone?', a: 'Great solo activities for girls at home: generate a random nail art combo and actually do it, start a bullet journal (any notebook works), build a vision board on Canva, take an unhinged personality quiz on uquiz.com, write a letter to your future self, or practice hand lettering with just a pen and paper. If you have your phone or computer: try our ASMR Ice Cream game, the Doodle Board, or build a mood playlist for your current era.' },
              { q: 'What to do when your bored for girls at night?', a: 'Night boredom hits different. Best ideas for girls at night: dim your screen and play the 3D Binaural Sound Bath, do a GRWM aesthetic randomizer (even if you\'re going nowhere), write in your journal, or take 3 personality quizzes back-to-back and text the results to your friend. If you can\'t sleep: our Bubble Popper and Scale of the Universe are perfect 3AM activities.' },
              { q: 'What to do when bored for teenage girls?', a: 'Teenage girl boredom cures: start a digital vision board for your goals (actually useful), practice hand lettering (looks impressive, takes 10 min to learn), challenge a friend to a Telepathy Mind-Match or Truth or Dare, build the perfect breakup/hype-up playlist, or write yourself a letter to open in exactly one year. Also: our Connect 4 vs AI is secretly addictive.' },
            ].map(({ q, a }) => (
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
