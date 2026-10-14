# Folio MVP: roles and flows (one description for everyone)

Use these words with the team, with test participants, on the poster and in the wiki. If the app does something different, fix the app or fix this page, not just the conversation.

## What Folio is, in two sentences
Folio is one human-picked music Edition per city per day, locked at the city's midnight. There are no likes and no algorithm: a named curator picks 8 to 12 tracks, albums or artists, and every pick has a reason and a sourced Liner Note.

## The five rules that never change
1. **One Edition per city per day**, by one named curator, 8 to 12 picks.
2. **Every pick has a source.** The link must open, or the Edition cannot be published.
3. **A mix, not all new:** at least 2 and at most 4 picks are new and upcoming local artists, never above 45%. The rest are artists people may already know.
4. **No likes, no ranking.** Comments never reorder anything. The only votes are the Discovery check ("did this show you something new?") and Backs for curators.
5. **Locked at midnight** in the city's own time zone, then archived and never edited.

## City and location
- Only **Brisbane** is live. Other cities show "Coming soon".
- "Use my location" is optional, asks the browser first and is never stored. Or pick the city from the list.
- Everything on screen (Edition, greeting, facts, Nearby events, artists) is for the selected city.

## Roles
| Role | How you get it | What you can do |
|---|---|---|
| **Guest** | "Join as a guest" (a first name is enough) | Read, comment, answer the Discovery check, back curators, connect to an artist. No profile picture or bio. |
| **Listener** | Sign up | Everything a guest can do, plus saving picks privately, a profile picture and a bio. |
| **Artist** | Sign up as an artist | Everything a listener can do, plus pitch to curators, post updates, answer one fan question a day, raise gigs for approval. |
| **Curator** | **Applied for, not chosen.** The Folio team approves an application. Greyed out at sign-up. | Everything above, plus the Curator Studio: publish the daily Edition, read pitches, raise gigs (up to 3 per Edition). |
| **Folio team (admin)** | Set by us in the database (`is_admin`), never in the app | Lands on the Team screen: read curator applications, approve or decline (cannot decide their own). Verify gigs (when built). |

## Where each role lands after login
| Role | Lands on | Extra tab |
|---|---|---|
| Member (listener, artist, guest) | Today (artists also find their space under Me) | none |
| Curator | Curator Studio | Studio |
| Folio team | Team screen (curator applications) | Team (and Studio if also a curator) |

Me has two tabs: **You** (role actions, saved picks) and **Settings** (name, suburb, picture, bio, city and location, theme, sign out, delete my account). Delete is blocked for curators and the team, so published Editions stay in the archive; the team removes those by hand.

## Flows
**1. New listener.** Open the site, pick or confirm Brisbane, read the short intro, join as a guest or sign up, land on Today and read the Edition.

**2. Returning listener.** Open Today, read the Edition, open a pick's Liner Note and source, comment, answer the Discovery check. Browse shows past Editions, curators, artists and Nearby events.

**3. Artist.** Sign up as an artist, add a picture and bio, pitch a track to a curator, post updates, answer the daily fan question.

**4. Curator.** Apply to curate. After approval, open the Studio, add 8 to 12 picks, each with a reason and a source link. The app checks the rules (mix, sources, one Edition per day) and publishes. Up to 3 gigs may be raised per Edition.

**5. Listener and artist.** From Browse, a listener connects to an artist (no direct messages). The artist sees only the fan's name, can post updates the fan sees and answer one question a day. The fan can disconnect at any time.

**6. Curator and listener.** The listener answers the Discovery check and may back the curator once a month. Backs and Discovery results decide who curates. They never change what is shown inside an Edition.

**7. Gig, raise and verify (in build; today Nearby shows curator tips).** A curator or artist raises a gig (at most 5 pending per person). Automatic checks run, then a Folio team member who is not the submitter verifies it. Approved future gigs in the selected city appear in Browse under Nearby events.

## What the MVP does not do yet
Real city coverage beyond Brisbane; automatic gig sources; the source-link check that opens each link and an advisory AI check shown only to the curator; profile pictures stored outside the database; email-based account recovery. Say so plainly if asked.
