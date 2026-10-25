# Tradeshow demonstration guide (Tue 20 Oct 2026, 11am to 2pm, room 49-316 and 316A)

Every step below was checked in a phone-sized test browser on 20 Oct 2026, except those marked **(live: not checked)**. Setup is 15 minutes; each marker has at most 10 minutes with the team; every member pitches 3 minutes and demos alone.

## Before you leave (do these in order)
1. **Publish today's Edition.** Studio > Day = **Tuesday 20 October** > 8 to 12 picks, at least 2 new local artists. Check Today shows it. If you skip this, Today says "Today's Edition isn't published yet" (no fallback in live mode; seen on the live site at about 01:30 on 20 Oct).
2. Open the live link on **mobile data**, not wifi: https://s4899427.github.io/Team_11_Folio/ (the page and the database both loaded from a laptop browser on 20 Oct; the QR itself was verified earlier).
3. On each demo phone: Me > Create account > **"Just looking? Join as a guest"** > first name. Do it before you arrive: an anonymous visitor cannot comment.
4. Phones charged; power bank; extension lead; printed run sheet; poster pair (Shaz).

## The 45-second demonstration path
| Step | What to tap | What the visitor should see |
|---|---|---|
| 1 | Scan the QR | Five intro cards. Tap Next five times, then "Read Brisbane's Edition" |
| 2 | Today | Curator, picks with "Why it's here", Spotify/YouTube/Bandcamp links, countdown to Brisbane midnight |
| 3 | Tap **Liner note** on a pick | A fact and a source link. This row is small; tap its full width |
| 4 | Scroll to **Did you know?**, tap "More from Brisbane" | City facts with sources |
| 5 | **Discussion** (bottom of Today): the "Add a comment" box appears only after step 3 of setup | Post a comment; it appears for everyone on the same Edition |
| 6 | **Browse** | Editions, "Nearby events" (curator tips; may be empty), "Where to look" venues, artists |
| 7 | Second phone | Open Today on the second phone, scroll to Discussion, see the comment |

**Say honestly:** "Nearby events are curator tips; Folio doesn't scrape listings." "Two testers, one at a time; neither could find the comment box, which is why we're showing it to you now."

## Show the other roles without touching the live database
Open `https://s4899427.github.io/Team_11_Folio/#/demo`, tap "Start the sandbox", then Me > Settings > Demo switches (Studio, Team screen). Nothing is saved to the shared database.

## If something breaks
| Problem | Fallback |
|---|---|
| Today shows "isn't published yet" | Publish in Studio (curator phone), or show the sandbox (`#/demo`) and say why |
| QR will not open | Type the short link on the poster; or use mobile data instead of wifi |
| Live site slow or down | Sandbox on the same page; screenshots in `submission/09_Evidence/screenshots/`; the screen recording on the phone |
| Comment box missing | The phone is not signed in: Me > Create account > Join as a guest |
| Edition looks wrong | Sign out, reload; never edit live data during the show |

## What a marker is likely to ask, and the true answer
- **Was it tested with several users at once?** No. Two sessions, one person each, on the evening of 19 Oct. We planned simultaneous use; it did not happen. That is why the two-phone demonstration matters.
- **What did testing change?** A Discussion shortcut, bigger tap targets and a clearer guest prompt were built after the sessions (commit 9a06de9). Planned, not built: Browse links back to picks.
- **Ethics?** Shortened workshop on 19 Oct (Dylan, one outside participant, Pranav's written answers). Comments have no moderation and we say so.
- **AI?** Claude for code and documents, TurboScribe for transcription, Google AI Mode for artist brainstorming; all disclosed in `06_Ethics/AI_USE.md`.

## Capture at the stand
Three things visitors say each hour: quote, a code (V1, V2), what it touches (awareness, privacy, location). Never write names.
