// ── Real local events integration ──────────────────────────────────
// Uses Ticketmaster's Discovery API, which (unlike Eventbrite) supports
// direct client-side calls with a free public API key — no backend
// proxy required for a prototype like this.
//
// TO GO LIVE:
//   1. Get a free key: https://developer.ticketmaster.com/products-and-docs/apis/getting-started/
//   2. Create a file named .env.local in the project root containing:
//        VITE_TICKETMASTER_API_KEY=your_key_here
//   3. Restart `npm run dev`. That's it — no code changes needed.
//
// Without a key, this safely falls back to the existing NEARBY.events
// mock data rather than failing or showing an error.

import { NEARBY } from "./folio-data";

export async function fetchNearbyEvents(city = "Melbourne") {
  const apiKey = import.meta.env.VITE_TICKETMASTER_API_KEY;

  if (!apiKey) {
    return { events: NEARBY.events, live: false, reason: "No VITE_TICKETMASTER_API_KEY set — showing placeholder events." };
  }

  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${encodeURIComponent(city)}&size=5&sort=date,asc`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Ticketmaster responded ${res.status}`);
    const data = await res.json();
    const raw = data._embedded?.events || [];
    if (raw.length === 0) throw new Error("No events returned for this city");

    const events = raw.map((e, i) => ({
      id: e.id || `live-${i}`,
      type: e.classifications?.[0]?.segment?.name?.toLowerCase() || "art",
      title: e.name,
      venue: e._embedded?.venues?.[0]?.name || "Venue TBA",
      time: e.dates?.start?.localDate || "Date TBA",
    }));
    return { events, live: true, reason: null };
  } catch (err) {
    return { events: NEARBY.events, live: false, reason: `Ticketmaster fetch failed (${err.message}) — showing placeholder events.` };
  }
}
