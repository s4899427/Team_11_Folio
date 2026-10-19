# App probe, 20 Oct 2026 (what was actually checked)

Method: the committed source was built (`vite build --base=/Team_11_Folio/`) and driven with Playwright in a 390 x 844 touch viewport, in **demo mode** (no Supabase keys in the test build). The live site was loaded in a laptop browser; no accounts were created on it.

| Check | Result |
|---|---|
| `npm test` | 25 pass, 0 fail |
| Production build | Succeeds |
| Welcome: 5 Next taps, then "Read Brisbane's Edition" | Lands on Today with **no account** |
| Me, anonymous | Says "You're browsing as a guest"; offers Create account and Log in |
| Me > Create account > "Just looking? Join as a guest" | Works; afterwards the comment box exists and a posted comment appears |
| Comment prompt for anonymous visitors | A "Log in to join the discussion" text link only, at about 3,526 px of a 3,990 px page; it goes to Login, not to the guest button |
| Liner note row and "More from Brisbane" control | 16 px high (below the 24 px minimum target size in WCAG 2.2) |
| Browse | Editions list, "Nearby events" (curator tips), "Where to look" venues, artists |
| Live site (laptop browser) | Loads; intro shows; Today says "Today's Edition isn't published yet"; the live bundle contains the project URL and an anon key and no service_role key; the Supabase API answers (401 without a key, as expected) |
| Not checked | Live sign-up, live comments across two phones, the QR scan itself, live Studio |

Optional patch (`folio_a11y.patch`): a Discussion jump link, a "Join as a guest or log in" prompt, and 44 px touch targets. In the same test build: 25 unit tests pass, the build succeeds, the guest link works, the new targets measure 44 px, and posting a comment still works. Not tested against the live database.
