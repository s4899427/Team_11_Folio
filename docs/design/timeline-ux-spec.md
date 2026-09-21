# Timeline UX Spec — Art & Fashion
Resolves the infinite-scroll vs. anti-doomscroll conflict. Applies to both verticals identically unless noted.

## Core principle
A timeline is a bounded history you move through, not an endless feed. Every timeline has a visible start, a visible end, and a known size — the user always knows how much there is and where they are in it.

## Structure

**Scoping (what bounds the timeline)**
- User selects a genre/style/era/movement first (e.g. "Renaissance sculpture," "Y2K fashion," "West African textile art")
- The timeline that loads is scoped to that selection only — never a single undifferentiated feed of everything
- Header always shows the scope and total size, e.g. "Renaissance sculpture — 47 pieces, 1400–1600"

**Ordering**
- Chronological by default (oldest → newest, or newest → oldest — pick one and be consistent)
- Optional: toggle to sort by "most discussed" or "recently added by community" as a secondary, non-default option — never algorithmic ranking

**Loading behavior — the key fix**
- Load an initial batch (e.g. 15–20 items) on entry
- NO auto-loading on scroll
- A clear, explicit "Load more" button (or "Show next 20") sits at the bottom of the loaded batch
- Reaching the end shows a definitive end state: "You've reached the end — 47 of 47 pieces," not an infinite loading spinner
- Optional: a progress indicator (e.g. a thin bar or "23 of 47") so the user always has a sense of position

**Per-item card content**
- Image/artifact photo
- Title, artist/creator (or "unknown" if applicable), year/era
- One short line of context (not a full essay) — tapping opens the full entry
- No autoplay video, no autoplay audio
- If a video exists (e.g. a runway clip), it requires a deliberate tap to play — never plays on scroll-into-view

**Digital lookup / "lens" feature (both verticals)**
- Triggered manually (user taps a piece to look deeper), never automatic or ambient
- Opens a focused detail view, not another feed — a dead end by design, not a launchpad into more scrolling

## What this achieves against the anti-doomscroll principle
- User always knows the scope and can see the end — no illusion of endlessness
- Continuing requires an active choice (tap "load more"), not passive momentum
- No autoplay anywhere removes the reels-style pull
- Chronological/historical framing reinforces "this is a history to learn," not "content to consume"

## One open decision for the team
Should genre/era selection happen every time (user re-picks scope each session), or should the app remember the last scope and drop the user back into it? Re-picking reinforces deliberateness; remembering reduces friction. Worth testing both with users rather than assuming.
