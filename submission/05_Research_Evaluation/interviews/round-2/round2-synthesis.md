# Round 2 Master Synthesis — All 5 Participants
Pranav: Participant A (India), Participant B (India). Shaz: Participant C (Uni student), Participant D (Retail worker), Participant E (Health professional). Anonymized per team's ethics decision.

## Headline finding: 5 out of 5 independently described the same distinction
Every single Round 2 participant, unprompted and in their own words, drew the same line between genuine inspiration and passive scrolling:

- "Getting inspired... trying to know how things work" vs. "doesn't have a good intellectual message... more of a time pass" (Participant B)
- "If I'm looking for inspiration I'm actually saving things, searching specific words... when I'm killing time I don't even remember what I saw" (Participant C)
- "Inspiration has a purpose and I usually leave with something... killing time is more automatic, usually ends when I realise I've scrolled too long" (Participant D)
- "When I'm browsing for inspiration I start making connections... when I'm just killing time, everything blends together, I'm consuming more than thinking" (Participant E)

This is now backed by five independent interviews across two rounds and two interviewers. It's the single strongest piece of evidence in the whole project — worth leading with at stand-up.

## Critical finding: curator credibility is the make-or-break condition
All three of Shaz's participants reacted positively to the concept when it was explained — but every one of them attached a condition:

- "I could see myself checking it daily if it was quick and the Threads were actually different each day." (Participant C)
- "I'd probably ignore it if the curation started feeling random or promotional." (Participant D)
- "I'd check it regularly if the curator choices felt credible." (Participant E)

**This is the sharpest possible evidence that the curator rotation / cold-start problem (still an open item in the requirements doc) is not a side detail — it's the single biggest risk to whether anyone actually returns to the app.** Worth escalating this to the top of your open-questions list, not leaving it where it currently sits.

## Discovery happens through trusted trails, not open browsing
Participant D was explicit: *"I don't normally open an app and think 'show me culture.' I usually follow a trail from something I already trust — an artist, a friend's recommendation, a restaurant page."* His actual example: a friend sent a song → he looked up the artist → similar artists → live performances.

Participant E does the same thing across specialised apps (Pinterest for visual references, Spotify for music, Letterboxd for film) and relies heavily on friends sending her things she wouldn't search for herself.

**Tension worth naming honestly**: your onboarding is category-based (pick your interests across six areas). This finding suggests people's *actual* discovery behaviour is trail-based (follow one trusted thing to the next), not category-based. This doesn't invalidate onboarding, but it does validate that entries should link outward to related things (artist → similar artists, piece → related pieces) as a core interaction — which your artist-entry model already partly supports. Worth deliberately strengthening this cross-linking.

## Strong validation, with real precedent, for "Tonight's Theme"
This is no longer hypothetical behaviour — participants described it as something they *already do*:

- "Someone usually asks what everyone is wearing, and we might send songs in the group chat while getting ready." (Participant C)
- "If it's a concert, wedding or bigger night out, there's definitely coordination... for a normal night, not really." (Participant D)
- "My friends do this a lot. We send outfit photos before events and make shared playlists for road trips, parties." (Participant E)

Confirms the earlier scoping decision: this should be occasion-based, not an everyday nudge. All three also independently said they'd adjust only *a little*, treating a shared theme as a prompt rather than an obligation — consistent with Round 2's earlier finding from Pranav's interviews.

## Private drafts matter more than expected
Several participants prefer to save things privately rather than build on them publicly:

- "If it gives me an idea, I'll save it rather than publicly build on it." (Participant C)
- "I might make something privately and never show them, even if their post inspired it." (Participant E)

Reasons given: not wanting to seem competitive, not wanting to "put yourself next to their work for comparison," and simple perfectionism. This strongly validates the existing **Drafts** feature — it's not a minor convenience, it's addressing a real, named anxiety about public remixing.

## Attribution: nuanced, not binary
Refining the earlier (Pranav round) finding that credit "doesn't matter": it's more precise to say people are fine without heavy attribution for a genuine reinterpretation, but do want acknowledgement for an exact copy:

- "Probably flattering if it was clearly their own version... unless they copied it exactly without saying anything." (Participant C)
- "I'd only be annoyed if it felt like they were copying the specific execution." (Participant E)

## Category interest (from the 3 participants asked directly)
- Participant C: Music first, then Fashion
- Participant D: Food or Music
- Participant E: Art/Design first, then Music

Music appears in every answer as a first or second choice — useful if you need to prioritise which Archive category gets the deepest build first. Participant E's reasoning for Art/Design is also a direct, unprompted validation of the generalised Thread model: *"I'd be most interested in seeing combinations I wouldn't have put together myself."*

---

## Updated traceability additions

| Requirement | Supporting evidence | Source |
|---|---|---|
| Informative, not infinite | Same inspiration/killing-time distinction, independently, 5/5 participants | Round 2, all participants |
| Curator rotation is urgent, not optional | All 3 positive reactions conditioned on curator credibility | Round 2, Participants C, D, E |
| Cross-linking entries (artist → related) | "I follow a trail... an artist, similar artists" | Round 2, Participant D |
| Drafts / private space | Multiple participants prefer private saves over public remix | Round 2, Participants C, E |
| Tonight's Theme (occasion-scoped, optional) | Real existing behaviour for big events only, treated as a prompt not obligation | Round 2, Participants C, D, E |
| Generalised Thread model (any domain) | "Combinations I wouldn't have put together myself" | Round 2, Participant E |

## What to do with this before stand-up
1. **Move curator rotation from "open question" to "urgent, being actively worked on"** in your requirements doc and stand-up deck — the evidence now demands it, not just good practice.
2. Consider adding a small "related entries" link on artist/piece detail views if there's time — directly responds to the trail-following finding.
3. Use the 5/5 inspiration-vs-killing-time finding as your strongest single stand-up slide — it's the most repeated, most independently-confirmed piece of evidence in the whole project.

---

## Addendum — Participant F (Dylan, self-interview)

### New finding: capturing as personal memory, not for sharing
Unlike every other participant, the first instinct after creating something isn't a sharing app at all — it's a personal capture tool: *"My camera/recording evidence tool... need to have it captured as a memory, can be a voice note recorded via mic as well."* Barely posts anything; content mostly stays in notes/archives/gallery.

**Design implication**: reinforces that Field Notes and Drafts should feel like personal archiving first, sharing second — the app shouldn't assume capturing = intending to publish.

### New finding: wants anonymous critique specifically
Raised twice, independently: *"Def support them, critique if I think something needs [it] — but would love if I was anonymous."* And when asked what holds him back from responding to others: *"Being judged for judging."*

**This is a genuinely new, concrete design idea no other participant raised.** Worth considering: an optional "anonymous" toggle specifically for critique-type comments, separate from attributed takes/remixes (which stay tied to identity, since they're closer to creative contribution than criticism).

### Confirms existing patterns
- Perfectionism/fear of judgment as the main reason for holding back sharing — now confirmed by nearly every participant across both rounds.
- Trail-following discovery, extended to **admired public figures**, not just friends — real example: checking what an admired artist "would have worn," not finding anything concrete, and taking loose inspiration from his videos instead.
- Tonight's Theme validated again with precise phrasing: *"Want to match the vibe but not [match] them at the same time"* — vibe-alignment without copying, exactly the current design.
- Strong visual-over-text preference: "I like visuals, can't read a book."
- On being copied: fully open, takes both praise and criticism constructively, no possessiveness at all — sits at the most relaxed end of the spectrum seen across all participants.

### Closing line — strong candidate for your Design Process Overview
*"I believe everything relates to everything — it's all about the moment you're given, and you just have to live it, else capture it, archive it."*

This is close to a plain-language restatement of the entire app's thesis, from a participant, unprompted. Strong closing quote for documentation.
