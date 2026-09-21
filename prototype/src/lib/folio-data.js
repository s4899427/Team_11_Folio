// FOLIO — curated mock data
// Structured to allow a real backend to replace these exports later.

export const COMMUNITIES = [
  { id: "music", name: "Music", color: "#7C1F3A" },
  { id: "art", name: "Art", color: "#C25B3F" },
  { id: "fashion", name: "Fashion", color: "#D4A24E" },
  { id: "film", name: "Film", color: "#2F5447" },
  { id: "food", name: "Food", color: "#8B5A3C" },
  { id: "architecture", name: "Architecture & Design", color: "#6B7F6E" },
  { id: "poetry", name: "Poetry / Literature", color: "#9B7B8E" },
  { id: "photography", name: "Photography", color: "#5A6B7A" },
  { id: "dance", name: "Dance", color: "#A04555" },
  { id: "craft", name: "Craft / Textile", color: "#B8845F" },
  { id: "ritual", name: "Ritual / Spirituality", color: "#4A5D5A" },
  { id: "tattoo", name: "Tattoo / Body Art", color: "#5C3D3D" },
];

// Onboarding/profile selection uses these 5 groups, each covering several
// of the 12 original communities above. Content stays tagged with the
// original granular community; grouping only affects what a user picks.
export const COMMUNITY_GROUPS = [
  { id: "music-sound", name: "Music & Sound", color: "#7C1F3A", includes: ["music", "dance"] },
  { id: "visual-arts", name: "Visual Arts & Design", color: "#C25B3F", includes: ["art", "photography", "architecture"] },
  { id: "fashion-craft", name: "Fashion & Craft", color: "#D4A24E", includes: ["fashion", "craft", "tattoo"] },
  { id: "film-lit", name: "Film & Literature", color: "#2F5447", includes: ["film", "poetry"] },
  { id: "food-ritual", name: "Food & Ritual", color: "#8B5A3C", includes: ["food", "ritual"] },
];

export const getCommunity = (id) => {
  const sub = COMMUNITIES.find((c) => c.id === id);
  if (sub) return sub;
  const group = COMMUNITY_GROUPS.find((g) => g.id === id);
  if (group) return group;
  return { id, name: id, color: "#A89E8A" };
};

export const CURATORS = [
  { id: "c1", name: "Amara Okafor", community: "music", role: "Sound Archivist, Lagos", bio: "Ten years cataloguing West African cassette culture. Believes the best records are the ones nobody kept.", image: "https://i.pravatar.cc/300?img=47" },
  { id: "c2", name: "Kenji Watanabe", community: "photography", role: "Visual Researcher, Tokyo", bio: "Curates the space between street photography and family album. Writes about light the way other people write about weather.", image: "https://i.pravatar.cc/300?img=12" },
  { id: "c3", name: "Sofia Marchetti", community: "fashion", role: "Editor-at-large, Milan", bio: "Former pattern cutter turned critic. Interested in clothing as inheritance, not trend.", image: "https://i.pravatar.cc/300?img=32" },
  { id: "c4", name: "Daniel Oduya", community: "food", role: "Culinary Historian, Cape Town", bio: "Traces recipes across borders and generations. Thinks a kitchen is an archive you can eat.", image: "https://i.pravatar.cc/300?img=53" },
  { id: "c5", name: "Yuki Tanaka", community: "film", role: "Cinema Programmer, Kyoto", bio: "Builds retrospectives around mood rather than movement. Has seen In the Mood for Love forty-one times.", image: "https://i.pravatar.cc/300?img=15" },
  { id: "c6", name: "Lina Vasquez", community: "craft", role: "Textile Researcher, Oaxaca", bio: "Documents weaving traditions before they quiet. Believes a thread holds more memory than a photograph.", image: "https://i.pravatar.cc/300?img=44" },
];

export const getCurator = (id) => CURATORS.find((c) => c.id === id) || CURATORS[0];

const img = (seed, w = 800, h = 1000) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

// ── TODAY'S THREAD ──────────────────────────────────────────────
export const TODAY_THREAD = {
  id: "t-2026-09-15",
  date: "2026-09-15",
  dateLabel: "SEP 15",
  title: "The Hour Between",
  curator: CURATORS[4],
  presence: 312,
  elements: [
    { community: "music", title: "Frank Ocean", subtitle: "Channel Orange, ten years on", image: img("frank-ocean-night", 800, 1000), what: "An album that treated R&B like a letter — personal, wandering, unconcerned with the clock. A decade later it still sounds like someone thinking out loud past midnight.", why: "Ocean refused the album cycle and the genre gatekeepers. He made longing feel architectural, and a generation of artists learned that a record could move at the speed of a feeling rather than a single.", explore: "Listen to 'Pyramids' as a two-part suite. The first half is a story; the second is the morning after." },
    { community: "fashion", title: "Issey Miyake's Pleats", subtitle: "The last pleat-line, archived", image: img("pleats-fabric-fold", 800, 1000), what: "Garments heat-pressed from a single sheet of polyester, then cut. The fabric remembers its folds the way skin remembers a habit.", why: "Miyake treated clothing as engineering, not decoration. His pleats democratized sculpture — you could fold a museum and wear it on a bicycle.", explore: "Watch how the fabric moves standing still versus walking. The garment is designed for the second state." },
    { community: "art", title: "Hokusai's Late Wave", subtitle: "The Great Wave, and what came after", image: img("hokusai-wave-blue", 800, 1000), what: "Katsushika Hokusai drew the most reproduced image in art history at seventy-one. He said he wouldn't understand drawing until he was a hundred and ten.", why: "The Wave is not a peak — it's a middle chapter. Hokusai's late work is stranger, looser, and less shown. It argues that mastery is not arrival but continued appetite.", explore: "Find 'The Ghost of Kohada Koheiji.' It's from the same late period, and it's the Wave's opposite." },
    { community: "food", title: "Andean Potatoes", subtitle: "Four thousand varieties, one valley", image: img("andean-potatoes-earth", 800, 1000), what: "The Andes hold more kinds of potato than the rest of the world combined. Each has a name, a season, and a use. Some are grown only for freeze-drying at altitude.", why: "This is agriculture as language. A single field can hold a vocabulary of flavours, colours, and resistances that industrial farming has no word for. The potato is not a crop here — it's a library.", explore: "Ask what 'chuño' is. The answer involves frost, altitude, and a year of patience." },
    { community: "film", title: "Wong Kar-wai, Restored", subtitle: "In the Mood for Love, 4K", image: img("wong-kar-wai-red-curtain", 800, 1000), what: "A film about two people who almost have an affair and never do. The restored print makes the corridors longer, the dresses slower, the silence heavier.", why: "Wong proved that withholding is a structure. He built a film out of glances, and it holds. The restoration doesn't add detail — it adds time.", explore: "Watch the scene at the noodle stand twice. The second time, watch the wall behind them." },
  ],
};

// ── ARCHIVE THREADS ─────────────────────────────────────────────
export const ARCHIVE_THREADS = [
  { id: "t-2026-09-14", date: "2026-09-14", dateLabel: "SEP 14", title: "Night Markets & Neon", curator: CURATORS[1], presence: 489, accent: "#C25B3F", elements: [
    { community: "food", title: "Taipei Night Markets", subtitle: "After-midnight noodle stalls" },
    { community: "photography", title: "Neon as Architecture", subtitle: "The light that builds cities" },
    { community: "music", title: "City Pop, Reissued", subtitle: "Tokyo, 1979–1985" },
    { community: "film", title: "Fallen Angels", subtitle: "Wong Kar-wai's midnight film" },
    { community: "fashion", title: "Techwear Origins", subtitle: "When function became form", image: "/images/images-26.jpeg" },
  ]},
  { id: "t-2026-09-13", date: "2026-09-13", dateLabel: "SEP 13", title: "Women Who Changed Sound", curator: CURATORS[0], presence: 621, accent: "#7C1F3A", elements: [
    { community: "music", title: "Alice Coltrane", subtitle: "Harp as devotion" },
    { community: "music", title: "Laurie Anderson", subtitle: "Story as instrument" },
    { community: "music", title: "Miriam Makeba", subtitle: "Exile as anthem" },
    { community: "poetry", title: "Sun Ra's Arkestra", subtitle: "The women who held the cosmos" },
  ]},
  { id: "t-2026-09-12", date: "2026-09-12", dateLabel: "SEP 12", title: "Objects With Memory", curator: CURATORS[5], presence: 298, accent: "#B8845F", elements: [
    { community: "craft", title: "The Family Quilt", subtitle: "Stitch as record" },
    { community: "art", title: "Mended Ceramics", subtitle: "Kintsugi as philosophy" },
    { community: "photography", title: "The Inherited Camera", subtitle: "A lens with a history" },
    { community: "ritual", title: "The Household Shrine", subtitle: "Objects that are watched over" },
  ]},
  { id: "t-2026-09-11", date: "2026-09-11", dateLabel: "SEP 11", title: "The Color of Devotion", curator: CURATORS[5], presence: 374, accent: "#4A5D5A", elements: [
    { community: "ritual", title: "Saffron", subtitle: "The color you wear to renounce", image: "/images/images-29.jpeg" },
    { community: "art", title: "Blue Madonna", subtitle: "Ultramarine and the cost of heaven" },
    { community: "architecture", title: "Mosque Tiles", subtitle: "Geometry as prayer" },
    { community: "dance", title: "Flamenco Red", subtitle: "The dress that argues" },
  ]},
  { id: "t-2026-09-10", date: "2026-09-10", dateLabel: "SEP 10", title: "Quiet Architecture", curator: CURATORS[1], presence: 256, accent: "#6B7F6E", elements: [
    { community: "architecture", title: "Tadao Ando's Concrete", subtitle: "Light poured into walls" },
    { community: "architecture", title: "The Reading Room", subtitle: "Silence as a design material" },
    { community: "art", title: "Rothko Chapel", subtitle: "A room that asks you to stay" },
  ]},
  { id: "t-2026-09-09", date: "2026-09-09", dateLabel: "SEP 09", title: "Hands That Weave", curator: CURATORS[5], presence: 412, accent: "#B8845F", elements: [
    { community: "craft", title: "Oaxacan Weaving", subtitle: "A loom that remembers" },
    { community: "craft", title: "Kashmir Pashmina", subtitle: "The ring test and the goat" },
    { community: "fashion", title: "Boro Patchwork", subtitle: "Mending as inheritance" },
    { community: "tattoo", title: "Hand-Tapped Tattoos", subtitle: "The tool that doesn't hum" },
  ]},
  { id: "t-2026-09-08", date: "2026-09-08", dateLabel: "SEP 08", title: "Cinema of Longing", curator: CURATORS[4], presence: 533, accent: "#2F5447", elements: [
    { community: "film", title: "Letterboxd and the Diary", subtitle: "Rating as ritual" },
    { community: "film", title: "Tarkovsky's Mirror", subtitle: "Memory shot on film" },
    { community: "poetry", title: "The Film Still as Poem", subtitle: "One frame, held", image: "/images/images-3.png" },
  ]},
  { id: "t-2026-09-07", date: "2026-09-07", dateLabel: "SEP 07", title: "Spice Routes, Revisited", curator: CURATORS[3], presence: 467, accent: "#8B5A3C", elements: [
    { community: "food", title: "The Cardamom Route", subtitle: "A pod that crossed an ocean" },
    { community: "food", title: "Saffron's Weight", subtitle: "Worth its weight in gold, still" },
    { community: "ritual", title: "Incense as Geography", subtitle: "Smoke that maps a trade" },
  ]},
  { id: "t-2026-09-06", date: "2026-09-06", dateLabel: "SEP 06", title: "Punk, 1977", curator: CURATORS[0], presence: 401, accent: "#7C1F3A", elements: [
    { community: "music", title: "The Vibrators", subtitle: "Pub rock turned punk, London", image: "/images/images-6.jpeg" },
    { community: "art", title: "Show Poster, Torn Edge", subtitle: "DIY gig flyer, hand-cut type", image: "/images/images-3.jpeg" },
    { community: "art", title: "London, 1977", subtitle: "The poster that named the year", image: "/images/images-4.jpeg" },
    { community: "fashion", title: "Street Style, 1977", subtitle: "Studs, safety pins, secondhand blazers", image: "/images/images-5.jpeg" },
    { community: "fashion", title: "Dressed for the Night", subtitle: "Going out, London, 1977", image: "/images/images-19.jpeg" },
    { community: "art", title: "Kiss, Reimagined", subtitle: "Two figures, vinyl for heads", image: "/images/images-8.jpeg" },
  ]},
  { id: "t-2026-09-05", date: "2026-09-05", dateLabel: "SEP 05", title: "Seoul, Style and Self", curator: CURATORS[2], presence: 328, accent: "#D4A24E", elements: [
    { community: "fashion", title: "Seoul Street Style", subtitle: "Layering as language", image: "/images/images-26.jpeg" },
    { community: "poetry", title: "A Verse for the City", subtitle: "Found poem, subway platform", image: "/images/images-14.jpeg" },
    { community: "photography", title: "Self as Subject", subtitle: "The mirror selfie as tradition" },
  ]},
];

// ── ARCHIVE POSTS (general, not tied to a thread) ──────────────
export const ARCHIVE_POSTS = [
  { id: "p1", author: "Mira Chen", authorImage: "https://i.pravatar.cc/200?img=20", community: "photography", type: "FIELD NOTE", title: "The last darkroom in my city", body: "It's above a laundromat. The owner is eighty-three. He still prints by hand and refuses to explain why. I think the answer is that the question is the wrong shape.", image: img("darkroom-red-light", 800, 600), date: "SEP 10", likes: 42 },
  { id: "p2", author: "Tomás Rivera", authorImage: "https://i.pravatar.cc/200?img=33", community: "food", type: "MY TAKE", title: "My grandmother's recipe has no measurements", body: "She taught me to cook with 'un poco' and 'hasta que se vea bien.' I tried to write it down once. The dish tasted wrong. I think precision was never the point.", image: img("grandmother-kitchen-hands", 800, 600), date: "SEP 09", likes: 88 },
  { id: "p3", author: "Aiko Mori", authorImage: "https://i.pravatar.cc/200?img=23", community: "film", type: "REMIX", inspiredBy: "Wong Kar-wai — In the Mood for Love", title: "I shot my hallway like it was a Wong Kar-wai film", body: "Slow. Gold light through a crack in the door. The corridor did the rest. I didn't plan the feeling; I just stopped rushing past it.", image: img("hallway-gold-light-curtain", 800, 600), date: "SEP 08", likes: 156 },
  { id: "p4", author: "Olu Adeyemi", authorImage: "https://i.pravatar.cc/200?img=51", community: "music", type: "FIELD NOTE", title: "Found: a cassette no one will identify", body: "Side B is water-damaged. Side A is a woman singing in a language I don't recognise, over a guitar tuned down a half-step. It's the most beautiful thing I own and I can't share it.", image: "/images/images-7.jpeg", date: "SEP 07", likes: 64 },
  { id: "p5", author: "Elena Popova", authorImage: "https://i.pravatar.cc/200?img=45", community: "dance", type: "MY TAKE", title: "Flamenco is not a performance. It's an argument.", body: "The dancer is not entertaining you. They are settling something with the floor, with the air, with someone who isn't in the room. You are allowed to watch. That is the generosity.", image: img("flamenco-dress-red-motion", 800, 600), date: "SEP 06", likes: 112 },
  { id: "p6", author: "Kwame Asante", authorImage: "https://i.pravatar.cc/200?img=13", community: "architecture", type: "FIELD NOTE", title: "The courtyard that cooled a whole block", body: "My uncle's house in Kumasi has a tree in the centre. No air conditioning. The whole compound stays ten degrees cooler. The tree was planted before my father was born.", image: img("courtyard-tree-shade-africa", 800, 600), date: "SEP 05", likes: 73 },
];

// ── FEATURED POSTS for today's thread (curator-selected top 20) ─
export const FEATURED_POSTS = [
  { id: "fp1", author: "Aiko Mori", authorImage: "https://i.pravatar.cc/200?img=23", community: "film", type: "REMIX", inspiredBy: "Wong Kar-wai", title: "Corridor at 1am", body: "The gold light did all the work.", image: img("corridor-gold-1am", 600, 600) },
  { id: "fp2", author: "Mira Chen", authorImage: "https://i.pravatar.cc/200?img=20", community: "photography", type: "FIELD NOTE", title: "Pleats in motion", body: "Watched a woman on a bicycle. The fabric was doing something the designer planned and she didn't notice.", image: img("pleats-bicycle-motion", 600, 600) },
  { id: "fp3", author: "Tomás Rivera", authorImage: "https://i.pravatar.cc/200?img=33", community: "food", type: "MY TAKE", title: "My first chuño", body: "It tasted like frost and patience. I understood the mountain differently after.", image: img("chuño-frost-potato", 600, 600) },
  { id: "fp4", author: "Olu Adeyemi", authorImage: "https://i.pravatar.cc/200?img=51", community: "music", type: "FIELD NOTE", title: "Channel Orange at 3am", body: "Played it on vinyl. 'Bad Religion' came on and I had to stop driving.", image: "/images/images-10.jpeg" },
  { id: "fp5", author: "Elena Popova", authorImage: "https://i.pravatar.cc/200?img=45", community: "art", type: "REMIX", inspiredBy: "Hokusai", title: "The wave I almost missed", body: "Saw the print in person. It's smaller than you think. That's the point.", image: img("hokusai-print-small", 600, 600) },
];

// ── NEARBY (location-aware cultural card) ──────────────────────
export const NEARBY = {
  location: "Melbourne, AU",
  intro: "Late winter light. The city is between seasons — coats still out, but the galleries have opened their spring rooms.",
  events: [
    { id: "e1", type: "art", title: "Marina Abramović — The Method", venue: "ACCA", time: "Until Oct 12" },
    { id: "e2", type: "music", title: "Ambient listening session: Nala Sinephro", venue: "The Jazzlab", time: "Tonight, 8pm" },
    { id: "e3", type: "food", title: "Ochre Weekend: Indigenous food series", venue: "Fed Square", time: "Sat–Sun" },
  ],
};

// ── TONIGHT'S THEME (going out) ─────────────────────────────────
export const TONIGHT_THEME = {
  theme: "Slow",
  prompt: "Not a party. A long table, low light, one record on repeat.",
};

export const SAMPLE_DRAFTS = [
  { id: "d1", about: "Today's Thread — The Hour Between", type: "MY TAKE", title: "On the Miyake pleat and the memory of fabric", body: "I keep thinking about the idea that a garment can remember. My mother ironed the same crease into the same trousers for thirty years...", date: "SEP 15" },
];
