# Data and privacy register

What Folio collects, who can see it, why, and how it is removed. Written from the database schema (`prototype/supabase/schema.sql`) and the app code, so each line can be checked against the build. This register is evidence for the ethics page; it is not a legal privacy policy.

## Data held about app users
| Data | Where | Who can read it | Why we hold it | Removal |
|---|---|---|---|---|
| Email, password (hashed) | Supabase Auth | Only the person (and Supabase) | Sign in | Delete my account (not available to curators and the team; the team removes those by hand) |
| Name | profiles | **Everyone** (names are public so curators are named humans) | Show who commented, curated or replied | Delete account; guests use a first name only |
| Suburb, bio, picture | profiles | **Everyone** (optional) | Identity for artists and curators | Edit or clear in Settings; deleted with the account |
| City | profiles | Everyone | Which Edition to show | Deleted with the account |
| Role, team flag | profiles | Role: everyone. Team flag is set only in the database | Permissions | n/a |
| Comments | comments | Everyone | The conversation under an Edition | Deleted with the account |
| Discovery answers | discovery | Only the answerer; curators see totals only | Measure whether picks showed something new | Deleted with the account |
| Backs (monthly vote of support) | backs | Only the person who backed | Curator standing | Deleted with the account |
| Pitches | pitches | The artist and the receiving curator | Curator inbox | Deleted with the account (artists) |
| Connections (fan to artist) | connections | The fan and that artist (the artist sees the fan's name) | Updates and one question a day | Fan can disconnect any time; deleted with the account |
| Updates and questions | dispatches, questions | Connected fans (updates); asker and artist (questions) | Artist to fan contact | Deleted with the account |
| Curator applications | applications | The applicant and the Folio team | Approval | Deleted with the account (applicants who are not curators) |
| Private saves | This device only (browser storage) | Only the person | Bookmarks | Clear browser data or remove in Me |

## Data we deliberately do not collect or keep
- **Location.** "Use my location" runs in the browser, finds the nearest live city, and is not sent or stored. The city can also be picked by hand.
- **Listening history, tracking, analytics, ads, follower counts, likes, rankings.**
- **Anything about what a person does outside Folio** (the Facebook Beacon lesson from the course).

## Research participants (interviews and evaluation)
- Participants are identified by codes (R1-A to R1-F for the interview round), never by name, in the repository and the PDF.
- Consent is obtained before each session and recorded as "consent given" with the code and date (no signatures in the public repo).
- Photos of participants are not published unless each person agreed in writing.
- Names appear in older commits of the git history from before de-identification; the team decided not to rewrite history. The working tree is clean. [Confirm this decision with the tutor if asked.]

## Risks we know about
1. **Public profile fields.** Name, suburb, bio and picture are readable by anyone who can reach the database API. Mitigation: all optional except name; guests have no bio or picture; disclosed here. A suburb plus a name can narrow where someone lives; consider removing suburb from the public read before release.
2. **Pictures in the database.** Small images held as text. Not suitable at scale.
3. **Account deletion for curators.** Refused so published Editions are not broken; the team removes those accounts by hand on request.
4. **Demo hosting.** The shared database is a student project, not a production service.
