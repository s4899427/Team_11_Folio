# Folio

**Social and mobile computing for shared everyday expression.**

DECO3500 Social & Mobile Computing — Team 11, Semester 2 2026

## Start here

**[`docs/requirements/master-spec.docx`](./docs/requirements/master-spec.docx)** — the current source of truth for the whole product: domain, navigation, every screen's structure, the full posting journey, all 12 communities, the curator model, and core design principles. Read this before anything else in the repo.

## What this is

Folio opens to **Today** — one curated "Thread" a day, picked by a rotating curator, made of any number of elements from any creative domain (a song, an artwork, a place, a ritual — not fixed to a preset combination). The community posts throughout the day in response to the theme; the curator selects the featured posts by editorial judgement, not popularity. At midnight it locks permanently and moves to **Archive**, becoming a dated record. **Me** holds your profile, your communities, and your saved items.

No algorithm anywhere. Likes and comments carry zero ranking weight.

## Try the prototype

**Live:** `https://<your-github-username>.github.io/<this-repo-name>/` — replace the placeholder with your actual GitHub Pages URL once the first deploy finishes (see below). Works on desktop and mobile, no install needed.

**Locally (for development, or if Pages isn't live yet):**

```bash
cd prototype
npm install
npm run dev
```

Then open the URL it prints (`http://localhost:5173` by default). No login is required — the app uses simulated, local-only authentication, per the assignment brief's guidance not to build real login for a proof-of-concept.

### Getting the live link working

This repo ships with a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds `prototype/` and deploys it to GitHub Pages automatically on every push to `main`. One-time setup after you push this repo:

1. **Settings → Pages → Source: GitHub Actions** (not "Deploy from a branch").
2. Push to `main` (or run the workflow manually from the **Actions** tab → *Deploy Folio prototype to GitHub Pages* → **Run workflow**).
3. Wait ~1–2 minutes for the first build. The live URL appears in the workflow run's summary, and under **Settings → Pages**.
4. Come back and replace the placeholder URL above with the real one.

The prototype uses hash-based routing (`/#/archive`, `/#/me`, etc.) specifically so it works correctly as a static site on GitHub Pages — no server-side routing needed, and deep links won't 404 on refresh.

## Repo guide

| Folder | What's in it |
|---|---|
| `prototype/` | The working interactive prototype (React + Vite) |
| `docs/requirements/` | **`master-spec.docx`** (current) + earlier requirements draft |
| `docs/research/` | Interview transcripts (Round 1 + Round 2, de-identified), synthesis, current-vs-expected, use cases |
| `docs/design/` | UX specs and SMC theory-to-feature mapping |
| `docs/process/` | Concept pivots, continuity report, decision log |
| `docs/team/` | Signed charter and the ethics draft (also posted to the Wiki — see below) |
| `docs/archive/` | Superseded drafts from the MOTIF era, kept for process history |
| `presentation/` | Current stand-up deck |

See the [Wiki](../../wiki) for the Design Process Overview, Ethical Considerations, and stand-up records — post `docs/team/ethical-considerations-DRAFT-for-wiki.md` there as the Ethics page if it isn't live yet.

## Team

| Name | Role |
|---|---|
| Dylan | Research synthesis & documentation |
| Pranav | Content & audience research |
| Mohammad | Technical build |
