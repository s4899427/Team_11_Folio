# Onboarding copy: from explaining to editorial

Status: proposed, not yet tested with participants. Owner: Dylan (draft). Shaz to review for design fit.

## Why we changed it

The first onboarding used about 120 visible words across three pages to explain features. It read like an app describing itself. Folio's idea is closer to a publication: one Edition, chosen by a person, once a day. The copy should show that confidence instead of listing rules.

Design principle we wrote down: **Folio should feel like a publication that knows what it is, not an app trying to explain itself.**

Constraints we kept on purpose:
- The three-page flow, navigation, map, data and responsive behaviour do not change.
- The Acknowledgement of Country, map attribution, the sourced city fact, and the location-permission explanation stay word for word. These carry meaning or obligations, so we did not shorten them for style.
- Fictional scenarios stay labelled as made up.
- "Needs native-speaker review" chips on the Seoul, Mumbai and Brisbane wording stay until someone checks them.

## Before and after

| Page | Before (summary) | After |
|---|---|---|
| 1. What Folio is | Headline plus a long paragraph and four explanatory points about curators, no ranking, midnight lock and comments | "One Edition. One city. One day." / "New to the city? Start with its music." / four short lines (named curator, eight to twelve picks and no likes, locked at midnight, comments on today's Edition only) |
| 2. Your city | Headline, an explanation of time-zone detection, controls, map, fact, acknowledgement | Same elements. Detection explanation becomes "Guessed from your clock. Change it any time." |
| 3. Three ways in | Three long scenario descriptions with explanatory labels | Three tagged two-line stories (Reader, Listener to curator, Curator), each still labelled as a made-up scenario |

## What we cut, and what we deliberately kept

- Cut: "no feed" (implied by one Edition a day), "the only place people meet here" (the comments line now stands alone), and repeated labels on page 3.
- Kept: who chooses (a named curator, never an algorithm), the absence of likes and ranking, the midnight lock, and the one place people interact.

## What we do not know yet

This is a hypothesis: less copy makes the idea clearer and more intriguing. We have no evidence yet. Shorter copy could instead leave newcomers unsure what an Edition is.

Test it in the evaluation sessions:
- After onboarding, ask each participant to say in their own words what Folio is. Record whether they mention a person choosing, once a day, and one city.
- Note who skips or re-reads the onboarding screens.
- If two or more participants cannot explain it, restore one line of explanation and record the change in the decisions log.

## Items to verify before publishing

- Priya's "three local artists by Friday" is invented for a fictional person, so the made-up label must stay.
- Check that the Country acknowledgement text and the map attribution were not altered by the edit.
- The Seoul, Mumbai and Brisbane wording still needs native-speaker or Elder review.

## AI use (for docs/AI_USE.md)

Claude helped draft the shortened copy and the implementation prompt, from a brief written by the team. Prompt: the "act as a brand strategist and UX copywriter" brief in this conversation. The team chose the final wording and the principle above.

## Appendix: the implementation prompt (single Base44 edit)

See the prompt in the project chat. It tells Base44 to edit the existing onboarding text in place, change nothing else, and stop.


## Update 15 Oct: the story intro (current copy)
Shown part by part. Tap the right side or Next to go on, the left side or Back to return, or swipe. It ends on Today. Tapping the Folio logo (Today, Me) replays it.
1. **The {City} Edition.** "Your city's front page, for music." One Edition a day. Picked by a named local. Gone at midnight.
2. **Someone accountable.** "Every story starts somewhere." Here, it starts with a person: a named local curator who picks 8 to 12 tracks and prints the reason beside each one. No algorithm. No likes. No ranking.
3. **Something new.** "Hear what you've never heard. Learn what you never knew." New local artists sit beside the names you know, and every pick carries one fact you can check.
4. **Something to do.** "Then go get lost in the music." Gigs near you, and one fact worth saying out loud when you get there.
5. **Did you know? (Brisbane)**, with the Acknowledgement of Country. The fact is from AIATSIS (Songs of Australia): songs carry history, family connections, knowledge of the natural world and medicine. It is a national fact and says so on screen. Note: a Brisbane-specific fact about Aboriginal music could not be verified, so none is claimed; the code has a TODO to add one from a Turrbal or Yuggera/Jagera body or the State Library of Queensland. The Acknowledgement wording is still a draft: have an appropriate Aboriginal or Torres Strait Islander person check it before the tradeshow. No artwork is used: artwork needs permission and credit.
6. **Last thing.** City greeting, a different sourced "Did you know?", and the city picker. Button: "Read {City}'s Edition".
Test: `07_Engineering/e2e/intro.py`.
