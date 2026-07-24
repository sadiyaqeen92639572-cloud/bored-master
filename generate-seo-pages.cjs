#!/usr/bin/env node
/**
 * generate-seo-pages.js
 * Generates static HTML satellite pages for boredmaster.com SEO
 * Each page has unique content + loads the SPA for interactivity
 */

const fs = require('fs');
const path = require('path');

const SITE = 'https://boredmaster.com';

const shell = (slug, title, desc, h1, h2, intro, faqs, schema) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${SITE}/${slug}/">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${SITE}/${slug}/">
  <meta property="og:type" content="website">
  <meta name="robots" content="index, follow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#F4F4F1;color:#1A1A1A;line-height:1.6}
    .hero{background:#fff;border-bottom:4px solid #000;padding:2rem 1rem 3rem;text-align:center}
    .hero h1{font-size:clamp(1.6rem,4vw,2.4rem);font-weight:900;text-transform:uppercase;margin-bottom:.75rem}
    .hero p{max-width:640px;margin:0 auto 1.5rem;font-size:1rem;color:#444}
    .cta{display:inline-block;background:#00FF00;border:3px solid #000;padding:.9rem 2.2rem;font-weight:900;font-size:1rem;text-transform:uppercase;text-decoration:none;color:#000;box-shadow:5px 5px 0 #000;transition:.15s}
    .cta:hover{transform:translate(2px,2px);box-shadow:3px 3px 0 #000}
    .content{max-width:760px;margin:2.5rem auto;padding:0 1rem}
    .content h2{font-size:1.3rem;font-weight:900;text-transform:uppercase;border-left:5px solid #00FF00;padding-left:.75rem;margin:2rem 0 .75rem}
    .content p{margin-bottom:1rem;color:#333}
    .cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin:1.5rem 0}
    .card{background:#fff;border:3px solid #000;padding:1rem;box-shadow:4px 4px 0 #000}
    .card h3{font-size:.9rem;font-weight:900;text-transform:uppercase;margin-bottom:.4rem}
    .card p{font-size:.82rem;color:#555;margin:0}
    .faq{margin:2rem 0}
    .faq details{background:#fff;border:2px solid #000;margin-bottom:.6rem;padding:.75rem 1rem}
    .faq summary{font-weight:700;cursor:pointer;font-size:.95rem}
    .faq p{margin-top:.5rem;color:#444;font-size:.9rem}
    .app-section{border-top:4px solid #000;margin-top:3rem;padding-top:2rem;text-align:center}
    .app-section p{margin-bottom:1rem;font-size:1rem;color:#444}
    footer{border-top:4px solid #000;margin-top:3rem;padding:1.5rem 1rem;text-align:center;font-size:.8rem;color:#666;background:#fff}
    footer a{color:#000;font-weight:700}
  </style>
  <script type="application/ld+json">${JSON.stringify(schema)}</script>
</head>
<body>
  <div class="hero">
    <h1>${h1}</h1>
    <p>${desc}</p>
    <a href="/" class="cta">⚡ Launch Bored Master — Free &amp; Instant</a>
  </div>
  <div class="content">
    <h2>${h2}</h2>
    ${intro}
    ${faqs}
  </div>
  <div class="app-section content">
    <h2>🎮 Play Now — No Sign-Up Required</h2>
    <p>All activities are 100% free, work in your browser, and require zero downloads. Just click and go.</p>
    <a href="/" class="cta">Open Bored Master</a>
  </div>
  <footer>
    <p><a href="/">Bored Master</a> · <a href="/games/connect4/">Connect 4</a> · <a href="/games/tictactoe/">Tic-Tac-Toe</a> · <a href="/activities/home/">At Home</a> · <a href="/activities/school/">At School</a> · <a href="/activities/work/">At Work</a></p>
  </footer>
</body>
</html>`;

const faqBlock = (items) => `<div class="faq">${items.map(([q,a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('')}</div>`;

const cardBlock = (items) => `<div class="cards">${items.map(([title,desc]) => `<div class="card"><h3>${title}</h3><p>${desc}</p></div>`).join('')}</div>`;

const pages = [

  // ── GAMES ─────────────────────────────────────────────────────────────────
  {
    slug: 'games/connect4',
    title: 'Play Connect 4 Online vs AI — Free Browser Game | Bored Master',
    desc: 'Play Connect 4 against our tactical AI — no download, no sign-up. Drop coins, block the bot, and win in seconds. Works on any device.',
    h1: 'Connect 4 Online vs AI — Free & Instant',
    h2: 'Why Play Connect 4 When Bored?',
    intro: `<p>Connect 4 is the perfect browser game when you have 5 to 15 minutes to kill. Our neobrutalist version pits you against a local tactical AI that adapts to your moves. No ads interrupting you, no downloads, no account needed — just pure strategy.</p>
    <p>Works great at school, at work, or at home. The high-contrast design keeps it discreet on screen.</p>
    ${cardBlock([['🎯 Strategy vs AI','Outsmart an adaptive bot that blocks your moves'],['🔇 Silent Mode','No sounds, no notifications — completely discreet'],['📱 Works Everywhere','Phone, tablet, laptop — any browser']])}`,
    faqs: faqBlock([
      ['Is this Connect 4 free to play?','Yes, 100% free. No login, no subscription, no ads to click through.'],
      ['Can I play Connect 4 on my phone?','Absolutely. Our game is fully touch-optimized and works on iOS and Android browsers.'],
      ['How hard is the AI?','The AI uses tactical heuristics to block your winning moves. It\'s challenging but beatable with strategy.'],
      ['What is Connect 4?','Connect 4 is a two-player game where you drop colored coins into a 7-column grid and try to align 4 in a row before your opponent.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"SoftwareApplication","name":"Connect 4 vs AI","applicationCategory":"Game","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"url":`${SITE}/games/connect4/`}
  },

  {
    slug: 'games/tictactoe',
    title: 'Play Tic-Tac-Toe Online vs AI — Silent Browser Game | Bored Master',
    desc: 'Play Tic-Tac-Toe against our AI in a minimalist, silent, and ultra-discreet browser game. Perfect for 5-minute tactical breaks.',
    h1: 'Tic-Tac-Toe vs AI — Silent & Instant',
    h2: 'The Most Discreet Game on the Internet',
    intro: `<p>Classic, clean, and completely silent. Our Tic-Tac-Toe is designed for situations where you need to look like you\'re thinking hard about something important. Place your marks, the AI responds instantly, and you can close the tab in one click.</p>
    ${cardBlock([['❌ No Sound','Zero audio — stealth mode by design'],['🤖 Smart AI','Plays optimally using minimax strategy'],['⚡ Instant Load','No loading screens, no wait']])}`,
    faqs: faqBlock([
      ['Can the AI be beaten?','Yes! The AI plays optimally but you can draw consistently once you learn the strategy.'],
      ['Is it multiplayer?','Currently single-player vs AI. Multiplayer on the same device coming soon.'],
      ['Why play Tic-Tac-Toe online?','It\'s fast, quiet, and requires zero setup — ideal when boredom hits suddenly.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"SoftwareApplication","name":"Tic-Tac-Toe vs AI","applicationCategory":"Game","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"url":`${SITE}/games/tictactoe/`}
  },

  {
    slug: 'games/soap-carver',
    title: 'Rainbow Soap Carver — Satisfying ASMR Browser Game | Bored Master',
    desc: 'Slice satisfying colorful soap bars with relaxing ASMR sounds. Reveal the secret toy hidden inside. Free, instant, no download.',
    h1: '🧼 Soap Carver — Satisfying ASMR Game',
    h2: 'Why Soap Carving is Oddly Satisfying',
    intro: `<p>Millions of people watch soap carving videos for the pure satisfaction of it. Our interactive version lets you do it yourself — drag your cutter, watch colorful layers peel away, and listen to the relaxing ASMR sounds. Carve all the way down to reveal a secret toy hidden at the center.</p>
    ${cardBlock([['🎨 Colorful Soap Bars','Rainbow layers with satisfying visual feedback'],['🔊 ASMR Sounds','Relaxing audio cues on every slice'],['🎁 Hidden Surprise','A secret toy revealed when fully carved']])}`,
    faqs: faqBlock([
      ['Is soap carving actually satisfying?','Yes — the combination of visual progress and ASMR sounds triggers genuine relaxation responses.'],
      ['How do I play?','Drag your cursor or finger over the soap block to carve layers. Keep going until the toy appears!'],
      ['Does it work on mobile?','Yes, touch-optimized for phones and tablets.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"SoftwareApplication","name":"Rainbow Soap Carver","applicationCategory":"Game","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"url":`${SITE}/games/soap-carver/`}
  },

  {
    slug: 'games/lawn-mower',
    title: 'Lawn Mower Simulator — Relaxing Grass Cutting Game | Bored Master',
    desc: 'Mow overgrown grass into a perfectly manicured lawn. Move in spirals or rows for maximum satisfaction. Free browser game, no download.',
    h1: '🌱 Lawn Mower Simulator — Cut Every Blade',
    h2: 'The Satisfying Power-Washer of Grass Games',
    intro: `<p>There\'s a reason lawn mowing videos get millions of views. Our browser version captures that same "clean sweep" satisfaction — drag the mower across dark overgrown tiles, watch them transform into bright neon-green turf, and aim for 100% coverage.</p>
    ${cardBlock([['🟩 100% Coverage Goal','Mow every single tile for full satisfaction'],['🔇 Silent & Discreet','No audio required — perfect for class or work'],['📐 Spiral Strategy','Work in rows or spirals to maximize efficiency']])}`,
    faqs: faqBlock([
      ['Why is lawn mowing satisfying?','The visual progress of transforming chaos into order triggers dopamine release — same reason power-washing videos are addictive.'],
      ['How long does it take to complete?','Usually 3-8 minutes depending on your strategy.'],
      ['Can I play on mobile?','Yes, works great on touchscreens.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"SoftwareApplication","name":"Lawn Mower Simulator","applicationCategory":"Game","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"url":`${SITE}/games/lawn-mower/`}
  },

  {
    slug: 'games/bubble-pop',
    title: 'Virtual Bubble Wrap Popper — Infinite ASMR | Bored Master',
    desc: 'Pop infinite virtual bubble wrap with satisfying sounds. The ultimate digital fidget toy. Free, instant, works on any device.',
    h1: '🫧 Virtual Bubble Wrap — Pop Forever',
    h2: 'The Ultimate Digital Stress Relief',
    intro: `<p>Popping bubble wrap is one of the most universally satisfying activities known to humankind. Our virtual version gives you an infinite supply — pop one by one or go full rapid-fire. Toggle the ASMR sounds on for maximum satisfaction or keep it silent for stealth mode.</p>
    ${cardBlock([['♾️ Infinite Bubbles','Regenerate a fresh sheet any time'],['🔊 ASMR Toggle','Sound on or off — your choice'],['📱 Phone Friendly','Tap bubbles with your fingers naturally']])}`,
    faqs: faqBlock([
      ['Is virtual bubble popping actually satisfying?','Yes — studies show it reduces stress and anxiety similarly to the real thing.'],
      ['Can I pop all of them?','Yes! Hit Regenerate for a fresh sheet once they\'re all popped.'],
      ['Is there a score?','No score — just pure, judgment-free satisfaction.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"SoftwareApplication","name":"Virtual Bubble Wrap Popper","applicationCategory":"Game","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"url":`${SITE}/games/bubble-pop/`}
  },

  // ── CONTEXT PAGES ─────────────────────────────────────────────────────────
  {
    slug: 'activities/home',
    title: 'Fun Things to Do at Home When Bored — 30+ Ideas | Bored Master',
    desc: 'Stuck at home and bored? Get instant ideas: virtual museum tours, origami, Wikipedia rabbit holes, ambient sound baths, and interactive games. All free.',
    h1: 'Things to Do at Home When Bored',
    h2: 'Why Home Boredom Is Actually an Opportunity',
    intro: `<p>Being bored at home is underrated. Unlike boredom at school or work, you have access to your full environment — time, quiet, and freedom to actually do something interesting. The trick is having the right idea at the right moment.</p>
    <p>Our engine filters 40+ activities by context, mood, and available time to give you the perfect home boredom cure in one click.</p>
    ${cardBlock([['🌐 Wikipedia Rabbit Hole','Start random, reach any target page'],['🏛️ Virtual Museum Tour','Explore the Louvre from your sofa'],['🧼 Soap Carver ASMR','Slice satisfying colorful soap bars'],['🌌 Scale of the Universe','Zoom from quarks to galaxy clusters'],['📐 Origami Challenge','Fold a crane from a sheet of paper'],['🎧 3D Sound Bath','Binaural audio with headphones, lights off']])}`,
    faqs: faqBlock([
      ['What can I do when bored at home with no money?','Everything on Bored Master is 100% free. Wikipedia, virtual tours, origami, and our browser games cost nothing.'],
      ['What to do when bored at home alone?','Solo activities like the Wikipedia Game, soap carver, lawn mower simulator, or a 3D sound bath are perfect for solo sessions.'],
      ['What to do when bored at home at night?','Night mode on Bored Master filters activities like star watching, shadow puppets, binaural sound baths, and relaxing browser games.'],
      ['How do I stop being bored at home?','The fastest cure is lowering the decision barrier — stop scrolling for options and just hit "Surprise Me" to get an instant activity.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"WebPage","name":"Things to Do at Home When Bored","description":"30+ free boredom cures for home","url":`${SITE}/activities/home/`}
  },

  {
    slug: 'activities/school',
    title: 'Things to Do When Bored in Class or at School | Bored Master',
    desc: 'Secretly bored in class? Find discreet, silent activities: mental games, pen spinning, finger tutting, and stealth browser games that look like work.',
    h1: 'What to Do When Bored at School or in Class',
    h2: 'The Art of Productive-Looking Boredom',
    intro: `<p>Every student knows the feeling — 45 minutes left in a lecture, your brain has completely checked out. The key is finding activities that are silent, discreet, and look completely innocent from a teacher\'s perspective.</p>
    <p>Our "In Class" and "At School" filters surface only low-risk, quiet activities specifically designed for this situation.</p>
    ${cardBlock([['❌ Tic-Tac-Toe vs AI','Completely silent, looks like focused work'],['🔤 Alphabet Mental Game','Zero paper, zero screen, all in your head'],['🖊️ Pen Spinning','Master the Thumb Around while half-listening'],['🖖 Finger Tutting','Silent hand dexterity exercise'],['📝 3-Panel Comic Strip','Draw in notebook corner, looks like notes'],['💻 Fake Spreadsheet Mode','Type randomly — generates real-looking data']])}`,
    faqs: faqBlock([
      ['What to do when bored in class without getting caught?','Use our "Stealth" mood filter — it only shows activities with risk level "Totally Invisible": mental games, silent browser games, and subtle physical exercises.'],
      ['What to do when bored at school on your phone?','Filter by "Phone" device — bubble popper, tic-tac-toe, soap carver, and tap speed test all work silently on a phone screen.'],
      ['Is it bad to be bored in class?','Occasional boredom is normal. Using it for discreet mental exercises like the Alphabet Game can actually sharpen focus.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"WebPage","name":"Things to Do When Bored at School","url":`${SITE}/activities/school/`}
  },

  {
    slug: 'activities/work',
    title: 'Things to Do When Bored at Work — Discreet Ideas | Bored Master',
    desc: 'Bored at work between tasks? Discreet activities that look productive: typing tests, inbox cleanup, desk yoga, and stealth browser games.',
    h1: 'Things to Do When Bored at Work',
    h2: 'Stay Sharp Between Tasks Without Getting Caught',
    intro: `<p>Dead hours between tasks are inevitable. The key is channeling them into something that either looks productive or genuinely is. Our "At Work" filter surfaces only office-safe, computer-friendly activities designed for this exact scenario.</p>
    ${cardBlock([['⌨️ Typing Speed Test','Looks exactly like typing a report'],['📥 Inbox Unsubscribe','Actually productive boredom cure'],['🧘 Desk Yoga','Invisible micro-stretches at your chair'],['📻 Global Radio Globe','Ambient background discovery'],['🔴 Connect 4 vs AI','Discreet, small window, looks like a tool'],['💻 Fake Spreadsheet','Full keyboard mode, 100% office-looking']])}`,
    faqs: faqBlock([
      ['What to do when bored at work with nothing to do?','Use our "Productive" mood filter to find activities that either are genuinely useful (inbox cleanup, typing practice) or look it (stealth spreadsheet).'],
      ['How to pass time at work without looking lazy?','Typing speed tests, email cleanup, and our fake spreadsheet mode are all completely justifiable if anyone glances at your screen.'],
      ['What to do when bored at a desk job?','Desk yoga micro-stretches + a typing test is a perfect 10-minute combo that leaves you feeling more awake.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"WebPage","name":"Things to Do When Bored at Work","url":`${SITE}/activities/work/`}
  },

  {
    slug: 'activities/night',
    title: 'Things to Do When Bored at Night — Calm & Fun Ideas | Bored Master',
    desc: 'Bored late at night? Find calm, low-key activities: binaural sound baths, star watching, shadow puppets, and relaxing browser games.',
    h1: 'Things to Do When Bored at Night',
    h2: 'Late Night Boredom Deserves Special Treatment',
    intro: `<p>Night boredom is different — you can\'t be loud, you\'re probably tired but not sleepy, and you want something that feels immersive without requiring effort. Our Night mode surfaces the perfect calm-yet-engaging activities.</p>
    ${cardBlock([['🎧 3D Sound Bath','Binaural audio in darkness — deeply relaxing'],['🌌 Star Watching','Find constellations and satellites'],['🐕 Shadow Puppets','Phone flashlight + bedroom wall'],['🧼 Soap Carver ASMR','Relaxing slice-and-reveal game'],['🌱 Lawn Mower','Meditative mowing, totally silent'],['🫧 Bubble Pop','Infinite satisfying pops, ASMR optional']])}`,
    faqs: faqBlock([
      ['What to do when bored at night alone?','Night mode on Bored Master filters only calm, solo-friendly activities: sound baths, ASMR games, star watching, and shadow puppets.'],
      ['What to do at night when you can\'t sleep?','Avoid screens if possible. If you need one: binaural soundscapes with headphones in the dark are genuinely sleep-inducing.'],
      ['What to do at night for fun?','Soap carver, bubble popper, and the Wikipedia rabbit hole game are engaging without being stimulating enough to keep you wired.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"WebPage","name":"Things to Do When Bored at Night","url":`${SITE}/activities/night/`}
  },

  {
    slug: 'activities/friends',
    title: 'Fun Things to Do With Friends When Bored | Bored Master',
    desc: 'Bored with friends and out of ideas? Try Voice Telepathy, Truth or Dare, Exquisite Corpse stories, and Wink Assassin. All free, no materials needed.',
    h1: 'Fun Things to Do With Friends When Bored',
    h2: 'Zero-Prep Group Activities That Actually Work',
    intro: `<p>The worst kind of boredom is being bored with friends — because everyone is waiting for someone else to suggest something. Cut through it with activities that need zero materials, zero planning, and start in 30 seconds.</p>
    ${cardBlock([['🧠 Voice Telepathy','Say the same word simultaneously — starts hilarious'],['🔥 Truth or Dare','Pre-loaded question generator for groups'],['✍️ Exquisite Corpse','Collaborative absurd story on one sheet'],['👁️ Wink Assassin','Psychology party game with zero materials'],['📳 Shake to Decide','Group decision by phone shake'],['🌟 Personality Quiz Marathon','Three chaotic quizzes, compare results']])}`,
    faqs: faqBlock([
      ['What to do with friends when bored at home?','Voice Telepathy and Exquisite Corpse start with literally just your voices and a piece of paper.'],
      ['What to do with friends when bored with no money?','Everything in Friends mode is free — no apps to buy, no materials to purchase.'],
      ['What to do with friends when bored at night?','Wink Assassin and Truth or Dare are perfect evening group games. Loud, but worth it.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"WebPage","name":"Fun Things to Do With Friends When Bored","url":`${SITE}/activities/friends/`}
  },

  // ── TOOL PAGE ─────────────────────────────────────────────────────────────
  {
    slug: 'boredom-activity-finder',
    title: 'Boredom Activity Finder — Smart Boredom Cure Generator | Bored Master',
    desc: 'Filter 40+ boredom cures by context (home, school, work), duration, mood, and device. Get an instant smart recommendation in one click.',
    h1: 'Smart Boredom Activity Finder',
    h2: 'How Our Recommendation Engine Works',
    intro: `<p>Most "things to do when bored" lists give you 50 items and leave you scrolling for 10 minutes. Our activity finder is different — it uses weighted scoring across four dimensions to surface the single best option for your exact situation.</p>
    <p><strong>How it works:</strong> Select your context (home, school, work, with friends, at night), available time (30 seconds to 1 hour), and desired mood (chill, productive, funny, secret, social). The engine instantly filters and scores the entire activity database to give you one perfect pick.</p>
    ${cardBlock([['🌍 Context Filter','Home, school, work, friends, night, or computer'],['⏱️ Duration Filter','30 seconds to 1 hour — your call'],['🎭 Mood Filter','Chill, productive, funny, secret, or social'],['📱 Device Filter','Phone, computer, paper, or no-device'],['⚡ Smart Pick','Weighted AI picks the single best match'],['🎲 Surprise Me','Pure random if you want to be surprised']])}`,
    faqs: faqBlock([
      ['What is the Smart Pick feature?','Smart Pick uses weighted scoring that considers your filters, recent activities, favorites, and time of day to pick the statistically best activity for you right now.'],
      ['How many activities are in the database?','40+ activities across 7 contexts, 5 moods, 4 durations, and 4 device types.'],
      ['Is it free?','100% free, forever. No login, no subscription.'],
      ['What if I don\'t like the suggestion?','Hit "Try Another" for a random alternative, or "Smart Pick" for a scored recommendation from the filtered pool.'],
    ]),
    schema: {"@context":"https://schema.org","@type":"SoftwareApplication","name":"Boredom Activity Finder","applicationCategory":"UtilitiesApplication","operatingSystem":"Any","offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},"url":`${SITE}/boredom-activity-finder/`}
  },

];

// ── Build ──────────────────────────────────────────────────────────────────
let built = 0;
for (const p of pages) {
  const dir = path.join(__dirname, 'public', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  const html = shell(p.slug, p.title, p.desc, p.h1, p.h2, p.intro, p.faqs, p.schema);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`✅ /${p.slug}/`);
  built++;
}

// Update sitemap
const sitemapUrls = [
  { url: SITE + '/', priority: '1.0' },
  ...pages.map(p => ({ url: `${SITE}/${p.slug}/`, priority: '0.8' }))
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url><loc>${u.url}</loc><changefreq>weekly</changefreq><priority>${u.priority}</priority></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), sitemap);
console.log(`\n✅ sitemap.xml updated (${sitemapUrls.length} URLs)`);
console.log(`\n🎉 ${built} SEO pages generated in /public/`);
console.log('👉 Next: npm run build && git add -A && git commit -m "feat(seo): add satellite pages and sitemap" && git push');
