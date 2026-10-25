# Test evidence, 24 Oct 2026 (post-evaluation features)

Run in Claude's workspace on a patched copy of the repo at commit b24938b. Not run on real Supabase or real phones.

| Check | Result |
|---|---|
| `npm test` (patched copy) | 32 tests, 32 pass, 0 fail (25 existing + 7 new in `test/live-share.test.mjs`) |
| `npm run build` | success, 1653 modules |
| Existing database rules `supabase/rls_test.sh`, PG 16.15 local, with migration 004 loaded | passed: 65, failed: 0 |
| New `supabase/presence_test.sh` | passed: 18, failed: 0 (counting, unique readers, today-only, locked/unknown Edition returns 0, bad ids rejected, no direct table access for anon or signed-in users, only edition_id/client_id/seen_at stored, 30 s freshness window, 10 min cleanup, cascade on Edition delete) |
| Component behaviour (jsdom): Comments | 7/7: first load not flagged; other device's comment appears; flagged New; network failure keeps comments; recovers; flag fades |
| Component behaviour (jsdom): ShareButton | 4/4: share sheet; cancel does nothing; clipboard copy; manual link |
| Component behaviour (jsdom): ReadingNow | 6/6: count; valid random id sent; "Just you"; locked and seed Editions make no calls; database error renders nothing |
| End to end (headless Chromium, 2 windows, built app, local Postgres via REST stand-in) | 10/10: both windows show "2 people reading right now"; other-device comment appears in <8 s and is flagged New; after one window closes the other returns to "Just you"; 9 share buttons; Share copies the deep link; no uncaught page errors |

Limits: the REST layer was a stand-in, not Supabase; polling intervals were real (5 s and 10 s). Presence count can be inflated by repeated calls with fake ids.

## 25 Oct 2026: two real phones, live site
Tested by Dylan with a second phone (Pranav's), after the Supabase key fix and redeploy. Not recorded on video; no screenshots kept unless added to this folder.

| Check | Result |
|---|---|
| Both phones open the live site; Today shows River City Signals (Pranav) | Pass |
| Browse and archive calendar show the 20 Oct and 25 Oct Editions on both phones | Pass |
| Comment posted on one phone appears on the other without a refresh | Pass, within about 1 second (the design target is 5 s) |
| Share button, "reading now" count dropping when a tab closes, locked-Edition comments | Not checked on the phones |

Limit: one run, two phones, two people who know the system. The comment test used a signed-in account on one phone and a guest on the other.
