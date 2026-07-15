import type React from 'react'
import { activities, moodLabels } from '../src/data/activities'
import App from '../src/App'

// ─── JSON-LD Schema ───────────────────────────────────────────────────────────
const SITE_URL = 'https://boredmaster.com'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    // ── WebSite ──────────────────────────────────────────────────────────────
    {
      '@type': 'WebSite',
      name: 'Bored Master',
      url: SITE_URL,
      description: 'Instant anti-boredom ideas for any situation.',
    },

    // ── FAQPage ──────────────────────────────────────────────────────────────
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

    // ── ItemList — all 43 activities (Google carousel potential) ─────────────
    {
      '@type': 'ItemList',
      name: '43 Fun Things To Do When Bored',
      description: 'Hand-picked anti-boredom activities and free browser games. No install, no account.',
      numberOfItems: 43,
      itemListElement: [
        { '@type': 'ListItem', position: 1,  name: 'Connect 4 Strategy vs AI',           url: `${SITE_URL}/?activity=act-connect4` },
        { '@type': 'ListItem', position: 2,  name: 'Satisfying Ice Cream Licking ASMR',  url: `${SITE_URL}/?activity=act-icecream` },
        { '@type': 'ListItem', position: 3,  name: 'Rainbow Soap Carver & Shaver',        url: `${SITE_URL}/?activity=act-soap-carver` },
        { '@type': 'ListItem', position: 4,  name: 'Relaxing Lawn Mower Simulator',       url: `${SITE_URL}/?activity=act-grass-cutter` },
        { '@type': 'ListItem', position: 5,  name: '"Looks Busy" Mode – Fake Spreadsheet', url: `${SITE_URL}/?activity=act-stealth-work` },
        { '@type': 'ListItem', position: 6,  name: 'Stealthy Doodle Board',               url: `${SITE_URL}/?activity=act-doodle-creative` },
        { '@type': 'ListItem', position: 7,  name: 'Satisfying Bubble Popper',            url: `${SITE_URL}/?activity=act-bubble-pop` },
        { '@type': 'ListItem', position: 8,  name: 'Boredom Truth or Dare',               url: `${SITE_URL}/?activity=act-truth-dare` },
        { '@type': 'ListItem', position: 9,  name: 'Silent Tic-Tac-Toe vs AI',            url: `${SITE_URL}/?activity=act-tictactoe-ai` },
        { '@type': 'ListItem', position: 10, name: 'The Alphabet Mental Challenge',        url: `${SITE_URL}/?activity=act-class-alphabet` },
        { '@type': 'ListItem', position: 11, name: '3-Panel Pencil Comic Strip',           url: `${SITE_URL}/?activity=act-class-doodle-story` },
        { '@type': 'ListItem', position: 12, name: 'Finger Gym (Finger Tutting)',          url: `${SITE_URL}/?activity=act-class-finger-gym` },
        { '@type': 'ListItem', position: 13, name: 'Master the Thumb Around Pen Spin',     url: `${SITE_URL}/?activity=act-class-pen-spinning` },
        { '@type': 'ListItem', position: 14, name: 'The Wikipedia Rabbithole Game',        url: 'https://en.wikipedia.org/wiki/Special:Random' },
        { '@type': 'ListItem', position: 15, name: 'Virtual Tour of a Quirky Museum',      url: 'https://artsandculture.google.com/' },
        { '@type': 'ListItem', position: 16, name: 'The Supreme Origami Challenge',        url: `${SITE_URL}/?activity=act-home-origami` },
        { '@type': 'ListItem', position: 17, name: '5-Item Speed Declutter',               url: `${SITE_URL}/?activity=act-home-declutter` },
        { '@type': 'ListItem', position: 18, name: 'Undetectable Desk Yoga',               url: `${SITE_URL}/?activity=act-work-desk-stretch` },
        { '@type': 'ListItem', position: 19, name: 'The Great Inbox Unsubscribe',          url: `${SITE_URL}/?activity=act-work-email-cleanup` },
        { '@type': 'ListItem', position: 20, name: 'Ultra Fast Typing Training',           url: 'https://play.typeracer.com/' },
        { '@type': 'ListItem', position: 21, name: 'Voice Telepathy Mind-Match',           url: `${SITE_URL}/?activity=act-friends-telepathy` },
        { '@type': 'ListItem', position: 22, name: 'The Exquisite Corpse Story',           url: `${SITE_URL}/?activity=act-friends-story` },
        { '@type': 'ListItem', position: 23, name: 'Wink Assassin / Mafia Game',           url: `${SITE_URL}/?activity=act-friends-wink-assassin` },
        { '@type': 'ListItem', position: 24, name: 'Stars and Satellites Watching',        url: `${SITE_URL}/?activity=act-night-sky` },
        { '@type': 'ListItem', position: 25, name: 'Retro Shadow Puppets Theater',         url: `${SITE_URL}/?activity=act-night-shadow-puppets` },
        { '@type': 'ListItem', position: 26, name: '3D Binaural Sound Bath',               url: 'https://mynoise.net/' },
        { '@type': 'ListItem', position: 27, name: 'Challenge Google Quick Draw AI',       url: 'https://quickdraw.withgoogle.com/' },
        { '@type': 'ListItem', position: 28, name: 'Fly Over Global Live Radios',          url: 'https://radio.garden/' },
        { '@type': 'ListItem', position: 29, name: 'Zoom Through the Scale of the Universe', url: 'https://htwins.net/scale2/' },
        { '@type': 'ListItem', position: 30, name: 'Retro Physics Sandbox – Sandspiel',    url: 'https://sandspiel.club/' },
        { '@type': 'ListItem', position: 31, name: 'Random Nail Art Combo Generator',      url: `${SITE_URL}/?activity=act-girls-nail-art` },
        { '@type': 'ListItem', position: 32, name: '5-Min Digital Vision Board',           url: `${SITE_URL}/?activity=act-girls-vision-board` },
        { '@type': 'ListItem', position: 33, name: 'Bullet Journal Speed Layout',          url: `${SITE_URL}/?activity=act-girls-journal` },
        { '@type': 'ListItem', position: 34, name: 'GRWM Routine Randomizer',              url: `${SITE_URL}/?activity=act-girls-grwm` },
        { '@type': 'ListItem', position: 35, name: 'Letter to Future Me in 1 Year',        url: 'https://www.futureme.org/' },
        { '@type': 'ListItem', position: 36, name: 'Unhinged Personality Quiz Marathon',   url: 'https://uquiz.com/' },
        { '@type': 'ListItem', position: 37, name: 'Mood Playlist in 10 Minutes',          url: `${SITE_URL}/?activity=act-girls-playlist` },
        { '@type': 'ListItem', position: 38, name: 'Hand Lettering in 10 Minutes',         url: `${SITE_URL}/?activity=act-girls-handlettering` },
        { '@type': 'ListItem', position: 39, name: 'Shake to Decide — Yes/No Phone Game',   url: `${SITE_URL}/?activity=act-shake-decide` },
        { '@type': 'ListItem', position: 40, name: 'Tap Speed Test',                        url: `${SITE_URL}/?activity=act-tap-speed` },
        { '@type': 'ListItem', position: 41, name: 'Phone Tilt Maze',                       url: `${SITE_URL}/?activity=act-tilt-maze` },
        { '@type': 'ListItem', position: 42, name: 'One-Thumb Drawing Canvas',              url: `${SITE_URL}/?activity=act-thumb-draw` },
        { '@type': 'ListItem', position: 43, name: 'Swipe Reaction Game',                   url: `${SITE_URL}/?activity=act-swipe-reaction` },
      ],
    },

    // ── SoftwareApplication — interactive browser games ───────────────────────
    {
      '@type': 'SoftwareApplication', name: 'Connect 4 Strategy vs AI', applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser', url: `${SITE_URL}/?activity=act-connect4`,
      description: 'Free online Connect 4 game against an AI opponent. Place pieces freely on the grid. No download required.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'SoftwareApplication', name: 'Satisfying Ice Cream Licking ASMR', applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser', url: `${SITE_URL}/?activity=act-icecream`,
      description: 'Interactive ASMR ice cream licking game. Lick scoops before they melt — free, no install needed.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'SoftwareApplication', name: 'Rainbow Soap Carver ASMR', applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser', url: `${SITE_URL}/?activity=act-soap-carver`,
      description: 'Virtual soap carving and shaving simulator. Satisfying ASMR game — free browser game, no download.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'SoftwareApplication', name: 'Relaxing Lawn Mower Simulator', applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser', url: `${SITE_URL}/?activity=act-grass-cutter`,
      description: 'Mow a virtual lawn in a satisfying browser game. Free, no install, no ads.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'SoftwareApplication', name: 'Satisfying Bubble Popper', applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser', url: `${SITE_URL}/?activity=act-bubble-pop`,
      description: 'Pop satisfying bubbles in this free browser game. Infinite bubble wrap — no install needed.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'SoftwareApplication', name: 'Silent Tic-Tac-Toe vs AI', applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser', url: `${SITE_URL}/?activity=act-tictactoe-ai`,
      description: 'Play Tic-Tac-Toe against an AI opponent in your browser. Silent, free, no download.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'SoftwareApplication', name: 'Boredom Truth or Dare', applicationCategory: 'GameApplication',
      operatingSystem: 'Web Browser', url: `${SITE_URL}/?activity=act-truth-dare`,
      description: 'Free Truth or Dare generator for groups. Random dares and questions — browser-based, no install.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'SoftwareApplication', name: 'Stealthy Doodle Board', applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web Browser', url: `${SITE_URL}/?activity=act-doodle-creative`,
      description: 'Discreet browser doodle board that looks like work. Draw without anyone noticing — free, no install.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },

    // ── HowTo — step-by-step offline activities ───────────────────────────────
    {
      '@type': 'HowTo', name: 'How to Do Finger Gym (Finger Tutting)',
      description: 'Learn fluid geometric finger movements to improve manual dexterity. Silent, can be done anywhere.',
      totalTime: 'PT5M',
      step: [
        { '@type': 'HowToStep', text: 'Press your palms together, then fold every other finger alternately.' },
        { '@type': 'HowToStep', text: 'Try to create perfect right angles by rolling your knuckles.' },
        { '@type': 'HowToStep', text: 'Mentally orchestrate simple routines to practice.' },
      ],
    },
    {
      '@type': 'HowTo', name: 'How to Do the Thumb Around Pen Spin',
      description: 'Learn to spin a pen around your thumb — the classic trick of pen spinning, perfect for class or lectures.',
      totalTime: 'PT15M',
      supply: [{ '@type': 'HowToSupply', name: 'Balanced ballpoint pen' }],
      step: [
        { '@type': 'HowToStep', text: 'Get a balanced pen (a classic long ballpoint pen is perfect).' },
        { '@type': 'HowToStep', text: 'Position it between your middle finger, index finger, and thumb.' },
        { '@type': 'HowToStep', text: 'Give a gentle push with your middle finger to pivot the pen around your thumb.' },
        { '@type': 'HowToStep', text: 'Catch it with your index finger. Be careful not to drop it loudly on the floor!' },
      ],
    },
    {
      '@type': 'HowTo', name: 'How to Fold an Origami Crane',
      description: 'Fold a classic Japanese paper crane from a single square sheet of paper. No scissors needed.',
      totalTime: 'PT15M',
      supply: [{ '@type': 'HowToSupply', name: 'Square sheet of paper' }],
      step: [
        { '@type': 'HowToStep', text: 'Take a standard piece of paper and cut or fold it into a perfect square.' },
        { '@type': 'HowToStep', text: 'Apply basic origami folds: diagonals, then center lines.' },
        { '@type': 'HowToStep', text: 'Follow a paper crane or butterfly fold sequence.' },
        { '@type': 'HowToStep', text: 'Decorate the finished model with pens or markers.' },
      ],
    },
    {
      '@type': 'HowTo', name: 'How to Do a 5-Item Speed Declutter',
      description: 'Find and remove exactly 5 unnecessary items from your space in under 5 minutes. Perfect productivity kickstart.',
      totalTime: 'PT5M',
      step: [
        { '@type': 'HowToStep', text: 'Set a timer for 3 minutes.' },
        { '@type': 'HowToStep', text: 'Scan the room for visual clutter.' },
        { '@type': 'HowToStep', text: 'Pick 5 items: old papers, wrappers, dried-up pens, dirty laundry.' },
        { '@type': 'HowToStep', text: 'Discard or return each item to its proper spot.' },
      ],
    },
    {
      '@type': 'HowTo', name: 'How to Do Undetectable Desk Yoga',
      description: 'Discreet micro-stretches you can do at your desk chair to release tension without anyone noticing.',
      totalTime: 'PT5M',
      step: [
        { '@type': 'HowToStep', text: 'Sit up straight, drop your shoulders, and make gentle, slow circles with your neck.' },
        { '@type': 'HowToStep', text: 'Push your palms toward the ceiling to stretch your spine.' },
        { '@type': 'HowToStep', text: 'Gently roll your ankles and brace your core for 15 seconds.' },
      ],
    },
    {
      '@type': 'HowTo', name: 'How to Play the Exquisite Corpse Story Game',
      description: 'Create a hilarious collaborative story where each player writes one sentence, folds the paper, and passes it on.',
      totalTime: 'PT15M',
      supply: [{ '@type': 'HowToSupply', name: 'Sheet of paper and a pen' }],
      step: [
        { '@type': 'HowToStep', text: 'The first player writes a sentence (Subject + Verb + Object) at the top of the paper.' },
        { '@type': 'HowToStep', text: 'Fold the paper so only the very end of the sentence is visible.' },
        { '@type': 'HowToStep', text: 'The next player continues the story from that clue and folds it again.' },
        { '@type': 'HowToStep', text: 'At the end, unfold the paper and read the absurd masterpiece out loud!' },
      ],
    },
    {
      '@type': 'HowTo', name: 'How to Play Wink Assassin (Mafia Game)',
      description: 'A party game of psychology and secrets. A secret assassin eliminates players by winking, while a detective tries to unmask them.',
      totalTime: 'PT15M',
      step: [
        { '@type': 'HowToStep', text: 'Draw roles in secret (one assassin, one detective, and citizens).' },
        { '@type': 'HowToStep', text: 'All players make eye contact and chat normally.' },
        { '@type': 'HowToStep', text: 'The assassin discreetly winks at a citizen to eliminate them — the victim waits 5 seconds then declares they are dead.' },
        { '@type': 'HowToStep', text: 'The detective must observe the group and accuse the suspect before everyone is eliminated.' },
      ],
    },
    {
      '@type': 'HowTo', name: 'How to Do Retro Shadow Puppets Theater',
      description: 'Use a phone flashlight to project funny animal silhouettes on your bedroom wall. A calming and creative night activity.',
      totalTime: 'PT5M',
      supply: [{ '@type': 'HowToSupply', name: 'Phone with flashlight' }],
      step: [
        { '@type': 'HowToStep', text: 'Prop up your phone so the flashlight shines onto a plain wall.' },
        { '@type': 'HowToStep', text: 'Position your hands between the light source and the wall.' },
        { '@type': 'HowToStep', text: 'Shape your fingers into animal silhouettes (dog, bird, rabbit) and project them.' },
        { '@type': 'HowToStep', text: 'Create a short story or dialogue between the shadow puppets.' },
      ],
    },

    // ── Organization ─────────────────────────────────────────────────────────
    {
      '@type': 'Organization',
      name: 'Bored Master',
      legalName: 'Gesmine-Invest Limited',
      url: SITE_URL,
      identifier: { '@type': 'PropertyValue', propertyID: 'UK Company Number', value: '14120136' },
      address: { '@type': 'PostalAddress', streetAddress: 'Hardy House, 269 Poynders Gardens', addressLocality: 'London', postalCode: 'SW4 8PQ', addressCountry: 'GB' },
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
  'act-shake-decide':        { icon: '📳', joke: 'Can\'t decide? Let physics do it. Final answer.', cta: 'Play Shake to Decide', href: '/?activity=act-shake-decide' },
  'act-tap-speed':           { icon: '⚡', joke: 'Your thumbs are either elite or embarrassing. Find out.', cta: 'Play Tap Speed Test', href: '/?activity=act-tap-speed' },
  'act-tilt-maze':           { icon: '🕹️', joke: 'Tilt your phone. Don\'t drop it. Good luck.', cta: 'Play Phone Tilt Maze', href: '/?activity=act-tilt-maze' },
  'act-thumb-draw':          { icon: '👍', joke: 'One thumb. Zero excuses. Maximum art.', cta: 'Play One-Thumb Drawing', href: '/?activity=act-thumb-draw' },
  'act-swipe-reaction':      { icon: '👈👉', joke: '15 rounds. Your reaction time is about to get humbled.', cta: 'Play Swipe Reaction Game', href: '/?activity=act-swipe-reaction' },
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
          🗂️ Browse All 43 Activities — Fun Things To Do When Bored
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
          43 hand-picked activities • no install • no account • 100% free
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

      {/* Phone Boredom Guide Section */}
      <section className="mt-10 max-w-6xl mx-auto px-4 bg-white border-4 border-black p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-black mb-6 pb-4 border-b-4 border-black">
          What to Do When Bored on Phone
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-black/85">
          {([
            {
              emoji: '🎮',
              title: 'Quick Phone Games When Bored',
              body: (<>No downloads needed. Test your taps in <a href="/?activity=act-tap-speed" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Tap Speed Test</a>, swipe fast in <a href="/?activity=act-swipe-reaction" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Swipe Reaction Game</a>, tilt to navigate in <a href="/?activity=act-tilt-maze" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Phone Tilt Maze</a>, or pop bubbles in <a href="/?activity=act-bubble-pop" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Bubble Popper</a>. All tap-friendly, all free.</>),
            },
            {
              emoji: '😌',
              title: 'Relaxing Phone Activities When Bored',
              body: (<>Need to decompress? Carve a <a href="/?activity=act-soap-carver" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">neon ASMR soap bar</a>, mow a satisfying <a href="/?activity=act-grass-cutter" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">pixel lawn</a> in perfect rows, or pop <a href="/?activity=act-bubble-pop" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">infinite bubble wrap</a> mindlessly. Scientifically proven to remove overthinking (by us, just now).</>),
            },
            {
              emoji: '🤫',
              title: 'Quiet Phone Activities (No Sound)',
              body: (<>Silent mode only: draw on the <a href="/?activity=act-thumb-draw" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">One-Thumb Drawing</a> canvas, pop <a href="/?activity=act-bubble-pop" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Bubble Wrap</a> silently, tilt through <a href="/?activity=act-tilt-maze" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Phone Tilt Maze</a>, or let <a href="/?activity=act-shake-decide" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Shake to Decide</a> settle your indecision wordlessly.</>),
            },
            {
              emoji: '🏆',
              title: 'Phone Games to Play Alone When Bored',
              body: (<>Solo phone sessions: prove your thumbs in <a href="/?activity=act-tap-speed" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Tap Speed Test</a>, beat all 5 levels of <a href="/?activity=act-tilt-maze" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Phone Tilt Maze</a>, score 15/15 in <a href="/?activity=act-swipe-reaction" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Swipe Reaction</a>, or defeat <a href="/?activity=act-connect4" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Connect 4 AI on Hard</a>.</>),
            },
            {
              emoji: '👯',
              title: 'Phone Activities with Friends When Bored',
              body: (<>Multiplayer boredom fix: play <a href="/?activity=act-friends-wink-assassin" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Wink Assassin</a> on one screen, send each other <a href="/?activity=act-friends-story" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Collaborative Story</a> prompts via text, or run a <a href="/?activity=act-truth-dare" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Truth or Dare</a> session over voice call. <a href="/?activity=act-friends-telepathy" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Telepathy Mind-Match</a> works great over FaceTime too.</>),
            },
            {
              emoji: '🌙',
              title: 'What to Do on Your Phone at Night',
              body: (<>3AM phone doom-scroll antidote: dim brightness and explore <a href="https://htwins.net/scale2/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Scale of the Universe</a>, mow a <a href="/?activity=act-grass-cutter" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">relaxing pixel lawn</a>, try <a href="/?activity=act-night-shadow-puppets" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Shadow Puppets Theater</a> with your flashlight, or play <a href="https://mynoise.net/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Binaural Soundscapes</a> to actually fall asleep.</>),
            },
            {
              emoji: '⚡',
              title: '5-Minute Phone Activities When Bored',
              body: (<>Short attention span approved: try <a href="https://quickdraw.withgoogle.com/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Google Quick Draw AI</a> (20-second sketches), do one round of <a href="/?activity=act-tictactoe-ai" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Tic-Tac-Toe</a>, carve one <a href="/?activity=act-soap-carver" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">soap bar</a>, or pop bubbles for exactly 60 seconds in <a href="/?activity=act-bubble-pop" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Bubble Popper</a>.</>),
            },
            {
              emoji: '🎨',
              title: 'Creative Things to Do on Phone When Bored',
              body: (<>Unleash phone creativity: draw anything on the <a href="/?activity=act-doodle-creative" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Doodle Board</a>, write a <a href="/?activity=act-friends-story" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">random story prompt</a>, generate a <a href="/?activity=act-girls-nail-art" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">random nail art combo</a>, or start a digital <a href="/?activity=act-girls-vision-board" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">vision board</a> for something you actually want to accomplish.</>),
            },
            {
              emoji: '😂',
              title: 'Funny Things to Do on Phone When Bored',
              body: (<>Boredom + humor = cured: activate <a href="/?activity=act-stealth-work" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">&ldquo;Looks Busy&rdquo; Mode</a> (fake spreadsheet that fools everyone), play <a href="/?activity=act-truth-dare" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Truth or Dare</a> with your most chaotic contact, write yourself a <a href="https://www.futureme.org/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">letter to open in 5 years</a> and make it embarrassing on purpose.</>),
            },
          ] as { emoji: string; title: string; body: React.ReactNode }[]).map(({ emoji, title, body }) => (
            <div key={title} className="bg-[#E9E9E9] p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black text-sm uppercase tracking-tight mb-2 flex items-center gap-1.5 border-b border-black/20 pb-1.5">
                <span>{emoji}</span> {title}
              </h3>
              <p className="leading-relaxed font-medium">{body}</p>
            </div>
          ))}
        </div>

        {/* Phone FAQ */}
        <div className="mt-8 pt-6 border-t-4 border-black">
          <h3 className="font-black text-sm uppercase tracking-tight text-black mb-4">📱 FAQ — What to Do When Bored on Phone</h3>
          <div className="space-y-3">
            {([
              {
                q: 'What can I do on my phone when I\'m bored?',
                a: (<>Best no-download phone activities: pop <a href="/?activity=act-bubble-pop" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">infinite bubble wrap</a>, carve a <a href="/?activity=act-soap-carver" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">neon ASMR soap</a>, beat the <a href="/?activity=act-connect4" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Connect 4 AI</a>, lick a <a href="/?activity=act-icecream" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">melting ice cream</a>, or play <a href="https://quickdraw.withgoogle.com/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Google Quick Draw</a>. All free, all instant, no account required.</>),
              },
              {
                q: 'What games can I play on my phone when bored alone?',
                a: (<>Top solo phone games when bored: <a href="/?activity=act-connect4" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Connect 4 vs AI</a> (3 difficulty levels), <a href="/?activity=act-tictactoe-ai" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Tic-Tac-Toe vs AI</a>, <a href="/?activity=act-bubble-pop" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Bubble Popper</a> (beat your own score), <a href="/?activity=act-icecream" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Ice Cream ASMR</a>, and <a href="/?activity=act-grass-cutter" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Lawn Mower Simulator</a>. No login, no install, instant tap-to-play.</>),
              },
              {
                q: 'What to do when bored on phone at night?',
                a: (<>Low-stimulation night phone activities: mow a <a href="/?activity=act-grass-cutter" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">relaxing pixel lawn</a> (no sound needed), explore <a href="https://htwins.net/scale2/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Scale of the Universe</a>, try <a href="https://mynoise.net/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">MyNoise sound baths</a> to wind down, or write a <a href="https://www.futureme.org/" target="_blank" rel="noopener noreferrer" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">letter to future you</a>. Avoid anything with leaderboards — they spike adrenaline.</>),
              },
              {
                q: 'What are fun things to do on your phone when bored with friends?',
                a: (<>Phone fun with friends: share one screen for <a href="/?activity=act-friends-wink-assassin" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Wink Assassin</a>, run a <a href="/?activity=act-truth-dare" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Truth or Dare</a> generator, play <a href="/?activity=act-friends-telepathy" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Telepathy Mind-Match</a> over FaceTime, or write an <a href="/?activity=act-friends-story" className="font-black text-[#1D4ED8] underline decoration-2 hover:bg-[#00FF00] hover:text-black px-0.5 transition-colors">Exquisite Corpse story</a> by texting one sentence each. Zero setup, immediate chaos.</>),
              },
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
      <footer className="mt-16 border-t-4 border-black bg-[#00FF00] py-6 px-8 flex flex-col items-center text-black text-xs font-black uppercase gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-4">
          <span>Bored Master — 43 activities, no install, no account, 100% free.</span>
          <p className="font-mono font-bold tracking-tight text-center">© 2026 Bored Master Inc. • Free your mind from boredom.</p>
        </div>
        <p className="normal-case font-medium text-[10px] text-black/70 text-center max-w-2xl">
          Bored Master is part of Gesmine-Invest Limited, registered UK company number 14120136, registered office address at Hardy House, 269 Poynders Gardens, London, London, United Kingdom, SW4 8PQ.
        </p>
      </footer>
    </>
  )
}
