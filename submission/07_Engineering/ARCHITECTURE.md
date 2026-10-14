# Architecture

```
Phone browser  --HTTPS-->  GitHub Pages (static React app, built by GitHub Actions)
      |
      +-------HTTPS------>  Supabase (Postgres + Auth + Row-Level Security)
                              - every table has RLS; only the public "anon" key is in the browser
                              - roles live in `profiles`; the client cannot change them
                              - functions: decide_application, delete_my_account, curator_stats
```

| Part | Choice | Why |
|---|---|---|
| Front end | React 18, Vite, Tailwind, HashRouter, react-query | Static hosting; fast on mobile; no server |
| Data and auth | Supabase (Postgres, Auth, RLS) | Real shared data for several simultaneous users, with permission rules enforced by the database |
| Demo mode | Same app with no Supabase keys: data in the browser | Anyone can try it unassisted; also used by tests |
| Deploy | GitHub Actions: `npm ci`, `npm test`, build, publish to Pages | A failing test blocks a deploy |
| Not used | A Python or Node server | A custom server adds deployment risk and nothing the criteria reward |

## Permission model (enforced by row-level security, not by the screens)
- Only a curator can publish, and only for their own city and only for today or later.
- A user can edit only name, suburb, bio and avatar on their own profile.
- Only the Folio team can read all curator applications; deciding runs through a database function that refuses non-team callers and the team member's own application.
- Delete my account runs through a database function and refuses curators and the team.

## Prototype boundary
This is a proof of concept. See "Real vs simulated" in `02_Product/MVP_SPEC.md`.

## How to run
`cd prototype && npm install && npm run dev` (demo mode), or add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` for the shared database. Database setup: `07_Engineering/SUPABASE_SETUP.md`.
