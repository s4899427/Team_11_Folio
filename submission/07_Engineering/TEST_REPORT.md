# Test report

| Layer | What | Result | Date | Re-run with |
|---|---|---|---|---|
| Unit | 25 tests: city time zones and midnight lock, Edition rules (8 to 12 picks, mix 2 to 4 and 45%, sources), backs, discovery, greetings | 25 pass, 0 fail | 14 Oct 2026 | `cd prototype && npm test` |
| End to end (browser) | Five main flows, 28 checks, 390 x 844 viewport, demo mode | 28 pass, 0 fail, no page errors | 14 Oct 2026 | `cd prototype && npm run build && npm run preview` in one terminal, then `python3 ../submission/07_Engineering/e2e/flows.py` in another (needs `pip install playwright`) |
| Live backend | Supabase smoke test: sign-up, roles, row-level security, publishing, comments, discovery, backs | 33 of 33 (script now has 34 checks; the curator checks are skipped unless CURATOR_EMAIL and CURATOR_PASSWORD are set) | 12 Oct 2026 (before the roles round) | `node supabase/smoke_test.mjs` with the anon key |
| Database rule checks (throwaway Postgres) | `bash prototype/supabase/rls_test.sh` | Last run before the roles round; **not re-run** for admin and delete-account functions | pending | needs Postgres installed |
| Roles round (admin, approvals, delete account) on live backend | Run the migration, then the manual checks in `submission/07_Engineering/SUPABASE_SETUP.md` | **Not yet run** | pending | manual |
| Two phones at once | Two accounts, one comment seen on the other | **Not yet run** | pending | manual |
| Accessibility | Contrast, screen reader, keyboard | **Not run** | n/a | n/a |

## Known defects and gaps
- Source-link check runs on the client only; a link that opens in the Studio can still go stale later.
- Pictures are stored in the database as small images; fine for a prototype, not for scale.
- Demo mode accounts are per browser.

## What the tests do not prove
They show the software does what we wrote. They do not show people want it or can use it; that needs the evaluation sessions.
