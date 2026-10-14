# Folio — Evaluation Kit (Round 2, formative)

Status: **protocol only. No results yet.** Everything below is a plan; fill the results sections only with what actually happens. Never write up sessions that were not run.

Why this exists: the unit says evaluation is formative, must involve **multiple users interacting at the same time** and happen **in context**, and that SUS and TAM are not the point (Week 8 slides). So this kit starts from our social design objective, not from "is it usable?".

## 1. Design objective -> questions -> evidence

**Social design objective (Olsson et al. style):** Folio *invites* people in a place to discover music through a named human curator and to *back* the curators who show them something new, instead of ranking by an algorithm.

**Design approach:** one Edition per city per day; a curator card first; Nearby and "Did you know?" tied to the city; Discovery check and Backs as the only voting; no likes.

| # | Evaluation question | What counts as evidence | Where it comes from |
|---|---|---|---|
| Q1 | Does the curator-first layout change how participants judge the picks (trust, curiosity, scepticism)? | What they say they look at first; whether they open the curator card; their reason for opening or ignoring it | Observation, think-aloud, interview |
| Q2 | Are Nearby events (in Browse) found and used, and do they lead anywhere (a venue search, a plan, a message to a friend)? | Whether Browse and its Nearby events are opened; what happens next; "did you plan anything?" | Observation, interaction traces |
| Q3 | Does "Did you know?" start talk between people (aloud, or shared with the person next to them)? | Moments where a participant reads a fact aloud, shows it to someone, or reacts | Observation of pairs/groups |
| Q4 | Do people understand and trust the Discovery check and Backs? Do they feel pressured, or want likes? | How they interpret "did this show you something new?"; hesitation; strategic or gaming comments | Observation, interview, critical questions |
| Q5 | When several people use the same Edition at once, what do they notice about each other (awareness)? | Whether they see others' comments appear, whether they respond; what they wanted to see and could not | Paired session, interaction traces |
| Q6 | Does the place-based layer (greeting, facts, local touches) feel welcoming or tokenistic? | Reactions to the greeting and Acknowledgement of Country; Seoul/Mumbai participants' reactions to their city | Interview, targeted participants |
| Q7 | When would people NOT want to use it? | Concrete circumstances and reasons | Critical interview question |
| Q8 | For someone new to Australia, does the mix of well-known and new local artists, plus the Liner Note context, help them feel they can join conversations about music here? Is roughly 65/35 (2-3 new artists per Edition) about right? | What they recognise, what they want explained, whether the new artists were interesting or noise, what they would change in the mix | Interview, think-aloud, international-student participants |
| Q9 | Does connecting with an artist (private connection, updates, one question a day) make participants feel closer to the local culture? What do artists feel about being seen by name? | Whether they connect and why or why not; the question they ask; the artist's reaction to seeing a fan's name | Observation, interview with at least one artist participant |
| Q10 | Can people avoid unwanted social interaction? Do they feel safe about what others can see of them (comments, an artist seeing a fan's name, connecting and disconnecting)? | Whether they find how to disconnect or stay anonymous; any discomfort about being named; what they would not post publicly; whether guest mode is enough | Observation, interview, critical questions |
| Q11 | Does physical and social context change use? Does moving place (home, campus, a venue, another city) change what they want from Folio, and does the location prompt feel acceptable? | Reactions to the "Use my location" prompt; whether the city picker is understood; behaviour when tested on phones in different places; how a newcomer versus a local uses it; what changes at midnight in the city's own time | Phone sessions in place (campus, outdoors, a venue), interview |

## 2. Participants (recruit; do not invent)

- Minimum for this round: **2 pairs/small groups (3-4 people each) tested together**, ideally at least one group who share a real relationship (friends, housemates) because social use depends on that.
- Include **2-3 international students who are new to Australia** (the target use case: arrived recently, loves music, finds the local scene unfamiliar). The team's own experience is one data point, not evidence.
- Include **at least one participant who is a musician or gig-goer**, and if possible someone who identifies with Seoul or Mumbai (for Q6). Do not ask anyone to represent a culture.
- Do not recruit the whole team's friends only: note the sampling bias in the write-up either way.
- Record for each participant only what you need: a code (P1...), age band, how they find music now. No names in the repo.

## 3. Consent and ethics (read out, get verbal or written agreement)

"This is a student project at UQ (DECO3500). We are testing the app, not you. You can stop at any time. We will take notes (and audio only if you agree). Your name will not appear in anything we publish; we will use codes. The app can ask to use your location, and you can say no and pick a city from a list instead. If you connect to an artist in the app, that artist can see your name; in this test you will use a guest name. Is it OK to continue?"

- Keep notes de-identified from the start. Store consent forms outside the public repo.
- Check with the course staff whether anything beyond a low-risk class activity applies.
- Do not collect health, political or other sensitive information.

## 4. Setup (the tradeshow-realistic version)

- **Shared data on**: Supabase configured (see `docs/SUPABASE_SETUP.md`). Without it, phones do not share Editions or comments, so a social test is impossible.
- 3-4 phones, each in a different guest account. Use "Join as a guest".
- Context: run it where music is actually discussed: a cafe, the studio room at break, a shared lounge. Note the setting, noise, and interruptions.
- Time: use the real Today Edition. If the curator slot for the day is empty, publish a rehearsed one beforehand so the Edition is not the seed fallback (and say which it was).
- Two roles on the team: **facilitator** (talks as little as possible) and **observer** (silent, uses the sheet in section 6).

## 5. Session script (about 25 minutes)

1. **Welcome and consent (3 min).**
2. **Warm-up, no app (2 min):** "Tell each other how you found the last song you loved."
3. **Free exploration (5 min):** "Open the link and look around together however you like." Do not explain features. Note what they open first.
4. **Scenario tasks (10 min), in the group:**
   - T1. "It is Friday afternoon. Decide whether you would use today's Edition to plan a night out." (Browse > Nearby events, curator)
   - T2. "Find one pick you would play for the group and say why." (curator, Liner Note)
   - T3. "Use whatever you think is appropriate to tell the curator whether this Edition worked for you." (Discovery check, Backs, comments)
   - T4. (Optional pair) "One of you is Seoul, one is Brisbane. Show each other what your app says." (cities)
5. **Group interview (5 min), critical questions included:**
   - What did you look at first, and why?
   - When did you stop and say something to each other?
   - What did you expect to be able to do that you could not?
   - Did "did this show you something new?" mean what you thought? Would you answer it honestly if you knew it affects the curator?
   - How would you game or abuse this? (invites honest criticism)
   - **When would you NOT want to use this?** What would make you stop?
   - What felt welcoming, and did anything feel like it was trying too hard? (Q6)

## 6. Observation sheet (one per group)

Fill in during the session; add timestamps (mm:ss).

| Time | Who (P1...) | What they did / said | Social? (aloud, shown to another, ignored) | Context factor (noise, interruption, phone sharing) | Breakdown / workaround? |
|---|---|---|---|---|---|

Things to look for (from Week 8): who initiates/responds, turn-taking, interruptions, helping and negotiation, shared attention, breakdowns and workarounds, participation imbalance, and moments where they ignore or bypass the technology.

## 7. Adapted heuristics (use after the session on the recordings/notes)

Adapted from Greenberg et al. (2000), the Locales-based groupware heuristics presented in Week 8. Mark each as Met / Partly / Not met with an example. **Mark only from evidence in the notes.**

1. Locales: does the city Edition collect people, artefacts and resources around one shared purpose?
2. Awareness within the locale: could participants tell what others had done (comments, Discovery answers, who curates)?
3. Individual views: do guests, readers, curators and artists each see what suits their role?
4. Evolving interaction over time: does the daily lock and the archive support revisiting?
5. Relating locales: can people move between cities, and does that make sense?

## 8. Analysis plan (describe -> interpret -> decide)

1. Within 24 hours: write up each session from notes, de-identified, with timestamps.
2. Code the observation rows with a small shared code set (e.g. NOTICED-CURATOR, IGNORED-NEARBY, SHARED-FACT, CONFUSED-DISCOVERY, WANTED-LIKE, NOT-WANT-TO-USE). Two team members code independently, then reconcile; record disagreements.
3. For each question Q1-Q7: what happened, with a short quote or observed behaviour, what we think it means, and **what we changed or will change**. A finding without a design decision is incomplete.
4. Record the limitations honestly: small sample, friends, setting, curator content fake or rehearsed, one day of data.

## 9. Results (fill in only after sessions)

| Session | Date | Group | Setting | Notes file |
|---|---|---|---|---|
| (none run yet) | | | | |

### Findings -> design decisions log

| Finding (evidence) | Question | Decision | Done? |
|---|---|---|---|
| | | | |

## 10. What would stop this earning a 7 (be honest)

- No real session was run, or only individual (not simultaneous) use was tested.
- Findings are validation-only ("they liked it") with no critical questions.
- No link from findings to specific changes in the prototype and requirements.
- Claims about "users" with no participants behind them.
