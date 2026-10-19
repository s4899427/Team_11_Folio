# Ethical considerations: Folio

*DECO3500, Team 11. Wiki page. Replaces the earlier draft written for the multi-domain concept, which no longer matches the product.*

**Frameworks.** We used the Ethical Disclaimer canvas (Ethics for Designers Toolkit, everydayethics.uxp2.com/methods/ethical-disclaimer/) to list stakeholders, imagine unethical situations and decide who takes responsibility, in a team workshop a shortened workshop on 20 Oct 2026 (not the full six-step version): Dylan facilitated and took part, one outside participant (P1) answered aloud, and Pranav answered the written form; Shaz was invited and had not responded when this was written (see `ETHICS_WORKSHOP_RECORD.md`). The draft table was written by Claude and challenged by those people. We did not use Loke & Matthews (2020) because we could not verify its content. We also use two readings from the unit: Winner (1980), "Do artifacts have politics?", and Akrich (1992), "The de-scription of technical objects", because Folio's central design choices are political choices built into software.

## 1. Who is affected
| Stakeholder | How |
|---|---|
| Listeners and guests | What they read, what others can see of them, and whether location is requested |
| Curators | Editorial power over what counts as "the scene" for a day |
| Artists | Whether they are picked, and whether fans see their updates |
| Fans who connect to artists | The artist sees their name |
| People and scenes not covered | Cities, genres and communities with no curator |
| Participants in our research | Their words and sessions |

## 2. Artefacts with politics (Winner, Akrich)
Folio removes likes and ranking, locks Editions at midnight, requires a source for every pick, and makes curator status something you apply for, not choose. These are not neutral. Each shifts power: from popularity to a named person's judgement; from the crowd to a fact checkable by a stranger; from self-nominated to approved. Akrich's idea of the "script" applies: the app assumes a curious, local-minded listener, and a curator who can write a sourced note in under an hour. People outside that script (no curator in their city, no time, no Australian-scene knowledge) are served worse. We say so rather than hide it.

## 3. Curation as gatekeeping
One named curator decides what represents Brisbane's music each day. Mitigations: curators are approved after applying; every pick needs a checkable source; at least 2 and at most 4 picks are new and upcoming local artists; Backs and the Discovery check give readers a say about who keeps curating without changing what is shown. **Unresolved:** with a handful of curators the scene will be uneven, and curator rotation and fairness are not built. This is the largest open risk.

## 4. Location
Location is optional: the browser asks, we use it once to pick a city, and it is not stored. The alternative is a list. Risk: asking for location can feel invasive, and a city list reveals the same information. We test this (Evaluation Kit, Q11).

## 5. Artist–fan connection and unwanted interaction
A fan who connects to an artist shares their name with that artist; there are no direct messages and no follower counts, and the fan can disconnect. Artists can answer at most one question per fan per day. The risk is a fan being identifiable to a stranger; the consent script says so before sessions, and test participants use guest names. We test it (Q10).

## 6. Data and security (honest limits)
- The main prototype uses Supabase with row-level security. Rules were tested (65 checks on a throwaway database; 33 checks on the live project).
- Profile pictures are stored as small images in the database, a prototype shortcut.
- The Base44 side prototype had a security scan with 14 issues (7 critical, including public data tables and an admin bypass). We did not use it with real people and we do not claim it is safe.
- No analytics or tracking beyond what the database needs to run the app.

## 7. Research ethics
Participants were told the purpose and could stop at any time; notes use codes (P1, P2), not names. Consent forms are stored outside the public repo. **Action before submission:** earlier research documents in this repo used participants' first names; they are being replaced by codes. One Round 2 interview is a team member's self-interview and is labelled as such. Sample bias (friends and classmates) is stated in the process overview.

## 8. Content, copyright and cultural respect
- Every Liner Note has a source link; Wikipedia-only facts are being cross-checked against primary sources before the tradeshow.
- The Acknowledgement of Country (Brisbane) is a draft **pending review by UQ's Aboriginal and Torres Strait Islander Studies Unit or a local Elder**; the Seoul and Mumbai greetings are drafts pending native-speaker review. Until reviewed, these are not shown for cities that are not live.
- No third-party images in the app. Streaming and embeds are links out, because of licensing.
- Music picks are scoped to Australian artists for now, which excludes the large non-Australian music newcomers also love. This is a design choice, not neutral.

## 8b. What the workshop and evaluation changed (20 Oct 2026)
Full record: `ETHICS_WORKSHOP_RECORD.md`. Participants are coded; recordings and transcripts are kept privately outside the repository and deleted after marking. A name was spoken by accident in one evaluation recording; it is not published.
- **Comments need moderation.** Pranav found no report, hide or rate limit; a pile-on under a new artist's first feature is the harm. Planned: a report flag and a curator "hide" on their own Edition. **Not built.**
- **Fan questions (row 8).** Changed to "partly": block and report on both sides are missing. A Disconnect button exists and deletes the connection; whether earlier questions stay visible to the artist is **not verified**.
- **Scam events.** P1 raised fake events and ticket scams aimed at students, especially newcomers. Nearby is curator tips and the verification step is **not built**.
- **Acknowledgement of Country.** P1 worried about tokenism and permission; P2, new to Brisbane, valued the Aboriginal cultural content. Decision: keep it, **review pending** with an appropriate person, and check the wording against UQ's official Acknowledgement. We do not claim it has been reviewed.
- **Privacy.** Suburb to be hidden by default (planned). P2 expected taste to be exposed; Folio shows no listening history, but the app does not say so (planned, if the privacy register confirms it).
- **Limits.** One outside participant, some leading questions, no First Nations voice, no artist, no curator.

## 9. Use of AI
AI tools helped build the prototype, draft documents and prepare interview material; a transcription tool (TurboScribe) and Google AI Mode (brainstorming candidate artists, whose claims were checked and partly rejected) were also used. Every use and the prompts are listed in `docs/AI_USE.md`. AI is not used to pick Editions or to rank anything shown to readers. The planned advisory source check would be shown to the curator only, never presented to readers as a verdict.

## 10. What is still open
Curator rotation and fairness · moderation beyond report-by-hand · whether one daily Edition is enough variety · whether newcomers use the app after the first week · long-term effect of removing likes.

## 11. What we cannot guarantee
Said plainly, so a reader can judge the work:
- **AI-made music.** Folio cannot detect AI-generated music. The safeguard is human: a named curator signs "human-made, local and new" for every new-artist pick and cites two independent sources. A curator can still sign falsely. What limits the harm is visibility (every reader sees the sources), the team's power to remove a curator, and the Discovery check. We have not tested this against deliberate abuse.
- **Local and new are claims, not measurements.** "Local" rests on a profile location, a gig or a venue the curator names. We use no stream counts and no streaming-service integration, because we have not verified API access or terms.
- **Facts.** Eleven seed picks and two city facts rest on Wikipedia alone and are being cross-checked (`05_Research_Evaluation/DATA_VERIFICATION_REGISTER.md`). We claim no Brisbane-specific fact about Aboriginal music because we could not verify one; the national fact on screen is labelled as national. The Acknowledgement of Country wording is a draft that has not yet been reviewed by an appropriate person, and the app uses no Aboriginal artwork.
- **Evaluation.** When this page was first drafted (15 Oct 2026) no evaluation session had been run. Findings come from small, convenience-based, short sessions in one city, and are formative, not proof. Two sessions on 20 Oct 2026, one participant each; neither tested simultaneous use. See `05_Research_Evaluation/EVALUATION_RESULTS.md`.
- **Prototype, not product.** No email recovery, moderation tooling, content licensing or scale testing. Nearby events are curator-entered tips. A gig verification queue and a source-link check were planned and are not built.
