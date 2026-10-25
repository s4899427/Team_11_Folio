# Design process overview: Folio

*DECO3500 Social & Mobile Computing, Team 11.*

**Poster and promotional material:** [Folio poster (PDF)](https://github.com/s4899427/Team_11_Folio/blob/main/docs/FOLIO_POSTER.pdf)
**Prototype:** https://s4899427.github.io/Team_11_Folio/ . Reading needs no account. To comment, open Me, Create account, then "Join as a guest" (no email). `#/demo` opens a sandbox where every role can be tried on one device.
**Repository:** https://github.com/s4899427/Team_11_Folio

## Summary
Newcomers to a city, and people tired of algorithmic feeds, struggle to find a local music scene they can trust and talk about. Folio offers one human-picked music Edition per city per day, locked at the city's midnight, with no likes and no ranking. Every pick has a reason and a Liner Note with a checkable source. Listeners, artists and curators connect through comments, a Discovery check and an artist-fan link, with the rules enforced in the database.

## Process

**1. Starting wide (MOTIF).** We began with a wiki of world culture. Six Round 1 interviews converged, unprompted, on one complaint: algorithmic discovery has flattened taste and people want something more human.

**2. Narrowing.** Our pivot log records eight changes, such as dropping streaming for licensing reasons and moving from a browsable library to one daily curated Thread. Course feedback called the daily curated experience our strongest idea. We renamed the app (MOTIF to Folio) after finding clashes with existing products.

**3. Round 2 research.** Five more interviews found that all five drew the same line between inspiration and killing time, and that interest in a curator-led offer depended on the curator's credibility. One participant was a team member's self-interview, so we treat it as weak evidence.

**4. Music-first pivot (after Week 9).** Our tutor's stand-up feedback was to scope down to one domain. Two of us independently proposed music. We chose Brisbane because we and our interviewees are here, and because the clearest use case is an international student new to Australia. The Thread became an Edition of 8 to 12 picks, each with a Liner Note, and roles became guest, listener, artist and curator.

![Today screen, 14 Oct build](https://github.com/s4899427/Team_11_Folio/raw/main/submission/09_Evidence/screenshots/F1-4-today.png)
*Today, 14 Oct build: the curator, the picks and the discussion for one city and one day.*

**5. Building and simulating.** The prototype (React, Vite) runs on a shared Supabase database so several phones see one Edition. Rules sit in the database as well as the interface: one Edition per city per day, no publishing without a source, curators approved by the team, comments only on the current Edition. The rules are covered by 35 unit tests, a live smoke test and 65 database rule tests on a local Postgres. We balanced real function (shared data, roles, midnight lock) with simulation (seed Editions, Brisbane only, curator-entered gigs, other cities marked "Coming soon"). A Base44 build was an early side experiment; its security scan found 14 issues, so we never used it with participants.

![Studio validation](https://github.com/s4899427/Team_11_Folio/raw/main/submission/09_Evidence/screenshots/F4-3-studio-errors.png)
*Studio refuses an Edition with missing sources or too few picks.*

**6. Evaluation (formative).** We used observation, interview, critical questions (including "when would you not use it") and heuristics adapted from locales-based groupware, rather than SUS or TAM. On the evening of 19 Oct we ran two sessions, one participant each, so **simultaneous multi-user use was not tested**. Neither participant could comment: both were anonymous readers and the only prompt was a link near the bottom of a very long page. P1 read Browse as an events guide; P2, new to Brisbane, valued the local facts. Full table: `05_Research_Evaluation/EVALUATION_RESULTS.md`.

**7. What changed.** Design changes so far: no likes (Rounds 1 and 2); sourced Liner Notes (peer feedback); Nearby inside Browse with opt-in location; curators "applied for, not chosen"; Editions widened to 8 to 12 picks (a team judgement, not a finding). After the sessions we fixed the commenting finding: a Discussion shortcut, a "Join as a guest" prompt and 44 px tap targets (commit 9a06de9). Linking Browse venues back to picks is not built.

**8. After evaluation.** We then added three features, none tested with participants (they were tested only with automated tests and a browser test against a mock server): near-live comments (the open Edition re-checks every 5 seconds), a share button, and an anonymous "reading now" count (no identity stored). All use polling, not websockets; the count can be inflated by repeated calls but carries no ranking or reward.

**9. Peer feedback.** Seven peers from four teams (6, 7, 8, 10) left written feedback on the course Miro board (summary: `05_Research_Evaluation/TRADESHOW_FEEDBACK.md`). Themes: a one-way social flow; unclear real versus demo-only features; a midnight lock that is hard to see in a short demo. They valued human curation and sources. We have not retested this.

## Theory and ethics
We use the unit's location and locales frameworks, and Winner (1980) and Akrich (1992) to argue that our rules are political choices built into the software. Full analysis: the Ethical Considerations page.

## Limitations
- **AI-made music** cannot be detected. The safeguard is a named curator who signs each new-artist pick and cites two independent sources; a curator could sign falsely. We have not tested deliberate abuse.
- **"Local" and "new"** are claims, not measurements. We use no stream counts or streaming integration.
- **Facts:** some seed picks rest on Wikipedia alone and are being cross-checked; the Acknowledgement of Country wording is unreviewed.
- **Evaluation** was two short sessions, in one city, with people known to the team, and the facilitator asked some leading questions. Findings are formative, not proof.
- **Presentation:** at the 22 Oct tradeshow our screen-only prototype stood beside physical projects such as Pulseband (People's Choice); we did not test whether a reading-led app is less eye-catching.
- **Prototype, not product:** no email recovery, moderation tooling, content licensing or scale testing.

## Who did what
| Person | Contribution |
|---|---|
| Dylan | Team lead. Research synthesis, documentation, product decisions, shared database, three interviews. |
| Pranav | Content and audience research; from 9 Oct technical owner (deployment, README, tradeshow kit). |
| Shaz | Earlier technical build and three interviews; from 9 Oct audience research, poster, pitch and demo script. |

*AI use, with prompts: `docs/AI_USE.md`.*
