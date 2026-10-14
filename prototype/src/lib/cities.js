// ─────────────────────────────────────────────────────────────────
// Cities. Folio is location-based: the city decides the time zone (and so
// the midnight lock), the greeting, the local flavour, the "Did you know?"
// facts and the Nearby layer.
//
// Only Brisbane has curated Editions today. Seoul and Mumbai ship with
// verified city notes and an "apply to curate" path, which is the honest
// shape of expansion: no fake local content, no invented curators.
//
// Every fact: one checkable claim in our own words, with a source link.
// Sources marked (W) are Wikipedia only. Cross-check before the tradeshow.
//
// LOCAL TOUCHES — greetings below must be read by a native speaker on the
// team or a friend before the tradeshow. The Acknowledgement of Country
// wording should be confirmed with UQ's Aboriginal and Torres Strait
// Islander Studies Unit or a local Elder, and ideally a First Nations
// musician is invited to contribute (paid and credited).
// ─────────────────────────────────────────────────────────────────

const fact = (id, text, sourceLabel, sourceUrl, note) => ({ id, text, sourceLabel, sourceUrl, note: note || "" });

export const CITIES = {
  brisbane: {
    id: "brisbane", name: "Brisbane", nickname: "Brissy", country: "Australia",
    tz: "Australia/Brisbane", curated: true,
    accentRgb: "212 162 78",
    greeting: { byTime: true, native: "Hello, Brisbane.", gloss: "Welcome to Brisbane", lang: "en-AU" },
    tagline: "Your Brisbane music scene, curated.",
    scene: "From the 1970s punk of The Saints to today's Valley venues, Brisbane's music has always been made in small rooms.",
    country_ack: {
      placeName: "Meanjin",
      meaning: "the spearhead",
      meaningSource: { label: "Australia Post, Traditional Place names (quoting Uncle Shannon Ruska)", url: "https://auspost.com.au/community-hub/traditional-place-names/meanjin-exploring-traditional-place-name-of-brisbane" },
      text: "Folio acknowledges the Traditional Custodians of the land where Brisbane stands, including the Turrbal and Yuggera/Jagera peoples, and pays respect to Elders past and present. Meanjin is a Traditional Place name for the Brisbane area.",
    },
    venues: [
      { name: "The Zoo", suburb: "Fortitude Valley" },
      { name: "The Triffid", suburb: "Newstead" },
      { name: "Fortitude Music Hall", suburb: "Fortitude Valley" },
      { name: "Brisbane Powerhouse", suburb: "New Farm" },
    ],
    facts: [
      fact("bne-beatles", "The Beatles played four Festival Hall shows on 29 and 30 June 1964 to about 5,000 fans each. Eggs and tomatoes were thrown, and they stayed in a guarded suite at Lennons Hotel under a code name.", "State Library of Queensland", "https://www.slq.qld.gov.au/blog/beatles-come-brisbane"),
      fact("bne-organ", "Brisbane City Hall's five-manual Willis organ was built in 1892 for an agricultural society. When the society went bankrupt, local musicians and the council saved it from auction in 1897.", "Brisbane City Council", "https://brisbane.qld.gov.au/facilities-recreation/parks-venues/brisbane-city-hall/city-hall-history-heritage/city-hall-main-auditorium-organ"),
      fact("bne-posters", "A State Library of Queensland poster exhibition on Brisbane bands from 1977 to 1987 drew on about 350 donated gig posters, made with hand-cut stencils and kitchen-table screen printing.", "QUT", "https://www.qut.edu.au/news?id=169959"),
      fact("bne-stranglers", "According to band member Hugh Cornwell, The Stranglers' 1979 single 'Nuclear Device (The Wizard of Aus)' was written about Queensland premier Joh Bjelke-Petersen. It reached No. 36 in the UK.", "Wikipedia (W)", "https://en.wikipedia.org/wiki/Nuclear_Device_(The_Wizard_of_Aus)"),
      fact("bne-razar", "Brisbane punk band Razar's 1978 song 'Task Force (Undercover Cops)' took aim at the Queensland Police Special Branch, and police regularly broke up punk gigs in the early 1980s.", "Wikipedia (W)", "https://en.wikipedia.org/wiki/Brisbane_punk_rock"),
      fact("bne-cloudland", "The Cloudland ballroom in Fortitude Valley was demolished overnight on 7 November 1982, without a permit and despite its National Trust listing, to make way for an apartment block.", "Australian Geographic", "https://www.australiangeographic.com.au/history-culture/2025/11/the-beloved-brisbane-ballroom-demolished-in-secret/"),
      fact("au-songs", "In Aboriginal and Torres Strait Islander cultures, songs carry far more than music: history, family connections, knowledge of the natural world and medicine. Songlines link places through linked songs and ceremonies.", "AIATSIS, Songs of Australia", "https://aiatsis.gov.au/about/connect-us/make-difference/songs-australia", "From across Australia, not specific to Brisbane."),
      // TODO(team): replace or add a Brisbane-specific fact once a source from a Turrbal or Yuggera/Jagera body or the State Library of Queensland is verified.
      fact("au-yidaki", "The yidaki belongs to the Yolngu people of north-east Arnhem Land and is tied to Yolngu Law and ceremony. 'Didgeridoo' is an introduced generic term, not a precise synonym.", "The Conversation", "https://theconversation.com/friday-essay-the-remarkable-yidaki-and-no-its-not-a-didge-74169", "From across Australia. Yolngu Country is in the Northern Territory, far from Brisbane."),
    ],
  },

  seoul: {
    id: "seoul", name: "Seoul", nickname: "", country: "South Korea",
    tz: "Asia/Seoul", curated: false,
    accentRgb: "127 176 163",
    greeting: { native: "안녕하세요", gloss: "Welcome to Seoul", line: "서울에 오신 것을 환영합니다", lang: "ko" },
    tagline: "Your Seoul music scene, from Hongdae to the charts.",
    scene: "Seoul's music runs from tiny Hongdae live clubs to the K-pop industry the world watches.",
    venues: [],
    facts: [
      fact("seo-gangnam", "Gangnam Style was the first YouTube video to pass one billion views, on 20 December 2012, about five months after it was uploaded.", "Guinness World Records", "https://www.guinnessworldrecords.com/news/2012/12/psys-gangnam-style-becomes-first-video-to-be-viewed-1-billion-times-on-youtube-46462/"),
      fact("seo-taiji", "Seo Taiji and Boys performed 'I Know' on an MBC TV talent contest on 11 April 1992. The jury and critics panned it, yet it is now seen as the starting point of K-pop.", "South China Morning Post", "https://scmp.com/lifestyle/k-pop/artists-celebrities/article/3174628/k-pop-was-born-april-1992-i-know-seo-taiji-boys"),
      fact("seo-clubdrug", "Club Drug opened in Hongdae in July 1994 and was called a womb for indie musicians. A 1996 joint album by Crying Nut and Yellow Kitchen is counted as Korea's first indie record.", "Korea JoongAng Daily", "https://www.koreajoongangdaily.com/korea/indie-scene-stays-strong-20-years-on/11048485"),
      fact("seo-dgbd", "Hongdae's DGBD club took its name from Club Drug and Blue Devil, and was meant to echo New York's CBGB.", "Korea Times", "https://www.koreatimes.co.kr/amp/southkorea/globalcommunity/20240824/finding-the-scene-5-remembering-9-of-hongdaes-formative-live-music-venues"),
      fact("seo-butler", "British guitarist Bernard Butler reportedly lost a card-game bet and played Hongdae's Spangle the next day in July 1999, with fans queuing from sunrise.", "Korea Times", "https://www.koreatimes.co.kr/amp/southkorea/globalcommunity/20240824/finding-the-scene-5-remembering-9-of-hongdaes-formative-live-music-venues", "The source says 'reportedly'."),
      fact("seo-pansori", "UNESCO proclaimed the pansori epic chant a Masterpiece of the Oral and Intangible Heritage of Humanity in Paris on 7 November 2003.", "Gyeonggi Provincial Government", "https://english.gg.go.kr/?p=2304"),
      fact("seo-trainee", "Jo-kwon of 2AM reportedly trained for seven years under JYP before debuting. Trainee contracts run two years or more and guarantee no debut.", "Korea Herald", "https://www.koreaherald.com/article/3646305", "2014 article; the source says 'reportedly'."),
    ],
  },

  mumbai: {
    id: "mumbai", name: "Mumbai", nickname: "", country: "India",
    tz: "Asia/Kolkata", curated: false,
    accentRgb: "224 122 95",
    greeting: { native: "नमस्कार", gloss: "Welcome to Mumbai", line: "मुंबईत आपले स्वागत आहे", lang: "mr" },
    tagline: "Your Mumbai music scene, from film songs to live rooms.",
    scene: "Mumbai is the home of Hindi film music, and it also has a live circuit that grew up around rooms like Fire N' Ice and Blue Frog.",
    venues: [],
    facts: [
      fact("mum-aayega", "When Lata Mangeshkar's 'Aayega Aanewala' (from the film Mahal) was released, the record carried the film character's name instead of hers.", "The Week", "https://www.theweek.in/magazine/theweek/cover/2022/02/10/a-voice-in-white.html"),
      fact("mum-guinness", "Guinness credited Lata Mangeshkar with at least 25,000 songs in 1974, relisted about 30,000 in 1991, then dropped the entry that year. The count is still disputed.", "Business Today", "https://businesstoday.in/trending/story/25k-or-30k-lata-mangeshkars-songs-list-tall-but-disputed-321640-2022-02-06"),
      fact("mum-aashiqui", "The T-Series cassette of the 1990 film Aashiqui reportedly sold about 15 million copies and launched the composing duo Nadeem-Shravan.", "The Quint", "https://www.thequint.com/amp/story/entertainment/25-years-of-aashiqui-then-and-now", "The source says 'reportedly'."),
      fact("mum-fire", "Fire N' Ice, a Lower Parel venue open from about 1999 to 2004, is credited with bringing rave culture to Mumbai. Blue Frog began in 2007.", "Homegrown", "https://homegrown.co.in/article/801690/iconic-music-venues-in-india-that-changed-the-game-vol-i"),
      fact("in-gauhar", "Gauhar Jaan made India's first 78 rpm disc recording in November 1902 at the Great Eastern Hotel in Calcutta, and ended her records by announcing her own name.", "Live History India", "https://livehistoryindia.com/story/people/gauhar-jaan-the-gramophone-queen-of-india", "From across India: this happened in Calcutta (now Kolkata), not Mumbai."),
    ],
  },
};

export const CITY_LIST = Object.values(CITIES);
export const getCity = (id) => CITIES[id] || null;

// Time zones that map to a city we cover. Anything else asks the person to choose.
const TZ_TO_CITY = {
  "Australia/Brisbane": "brisbane",
  "Asia/Seoul": "seoul",
  "Asia/Kolkata": "mumbai",
  "Asia/Calcutta": "mumbai",
};

/** Guess from the device time zone. Nothing leaves the device and no permission prompt is needed. */
export function detectCity(tz) {
  let zone = tz;
  if (!zone) { try { zone = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { zone = ""; } }
  return TZ_TO_CITY[zone] || null;
}

/** The fact for a given day: stable within a day, rotates daily, differs by city. */
export function factOfTheDay(city, isoDate) {
  const facts = city.facts;
  if (!facts.length) return null;
  const n = [...isoDate].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return facts[n % facts.length];
}

export const whatsOnUrl = (cityName, venue) =>
  `https://www.google.com/search?q=${encodeURIComponent(venue ? `${venue} ${cityName} what's on` : `live music ${cityName} this week`)}`;
