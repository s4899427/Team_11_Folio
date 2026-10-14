// ─────────────────────────────────────────────────────────────────
// SEED CONTENT — the first Editions, written by the team ("Folio Desk").
//
// Every Liner Note below is a single checkable fact with a source link.
// Sources marked (W) are Wikipedia only; cross-check against a primary
// source before the tradeshow. Nothing here is invented: if a fact could
// not be confirmed it was dropped rather than guessed.
//
// Dates are relative to today (Brisbane), so the demo always has a live
// "Today" Edition and a short Archive behind it. Seed editions are marked
// seed:true and are never written to the database.
// ─────────────────────────────────────────────────────────────────
import { addDays } from "./time.js";

export const DESK = { id: "folio-desk", name: "Folio Desk", blurb: "Founding curators — the Folio team, until Brisbane curators are recruited." };

const note = (text, sourceLabel, sourceUrl) => ({ text, sourceLabel, sourceUrl });

const TODAY_ITEMS = [
  {
    id: "i-saints", kind: "track", title: "(I'm) Stranded", artist: "The Saints", year: 1976,
    why: "Where the Edition starts: a Brisbane band pressing its own single, on its own label, in 1976.",
    linerNote: note(
      "The Saints self-released it on their own Fatal Records in September 1976 (about 500 copies). It is widely regarded as the first punk single from outside the US.",
      "State Library of Queensland", "https://www.slq.qld.gov.au/blog/im-stranded-no-time-saints-1976-treasure-collection-john-oxley-library"),
  },
  {
    id: "i-gobetweens", kind: "artist", title: "The Go-Betweens", artist: "The Go-Betweens", year: null,
    why: "The other founding Brisbane band story — two songwriters, one university.",
    linerNote: note(
      "Robert Forster and Grant McLennan met at the University of Queensland while both were taking a theatre arts course.",
      "Wikipedia (W)", "https://en.wikipedia.org/wiki/The_Go-Betweens"),
  },
  {
    id: "i-unit", kind: "album", title: "Unit", artist: "Regurgitator", year: 1997,
    why: "A big, strange, very 90s record made in a very Brisbane way: in a building nobody was meant to be in.",
    linerNote: note(
      "Unit was recorded in a condemned Fortitude Valley warehouse nicknamed 'The Dirty Room'. It peaked at No. 4 on the ARIA albums chart.",
      "Wikipedia (W)", "https://en.wikipedia.org/wiki/Unit_(album)"),
  },
  {
    id: "i-hungryghost", kind: "album", title: "Hungry Ghost", artist: "Violent Soho", year: 2013,
    why: "Suburban Brisbane rock that crossed over without changing its accent.",
    linerNote: note(
      "The band formed in 2004 in the Brisbane suburb of Mansfield. Hungry Ghost debuted at No. 6 on the ARIA chart and has since been certified ARIA Platinum.",
      "Wikipedia (W) and The Music Network", "https://themusicnetwork.com/news/violent-soho-earns-aria-platinum-certification"),
  },
  {
    id: "i-keepsake", kind: "album", title: "Keepsake", artist: "Hatchie", year: 2019,
    why: "The newest record in today's Edition, and a reminder the Brisbane sound keeps changing shape.",
    linerNote: note(
      "Harriette Pilbeam's debut album as Hatchie was released on 21 June 2019 through Double Double Whammy, Ivy League and Heavenly.",
      "Wikipedia (W)", "https://en.wikipedia.org/wiki/Hatchie"),
  },
];

const CHARTS_ITEMS = [
  {
    id: "i-thesedays", kind: "track", title: "These Days", artist: "Powderfinger", year: 1999,
    why: "A song that was written for a film and ended up belonging to a country.",
    linerNote: note(
      "Written for the 1999 film Two Hands, it won the Triple J Hottest 100 on Australia Day 2000.",
      "National Film and Sound Archive", "https://nfsa.gov.au/latest/deep-dive-powderfingers-bernard-fanning-and-producer-nick-didia"),
  },
  {
    id: "i-odyssey", kind: "album", title: "Odyssey Number Five", artist: "Powderfinger", year: 2000,
    why: "The album that made a Brisbane band a national one.",
    linerNote: note(
      "It reached No. 1 on the ARIA albums chart and won five ARIA Awards in 2001, including Album of the Year. The band formed in Brisbane in 1989.",
      "Wikipedia (W)", "https://en.wikipedia.org/wiki/Odyssey_Number_Five"),
  },
  {
    id: "i-savagegarden", kind: "album", title: "Savage Garden", artist: "Savage Garden", year: 1997,
    why: "Brisbane pop at full volume.",
    linerNote: note(
      "The Brisbane-formed duo's self-titled 1997 debut went to No. 1, and they won a record ten ARIA Awards in 1997.",
      "Wikipedia (W)", "https://en.wikipedia.org/wiki/Savage_Garden"),
  },
  {
    id: "i-apartment", kind: "track", title: "Apartment", artist: "Custard", year: 1995,
    why: "Jangly, funny and unmistakably local.",
    linerNote: note(
      "Released in October 1995 as the first single from Wisenheimer, it reached No. 7 in the 1995 Triple J Hottest 100.",
      "Wikipedia (W)", "https://en.wikipedia.org/wiki/Custard_(Australian_band)"),
  },
  {
    id: "i-192020", kind: "track", title: "19 20 20", artist: "The Grates", year: null,
    why: "Three-piece energy from the 2000s Brisbane scene.",
    linerNote: note(
      "The Grates formed in Brisbane in 2002. Four tracks from their debut album placed in the 2006 Triple J Hottest 100, with '19 20 20' at No. 10.",
      "Wikipedia (W)", "https://en.wikipedia.org/wiki/The_Grates"),
  },
];

const ROOMS_ITEMS = [
  {
    id: "i-zoo", kind: "place", title: "The Zoo", artist: "Fortitude Valley", year: 1992,
    why: "A small room with a long run.",
    linerNote: note(
      "It opened on 11 December 1992. It closed in 2024 and reopened under Crowbar ownership.",
      "The Music Network", "https://themusicnetwork.com/the-zoo-30th-anniversary/"),
  },
  {
    id: "i-powerhouse", kind: "place", title: "Brisbane Powerhouse", artist: "New Farm", year: 2000,
    why: "A power station that now powers a different kind of night out.",
    linerNote: note(
      "It was a power station supplying Brisbane's tram network (operating from 1928, decommissioned 1971) and reopened as an arts centre in May 2000.",
      "Wikipedia (W)", "https://en.wikipedia.org/wiki/Brisbane_Powerhouse"),
  },
  {
    id: "i-triffid", kind: "place", title: "The Triffid", artist: "Newstead", year: 2014,
    why: "A hangar turned into a live room.",
    linerNote: note(
      "A converted WWII aircraft hangar on Stratton Street, Newstead, it launched as a live venue in late 2014 with a capacity of about 800.",
      "Broadsheet Brisbane", "https://www.broadsheet.com.au/brisbane/bars/the-triffid"),
  },
  {
    id: "i-fortitude", kind: "place", title: "Fortitude Music Hall", artist: "Fortitude Valley", year: 2019,
    why: "The Valley's big room.",
    linerNote: note(
      "The venue holds about 3,000, sits on Brunswick Street Mall, and opened in 2019 as part of The Fort.",
      "Aus Leisure", "https://www.ausleisure.com.au/news/fortitude-music-hall-opens-in-brisbane"),
  },
  {
    id: "i-cloudland", kind: "place", title: "Cloudland", artist: "Fortitude Valley", year: 1982,
    why: "Included because rooms disappear, and Brisbane remembers.",
    linerNote: note(
      "The Cloudland ballroom was demolished overnight on 7 November 1982 by the Deen Brothers, without a permit and despite its National Trust listing, to make way for an apartment block.",
      "Australian Geographic", "https://www.australiangeographic.com.au/history-culture/2025/11/the-beloved-brisbane-ballroom-demolished-in-secret/"),
  },
];

const MAP_ITEMS = [
  {
    id: "i-gbbridge", kind: "place", title: "Go Between Bridge", artist: "Brisbane River", year: 2010,
    why: "A bridge named after a band, chosen by public competition.",
    linerNote: note(
      "The bridge, formerly the Hale Street Link, was named through a council naming competition (announced 29 September 2009) and opened to traffic on 5 July 2010.",
      "Wikipedia (W)", "https://en.wikipedia.org/wiki/Go_Between_Bridge"),
  },
  {
    id: "i-beegees", kind: "place", title: "Bee Gees Way", artist: "Redcliffe", year: 2013,
    why: "Not the city centre, but part of the same story.",
    linerNote: note(
      "The Gibb family settled in Redcliffe in the late 1950s and the brothers played at Redcliffe Speedway. Bee Gees Way there was unveiled in 2013.",
      "Visit Moreton Bay Region", "https://www.visitmoretonbayregion.com.au/bee-gees-way"),
  },
  {
    id: "i-valley", kind: "place", title: "The Valley Special Entertainment Precinct", artist: "Fortitude Valley", year: 2006,
    why: "A planning rule that shaped where live music is allowed to be loud.",
    linerNote: note(
      "The Valley Special Entertainment Precinct commenced on 1 July 2006. Brisbane City Council confirms the designated area.",
      "Brisbane City Council", "https://brisbane.qld.gov.au/planning-building/planning-guidelines-tools/other-plans-projects/valley-special-entertainment-precinct/about-valley-special-entertainment-precinct"),
  },
  {
    id: "i-livid", kind: "story", title: "Livid Festival", artist: "UQ, West End, RNA Showgrounds", year: 1989,
    why: "A festival that grew up across three Brisbane sites.",
    linerNote: note(
      "It started in 1989 at the University of Queensland with about 1,500 people, later moved to Davies Park in West End and then the RNA Showgrounds, and ran until 2003.",
      "State Library of Queensland", "https://www.slq.qld.gov.au/blog/livid-festival-1998"),
  },
  {
    id: "i-4zzz", kind: "story", title: "4ZZZ", artist: "Community radio", year: 1975,
    why: "Community radio, on air since 1975.",
    linerNote: note(
      "4ZZZ began broadcasting on 8 December 1975 as 4ZZ-FM.",
      "State Library of Queensland", "https://www.slq.qld.gov.au/blog/brisbane-radio-station-4zzz-40th-anniversary"),
  },
];

export function seedEditions(today) {
  const mk = (offset, title, blurb, items) => ({
    id: `seed-${addDays(today, -offset)}`,
    date: addDays(today, -offset),
    title, blurb,
    // Founding Editions are history, not a living scene: every artist is established and from Brisbane.
    // They are exempt from the new-artist mix rule; real curators must include new and upcoming artists.
    items: items.map((it) => ({ ...it, stage: "established", origin: ["track", "album", "artist"].includes(it.kind) ? "local" : undefined })),
    curatorId: DESK.id, curatorName: DESK.name,
    status: "published", seed: true,
  });
  return [
    mk(0, "Brisbane, on record", "Five Brisbane records and artists, from a 1976 single to a 2019 debut.", TODAY_ITEMS),
    mk(1, "Hottest 100s and ARIA nights", "Five songs and albums that took a Brisbane sound national.", CHARTS_ITEMS),
    mk(2, "Rooms that made the noise", "Five venues, from a power station to a ballroom that no longer exists.", ROOMS_ITEMS),
    mk(3, "Names on the map", "Five places and institutions where Brisbane music left a mark.", MAP_ITEMS),
  ];
}

const q = (s) => encodeURIComponent(s);
export const listenLinks = (item) => ({
  spotify: `https://open.spotify.com/search/${q(`${item.title} ${item.artist}`)}`,
  youtube: `https://www.youtube.com/results?search_query=${q(`${item.title} ${item.artist}`)}`,
  bandcamp: `https://bandcamp.com/search?q=${q(`${item.title} ${item.artist}`)}`,
});
export const findUrl = (item) =>
  `https://www.google.com/search?q=${q(`${item.title} ${item.artist}`)}`;
