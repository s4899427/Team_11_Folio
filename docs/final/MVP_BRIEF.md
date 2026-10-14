# Folio MVP brief

*Team 11, DECO3500. One page for markers and teammates. Roles and flows are in [`../MVP_ROLES_AND_FLOWS.md`](../MVP_ROLES_AND_FLOWS.md); evaluation in [`../evaluation/EVALUATION_KIT.md`](../evaluation/EVALUATION_KIT.md).*

## 1. Problem and users
People who are new to a city, or tired of algorithmic feeds, find it hard to discover the local music scene and to feel they can join conversations about it. Our interviews (Round 1, six participants; Round 2, five participants; `docs/research/`) described a split between *finding inspiration* and *killing time*, a distrust of algorithmic discovery, and a conditional interest in a human-picked daily offering: "if the curator choices felt credible" (Round 2, Participant E). Our target user is a newcomer to Brisbane who loves music; the second is the local curator or artist who wants to be heard by people nearby. This focus is a design hypothesis that the evaluation tests (Q8, Q11), not a finding of the interviews, which were about discovery in general.

## 2. The concept in one line
One human-picked music Edition per city per day, locked at the city's midnight: no likes, no ranking, every pick with a reason and a sourced Liner Note.

## 3. Social and mobile, stated plainly
| Idea from the unit | Where Folio uses it |
|---|---|
| Shared awareness of others | Comments on a shared daily Edition; the Discovery check and Backs show what people found, not who is popular |
| Context and location | The city decides the time zone, the midnight lock, the greeting and Nearby events; location is opt-in and never stored |
| Asynchronous and synchronous | Readers join the same Edition at different times; sessions test several people at the same moment |
| Social design choices | Artist–fan connection exposes a fan's name only, with no direct messages; a curator is applied for, not chosen |

## 4. MVP scope: in, out and why
| In the MVP | Why |
|---|---|
| Daily Edition of 8 to 12 picks, sourced Liner Notes, one per city per day, midnight lock | This is the idea we are testing; each rule removes an algorithmic shortcut |
| Roles: guest, listener, artist, curator (applied for), Folio team | The social structure (who can speak to whom) is the contribution |
| Shared database (Supabase) and a two-phone demo | The unit requires multiple users interacting at once |
| Brisbane live; Seoul and Mumbai "Coming soon" with sourced city notes | We cannot honestly curate cities we have no curators for |
| Curator-raised and artist-raised gigs, verified by a Folio team member (**in build**; today Nearby shows curator tips) | Nearby needs real events without trusting an unchecked feed |

| Out of the MVP | Why |
|---|---|
| Algorithmic recommendation, likes, ranking | Against the design objective |
| Direct messages | Avoids unwanted contact (ethics, Q10) |
| Streaming or embeds | Licensing; links out only |
| Automatic gig feeds | Needs a server-side key and caching; planned, not built |
| Automatic source and AI check on every pick | Planned (**in build**): link must open; an advisory AI check shown to the curator only. Today the app requires a source link but does not open it |
| Curator rotation and fairness queue | Future work; named as the main open risk |

## 5. Assumptions we test (each linked to the evaluation)
| Assumption | Question | Evidence so far |
|---|---|---|
| A named human curator builds more trust than a ranked list | Q1 | Round 1 and 2 interviews (stated preference only); session evidence **to be added** |
| A mix of 2 to 4 new local artists helps newcomers without becoming noise | Q8 | None yet |
| Shared "Did you know?" facts start talk between people | Q3 | None yet |
| People can avoid unwanted interaction | Q10 | None yet |
| Location and place change what people want | Q11 | None yet |

## 6. Known limits (said openly)
- Interview samples are small and drawn from friends and the team; one Round 2 interview is a team member's self-interview and counts as weak evidence.
- Evaluation is one short round with few groups; it cannot show long-term use.
- Profile pictures are stored in the database as small images, which is not a production design.
- The Base44 side prototype had open security issues and is not used for evaluation with real users.
- Only Brisbane is live. Facts sourced only from Wikipedia are cross-checked before the tradeshow.

## 7. Where it is built
Prototype: `prototype/` (live link in the README). Database rules: `prototype/supabase/schema.sql`, tested by `rls_test.sh` and `smoke_test.mjs` (33 of 33 checks passed on the live project, 12 Oct 2026).
