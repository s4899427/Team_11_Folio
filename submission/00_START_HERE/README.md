# Folio: submission folder (Team 11, DECO3500 Social and Mobile Computing, Semester 2 2026)

**For the marker.** This folder is the index to everything we produced, from user research to ethics. Start with `01_Rubric_Map/RUBRIC_TRACEABILITY.md`: it lists each marking criterion and where its evidence is.

## 30-second summary
Folio gives each city one human-picked music Edition per day: 8 to 12 picks, each with a reason and a sourced Liner Note, locked at the city's midnight. No likes, no ranking. At least two picks are new local artists. Brisbane is live. It is a mobile-first web app with a shared Supabase database, and a proof of concept, not a finished product.

## Try it
- **Live:** https://s4899427.github.io/Team_11_Folio/ . Choose **Join as a guest** (a first name is enough). No password needed.
- **Every role with no account (sandbox):** https://s4899427.github.io/Team_11_Folio/#/demo . Click *Start the sandbox*, then Me > Settings > Demo switches to open the Curator Studio and the Folio Team screen. Everything stays in your browser; nothing touches the shared database. *Leave the sandbox* returns to the live app.
- **Demo build (no backend):** `cd prototype && npm install && npm run dev`. In Me > Settings, "Demo switches" opens the Studio and Team screens.

## Map of this folder
| Folder | What is in it | Criterion |
|---|---|---|
| `01_Rubric_Map/` | Criteria, evidence, status, gaps | all |
| `02_Product/` | MVP specification, five flows and test results, roles, governance, onboarding copy | 1, 2 |
| `03_Theory_SMC/` | Social and mobile computing concepts applied to Folio, with trade-offs | 1, 5 |
| `04_Design_Process/` | Design process overview, decision log, timeline, pivots | 4, 5 |
| `05_Research_Evaluation/` | Interviews (de-identified), evaluation kit, results template | 1, 4, 5 |
| `06_Ethics/` | Ethical considerations, data and privacy register, AI use | 4, 5 |
| `07_Engineering/` | Architecture, database setup, test report, flow test script | 2, 4 |
| `08_Pitch_Poster_Demo/` | Poster and pitch brief, pitch script, professor Q&A | 3 |
| `09_Evidence/` | Screenshots and raw test results | 2, 4 |
| `10_Team/` | Charter, who did what | 4 |

## Honest status (14 Oct 2026)
Built and tested: the app, the backend, five main flows (28 of 28 automated checks). **Not yet done:** evaluation sessions with outside users, the A2 poster, two-phone simultaneous check on the live site, final placeholders. Those are listed in the rubric map.
