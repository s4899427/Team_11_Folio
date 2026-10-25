# Fresh-clone check — Pranav

**Date:** Saturday 24 October 2026
**Purpose:** Confirm that someone with no prior setup can clone the public repo and run the prototype by following `README.md` alone.
**Commit tested:** `471cc52` ("Add near-live comments, share button and reading-now presence"), 28 commits on `main`.

## Environment

| Item | Value |
|---|---|
| Machine | Linux (x86_64), clean directory, no previous clone |
| Node | v22.22.0 |
| npm | 10.9.4 |
| Postgres | `psql` client present, no local server |

## What I did (README "Try the prototype", in order)

| Step | Command | Result |
|---|---|---|
| 1 | `git clone https://github.com/s4899427/Team_11_Folio.git` | OK, about 10 seconds |
| 2 | `cd prototype && npm install` | OK, 7 seconds, 138 packages. npm reports 12 vulnerabilities (5 moderate, 7 high) in dev dependencies; none block install or build |
| 3 | `npm run dev` | OK. Vite ready in 238 ms; `http://localhost:5173/` returns HTTP 200 |
| 4 | `npm test` | OK. **32 tests, 32 pass, 0 fail**, 203 ms |
| 5 | `npx vite build` (not in README; checked anyway) | OK. 1,653 modules, `dist/` built in 3.9 s |
| 6 | `bash supabase/rls_test.sh` | **Fails without setup**: `psql: connection to server on socket /var/run/postgresql/.s.PGSQL.5432 failed`. The README says only "needs postgres installed"; the script needs a running server plus `rls_stub.sql` and `schema.sql` loaded first (see below) |

Install, dev server, unit tests and production build all work from a fresh clone with no extra steps. The only thing that does not work by following the README literally is the database-rule test, and that is a documentation gap rather than a code fault.

## What broke or was wrong

1. **`rls_test.sh` prerequisites are not in the README.** The README line says "65 database-rule checks on a throwaway Postgres (needs postgres installed)". Running it on a machine with `psql` but no server fails immediately. The script header itself points to `submission/07_Engineering/SUPABASE_SETUP.md` and needs `PGHOST/PGPORT/PGUSER` set and a database with `rls_stub.sql` then `schema.sql` loaded. The README should either give those three steps or say "see SUPABASE_SETUP.md".
2. **Check counts in the README are stale.** README says `rls_test.sh` has 65 checks; the script has 68 `expect_*` lines. README does not mention `npm test` count, but `TEST_REPORT.md` says 25 unit tests; a fresh clone now runs 32.
3. **Migration 004 is not documented.** `prototype/supabase/migrations/` now has `002`, `003` and `004_presence.sql`, and there is a new `supabase/presence_test.sh`. `docs/SUPABASE_SETUP.md` (the file the README links) lists only 002 and 003. Anyone setting up a fresh Supabase project from the README will miss 004, and the new comments / share / reading-now features will not work on their database.
4. **Two copies of SUPABASE_SETUP.md have drifted.** `docs/SUPABASE_SETUP.md` and `submission/07_Engineering/SUPABASE_SETUP.md` are no longer identical (`diff -q` reports they differ). The README links the `docs/` copy; the submission folder is what markers read.
5. **`smoke_test.mjs` and `presence_test.sh` are not mentioned in the README** at all. They are the only tests that exercise the live database, so a reader following the README would not know they exist.
6. **No `.env.example`.** The README says the app "runs in demo mode by default" and points to SUPABASE_SETUP.md for the shared database, but there is no example env file to copy, and `prototype/.gitignore` does not list `.env.local`, so a developer who creates one as instructed by SUPABASE_SETUP.md could commit their keys.

## What worked without any help

- Clone, install, dev server, unit tests, production build: all green, under one minute total.
- The seed Editions load in demo mode with no database, so the app is usable immediately after `npm run dev`.
- No hard-coded secrets found in the clone.

## Suggested README fixes (one line each)

- Replace "needs postgres installed" with "needs a running local Postgres; load `supabase/rls_stub.sql` then `supabase/schema.sql` then migrations 002–004, and set `PGHOST/PGPORT/PGUSER`; see `submission/07_Engineering/SUPABASE_SETUP.md`".
- Update the count to 68 (or drop the number and say "the database-rule checks").
- Add `node supabase/smoke_test.mjs` and `bash supabase/presence_test.sh` to the test list with a note that they need a live project.
- Add migration `004_presence.sql` to both copies of SUPABASE_SETUP.md and make the two copies identical again.
- Add `.env*` to `prototype/.gitignore` and commit a `prototype/.env.example` with the two `VITE_SUPABASE_*` names and empty values.
