# Ethical Considerations — Folio

*DECO3500 — Team 11 — GitHub Wiki page*

Framework used: **Loke & Matthews (2020)**, cross-checked against the **Ethical Disclaimer Canvas** (ethicsfordesigners.com). Both were used because Loke & Matthews is stronger on stakeholder harm analysis, while the Canvas is stronger on surfacing assumptions we might not otherwise question.

---

## 1. Who is affected by this design

| Stakeholder | How they're affected |
|---|---|
| **Everyday users** | What they see, whether they feel represented, whether posting feels safe |
| **Curators** | Given real editorial power over what counts as "featured" culture for a day |
| **Communities/cultures represented in content** | Whether their culture is shown accurately, respectfully, and by people with standing to speak on it |
| **Content sourced from external archives/images** | Original creators of any real photography, art, or archival material used |
| **People not represented at all** | Anyone whose culture, community, or form of expression isn't covered by the current 5 community groups |

---

## 2. Core ethical tension: curation is gatekeeping

Folio's entire premise — a human curator decides what's "featured" each day — is also, honestly, a form of **cultural gatekeeping**. Handing one person the power to decide what represents a culture for that day carries real risk: whose story gets told, whose doesn't, and who decided that.

**What we built to address this directly:**
- **Curator eligibility is tied to community membership** — a curator can only be nominated within communities they've actually joined, reducing (not eliminating) the risk of someone curating a culture they have no real connection to.
- **Open application**, not appointment — anyone verified can apply, rather than a closed editorial board deciding who gets to speak for a community.
- **Plurality of perspectives, not single "truth"** (see Section 3) — even once curated, content isn't presented as the one correct account.

**What remains genuinely unresolved:** at small scale (a handful of curators, as in this prototype), representation will inevitably be uneven. This is named honestly here rather than claimed as solved — it's a structural risk of any curation-based system, ours included.

---

## 3. Plurality of perspectives, not one enforced truth

Early in this project, peer feedback (Team 8) asked a hard question: *who decides accuracy when two sources describe the same cultural tradition differently?*

Our answer, reached deliberately rather than by default: **treating cultural/interpretive content as a single, fact-checkable "truth" is itself the ethical problem, not the solution.** Art interpretation is inherently subjective. Culture evolves and is described differently by different communities practicing it. Fashion has no single correct read.

**Design response:** where content is genuinely interpretive or disputed, Folio is designed to show multiple attributed perspectives side by side, rather than merging them into one "official" account. Verifiable factual claims (a date, a location) remain a separate, narrower dispute process — not conflated with cultural interpretation.

---

## 4. Community-authored content and moderation

Every user post must attach to a specific entry (no free-standing posts) and passes an automated relevance-and-safety check before publishing.

**Ethical reasoning behind this specific design:**
- Tying posts to entries bounds the moderation surface to something reviewable, rather than an open, unbounded space.
- The relevance check is explicitly **content-relevance based, never popularity/engagement-based** — this was a deliberate choice after recognising that "most liked" selection is functionally the same algorithmic mechanism our own research participants rejected.
- An **anonymous critique option** was added specifically because a participant named a real barrier: fear of "being judged for judging." Attributed creative contributions (takes, remixes) stay tied to identity; critique doesn't have to.

**Handling of serious real-world content:** no special system auto-generates themes from live or breaking news (a deliberate exclusion — see Section 6). However, users remain free to post genuinely, seriously, about real events (e.g. a war, a crisis) as a Field Note or My Take, passing through the same relevance/safety check as anything else. A curator may choose to feature such a post using ordinary human editorial judgement. We chose not to build a special automated pathway for this, since an algorithm deciding when a tragedy is "thread-worthy" is a worse ethical position than a human choosing to.

---

## 5. Data and privacy

- Authentication is **fully simulated and client-side** (localStorage only) for this prototype — no real backend, no real password security, no data leaves the user's own browser.
- This is a deliberate prototype-stage simplification, not a hidden limitation — it is documented plainly here and in the technical specification, and would need a real, properly secured backend before any real deployment.
- No behavioural tracking, no engagement analytics, and no algorithmic profiling of users exist anywhere in the product — consistent with the "no algorithm" design principle running through the whole build.

---

## 6. Real-world event sensitivity

We considered, and explicitly rejected, feeding live or breaking news (including political events, wars, or tragedies) automatically into the curator's daily theme-generation system. Reasoning: an automated system proposing "today's theme is [a tragedy]" risks being tone-deaf regardless of intent, and turns a human editorial judgement call into an algorithmic one — exactly the pattern this whole project is positioned against. Calendar-significance input is restricted to historically-processed anniversaries (via Wikipedia's "On This Day" data) and known local happenings (festivals, exhibitions), never live events.

---

## 7. Image sourcing and copyright

A batch of reference images was sourced for internal design/testing purposes during development. Several were identified as copyrighted (a commercial brand campaign photo, a stock library image, a travel blogger's personal photo, likely archival press photography) and are explicitly **not intended for the final submitted or presented version** of this project. Before any real-world use, these would need to be replaced with the team's own original photography or verifiably licensed sources (e.g. Unsplash, Pexels, Wikimedia Commons, or open-access museum APIs).

---

## 8. What's still genuinely open

Named honestly, not glossed over:
- Representation fairness at small curator-pool scale
- Long-term moderation quality once post volume grows beyond what a simple relevance check can meaningfully judge
- Whether the 5-community grouping itself unintentionally under-represents any of the original 12 categories it consolidates
- Cold-start: who curates the very first few days before rotation has real momentum
