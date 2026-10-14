# Folio — music-first addendum (supersedes the multi-domain parts of master-spec v2)

Decision (post Week 9): reposition only. Same product, one domain: **music, for Brisbane**. This file records what the code now does. `master-spec.docx` is unchanged and still holds the research basis and rationale.

## What changed in the build
| Master spec v2 | Now |
|---|---|
| 12 communities → 5 lenses, community picked at onboarding | Removed. One domain. Roles are Listener / Artist / Curator. |
| Thread of mixed culture, 5 elements | **Edition** of 8–12 music picks (track, album, artist, place, story). |
| — | **Liner Note** on every pick: one checkable fact with a source link. Publishing is blocked without a source. |
| Likes + comments | **No likes.** Comments are oldest-first and carry no ranking weight. |
| Curator Desk rotation algorithm (§9.4) | **One Edition per day, enforced in the database** (first curator to claim a day gets it). Rotation/fairness queue is future work. |
| Midnight lock (UI countdown) | Locked in **Brisbane time**; the database refuses edits after the day passes; future Editions stay hidden until their day. |
| Local-only data | Shared data through Supabase (optional), with an offline cache and built-in fallback. |
| Location card (Melbourne, mock) | **Nearby**: curator-posted gig tips + real Brisbane venue links. No scraped listings. |
| Friends & More, Make a Post composer | Removed (scope-down). Artists **pitch** a track to a curator instead. |
| Random stock photos / avatars | Removed. Typographic sleeves; no third-party images. |
| Simulated login only | Supabase email login when configured; simulated local login otherwise. |

## Seed content
Four founding Editions written by "Folio Desk" (the team), 20 picks, each with a sourced Liner Note. Sources marked (W) in `src/lib/seed.js` are Wikipedia-only: cross-check against a primary source before the tradeshow.

## Not built (say so when asked)
Artist take-over of an Edition for a day · shared-taste "ticket to talk" · curator voting/fan-base nomination · Spotify/YouTube embeds (links out only: licensing) · push notifications · moderation tooling beyond report-by-hand · real Brisbane curator recruitment (Studio and approval path exist; people do not yet).
