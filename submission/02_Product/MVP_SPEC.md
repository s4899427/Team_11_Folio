# Folio: MVP specification

Version 1.0, 14 Oct 2026. Owner: Dylan Sali (team lead). Status: build complete for the MVP scope; evaluation evidence pending.

## 1. One-line definition
Folio gives each city one human-picked music Edition per day: 8 to 12 picks, every pick with a reason and a sourced Liner Note, locked at the city's midnight. No likes, no ranking. Brisbane is the only live city.

## 2. Problem and opportunity
**Domain.** Discovering local music, especially emerging artists, on a phone.
**Problem (working statement, to be confirmed by evaluation).** Streaming feeds optimise for engagement and popularity. Listeners get endless choice with no accountable person behind it, and emerging local artists are buried.
**Opportunity.** A small, bounded, asynchronous social experience: one named person, one city, one day, with just enough awareness of other people (who curated, who found something new) and none of the pressure (no counts, no ranking).
**Evidence base.** Interviews (de-identified, `05_Research_Evaluation/all-interviews-deidentified.md`). **Insight (from the interviews):** six independent round-1 interviewees complained, unprompted, that algorithmic discovery had narrowed their taste, and one asked for it to be “more human focused” (R1-P6). *Draft to test in evaluation:* people would trust and open a daily list if a named person stands behind each pick. **[AFTER EVALUATION: add one line from the sessions that supports or contradicts this.]**

## 3. Users and roles
| Role | How obtained | Main goal | Lands on after login |
|---|---|---|---|
| Guest | Join with a first name | Read and react without commitment | Today |
| Member (listener) | Sign up | Read, discuss, save, discover | Today |
| Artist | Sign up as artist | Be heard by curators and fans | Today (artist space under Me) |
| Curator | Applied for, approved by the Folio team; never self-selected | Publish the daily Edition | Curator Studio |
| Folio team | Flag set in the database only | Approve curators; verify gigs | Team screen |

## 4. Five rules that never change
1. One Edition per city per day, by one named curator, 8 to 12 picks.
2. Every pick has a source link that opens, or the Edition cannot be published.
3. A mix, not all new: at least 2 and at most 4 picks are new local artists, never above 45% of the Edition.
4. No likes, no ranking. Comments never reorder anything. The only votes are the Discovery check and Backs for curators.
5. Locked at midnight in the city's own time zone, then archived and never edited.
*Rationale for rule 3 is a design judgement (floor of 2 so local artists are meaningfully present; ceiling of 4 so listeners still meet familiar names). Evaluation question Q8 tests it.*

## 5. Scope (MoSCoW)
| Must (built) | Should (built) | Could (not built) | Won't (this release) |
|---|---|---|---|
| Daily Edition, Liner Notes, archive | Discovery check and Backs | Verified gig queue with second-person check | Cities beyond Brisbane |
| Roles and role-based landing | Artist updates and one fan question a day | Server-side source-link check and advisory AI check | Native apps, push notifications |
| Curator application and team approval | Settings, picture, bio, delete account | Picture storage outside the database | Direct messages |
| Curator Studio with rule checks | Optional, never-stored location for nearest city | Email account recovery | Likes, follower counts, rankings |

## 6. Functional requirements
Acceptance criteria are testable. "Evidence" points at `USER_FLOWS_AND_TEST_RESULTS.md` flow and step.

| ID | Requirement | Acceptance criterion | Evidence |
|---|---|---|---|
| R1 | A new visitor understands what Folio is and why open it today | Within one screen a first-time user can say what it is and what is new today | F1 steps 1 to 5; usability check pending |
| R2 | Read today's Edition for my city | One Edition, 8 to 12 picks, each with reason and source | F1 step 4 |
| R3 | Open a pick's Liner Note and source | Note and link shown | F1 step 5 |
| R4 | Comment, answer the Discovery check, save privately | One Discovery answer per Edition; saves visible only to me | F2 |
| R5 | Browse past Editions, curators, artists and Nearby events | Nearby shows curator tips for the selected city | F2 step 7 |
| R6 | Settings: name, suburb, picture, bio, city, theme, sign out | Changes persist after reload | F2 step 9 |
| R7 | Delete my account | Typed confirmation; data removed; curators and team refused (published Editions stay) | Test report |
| R8 | Artist: pitch, post updates, answer one question a day | Pitch reaches a curator; update reaches connected fans only | F3, F5 |
| R9 | Apply to curate; team approves or declines | Applicant cannot self-assign; team cannot decide own application | F4 |
| R10 | Curator publishes an Edition only if rules pass | Incomplete or rule-breaking Edition is blocked with reasons | F4 steps 6 and 7 |
| R11 | Fan connects to an artist; sees updates; asks one question a day; can disconnect | Artist sees fan's name only; no counts shown | F5 |
| R12 | Works one-handed on a phone | 375 px wide, no horizontal scroll | Screenshots; audit pending |
| R13 | Several people use it at once | Two phones, two accounts see each other's comments | Backend 33/33; two-phone check pending |

## 7. Non-functional requirements
Privacy first (see `06_Ethics/DATA_AND_PRIVACY_REGISTER.md`): location never stored; discovery totals never show who answered; names only where the person chose to connect. Security: only the public `anon` key in the browser; roles stored in the database and not editable by the client; row-level security on every table. Accessibility: labelled form fields and focus styles are in place; a formal audit (contrast, screen reader) has not been done and is not claimed. Performance: static front end, no server to run.

## 8. Real vs simulated (criterion 2)
| Real (works for everyone at once on the live build) | Simulated or seeded |
|---|---|
| Sign up and sign in; roles; curator applications and approval | Founding Brisbane Editions are seeded so the app is never empty |
| Comments, Discovery check, Backs, pitches, connections, dispatches, questions | Other cities show "Coming soon" with sourced city notes, not Editions |
| Curator Studio publishing with rule checks and the midnight lock | Nearby events are curator-entered tips, not a live feed |
| Settings, picture, bio, delete account | Demo mode (no backend) stores everything in the browser for unassisted trials |

**Why there is real login when the brief says it can be skipped.** The brief allows "Joe Bloggs" for the demo. We built real roles because the idea depends on accountability: the named curator, the approval step and the artist-to-fan relationship cannot be experienced with one shared identity, and the brief also asks for multiple users at once. Guests join with a first name only, so evaluation sessions need no accounts.

**What the prototype is not.** It is a proof of concept, not a product: no email recovery, no moderation tooling, no content licensing, no scale testing.

## 9. Success measures (formative, not KPIs)
Use the evaluation kit: Did people say what Folio is after one screen? Did they reach and read a Liner Note unassisted? Did they feel the new-versus-familiar balance was right (Q8)? When would they NOT open it? Did they use it in context (commute, venue, cafe)? Report what we changed because of the answers.

## 10. Assumptions and risks
| Risk | Effect | Mitigation | Owner |
|---|---|---|---|
| No evaluation evidence | Weak process mark | Run 3 sessions before 22 Oct; log changes | Dylan, Shaz |
| Curator supply (one Brisbane curator pool) | Edition missing some days | Folio Desk fallback; application route | Team |
| Source links go stale | Trust damage | Link check on publish (client-side now; server-side planned) | Pranav |
| Public profile fields (name, suburb, bio, picture) | Privacy | Optional fields; guests have none; disclosed in the register | Dylan |
| Hosted demo abuse | Spam in shared database | Row-level security limits; delete account; team can remove content by hand | Pranav |

## 11. Open decisions
Choose and fill the ethics framework (Loke and Matthews 2020 or the Ethical Disclaimer canvas). **Decided:** markers use the sandbox at `#/demo` (no passwords, nothing shared); any real marker accounts are given only through Blackboard. Confirm tradeshow day (Tue 20 or Thu 22 Oct) with the tutor.

## 12. Glossary
Edition: the daily set of picks. Pick: a track, album or artist with a reason. Liner Note: one checkable fact with a source link. Discovery check: "did this show you something new?" Back: a monthly vote of support for a curator. Folio Desk: the built-in fallback curator. Team: the Folio admin role.
