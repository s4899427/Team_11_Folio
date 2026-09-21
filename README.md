# Folio

DECO3500 Social & Mobile Computing — Team 11, Semester 2 2026

## What this is

Folio is our answer to how music, fashion, art and food discovery actually happens for people — not through an algorithm guessing what you'll click next, but through someone you trust picking something out for you.

The app opens on **Today**: one Thread, picked by whoever's curating that day, built around a theme. It's not locked to one kind of content — could be a song, a place, a ritual, whatever fits. People post into it throughout the day, and the curator features posts by their own judgement, not by how many likes something got. At midnight the Thread locks for good and drops into **Archive** — a dated record you can scroll back through, not something that just disappears.

**Me** is your profile — your communities, your saved stuff.

That's it. No algorithm deciding what you see. Likes and comments don't rank anything.

## Start here

Before touching anything else in this repo, read [`docs/requirements/master-spec.docx`](./docs/requirements/master-spec.docx) — it's the source of truth for the whole product: navigation, every screen, the full posting flow, all 12 communities, how the curator model works, and the design principles we built around.

## Try the prototype

**Live:** https://s4899427.github.io/Team_11_Folio/

Works on desktop and mobile, nothing to install.

**Running it locally** (if you're developing, or Pages is down for some reason):

```bash
cd prototype
npm install
npm run dev
```

Open whatever URL it prints (usually `http://localhost:5173`). No real login — it's simulated, local-only auth, since the brief specifically says not to bother building real authentication for a proof-of-concept.

### If Pages ever needs setting up again

The repo has a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds `prototype/` and pushes it to Pages automatically on every push to `main`. If it's ever off:

1. Settings → Pages → Source: **GitHub Actions**
2. Push to `main`, or trigger it manually from the Actions tab → *Deploy Folio prototype to GitHub Pages* → Run workflow
3. Give it a minute — the live URL shows up in the run summary and under Settings → Pages

Routing is hash-based (`/#/archive`, `/#/me`, etc.) on purpose — that's what lets it work as a static site on Pages without breaking on a refresh.

## Repo guide

| Folder | What's in it |
|---|---|
| `prototype/` | The working prototype (React + Vite) |
| `docs/requirements/` | `master-spec.docx` (current) + earlier requirements draft |
| `docs/research/` | Interviews (Round 1 + Round 2, de-identified), synthesis, current-vs-expected, use cases |
| `docs/design/` | UX specs and the SMC theory-to-feature mapping |
| `docs/process/` | Concept pivots, continuity report, decision log |
| `docs/team/` | Team charter and the ethics draft (also up on the Wiki) |
| `docs/archive/` | Old drafts from the MOTIF era, kept for process history |
| `presentation/` | Current stand-up deck |

Check the [Wiki](../../wiki) for the Design Process Overview, Ethical Considerations, and our stand-up records.

## Team

| Name | Role |
|---|---|
| Dylan | Research synthesis & documentation |
| Pranav | Content & audience research |
| Mohammad | Technical build |
