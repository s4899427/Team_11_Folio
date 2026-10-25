# Folio: three post-evaluation interactive features (patch v2)

1. **Near-live comments.** On today's Edition, a comment posted on one device appears on others within about 5 seconds, no refresh, tagged "New" for a few seconds. Polling pauses while the tab is hidden. A failed refresh keeps the comments already on screen. Locked (past) Editions and demo/sandbox mode do not poll.
2. **Share.** "Share this Edition" under the title and "Share" on every pick: phone share sheet, else copy link, else show the link. Only a link and one line of text are shared.
3. **"Reading now" presence.** An anonymous count under the countdown ("3 people reading right now" / "Just you here right now"). It stores only (Edition, random per-page-load id, last-seen time): no user id, no name, no IP. The id is never saved, so it can't follow anyone across visits. Rows older than 10 minutes are deleted. Browsers cannot read the table (RLS, no policies); they can only call `heartbeat_reading()`, which returns a number.

## What these are NOT (say so in the docs)
- Polling every 5 s (comments) and 10 s (presence). **Not websockets/Realtime.**
- Presence can be inflated by someone calling the function with many fake ids. It carries no ranking, reward or identity, so the harm is cosmetic. This is a known limit.
- Built **after** the 20 and 22 Oct sessions. **Not evaluated with participants.**
- No in-app playback. Picks don't carry embeddable track links, so this stays future work.

## Apply (order matters)
1. **Database first (Supabase dashboard > SQL Editor):** paste the whole of `supabase/migrations/004_presence.sql` and run. Safe to re-run. If you skip this, the app still works; the presence line just doesn't appear.
2. **Code, from the repo's `prototype/` folder:**
```
unzip -o ~/Downloads/folio_live_share_v2.zip -d .
python3 apply_live_share.py
git status          # review. Do NOT `git add .` (stray .DS_Store files)
git diff
npm test            # expect 32 pass, 0 fail (25 existing + 7 new)
npm run build       # must succeed
```
`apply_live_share.py` edits `api.js`, `ItemCard.jsx`, `EditionView.jsx`. If anything doesn't match exactly it writes NOTHING and says which edit failed. Re-running is safe.
3. Delete `apply_live_share.py` and this README from `prototype/` (don't commit them). Commit: `src/lib/live.js`, `src/lib/api.js`, `src/components/folio/{ShareButton,ReadingNow,Comments,ItemCard,EditionView}.jsx`, `test/live-share.test.mjs`, `supabase/migrations/004_presence.sql`, `supabase/presence_test.sh`.
4. Push to `main` and wait for the green deploy.

## Two-phone check on the live site (5 minutes)
1. Two phones open Today. After ~10 s both say "2 people reading right now". Close one: the other returns to "Just you" within about 40 s.
2. Phone A posts a comment. Phone B shows it within ~5 s with "New".
3. Airplane mode on B for 15 s: comments stay on screen. Back online: next comment appears.
4. Tap Share: phone share sheet opens. Open the link elsewhere: it opens that Edition.
5. Open an archived Edition: no live line, no presence line (locked, read-only).

## What was verified, where (see TEST_EVIDENCE_24_OCT.md)
Patched copy of your real app: `npm test` 32/32 and `npm run build` OK. Database: your 65 existing RLS tests still 65/65 with migration 004 loaded, plus 18 new presence tests. End to end: headless Chromium, two windows, real built app, real Postgres and the real `heartbeat_reading` function behind a small stand-in for Supabase's REST layer.
**Not verified:** real Supabase (project gbkyzeacuqsviqdgdwch), real phones, real network. That is what the two-phone check is for.

## Wording for the docs
"After the tradeshow sessions we added three features: near-live comments (open Edition re-checks every 5 s), a share button, and an anonymous 'reading now' count (10 s heartbeat, no identity stored). All use polling, not websockets. They were built after evaluation and were not tested with participants. Presence can be inflated by a determined user; it carries no ranking or reward."
