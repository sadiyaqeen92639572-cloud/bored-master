import { Activity } from '../types';

export const activities: Activity[] = [
  // Interactive - Connect 4 Strategy vs AI
  {
    id: 'act-connect4',
    title: '🔴 Connect 4 Strategy vs AI',
    description: 'Outsmart our local tactical computer bot in this high-contrast Neobrutalist gravity-drop 4-in-a-row match.',
    contexts: ['class', 'school', 'work', 'home', 'computer'],
    durations: ['5m', '15m'],
    moods: ['productive', 'secret', 'chill'],
    devices: ['computer', 'phone'],
    risk: 'safe',
    interactiveType: 'connect4',
    steps: [
      'Enter your code name to start.',
      'Hover over a column and click or tap to drop your coin.',
      'Outsmart the AI by aligning 4 of your coins vertically, horizontally, or diagonally.'
    ]
  },
  // Interactive - Ice Cream Licking
  {
    id: 'act-icecream',
    title: '🍦 Satisfying Ice Cream Licking ASMR',
    description: 'A sensory licking experience! Move your mouse (the tongue 👅) over melting ice cream scoops and flowing drips to lick them up with relaxing pops and ASMR sounds.',
    contexts: ['home', 'class', 'work', 'computer', 'night'],
    durations: ['30s', '5m'],
    moods: ['chill', 'funny', 'secret'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    interactiveType: 'icecream',
    steps: [
      'Watch the ice cream melt and spawn dripping flows.',
      'Hover your cursor (the tongue) over the drips to lick them instantly.',
      'Clean up all drips before the ice cream completely melts!'
    ]
  },
  // Interactive - Soap Carver
  {
    id: 'act-soap-carver',
    title: '🧼 Rainbow Soap Carver & Shaver',
    description: 'Slice layers off a satisfying, colorful soap bar with relaxing ASMR audio. Shave the soap block fully to reveal a secret cute toy hidden at the center!',
    contexts: ['home', 'class', 'work', 'computer'],
    durations: ['30s', '5m', '15m'],
    moods: ['chill', 'funny', 'secret'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    interactiveType: 'soap_carver',
    steps: [
      'Drag your cutter over the pristine colorful soap blocks.',
      'Watch satisfying soap curls peel away with rhythmic tones.',
      'Clear all layers to unearth the secret prize trapped inside.'
    ]
  },
  // Interactive - Grass Cutter
  {
    id: 'act-grass-cutter',
    title: '🌱 Relaxing Lawn Mower Simulator',
    description: 'Prune overgrown dark green grass blocks into a beautiful perfectly manicured bright neon-green turf. Move in clean spirals or straight rows for absolute satisfaction.',
    contexts: ['home', 'class', 'work', 'computer'],
    durations: ['30s', '5m', '15m'],
    moods: ['chill', 'productive', 'secret'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    interactiveType: 'grass_cutter',
    steps: [
      'Hold and drag the orange lawn mower across overgrown grass.',
      'Trim overgrown grass tiles into high-contrast short neon green turf.',
      'Mow 100% of the grid to reveal a perfectly pruned, beautiful garden!'
    ]
  },
  // Interactive - Stealth
  {
    id: 'act-stealth-work',
    title: '💻 "Looks Busy" Mode - Realistic Spreadsheet',
    description: 'An interactive fake financial spreadsheet. Type on your keyboard and realistic tables and formulas will write themselves. Ideal to look extremely focused at the office or in class.',
    contexts: ['work', 'class', 'school', 'computer'],
    durations: ['5m', '15m', '1h'],
    moods: ['secret', 'productive'],
    devices: ['computer'],
    risk: 'safe',
    interactiveType: 'stealth',
    steps: [
      'Activate full-screen mode for full immersion.',
      'Type frantically on any keys on your keyboard.',
      'Watch tables, charts, and sales reports update in real-time.',
      'Press Escape to exit instantly in case of an alert!'
    ]
  },
  // Interactive - Doodle
  {
    id: 'act-doodle-creative',
    title: '🎨 Stealthy Doodle Board',
    description: 'A built-in discreet and fast drawing canvas. Express your creativity or draw abstract patterns without leaving paper trails or suspicious browser tabs.',
    contexts: ['class', 'school', 'home', 'computer'],
    durations: ['30s', '5m', '15m'],
    moods: ['chill', 'secret'],
    devices: ['computer', 'phone'],
    risk: 'safe',
    interactiveType: 'doodle',
    steps: [
      'Select a brush color and stroke thickness.',
      'Doodle aimlessly (perfect for relieving nervous energy or boredom).',
      'Clear the entire board with a single click if someone approaches.'
    ]
  },
  // Interactive - Bubble Popper
  {
    id: 'act-bubble-pop',
    title: '🫧 Satisfying Bubble Popper',
    description: 'An infinite virtual bubble wrap with ultra-satisfying visual and optional sound feedback. A perfect fidget toy to keep your fingers busy while staying low-key.',
    contexts: ['home', 'class', 'work', 'computer', 'night'],
    durations: ['30s', '5m'],
    moods: ['chill', 'funny', 'secret'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    interactiveType: 'bubbles',
    steps: [
      'Click or tap the bubbles to pop them.',
      'Toggle the sound effect on or off based on your required stealth level.',
      'Click "Regenerate" to get a fresh, pristine sheet of bubbles.'
    ]
  },
  // Interactive - Truth or Dare
  {
    id: 'act-truth-dare',
    title: '🔥 Boredom Truth or Dare',
    description: 'An interactive "Truth or Dare" card generator specially crafted to break the ice or entertain a group of bored friends at home or at parties.',
    contexts: ['friends', 'night', 'home'],
    durations: ['15m', '1h'],
    moods: ['funny', 'social'],
    devices: ['phone', 'computer'],
    risk: 'loud',
    interactiveType: 'truth_dare',
    steps: [
      'Gather your friends in a circle.',
      'Select "Truth" for an intriguing question or "Dare" for an amusing challenge.',
      'Pass the phone or device to the next player!'
    ]
  },
  // Interactive - TicTacToe
  {
    id: 'act-tictactoe-ai',
    title: '❌ Silent Tic-Tac-Toe vs AI',
    description: 'Face our local artificial intelligence in a minimalist, silent, and ultra-discreet tic-tac-toe game. Perfect for short tactical breaks.',
    contexts: ['class', 'school', 'work', 'computer'],
    durations: ['5m', '15m'],
    moods: ['productive', 'secret', 'chill'],
    devices: ['computer', 'phone'],
    risk: 'safe',
    interactiveType: 'tictactoe',
    steps: [
      'Start by placing your first mark.',
      'The computer instantly plays its move.',
      'Align 3 marks to claim victory and earn focus points.'
    ]
  },
  // Non-Interactive: Class Mode
  {
    id: 'act-class-alphabet',
    title: '🔤 The Alphabet Mental Challenge',
    description: 'Choose a complex theme (countries, brands, movies) and try to name one item for each letter of the alphabet from A to Z. All in your head, perfect for an extremely boring class.',
    contexts: ['class', 'school'],
    durations: ['5m', '15m'],
    moods: ['chill', 'productive', 'secret'],
    devices: ['offline'],
    risk: 'safe',
    steps: [
      'Choose a category: "Celebrities", "Foods", "Video Games", or "Cities".',
      'Go through the alphabet in your head: A for Argentina, B for Brazil, C for Canada...',
      'If you get stuck on a letter for more than a minute, skip it!'
    ]
  },
  {
    id: 'act-class-doodle-story',
    title: '📝 3-Panel Pencil Comic Strip',
    description: 'On a corner of paper, draw a quick 3-panel story featuring an object from your pencil case (like a pencil escaping its sharpener).',
    contexts: ['class', 'school'],
    durations: ['5m', '15m'],
    moods: ['funny', 'chill', 'secret'],
    devices: ['paper'],
    risk: 'safe',
    steps: [
      'Draw three identical boxes on the back of your notebook.',
      'Draw the initial situation, the conflict, and a funny resolution.',
      'Use expressive faces on the inanimate objects for comedic effect.'
    ]
  },
  {
    id: 'act-class-finger-gym',
    title: '🖖 Finger Gym (Finger Tutting)',
    description: 'Learn to make fluid geometric movements with your fingers and hands. It is extremely satisfying, completely silent, and improves manual dexterity.',
    contexts: ['class', 'school', 'work'],
    durations: ['5m', '15m'],
    moods: ['chill', 'secret'],
    devices: ['offline'],
    risk: 'safe',
    steps: [
      'Press your palms together, then fold every other finger alternately.',
      'Try to create perfect right angles by rolling your knuckles.',
      'Mentally orchestrate simple routines to practice.'
    ]
  },
  {
    id: 'act-class-pen-spinning',
    title: '🖊️ Master the "Thumb Around" Pen Spin',
    description: 'Learn to spin a pen around your thumb. It is the basic trick of pen spinning, a classic staple of boring lectures.',
    contexts: ['class', 'school'],
    durations: ['15m', '1h'],
    moods: ['chill', 'secret'],
    devices: ['paper', 'offline'],
    risk: 'medium',
    steps: [
      'Get a balanced pen (a classic long ballpoint pen is perfect).',
      'Position it between your middle finger, index finger, and thumb.',
      'Give a gentle push with your middle finger to pivot the pen around your thumb.',
      'Catch it with your index finger. Be careful not to drop it loudly on the floor!'
    ]
  },
  // Home Mode
  {
    id: 'act-home-wikipedia',
    title: '🌐 The Wikipedia Game (Rabbithole)',
    description: 'Start from a completely random Wikipedia page and try to reach a specific target page (e.g., "Albert Einstein" or "Pizza") using only internal hyperlinks.',
    contexts: ['home', 'computer'],
    durations: ['15m', '1h'],
    moods: ['productive', 'funny', 'chill'],
    devices: ['computer', 'phone'],
    risk: 'safe',
    externalLink: 'https://en.wikipedia.org/wiki/Special:Random',
    steps: [
      'Open a random Wikipedia page to begin.',
      'Define your final target (e.g., "Albert Einstein" or "Pizza").',
      'Navigate solely by clicking blue links inside the articles.',
      'Keep track of the number of clicks it takes to reach your destination!'
    ]
  },
  {
    id: 'act-home-museum',
    title: '🏛️ Virtual Tour of a Quirky Museum',
    description: 'Explore incredible art galleries and world museums for free using Google Arts & Culture or unique digital archive collections.',
    contexts: ['home', 'computer'],
    durations: ['15m', '1h'],
    moods: ['chill', 'productive'],
    devices: ['computer', 'phone'],
    risk: 'safe',
    externalLink: 'https://artsandculture.google.com/',
    steps: [
      'Head to Google Arts & Culture.',
      'Use Street View to virtually wander through the Palace of Versailles or the British Museum.',
      'Zoom in fully on a famous painting to inspect the brushwork and textures.'
    ]
  },
  {
    id: 'act-home-origami',
    title: '📐 The Supreme Origami Challenge',
    description: 'Take a simple square sheet of paper and craft a classic Japanese crane or a water cup. No scissors, just clean folds.',
    contexts: ['home', 'school', 'class'],
    durations: ['15m', '1h'],
    moods: ['chill', 'productive'],
    devices: ['paper'],
    risk: 'safe',
    steps: [
      'Take a standard piece of paper and cut/fold it into a perfect square.',
      'Follow basic origami folds: diagonals, center lines.',
      'Try to fold a paper crane or a butterfly.',
      'When done, decorate it with your pens.'
    ]
  },
  {
    id: 'act-home-declutter',
    title: '🧹 5-Item Speed Declutter',
    description: 'Look around your room and find exactly 5 unnecessary items to discard, donate, or return to their proper place. Boredom is amazing for kickstarting productivity.',
    contexts: ['home', 'work'],
    durations: ['5m', '15m'],
    moods: ['productive', 'chill'],
    devices: ['offline'],
    risk: 'safe',
    steps: [
      'Set a timer for 3 minutes.',
      'Scan the room for visual clutter.',
      'Pick 5 items: old papers, wrappers, dried-up pens, dirty laundry.',
      'Discard or return each item to its exact spot.'
    ]
  },
  // Work Mode
  {
    id: 'act-work-desk-stretch',
    title: '🧘 Undetectable Desk Yoga',
    description: 'A series of subtle, discreet micro-stretches you can do right on your desk chair to release tension without looking like you are working out.',
    contexts: ['work', 'class', 'computer'],
    durations: ['5m'],
    moods: ['chill', 'productive', 'secret'],
    devices: ['offline'],
    risk: 'safe',
    steps: [
      'Sit up straight, drop your shoulders, and make gentle, slow circles with your neck.',
      'Push your palms toward the ceiling to stretch your spine.',
      'Gently roll your ankles and brace your core for 15 seconds.'
    ]
  },
  {
    id: 'act-work-email-cleanup',
    title: '📥 The Great Inbox Unsubscribe',
    description: 'Take a few minutes to unsubscribe from all those commercial newsletters and cluttering sales emails in your inbox.',
    contexts: ['work', 'computer'],
    durations: ['15m', '1h'],
    moods: ['productive', 'chill'],
    devices: ['computer', 'phone'],
    risk: 'safe',
    steps: [
      'Search for the keyword "Unsubscribe" in your email client.',
      'Open recent promotional mail and click the unsubscribe link.',
      'Feel the satisfying relief of a lighter inbox.'
    ]
  },
  {
    id: 'act-work-type-racer',
    title: '⌨️ Ultra Fast Typing Training',
    description: 'Improve your typing speed with fun and engaging tests. Your colleagues will think you are typing up an essential business report.',
    contexts: ['work', 'computer', 'school'],
    durations: ['5m', '15m'],
    moods: ['productive', 'funny'],
    devices: ['computer'],
    risk: 'medium',
    externalLink: 'https://play.typeracer.com/',
    steps: [
      'Open a speed typing test website.',
      'Place your ten fingers on the home row of the keyboard.',
      'Type the text as fast as possible without making mistakes.',
      'Enjoy the satisfying clatter of your keys.'
    ]
  },
  // Friends Mode
  {
    id: 'act-friends-telepathy',
    title: '🧠 Voice Telepathy Mind-Match',
    description: 'A hilarious game of connection where two players must say the exact same word at the exact same time, starting from two completely unrelated concepts.',
    contexts: ['friends'],
    durations: ['5m', '15m'],
    moods: ['funny', 'social'],
    devices: ['offline'],
    risk: 'loud',
    steps: [
      'Two players each choose a secret random word (e.g., "Dog" and "Space").',
      'On the count of three, they say them out loud.',
      'Then, they try to find an overlapping middle concept (e.g., "Laika", the space dog).',
      'Repeat until you speak the same word in perfect unison!'
    ]
  },
  {
    id: 'act-friends-story',
    title: '✍️ The Exquisite Corpse Story',
    description: 'Create an absurd story together. Each person writes one sentence on a piece of paper, folds it to hide the beginning, and hands it to the next player.',
    contexts: ['friends', 'school'],
    durations: ['15m', '1h'],
    moods: ['funny', 'social'],
    devices: ['paper'],
    risk: 'loud',
    steps: [
      'The first player writes a sentence (Subject + Verb + Object) at the top of the paper.',
      'Fold the paper so only the very end of the sentence is visible.',
      'The next player continues the story from that clue and folds it again.',
      'At the end, unfold the paper and read the absurd masterpiece out loud!'
    ]
  },
  {
    id: 'act-friends-wink-assassin',
    title: '👁️ Wink Assassin / Mafia Game',
    description: 'A party game of psychology and secrets. One secret assassin eliminates players by winking at them, while a detective tries to unmask them.',
    contexts: ['friends', 'school', 'night'],
    durations: ['15m', '1h'],
    moods: ['funny', 'social'],
    devices: ['offline'],
    risk: 'loud',
    steps: [
      'Draw roles in secret (one assassin, one detective, and citizens).',
      'All players make eye contact and chat normally.',
      'The assassin must discreetly wink at a citizen to eliminate them. The victim waits 5 seconds, then declares they are dead.',
      'The detective must observe the group and accuse the suspect before everyone is eliminated.'
    ]
  },
  // Night Mode
  {
    id: 'act-night-sky',
    title: '🌌 Stars and Satellites Watching',
    description: 'Turn off all the lights, look out the window or go outside, and gaze at the night sky to find famous constellations or artificial satellites (like the ISS or Starlink).',
    contexts: ['night', 'home'],
    durations: ['15m', '1h'],
    moods: ['chill'],
    devices: ['offline'],
    risk: 'safe',
    steps: [
      'Turn off all light sources in your room.',
      'Wait 5 minutes for your eyes to fully adjust to the dark.',
      'Look for the Big Dipper or the North Star.',
      'Watch for steadily moving points of light: those are satellites!'
    ]
  },
  {
    id: 'act-night-shadow-puppets',
    title: '🐕 Retro Shadow Puppets Theater',
    description: 'Use your phone flashlight to project funny animal silhouettes on your bedroom wall. An ancient and calming art form.',
    contexts: ['night', 'home'],
    durations: ['5m', '15m'],
    moods: ['funny', 'chill'],
    devices: ['phone', 'offline'],
    risk: 'safe',
    steps: [
      'Prop up your phone so the flashlight shines onto a plain wall.',
      'Cross your hands to form a bird (interlocking thumbs for wings).',
      'Shape your fingers to form a dog (bending fingers for ears and snout).',
      'Move your hands to bring the silhouettes to life.'
    ]
  },
  {
    id: 'act-night-ambient-sound',
    title: '🎧 3D Binaural Sound Bath',
    description: 'Put your headphones on, lie down comfortably in pitch darkness, and listen to a binaural soundscape (forest rain, a cozy jazz cafe, or a space cabin).',
    contexts: ['night', 'home'],
    durations: ['15m', '1h'],
    moods: ['chill'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    externalLink: 'https://mynoise.net/',
    steps: [
      'Plug in your headphones or earbuds (stereo is required).',
      'Select an ambience on myNoise or YouTube (search "Binaural Rain" or "Cozy Cafe 3D").',
      'Close your eyes and let your mind chart the sonic space.'
    ]
  },
  // Computer Mode (Browser Rabbit Holes)
  {
    id: 'act-comp-quick-draw',
    title: '🤖 Challenge Google’s "Quick, Draw!" AI',
    description: 'A hilarious AI game where you must draw requested items in under 20 seconds, and Google’s neural network tries to guess what it is in real-time.',
    contexts: ['computer', 'home', 'work', 'school'],
    durations: ['5m', '15m'],
    moods: ['funny', 'chill'],
    devices: ['computer', 'phone'],
    risk: 'safe',
    externalLink: 'https://quickdraw.withgoogle.com/',
    steps: [
      'Click the link to open the official game.',
      'Read your assigned word (e.g., "bicycle" or "hat").',
      'Draw as clearly as possible while the AI voice comments on your strokes in real-time.',
      'Complete all 6 drawings to see your final score.'
    ]
  },
  {
    id: 'act-comp-radio-garden',
    title: '📻 Fly Over Global Live Radios',
    description: 'Spin an interactive 3D globe and tune in instantly to any local radio station streaming live anywhere on Earth.',
    contexts: ['computer', 'home', 'work'],
    durations: ['15m', '1h'],
    moods: ['chill', 'productive'],
    devices: ['computer', 'phone'],
    risk: 'safe',
    externalLink: 'https://radio.garden/',
    steps: [
      'Visit Radio Garden.',
      'Spin the glowing green globe.',
      'Click on a tiny green dot in Siberia, the Amazon rainforest, or Tokyo.',
      'Discover what people are listening to at this very moment.'
    ]
  },
  {
    id: 'act-comp-scale-universe',
    title: '🌌 Zoom Through the Scale of the Universe',
    description: 'A breathtaking interactive scale tool that lets you zoom from the infinitely small (quarks and strings) to the infinitely large (the observable universe).',
    contexts: ['computer', 'home', 'school'],
    durations: ['15m', '1h'],
    moods: ['chill', 'productive'],
    devices: ['computer'],
    risk: 'safe',
    externalLink: 'https://htwins.net/scale2/',
    steps: [
      'Open the interactive scale website.',
      'Scroll your mouse wheel forward or backward.',
      'Compare a red blood cell to a virus, a human, Earth, the solar system, and giant nebulae.'
    ]
  },
  {
    id: 'act-comp-sandspiel',
    title: '⏳ Retro Physics Sandbox (Sandspiel)',
    description: 'A classic pixel-art physics sandbox game. Drop sand, water, fire, lava, acid, and watch gorgeous, complex chain reactions unfold.',
    contexts: ['computer', 'home', 'class'],
    durations: ['5m', '15m'],
    moods: ['chill', 'funny'],
    devices: ['computer', 'phone'],
    risk: 'safe',
    externalLink: 'https://sandspiel.club/',
    steps: [
      'Open Sandspiel online.',
      'Select an element like "Sand" or "Lava".',
      'Draw on the screen to watch gravity pull particles down.',
      'Add acid or water to dissolve or extinguish materials.'
    ]
  },

  // ── FOR GIRLS ─────────────────────────────────────────────────────────────
  {
    id: 'act-girls-nail-art',
    title: '💅 Random Nail Art Combo Generator',
    description: 'Get an instant random nail art idea: color palette, pattern, and accent finger combo. Scroll through combinations until you find the one. Then actually do it (or just screenshot it).',
    contexts: ['home', 'night', 'friends'],
    durations: ['30s', '5m'],
    moods: ['funny', 'chill', 'social'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    tags: ['girls'],
    steps: [
      'Hit "Generate" to get a random base color + pattern + accent nail combo.',
      'Keep re-rolling until something looks actually cute.',
      'Screenshot your fave combo and try it on your nails.'
    ],
    externalLink: 'https://www.nailartgallery.com/'
  },
  {
    id: 'act-girls-vision-board',
    title: '🌸 5-Min Digital Vision Board',
    description: 'Open a blank Google Slides (or Canva free) and paste images of everything you want: travel, aesthetic rooms, career dreams, snacks. Chaotic Pinterest energy. No rules.',
    contexts: ['home', 'night', 'computer', 'school'],
    durations: ['15m', '1h'],
    moods: ['productive', 'chill'],
    devices: ['computer', 'phone'],
    risk: 'safe',
    tags: ['girls'],
    steps: [
      'Open Google Slides or Canva (free, no login needed).',
      'Search Google Images for anything that makes you feel something.',
      'Paste, resize, and arrange until it looks like your dream life.',
      'Save as wallpaper or print it out.'
    ]
  },
  {
    id: 'act-girls-journal',
    title: '📔 Bullet Journal Speed Layout',
    description: 'Set up a minimal weekly or mood tracker layout in under 5 minutes. No fancy supplies needed — a pen and any notebook work. Aesthetic by nature, functional by accident.',
    contexts: ['home', 'night', 'school', 'class'],
    durations: ['5m', '15m'],
    moods: ['productive', 'chill'],
    devices: ['paper', 'offline'],
    risk: 'safe',
    tags: ['girls'],
    steps: [
      'Open any notebook to a blank page.',
      'Draw a simple weekly grid (7 boxes, label with days).',
      'Add one mood tracker: a row of tiny circles, one per day.',
      'Decorate the border with whatever doodles feel right. Done.'
    ]
  },
  {
    id: 'act-girls-grwm',
    title: '🪞 GRWM Routine Randomizer',
    description: 'Can\'t decide what to wear or how to do your makeup? Spin a random vibe: "clean girl", "dark academia", "Y2K", "cottagecore", "no-makeup makeup". Then commit.',
    contexts: ['home', 'night', 'friends'],
    durations: ['5m', '15m'],
    moods: ['funny', 'chill', 'social'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    tags: ['girls'],
    steps: [
      'Pick a random aesthetic from the list (or close your eyes and point).',
      'Look it up on Pinterest for 2 minutes.',
      'Get dressed/ready in that style — even if you\'re not going anywhere.',
      'Take a mirror selfie. You earned it.'
    ],
    externalLink: 'https://www.pinterest.com/search/pins/?q=aesthetic+outfits'
  },
  {
    id: 'act-girls-letter',
    title: '💌 Letter to Future Me (1 Year)',
    description: 'Write an honest, unfiltered letter to yourself one year from now. What do you want? What\'s stressing you out? What do you hope changes? Seal it (digitally or on paper) and set a reminder.',
    contexts: ['home', 'night', 'school'],
    durations: ['15m', '1h'],
    moods: ['chill', 'productive'],
    devices: ['computer', 'phone', 'paper', 'offline'],
    risk: 'safe',
    tags: ['girls'],
    steps: [
      'Open futureme.org (free, anonymous) or grab a pen and paper.',
      'Write freely: your current mood, goals, fears, people in your life.',
      'Set a delivery date exactly 1 year from now.',
      'Forget about it. Future-you will be shocked at how much changes.'
    ],
    externalLink: 'https://www.futureme.org/'
  },
  {
    id: 'act-girls-quiz',
    title: '🌟 Unhinged Personality Quiz Marathon',
    description: 'Which villain era are you in? What pasta shape matches your energy? Which decade were you born in the wrong century for? Take 3 chaotic quizzes back-to-back and compare results with a friend.',
    contexts: ['home', 'night', 'friends', 'school'],
    durations: ['5m', '15m'],
    moods: ['funny', 'social', 'chill'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    tags: ['girls'],
    steps: [
      'Go to uquiz.com or buzzfeed.com/quizzes.',
      'Pick the most unhinged quiz title you see.',
      'Answer honestly (or chaotically — your call).',
      'Send the result to your group chat with zero context.'
    ],
    externalLink: 'https://uquiz.com/'
  },
  {
    id: 'act-girls-playlist',
    title: '🎵 Mood Playlist in 10 Minutes',
    description: 'Build the perfect playlist for your current vibe: main character moment, villain arc, soft launch, or full spiral. No skips allowed — only songs that actually hit.',
    contexts: ['home', 'night', 'friends', 'school'],
    durations: ['15m', '1h'],
    moods: ['chill', 'productive', 'social'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    tags: ['girls'],
    steps: [
      'Name your playlist something dramatic (very important).',
      'Add 10 songs that match the current energy — no fillers.',
      'Include at least one guilty pleasure and one throwback.',
      'Share it or keep it secret. Both are valid.'
    ]
  },
  {
    id: 'act-girls-handlettering',
    title: '✨ Hand Lettering in 10 Minutes',
    description: 'Learn one hand lettering technique that makes your handwriting look like an aesthetic quote poster. All you need: a pen, a piece of paper, and 10 minutes of patience.',
    contexts: ['home', 'night', 'school', 'class'],
    durations: ['5m', '15m'],
    moods: ['chill', 'productive'],
    devices: ['paper', 'offline'],
    risk: 'safe',
    tags: ['girls'],
    steps: [
      'Pick one word to practice (your name, "vibes", whatever).',
      'Write it in cursive, then thicken all downstrokes.',
      'Add a drop shadow 2px to the right and bottom.',
      'Try a second word — it already looks better. Keep going.'
    ]
  },
  {
    id: 'act-shake-decide',
    title: '📳 Shake to Decide',
    description: 'Can\'t make a decision? Shake your phone and let the universe (and accelerometer) decide for you. Yes or No. Final answer.',
    contexts: ['home', 'friends', 'night'],
    durations: ['30s'],
    moods: ['funny', 'chill', 'social'],
    devices: ['phone'],
    risk: 'safe',
    interactiveType: 'shake_decide',
    steps: ['Think of your yes/no question.', 'Shake your phone 3 times.', 'Accept the verdict. No renegotiating.']
  },
  {
    id: 'act-tap-speed',
    title: '⚡ Tap Speed Test',
    description: 'How fast can you tap? 10 seconds. Maximum effort. Prove your thumbs are elite.',
    contexts: ['home', 'class', 'work', 'friends'],
    durations: ['30s'],
    moods: ['productive', 'funny', 'social'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    interactiveType: 'tap_speed',
    steps: ['Tap the big button to start the 10-second countdown.', 'Tap as fast as humanly possible.', 'Check your taps-per-second score and rating.']
  },
  {
    id: 'act-tilt-maze',
    title: '🕹️ Phone Tilt Maze',
    description: 'Tilt your phone to roll the ball to the target. No touching the screen — pure physics vibes.',
    contexts: ['home', 'class', 'friends'],
    durations: ['5m', '15m'],
    moods: ['productive', 'chill'],
    devices: ['phone'],
    risk: 'safe',
    interactiveType: 'tilt_maze',
    steps: ['Grant motion sensor permission when prompted.', 'Tilt your phone to roll the yellow ball toward the green target.', 'Avoid the walls. Beat all 5 levels.']
  },
  {
    id: 'act-thumb-draw',
    title: '👍 One-Thumb Drawing',
    description: 'A drawing canvas built for one thumb. Big colors, fat brushes, zero precision required. Pure mobile art chaos.',
    contexts: ['home', 'class', 'night'],
    durations: ['5m', '15m'],
    moods: ['chill', 'funny'],
    devices: ['phone'],
    risk: 'safe',
    interactiveType: 'thumb_draw',
    steps: ['Pick a color from the bottom palette.', 'Draw with your thumb on the canvas.', 'Download your masterpiece (or delete it in shame).']
  },
  {
    id: 'act-swipe-reaction',
    title: '👈👉 Swipe Reaction Game',
    description: 'Swipe left or right before the round ends. 15 rounds. Speed + accuracy. Your thumbs have never been tested like this.',
    contexts: ['home', 'class', 'friends', 'night'],
    durations: ['5m'],
    moods: ['funny', 'productive', 'social'],
    devices: ['phone', 'computer'],
    risk: 'safe',
    interactiveType: 'swipe_reaction',
    steps: ['Read the on-screen direction prompt.', 'Swipe left or right accordingly (or use arrow keys).', 'Score as many correct swipes as possible in 15 rounds.']
  }
];

// Helper values for categories
export const contextLabels = {
  class: '🏫 In Class',
  home: '🏠 At Home',
  school: '🎒 At School',
  work: '💼 At Work',
  friends: '👥 With Friends',
  computer: '💻 On Computer',
  night: '🌙 At Night'
};

export const durationLabels = {
  '30s': '⏱️ < 1 min',
  '5m': '⏱️ 5 min',
  '15m': '⏱️ 15 min',
  '1h': '⏱️ 1 hour'
};

export const moodLabels = {
  chill: '🌸 Chill & Zen',
  funny: '🤪 Fun & Absurd',
  productive: '📈 Productive',
  social: '🤝 Social',
  secret: '🤫 Stealth'
};

export const deviceLabels = {
  phone: '📱 Phone',
  computer: '💻 Computer',
  paper: '📝 Paper & Pen',
  offline: '🧠 100% Mental/Physical'
};

export const riskLabels = {
  safe: '🟢 Totally Invisible',
  medium: '🟡 Medium Risk (movements)',
  loud: '🔴 Loud / Visible'
};
