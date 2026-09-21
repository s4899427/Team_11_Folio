# Folio — Use Cases & Test Cases

## Use Cases (User Journeys)

### UC1 — First-time onboarding
A new reader opens Folio for the first time and is asked what they're
into across six categories (Music, Art, Fashion, Film, Food, Design).
They pick a handful, hit Continue, and land on today's front page.

### UC2 — Reading today's edition
A returning reader opens the app and lands straight on Today. They see
the masthead with the real date, the day's curated Thread (several
elements from any domain), who edited it, how many others are reading
right now, and a countdown to when it locks.

### UC3 — Reacting to today's edition
A reader taps "My take" on today's Thread, writes a short reflection,
and posts it. The system checks it's actually related before publishing.
Another reader comments directly on that specific take.

### UC4 — Coordinating for tonight
A reader scrolls to "Going out tonight?", picks a vibe inspired by
today's Thread, and sees what a few others in their circle picked —
without following or messaging anyone.

### UC5 — Digging into the Archive
A reader who wants more than today's single story switches to Archive,
picks Frame (Art), filters by era and location, and browses past
entries — starting with the ones flagged "Must-know."

### UC6 — Encountering disputed history
While reading an Archive entry, a reader notices two different
"perspectives" attached to the same piece — a regional archive's account
and an independent scholar's — presented side by side rather than one
being marked correct.

### UC7 — Failed post (relevance check)
A reader tries to post something unrelated to the entry they're viewing.
The automatic check rejects it with a plain explanation, and nothing
publishes.

### UC8 — Saving a draft
A reader starts writing a take, isn't ready to publish, and saves it as
a draft instead. It's visible only on their own Me page, not on the
public entry.

### UC9 — Checking a location-based intro
A reader grants location access. The app recognises they're near a
known area and shows a short cultural intro for it, with a background
pattern that reflects the region — or is honest that they're far from
any known area if that's the case.

### UC10 — Viewing a personal profile
A reader opens Me and sees their avatar, bio, identity attributes drawn
from their own onboarding picks, and a wall split into what they've
posted and what's still in drafts.

---

## Test Cases

| # | Test | Steps | Expected Result |
|---|---|---|---|
| T1 | Onboarding requires a selection | Open app fresh, tap Continue with nothing selected | Continue button stays disabled |
| T2 | Onboarding accepts a partial selection | Pick one option in only one of six categories, tap Continue | App proceeds to Today |
| T3 | Skip onboarding | Tap "Skip for now" on first load | App proceeds to Today with no preferences set |
| T4 | Term explainer (long-press) | Press and hold "Avant-Garde" for ~0.5s | A definition toast appears; releases after a few seconds |
| T5 | Today's date is accurate | Open Today tab | Masthead date matches the device's actual current date |
| T6 | Countdown ticks down | Watch "Locks in" for 60+ seconds | Displayed time decreases in real time |
| T7 | Presence count fluctuates | Watch "here now" counter for 10+ seconds | Number changes slightly on its own, never drops below 3 |
| T8 | Post below minimum length is rejected | On any entry or Today, write fewer than 10 characters, submit | "Doesn't seem related" message shown; nothing published |
| T9 | Valid post publishes | Write a relevant post of 10+ characters, pick a type, submit | Spinner shows briefly, then a success message; post appears in the list |
| T10 | Post requires a type | Write valid text but don't pick My take/Remix/Field note, submit | Error: "Pick a post type first"; nothing published |
| T11 | Draft saves without checking | Write text, click "Save draft" | Saved instantly (no relevance check), appears under Drafts on Me, not on the public entry |
| T12 | Comment attaches to correct post | Add a comment under a specific post | Comment appears nested under that post only, not others |
| T13 | Comment box toggles | Click "Reply"/"Add a comment", then "Cancel" | Input field appears, then disappears without submitting anything |
| T14 | Archive filter narrows results | In Archive, change Era or Location dropdown | Grid updates; "X of Y" count resets to reflect the new scope |
| T15 | Load more respects the cap | Click "Load next 6" repeatedly until the end | Button disappears once all entries are shown; end message displays |
| T16 | Must-know entries surface first | Open any Archive category with default filters | Entries marked "★ Must-know" appear before unmarked entries in the grid |
| T17 | Discovery counter increments once per entry | Open the same entry twice | Counter increases only on the first open, not the second |
| T18 | Location denial degrades gracefully | Deny the location permission prompt | A dismissible inline prompt appears; app remains fully usable |
| T19 | Tonight's Theme reveals simulated friends | Pick any theme chip | A "Also dressing for tonight" list appears with the user's pick plus simulated others |
| T20 | Identity attributes reflect real picks | Complete onboarding with specific selections, open Me | Chips shown match what was actually selected, not a generic list |
| T21 | Edit preferences returns to origin tab | From Fashion (Fit), tap "Edit preferences," complete or skip | App returns to the Fit tab, not defaults to Music |
| T22 | Archive sub-tab switch preserves state | Switch from Tunes to Frame and back | Each sub-tab remembers its own era/location/batch selections |

---

*Note: T5–T7, T17, and T18 depend on real browser APIs (Date, geolocation) and should be tested in an actual browser, not assumed from reading the code.*
