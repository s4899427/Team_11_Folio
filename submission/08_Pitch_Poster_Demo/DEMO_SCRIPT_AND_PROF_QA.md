# Pitch, demo and professor Q&A

For the Week 12 studio (A2 portrait poster plus a 2 to 3 minute pitch; every member must be ready to pitch). Rehearse aloud with a timer. All three team members should be able to give all of it.

## A. The 2.5 minute pitch (about 330 words, read at a steady pace)
**Hook and problem (35 s).** Ask first, then pause and let them answer: "Quick question. What's the last song you loved because a *person* told you about it, not because an app suggested it?" Then: "One of our interviewees told us: 'I just want it to be more human focused.' Music Australia's 2025 research says it's national: streaming is now the main way people discover music, and personalised algorithms may be making emerging Australian artists harder to find." Then: "So we built something closer to what radio used to do for a city. Once a day, one named person picks 8 to 12 songs and tells you why each one is there. No likes. No ranking. That's Folio." Hold up the phone: "Here's today's curator." *Before you say the research lines, open the* Listening In *report and confirm both sentences and the page number; if you cannot, cut that sentence. Make sure an Edition is published that morning.*

**Idea (30 s).** "Folio gives each city one music Edition a day. A named local curator picks eight to twelve tracks, says why each is there, and links a source. It locks at the city's midnight. No likes, no ranking. At least two of the picks are new local artists, so discovery is built in, not left to chance."

**Show (45 s).** Open the phone. "I open Folio on the train. Today's Edition, curated by a person with a name. I open a Liner Note: one fact, one source. I tell Folio whether it showed me something new. Under Browse, a gig tonight. Artists can pitch to curators and reply to fans, one question a day, no feed." If a second phone is available: "Here is a second person on another phone; she comments, and I see it."

**Why it is social and mobile (25 s).** "It's asynchronous but shares a place: a city. Awareness is limited on purpose: you can see who curated and whether others found something new, but there are no counts and no ranking, because visibility has a privacy cost. That's the trade-off we designed around."

**What we learned (20 s).** "**[AFTER EVALUATION: one finding and one thing we changed because of it.]**"

**Close (10 s).** "Folio: one Edition, one city, one day. Try it. The QR code is on the poster."

## B. Demo checklist (the day before)
- Phone charged; QR code opens the live site over mobile data (not wifi).
- A fresh guest join works. A team account and a curator account are logged in on a second device.
- Today's Edition exists (the Folio Desk fallback shows if no curator published).
- A backup: screen recording of the five flows in case wifi fails.
- Do not demo anything not built (gig queue, source-link AI check).

## C. Professor Q&A: honest answers
**1. The brief says skip login. Why did you build real roles?**
"The brief allows one shared identity, but our idea depends on accountability: a named curator, an approval step and an artist-to-fan relationship. They can't be experienced with one identity, and the brief also asks for multiple simultaneous users. Guests join with a first name, so testers never need an account."

**2. Isn't the prototype becoming the product?**
"No. We call it a proof of concept and list what it isn't: no email recovery, no moderation tooling, no licensing, no scale testing. Base44 was our throw-away look-and-feel prototype; the repo build is what we evaluate."

**3. What is real and what is simulated?**
"Real: accounts, roles, curator approval, publishing with rule checks, comments, Discovery check, Backs, pitches, connections, questions, and the midnight lock, on a shared database. Simulated or seeded: the founding Brisbane Editions, other cities (Coming soon), and Nearby events, which are curator-entered tips."

**4. What did users tell you, and what did you change?**
"**[AFTER EVALUATION: specific finding, who said it (code), what changed in the app.]**" If evaluation has not run when asked: "We have interview findings from round one and round two [cite]. We are running evaluation sessions this week; here is the plan." Do not invent results.

**5. Which social and mobile concepts did you use?**
"The 3C model and awareness, the time-space matrix, social presence and its tensions (visibility versus privacy, context versus distraction), the location design framework for structuring the experience, and the Locales-based heuristics for evaluation. The map is in the repo." Name one trade-off: "We gave up social proof, like counts and trending, to protect privacy and keep it calm."

**6. Why no likes?**
"Likes create popularity loops that bury local artists. This is a deliberate political choice (Winner; Akrich): the system's rules shape behaviour, so we made them explicit. The only votes are 'did this show you something new' and monthly Backs for curators, and neither reorders an Edition."

**7. What if a curator is biased or abusive?**
"Curators are applied for and approved by the team, must cite a source for every pick, are measured by the Discovery rate and breadth of Backs, and the team can remove a curator. We haven't tested abuse at scale."

**8. Why 8 to 12 picks and 2 to 4 new artists?**
"The size is our judgement, not a tested result. The mix rule keeps local artists present without making the Edition all unknown names. Our evaluation question Q8 tests whether it felt right."

**9. How did you handle ethics?**
"Location is optional and never stored. Fan names are visible only to the artist they chose to connect with. Discovery totals never show who answered. Participants are coded, with consent. Our register lists every piece of data. We ran the Ethical Disclaimer canvas from the Ethics for Designers Toolkit as a team workshop **[AFTER WORKSHOP: date]** and used Winner and Akrich for the politics of our rules." Name the framework only once it is filled.

**10. Where did you use AI?**
"Claude was used for coding assistance, drafting documents, evaluation design, test scripts and city-fact research; every use is referenced and the prompts are in the appendix. All design decisions, interviews and evaluation were done by the team."

**11. Who did what?**
Use `10_Team/WHO_DID_WHAT.md`. Each member must be able to explain their part and the whole.

**12. What would you do with another month?**
"Run evaluation in more contexts (commute, venue), add the gig verification queue, server-side source-link checks, email recovery, and a second city with a local curator."

## D. Questions to ask ourselves before the marker does
- Can each of us say the insight in one sentence?
- Can each of us name the trade-off we accepted for each concept?
- Is there one thing the evaluation changed that we can point at on screen?

**12. What are the limits of the work?** (say this unprompted if time allows)
"Folio cannot detect AI-made music. A named curator signs that each new-artist pick is human-made, local and new and gives two independent sources, but a curator could still sign falsely; we haven't tested deliberate abuse. 'Local' and 'new' are claims a person makes, not measurements: we use no stream counts and no streaming integration. Some seed facts are Wikipedia-only and are being cross-checked, and we claim no Brisbane-specific fact about Aboriginal music because we couldn't verify one. Our evaluation is small, short and formative, in one city. It is a proof of concept: no email recovery, moderation tooling, licensing or scale testing."
