# Shared data setup (Supabase) — about 15 minutes

Without this, Folio runs in **demo mode**: it works, but every device sees only its own data.
With it, every phone sees the same Edition, comments, pitches and gig tips.

1. Create a free project at supabase.com (region: Sydney).
2. **SQL Editor → New query** → paste all of `prototype/supabase/schema.sql` → Run.
3. **Authentication → Providers → Email**: turn **"Confirm email" OFF** (so tradeshow visitors can sign up and use the app immediately).
4. **Project Settings → API**: copy the *Project URL* and the *anon public* key. (Never use the `service_role` key in the app.)
5. GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**: add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Push to `main`; the Pages build picks them up.
6. Open the live site, create your own account, then in Supabase **Authentication → Users** copy your user id and run in the SQL editor:
   `update public.profiles set role = 'curator' where id = '<your user id>';`
   Repeat for each founding curator. Log out and in again to see the Curator Studio.
7. Publish a real Edition for today from the Studio. From now on, the built-in founding Editions are only a fallback.

Local development: copy `prototype/.env.example` to `prototype/.env.local`, fill in the two values, `npm run dev`.

## Automated live check (2 minutes, after steps 1-6)
```bash
cd prototype
VITE_SUPABASE_URL=https://YOURPROJECT.supabase.co VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY \
CURATOR_EMAIL=you@example.com CURATOR_PASSWORD=yourpassword node supabase/smoke_test.mjs
```
It signs up throwaway guests and checks, against the live project: sign-up works, listeners cannot self-promote or publish, one Edition per city per day, comments appear for another user, Discovery and Backs rules, pitches. Anon key only, never `service_role`. **First live run: Mon 12 Oct 2026, 09:27 Brisbane, project in Sydney, 33 of 33 checks passed** (run by Dylan, output kept). Earlier failures that day were configuration, not code: email sign-ups were disabled in Authentication, and the curator account's password was reset in SQL (`extensions.crypt`). If a check fails, the message names the rule and the HTTP status. Delete the test comment and guest users afterwards in the Supabase dashboard.

## Check it works (do this once, on two phones)
- Open the site on both phones, choose the same city, and use **Join as a guest** on each (guest accounts need email confirmation OFF; step 3).
- Phone A answers the Discovery check on an Edition curated by someone else; phone B backs that curator. The curator's Studio standing updates.
- RLS rules are covered by `prototype/supabase/rls_test.sh` (45 checks on a throwaway Postgres), but that is not a substitute for this live check.
- Publish an Edition for tomorrow on phone A: it must NOT appear on phone B.
- Publish for today on phone A: it appears on phone B within ~30 seconds.
- Post a comment on phone B: phone A sees it after a refresh.
- Artist account sends a pitch: curator account sees it in the Studio inbox.
- Try to publish for a day already claimed by another curator: you get the "already claimed" message.

## Known limits (be upfront about these)
- Sessions last about an hour (Supabase default). If a write fails with "session expired", log in again. Log in on the demo devices right before the tradeshow.
- Row-level security is the only protection. The anon key is public by design; never put secrets in the frontend.
- The automated check passes on the live project (12 Oct). The two-phone manual checklist above has **not** been done yet; do it before relying on it at the tradeshow.
- The smoke test leaves a published Edition for today, a comment and `smoke-*` guest users. Delete them before publishing a real Edition (Table Editor: editions, comments; Authentication: Users).

## Round 2: admin, curator approval and delete account (13 Oct)
Run once each in Supabase > SQL Editor, in order (both safe to run again): `prototype/supabase/migrations/002_roles_admin.sql`, then `003_editions_up_to_12.sql` (lets Editions hold up to 12 picks; without it publishing 8 or more picks fails on the live database).
Then make yourself a Folio team member (use your own uuid from Authentication > Users):
```sql
update public.profiles set is_admin = true where id = '<your uuid>';
```
Check by hand (not covered by the automated smoke test yet): log in as the admin and open Team; apply as a second account; approve; the second account lands in the Studio on its next login or when Me opens.
Note: an admin who is also the only curator account lands on Team. Use a second account to see the curator view.
