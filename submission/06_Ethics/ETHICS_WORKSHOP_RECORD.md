# Ethics workshop record (Ethical Disclaimer method)

Status: **in progress.** P1 workshop done; Pranav answered in writing; P2 pending; Shaz wrote his own page, see 11_Evaluation. Part B (18-row draft) was written by Claude and challenged by the people below.

Date: Mon 19 Oct 2026, evening (the same night as the two evaluation sessions). Photo of notes: [attach].
This was **not** the full six-step 60-minute workshop. It was a shortened version with one outside participant plus written answers. Say so on the wiki page.

## Who took part
| Who | Role | How |
|---|---|---|
| Dylan | Team lead; facilitator and participant | In the room |
| P1 | External participant (Master of Business student, Griffith) | In the room, about 15 minutes, voice-recorded and machine-transcribed |
| Pranav | Team member | Written answers to the six-question form, sent overnight |

## Stakeholders added
- **P1:** students, and **international students and recent immigrants more than locals**, because locals already know the area; parents of students. Party-goers get "none" in benefits.
- **Pranav:** people who appear in a pick but are not the artist (a photographer whose image is linked, a venue staff member named in a reason, a co-writer who did not consent); commenters' own contacts (a first name in a small scene is still identifiable); established artists left out to fill the quota.

## New harms raised
| New | By | Meaning for the design |
|---|---|---|
| Unverified events and groups, fake parties and ticket scams, which could cost students money or lead them into danger | P1 | Row 14 is bigger than "wrong gig info": the Nearby list could be abused. The planned verification step is not built; Nearby is labelled as curator tips |
| Pile-on comments under a new artist's first feature; no report, no hide, no rate limit | Pranav | Our comments have no moderation: the team can remove them only by hand in the database |
| A fan's name is visible to an artist after connecting, and the UI may not make that obvious | Pranav | Check: a Disconnect button exists and removes the connection. Whether questions already asked remain visible to the artist is **not verified** |
| Quota forces a weak second "new" pick on a day a curator only knows one | Pranav | Test the 2 to 4 rule; curators should be allowed to publish fewer new artists with a stated reason (proposal) |
| People appearing in a pick who did not consent | Pranav | Add a curator rule: link only to the artist's own public pages |

## P1's decisions on the Part B rows
P1 answered "keep, change or remove" aloud. Caveat: the facilitator's wording was ambiguous, and "remove" may mean "remove the risk" rather than "delete this row". We record the words and our reading.

| Row | P1's decision | P1's reasoning (in their words) | Our reading |
|---|---|---|---|
| 2 Public name, suburb, bio | Keep | Not elaborated | Kept; Pranav suggests hide suburb by default |
| 3 Location prompt | Keep | "Only while accessing the application... Not 24x7" | Matches design: opt-in, in browser, not stored |
| 4 Under-18 users | Keep; no minor version, no age filter | "We should not have any minor version" | Kept as a stated limit |
| 6 Curators favouring friends | "Should remove it" | Curators should not favour anyone | Read as: remove the favouring. Keep the conflict-of-interest rule |
| 8 Fan questions | Change | "Change it to some other workflow" | Changed: see Pranav |
| 12 Acknowledgement of Country as tokenism | "Remove this. Or we take permission from them" | Final priority change: "Remove acknowledgement of country and using First Nation... language without permission" | **Ambiguous.** Likely means: nothing from First Nations cultures used without permission. We do not remove the Acknowledgement; we keep the review-before-tradeshow action |
| 13 Korean/Hindi greetings | Keep | "We can verify that" | Kept |
| 14 Wrong info / unfair venue promotion | "Remove it" | Verify event sources | Read as: remove the risk by verifying sources; row upgraded (see new harms) |
| Rows 1, 5, 7, 9 to 11, 15 to 18 | Not reviewed | | Mark "not reviewed by P1" |

## Pranav's written answers (summary)
- **Row 8 too optimistic** → change to "Partly": add block and report on both sides, and a way for a fan to remove their name from an artist's list. **Row 2:** move "consider hiding suburb" to "hide suburb by default".
- **Where the team should not take responsibility:** what Spotify, Bandcamp and YouTube track after a listener taps through (row 9).
- **One change:** a comment report flag and a curator "hide comment" on their own Edition. **Planned, not built.**
- **Evaluation change:** ask each participant whether they noticed their name is visible to the artist.
- **Agrees** guest names stay out of the repo, recordings stay private, and the Acknowledgement text needs review by an appropriate person. Fine to quote.

Verified against the code: a Disconnect button exists (it deletes the connection). No block, report or hide control exists in the app.

## Evidence from the evaluation that bears on row 12
P2 (not in the workshop) said the Aboriginal cultural content was valuable: "I did not know where to educate myself on it better ... a very nice way." P1 worried about tokenism and permission. So the content has value to a newcomer, and the risk is real. Decision: **keep the content, mark the review as pending, and get it checked by an appropriate person before presenting it as finished.** Check our Acknowledgement wording against UQ's official wording.

## What changed because of the exercise
| Change | Source | Status |
|---|---|---|
| Row 8 changed to "Partly"; block/report and name-removal added as planned work | Pranav, P1 | Documented; **not built** |
| Row 14 expanded to include scam events; event verification flagged as the main gap for newcomers | P1 | Documented; **not built** |
| Row 2: hide suburb by default | Pranav | Planned |
| New rows 19 to 22 added (non-consenting people in a pick; comment pile-ons; fan-name visibility; quota filler) | Pranav | Added |
| Ask participants whether they noticed their name is visible to the artist | Pranav | Not asked in E-01 or E-02; add to the next session |
| Tell users plainly that listening and search are not shown to anyone, if true | P2 (evaluation) | Planned |

**One change that matters most:** comment report and curator hide, plus event-source verification. These were not built, so they are recorded as planned. We do not claim they exist.

## Limits
Small and informal: one outside participant, partly yes/no questions, leading wording by the facilitator, no First Nations voice, no artist, no curator. The Acknowledgement of Country has not been reviewed by an appropriate person; that is still open.
