# Ethical considerations: Folio

*DECO3500, Team 11. Wiki page. Replaces the earlier draft written for the multi-domain concept, which no longer matches the product.*

**Frameworks.** We used Loke & Matthews (2020) to analyse harms to stakeholders and the Ethical Disclaimer canvas (ethicsfordesigners.com) to surface assumptions. **[Add the full Loke & Matthews reference from the course reading list; we have not copied one from memory.]** We also use two readings from the unit: Winner (1980), "Do artifacts have politics?", and Akrich (1992), "The de-scription of technical objects", because Folio's central design choices are political choices built into software.

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

## 9. Use of AI
AI tools helped build the prototype, draft documents and prepare interview material. Every use and the prompts are listed in `docs/AI_USE.md`. AI is not used to pick Editions or to rank anything shown to readers. The planned advisory source check would be shown to the curator only, never presented to readers as a verdict.

## 10. What is still open
Curator rotation and fairness · moderation beyond report-by-hand · whether one daily Edition is enough variety · whether newcomers use the app after the first week · long-term effect of removing likes.
