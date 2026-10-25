# Folio

DECO3500 Social & Mobile Computing — Team 11, Semester 2 2026

**Poster:** [docs/FOLIO_POSTER.pdf](https://github.com/s4899427/Team_11_Folio/blob/main/docs/FOLIO_POSTER.pdf) · **Live prototype:** https://s4899427.github.io/Team_11_Folio/ · **Wiki** (Design Process Overview, Ethical Considerations, stand-up records): https://github.com/s4899427/Team_11_Folio/wiki

> **Marking guide:** start at [`submission/00_START_HERE/README.md`](./submission/00_START_HERE/README.md). It maps every marking criterion to its evidence (MVP specification, five main flows with test results and screenshots, social and mobile concept map, design process, evaluation, ethics, pitch and Q&A).


## What this is

Folio is a **daily, human-curated music Edition for your city** (Brisbane curated today; Seoul and Mumbai have verified city notes and an apply-to-curate path). Your city sets the time zone and midnight lock, the greeting, the local "Did you know?" facts and the Nearby layer. Open the app and there is one Edition: eight to twelve picks chosen by a named curator, each with a short reason and a **Liner Note** (one checkable fact, with a source). Every Edition mixes artists you may already know with 2-4 new and upcoming local artists (at least 2, at most 4, never above 45%), and music picks are Australian artists, tagged by stage and origin. No algorithm: there are no likes, and comments don't rank anything. At the city's midnight the Edition locks into the **Archive** and is never edited again.

- **Today / Browse / Me** are the three tabs. Browse holds the curators, the artists you can connect to, and the Archive. Reading is open to guests.
- **Live touches (added after the evaluation sessions; not tested with participants):** comments on the open Edition refresh every 5 seconds, a Share button on Editions and picks, and an anonymous "reading now" count (needs `prototype/supabase/migrations/004_presence.sql`). These poll the database; they are not websockets.
- **Curators** build and publish Editions in the Curator Studio (one Edition per day; no source link, no publish).
- **Artists** pitch a track to a curator, post short updates to fans who connected, and answer one question a day from each. Fans choose to connect (the artist sees their name); there are no follower counts and no open messaging. **Nearby** shows curator gig tips and links to Brisbane venues.

What changed since Week 9 and what is deliberately not built: [`docs/requirements/music-first-addendum.md`](./docs/requirements/music-first-addendum.md). Research basis and rationale remain in [`docs/requirements/master-spec.docx`](./docs/requirements/master-spec.docx).

## Try the prototype

**Live:** https://s4899427.github.io/Team_11_Folio/

```bash
cd prototype
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests (time zones, cities, voting rules, validation, seed integrity)
bash supabase/rls_test.sh   # 65 database-rule checks; needs a RUNNING local Postgres with supabase/rls_stub.sql then schema.sql then migrations 002-004 loaded,
                            # and PGHOST/PGPORT/PGUSER set (steps: submission/07_Engineering/SUPABASE_SETUP.md)
bash supabase/presence_test.sh   # checks the 'reading now' function (migration 004), same throwaway Postgres
node supabase/smoke_test.mjs     # live check of a real Supabase project (needs VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, CURATOR_EMAIL, CURATOR_PASSWORD)
```

Use **Join as a guest** to try it without an email. Runs in **demo mode** by default (data stays on the device). To share data across devices, follow [`docs/SUPABASE_SETUP.md`](./docs/SUPABASE_SETUP.md).

## Repo guide

| Folder | What's in it |
|---|---|
| `prototype/` | The working prototype (React + Vite); `supabase/schema.sql` is the database |
| `docs/evaluation/` | Evaluation kit (protocol, scripts, observation sheet). Results: `submission/05_Research_Evaluation/EVALUATION_RESULTS.md` |
| `docs/CURATOR_GOVERNANCE.md` | How curators are backed, tiers, risks. Thresholds are hypotheses |
| `docs/requirements/` | `master-spec.docx` (current) + earlier requirements draft |
| `docs/research/` | Interviews (Round 1 + Round 2, de-identified), synthesis, current-vs-expected, use cases |
| `docs/design/` | UX specs and the SMC theory-to-feature mapping |
| `docs/process/` | Concept pivots, continuity report, decision log |
| `docs/team/` | Team charter and the ethics draft (also up on the Wiki) |
| `docs/archive/` | Old drafts from the MOTIF era, kept for process history |
| `presentation/` | Current stand-up deck |

Check the [Wiki](https://github.com/s4899427/Team_11_Folio/wiki) for the Design Process Overview, Ethical Considerations, and our stand-up records.

## Team

| Name | Role |
|---|---|
| Dylan | Lead, research synthesis, documentation, product decisions, shared database, evaluation sessions |
| Pranav | Content and audience research; from 9 Oct technical owner (deployment, README, tradeshow kit) |
| Shaz | Earlier technical build; from 9 Oct audience research, poster, pitch and demo script; wrote the Audience Evaluation, Ethical Considerations and Future Improvements pages (`submission/11_Evaluation/`) |

## AI use disclosure
The prototype code was largely written with Claude (Anthropic) under the team's direction: architecture, UI, database rules and tests. The research, requirements, evaluation, ethics and reflections are the team's own. A full per-section AI-use appendix with prompts, as the course requires, belongs in the submission; see `docs/AI_USE.md` (to be completed by the team).
