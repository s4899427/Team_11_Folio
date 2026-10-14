# Decision log

One line per decision that changed the design: what, why, evidence, and what it cost. Dates are those recorded in the repository or the team's working notes. A "reason" is only written where the team recorded one; bracketed items need the team's own account.

| Date | Decision | Reason | Evidence | Cost or risk |
|---|---|---|---|---|
| 20 Aug 2026 | Repository created | Start of the project | first commit | n/a |
| 7 Sep 2026 | Earlier concept recorded as MOTIF (world-culture discovery across music, fashion, art, food) | Six interviews converged on a wish for human curation over algorithmic discovery; peer feedback asked who decides accuracy **[REVIEW]** | project notes | Later replaced |
| 21 Sep 2026 | Renamed to Folio; React prototype replaces the earlier build; deploy to GitHub Pages | One curated daily experience was the strongest part of the concept; a browsable library was not **[REVIEW]** | commits on 21 Sep | Earlier research reframed |
| 8 Oct 2026 | Music-first Folio: one Edition per city per day, Liner Notes, shared data | Tutor's Week 9 feedback: scope to one domain, keep the curator mechanic supporting; two team members proposed music; team chose to reposition rather than rename again **[REVIEW]** | commits on 8 Oct | Narrower than MOTIF |
| 8 Oct 2026 | Cities: Brisbane live, Seoul and Mumbai as Coming soon | Show the city idea without faking content | commit "City-aware Folio" | Less content to evaluate |
| 8 Oct 2026 | Curators are applied for, never self-selected; curator voting | Accountability | CURATOR_GOVERNANCE.md | Slower to onboard curators |
| 9 Oct 2026 | Data sources checked from official pages: Ticketmaster Discovery and MusicBrainz usable; Bandsintown unavailable to students; Spotify dev mode limited | Choose feasible gig data later | Research notes | Gig feed not built |
| 12 Oct 2026 | Shared database live; smoke test 33 of 33 | Multiple simultaneous users | SUPABASE_SETUP.md | Hosted dependency |
| 13 Oct 2026 | Edition size 8 to 12 picks (was 5) | Team judgement that 5 felt too thin; **not** from testing | validate.js | Longer to curate |
| 13 Oct 2026 | New-artist mix: at least 2, at most 4, never above 45% | Local artists meaningfully present, familiar names still anchor | validate.js; to be tested by Q8 | Judgement, untested |
| 13 Oct 2026 | Nearby events moved from Today to Browse | Keep Today calm; one job per screen | Today.jsx, Browse.jsx | One more tap to see gigs |
| 13 Oct 2026 | Location is optional and never stored | Privacy; Facebook Beacon lesson | CityPicker.jsx | Manual city pick for some users |
| 13 Oct 2026 | Roles and landing: member to Today, curator to Studio, team to Team screen; admin only via database flag | Each role sees what it needs; no self-promotion | Admin.jsx; migration 002 | More to test |
| 13 Oct 2026 | Delete my account allowed except for curators and the team | Respect for users without breaking the archive | migration 002 | Manual removal for curators |
| 13 Oct 2026 | Base44 kept as a throw-away look-and-feel prototype; the repo build is the proof of concept | Brief: do not let the prototype become the product | Base44 prototype link | Two codebases; only the repo build is evaluated |
| 15 Oct | New and upcoming picks need two independent sources, a local note and the curator's attestation (no SoundCloud API, no stream counts) | Protect emerging local artists from non-local or AI-made acts replacing them; keep accountability with a named human; avoid unverified APIs and popularity metrics | Creative Australia *Listening In* (2025): algorithms may make emerging Australian artists harder to find; unit tests and UI flow F4 | Curators can still sign falsely; cannot detect AI music; extra effort per new-artist pick [REVIEW: check with evaluation] |
| 15 Oct | Intro rewritten as a front-page style story told one part at a time (tap, swipe or Next), ending on Today; the Folio logo replays it; a Brisbane-only On Country part names Meanjin with its source | A single dense screen was a wall of text; first-run stories are a familiar mobile pattern and let each idea land (awareness of what the product is before use). Replay lets a returning user or a marker see it again | Contact-sheet screenshots F1-1 to F1-3; UI test `intro.py` (tap, swipe, back, skip, replay, Seoul) | More taps before first value (skip button added); wording is a hypothesis to test in evaluation Q1 [REVIEW] |

## Decisions still to make
Ethics framework to apply; how markers access Studio and Team screens; tradeshow day.
