# Folio — Requirements Document (Final)
Domain, concept, and requirements as they actually stand — supersedes the earlier draft skeleton, which was left with placeholder text and described a concept the team has since moved past.

## 0. Domain Statement
**Social and mobile computing for shared cultural experience.**

Folio sits at the intersection of social computing (how people express, react to, and coordinate around each other) and mobile/contextual computing (location-awareness, ambient presence), applied to culture broadly — not locked to music, art, or fashion as separate verticals. Each day surfaces one curated cultural *experience* (which may include a song, an artwork, a place, a ritual, or any other instance a verified curator says belongs together), and people engage with it through reaction, coordination, and human curation instead of an algorithmic feed.

**One-line version for presentations/Q&A:**
"Social, because people react to and coordinate around a shared moment together, not alone. Mobile, because it's tied to where you are and what's happening right now, not just what you'd find sitting at a desktop."

## 1. Concept Summary
Folio opens to **Today** — a single daily "Thread": one curated cultural experience, assembled from any number of elements (not fixed to exactly music + art + fashion), picked by a rotating verified guest curator. The Thread locks permanently at midnight, becoming a dated record rather than an open-ended feed. **Archive** holds the full back-catalog plus deeper era/location/style browsing (organised into Tunes, Frame, and Fit as sub-categories, not top-level tabs). **Me** is a personal profile — identity attributes drawn from onboarding picks, and a wall separating published posts from private drafts.

## 2. Core User Needs (from research)
- **Need**: Discovery without algorithmic narrowing
  - Evidence: Aloysious, Minahil, Sully — all independently described algorithm fatigue and a preference for human curation
- **Need**: Trust in curated/verified sources
  - Evidence: Round 2 interviews (verified-artist trust questions)
- **Need**: Coordinating identity/style with friends before an occasion
  - Evidence: Marushka (Y2K playlist/outfit pairing for occasions), Sully and Rayyan (checking friends' style/music before deciding their own) — directly informed the "Tonight's Theme" feature
- **Need**: A reason to share culture that isn't social validation alone
  - Evidence: Team 4 peer feedback ("why would someone share with strangers?") — addressed via lineage/attribution on Remixes and the dated-record framing of each Thread

## 3. Functional Requirements
- The system must present one daily curated "Thread" composed of any number of elements from any cultural domain — not restricted to a fixed set of categories.
- The system must lock each Thread permanently at a fixed time (midnight local), after which it moves to the Archive as a read record.
- The system must allow browsing of past Threads and the deeper catalog via Archive, organised by era, location, and style.
- The system must NOT use algorithmic recommendation to surface content anywhere in the app.
- The system must require every user post to attach to a specific entry or Thread — no free-standing posts.
- The system must run an automated relevance and safety check on every post before publishing.
- The system must display multiple attributed perspectives on contested or interpretive content, rather than resolving to one enforced "correct" version.
- The system must support saving a post as a private draft, separate from publishing.
- The system must support a lightweight, non-social-graph coordination feature ("Tonight's Theme") that lets a user see a small set of others' style/vibe choices without following, messaging, or friending them.
- The system must use device location (with consent) to surface a short cultural intro to the user's current area, and must degrade gracefully (no nagging) if location is denied.

## 4. Design Principle: Informative, Not Infinite
Still fully in force. No infinite auto-loading, no autoplay, no short-form video, depth over volume, and every screen supports a specific task rather than open-ended passive scrolling. Extended to the daily Thread model itself: the Thread's hard lock at midnight is the strongest possible enforcement of "bounded, not infinite" — there is structurally no feed to get lost in.

## 5. Non-Functional / Constraints
- Must be legally compliant — no unlicensed commercial music streaming; any audio is either royalty-free or short preview clips via a legitimate API (e.g. Spotify), linking out for full playback.
- Must function as a proof-of-concept: the Today/Thread interaction is the one fully real, polished core; Archive content and imagery may be simulated/placeholder for this stage.
- Must support multiple users engaging with the same Thread concurrently, per the assignment's social/mobile requirement.

## 6. Resolved (previously open) Decisions
- Drop & Remix → superseded by lineage-based Remix within the Thread/Archive post system
- AR dress-up → cut; not part of the current scope
- Nearby/Scene → became the location-based cultural intro + Archive's "Shows near you"
- Full music streaming → cut in favour of short preview clips + link-out to Spotify
- Followers/following (user-to-user) → deliberately excluded; replaced with ambient presence and lineage/attribution

## 7. Still Genuinely Open
- **Curator rotation**: who is eligible to curate a Thread, how the slot is assigned, and what happens on a day nobody is lined up (cold-start problem)
- **Archive content moderation**: who resolves disputes on *factual, verifiable* claims (dates, locations) — separate from the plurality-of-perspectives model, which already handles interpretive disagreement
- **Post-lock interaction**: whether users can still add takes to an archived Thread after it locks, or whether it becomes fully read-only

## 8. Requirements Traceability
| Requirement | Supporting evidence | Source |
|---|---|---|
| No algorithm | "Algorithm has ruined the taste..." | Aloysious |
| No algorithm | "Everything feels very algorithm-driven..." | Minahil |
| Bounded, not infinite | Explicit design principle, tested against interview sentiment | Team synthesis |
| Coordination without a follow graph | Friends' style-checking before going out | Marushka, Sully, Rayyan |
| Plurality over single "accuracy" | Response to Team 8 peer feedback | Team 8, Round 1 feedback |
| Sample diversity in curation | Response to Team 8 peer feedback on UQ-only sample | Team 8, Round 1 feedback |

---
*This document replaces Requirements_Document_Skeleton.md, which is now stale and should not be used as the reference copy.*
