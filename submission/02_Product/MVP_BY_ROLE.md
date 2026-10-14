# Folio MVP by role: users, artists, curators, Folio team

One page per role: what the role can do in the MVP, what it cannot, the screens it uses, the flow that proves it, and its status. This is the plain-language version of the specification, for the pitch, the poster and the professors.

Status key: **Built and tested** (flow test passed), **Built, live check pending** (needs Supabase run), **Not built**.

## 1. Listener (member) and guest
| | |
|---|---|
| **Job** | Find new local music through one accountable person, in a few minutes a day |
| **Can** | Read the Edition; open Liner Notes and sources; comment; answer the Discovery check; back a curator (once a month); save picks privately; browse past Editions, curators, artists and Nearby events; connect to an artist and ask one question a day; edit name, suburb, picture and bio (members); delete their account |
| **Guests can** | Everything above except saving a picture and bio; they join with a first name only |
| **Cannot** | Like or rank anything; message anyone directly; publish; see who else answered the Discovery check |
| **Screens** | Welcome, Today, Edition, Browse, Me (You, Settings) |
| **Proof** | Flows F1, F2, F5 |
| **Status** | Built and tested |

## 2. Artist
| | |
|---|---|
| **Job** | Be heard by curators and by fans, without a follower race |
| **Can** | Everything a member can, plus: pitch a track to a curator; post short updates to fans who connected; answer one question a day per fan privately; see the names of fans who connected |
| **Cannot** | See follower counts; message fans who have not connected; publish an Edition |
| **Screens** | Artist space, Pitch, Browse (own card) |
| **Proof** | Flows F3, F5 |
| **Status** | Built and tested |

## 3. Curator
| | |
|---|---|
| **Job** | Publish the daily Edition for their city |
| **How they become one** | Apply from Me. The Folio team approves. It is never self-selected. |
| **Can** | Everything a member can, plus: the Studio (claim a day, add 8 to 12 picks, each with reason, Liner Note and source link, tag new artists), pitch inbox, add Nearby gig tips, edit their curator bio |
| **Rules enforced by the Studio and the database** | 8 to 12 picks; 2 to 4 new artists and not above 45%; every pick sourced; one Edition per city per day; locked at the city's midnight |
| **Lands on** | Curator Studio after login |
| **Cannot** | Edit a past day; publish for another city; decide curator applications |
| **Proof** | Flow F4 |
| **Status** | Built and tested (demo mode); approval path on the live database pending the SQL run |

## 4. Folio team (admin)
| | |
|---|---|
| **Job** | Keep curation accountable and the space safe |
| **How they become one** | The team flag is set in the database by us; the app cannot grant it |
| **Can** | See all curator applications with reason and link; approve (makes the applicant a curator of their city) or decline; (planned) verify gigs raised by curators and artists |
| **Cannot** | Decide their own application; read private saves or Discovery answers |
| **Lands on** | Team screen after login |
| **Proof** | Flow F4 steps 2 and 3 |
| **Status** | Built and tested (demo mode); live check pending. Gig verification not built. |

## What the MVP does not do yet (say so plainly)
Cities beyond Brisbane; automatic or verified gig sources; server-side source-link and advisory AI check; picture storage outside the database; email recovery; accessibility audit; moderation tools beyond manual removal by the team.

## Gaps we see (our own review), in order of mark impact
1. No user-evaluation evidence yet. Fix: run three sessions before the tradeshow.
2. Two-phone simultaneous check not recorded.
3. Team and approval path untested on the live database.
4. The poster does not exist.
5. Ethics framework not yet applied.
6. Nearby is curator tips; the gig verification story in the pitch must match what is built.
