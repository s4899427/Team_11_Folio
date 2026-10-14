# Design process overview: Folio

*DECO3500 Social & Mobile Computing, Team 11. Wiki page. Anything in **[AFTER EVALUATION]** brackets is evidence we have not collected yet; it is filled after the evaluation sessions, not invented.*

**Poster and promotional material:** [link, added after the tradeshow]  
**Prototype:** https://s4899427.github.io/Team_11_Folio/ (use "Join as a guest"; no login needed)  
**Repository:** https://github.com/s4899427/Team_11_Folio

## Summary
Newcomers to a city, and people tired of algorithmic feeds, struggle to find a local music scene they can trust and talk about. Folio offers one human-picked music Edition per city per day, locked at the city's midnight, with no likes and no ranking. Every pick has a reason and a Liner Note with a checkable source. Readers, artists and curators connect through shared comments, a Discovery check and an artist–fan link, with the rules built into the database.

## Process

**1. Starting wide (MOTIF).** We began with a wiki of world culture (music, fashion, art, food). Six Round 1 interviews converged, unprompted, on one complaint: algorithmic discovery has flattened taste and people want something more human. Peer feedback (Team 8) asked who decides accuracy when sources disagree.

**2. Narrowing and pivots.** Our pivot log records eight changes, such as dropping full streaming for licensing reasons, replacing a single "accuracy" model with several attributed perspectives, and moving from a browsable library to one daily curated Thread. Course feedback said the daily curated experience was our strongest idea. We also renamed the app (MOTIF to Folio) after finding clashes with existing products.

**3. Round 2 research.** Five more interviews (two interviewers) found that all five drew the same line between inspiration and killing time, and that interest in a curator-led daily offer depended on the curator being credible. One participant was a team member's self-interview; we treat it as weak evidence. Participants also described coordinating before big occasions, but treated it as a prompt, not a rule; that idea was later dropped with the multi-domain scope.

**4. Music-first pivot (after Week 9).** We repositioned to one domain, music, for one city, Brisbane. Our tutor's Week 9 stand-up feedback was to scope down to a single domain rather than stay cross-domain, and to keep the curator mechanic a supporting feature. Two of us independently proposed music. We chose Brisbane because it is where we and our interviewees are, and because the clearest use case we found is an international student new to Australia who wants to learn what local people actually listen to. The Thread became an Edition of 8 to 12 picks; each gained a Liner Note; roles became guest, listener, artist and curator. The design objective became: invite people in a place to discover music through a named human, and to back curators who show them something new.

**5. Building and simulating.** The prototype (React and Vite) runs on a shared Supabase database so several phones see the same Edition. Rules sit in the database as well as the interface: one Edition per city per day, no publishing without a source, curators approved by the team, comments only on the current Edition. We tested the rules (65 checks on a throwaway database; 33 checks on the live project). We balanced real function (shared data, roles, midnight lock) with simulation (seed Editions, Brisbane only, curator-raised gigs, Seoul and Mumbai marked "Coming soon"). A Base44 build was an early side experiment; a security scan found 14 issues, so we did not use it with real participants.

**6. Evaluation (formative, in context, several people at once).** Following the unit, we adapted methods to social and mobile use rather than using SUS or TAM: sessions with groups using the same Edition at the same time, observation and interview, critical questions (including when would you not use it), and heuristics adapted from locales-based groupware (Greenberg et al.). The kit lists eleven questions covering curator trust, Nearby use, shared facts, the Discovery check, awareness of others, the place-based layer, the mix of new artists, artist connection, avoiding unwanted interaction and physical context. **[AFTER EVALUATION: dates, number of groups and participants, setting, and the main findings for each question. For each finding, state what changed in the design.]**

**7. What changed.** Design changes driven by the process so far: no likes (Round 1 and 2), sourced Liner Notes (peer feedback on accuracy), Nearby moved into Browse and a city picker with opt-in location (context), curator "applied for, not chosen" (curation as gatekeeping), a wider Edition of 8 to 12 picks (after reviewing the first build we judged 5 to 7 picks too thin; this is a team judgement, not yet a finding), and a revised new-artist mix. **[AFTER EVALUATION: add changes made after the sessions.]**

## Theory and ethics
We use the unit's frameworks for location and locales, and Winner (1980) and Akrich (1992) to argue that our rules are political choices built into the software. Full analysis: Ethical Considerations page. Main open risk: with few curators the scene will be uneven.

## Limitations and what we could not verify
Said plainly, so a reader can judge the work:
- **AI-made music.** Folio cannot detect AI-generated music. The safeguard is human: a named curator signs "human-made, local and new" for every new-artist pick and cites two independent sources. A curator can still sign falsely. What limits the harm is visibility (every reader sees the sources), the team's power to remove a curator, and the Discovery check. We have not tested this against deliberate abuse.
- **Local and new are claims, not measurements.** "Local" rests on a profile location, a gig or a venue the curator names. We use no stream counts and no streaming-service integration, because we have not verified API access or terms.
- **Facts.** Eleven seed picks and two city facts rest on Wikipedia alone and are being cross-checked (`05_Research_Evaluation/DATA_VERIFICATION_REGISTER.md`). We claim no Brisbane-specific fact about Aboriginal music because we could not verify one; the national fact on screen is labelled as national. The Acknowledgement of Country wording is a draft that has not yet been reviewed by an appropriate person, and the app uses no Aboriginal artwork.
- **Evaluation.** When this page was first drafted (15 Oct 2026) no evaluation session had been run. Findings come from small, convenience-based, short sessions in one city, and are formative, not proof. **[AFTER EVALUATION: dates, number of sessions and participants.]**
- **Prototype, not product.** No email recovery, moderation tooling, content licensing or scale testing. Nearby events are curator-entered tips. A gig verification queue and a source-link check were planned and are not built.
- Also: one city; profile pictures are stored in the database; unreviewed greetings are not shown for cities that are not live.

## Who did what
| Person | Contribution |
|---|---|
| Dylan | Team lead. Research synthesis and documentation. Product decisions (Edition size, new-artist mix, roles and flows). Set up and tested the shared Supabase database. Interviewed three participants. |
| Pranav | Content and audience research (one interview transcript). From 9 Oct, technical owner: deployment, GitHub Actions secrets, architecture and README, tradeshow kit. |
| Shaz | Earlier: technical build. Interviewed three participants. From 9 Oct: audience research, poster, design, pitch and demo script. |

*AI use: see `docs/AI_USE.md`.*
