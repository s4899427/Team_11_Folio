# Evaluation results (formative): sessions E-01 (P1) and E-02 (P2)

Plan: `EVALUATION_KIT.md`. Every row below comes from a participant's own words (voice-recorded and machine-transcribed, recordings kept privately outside the repo) or from the observer's notes, and says which. Nothing is invented. **Both sessions were one person at a time, so simultaneous multi-user use was NOT tested.**

## Session log
| Code | Date | Where (context) | Who (anonymous) | Tasks run | Consent noted |
|---|---|---|---|---|---|
| E-01 | Tue 20 Oct 2026, early hours [Dylan to fill: start time] | [Dylan to fill: setting] | P1: Master of Business student, Griffith (Nathan); new to the area | First screen, free look, T1, T2; T3 and T4 (comment) **not completed**; Q1, Q4, Q8, Q10 and "when would you NOT use it" | Verbal consent to the study. **Recording consent not asked at the start; confirmed afterwards** ([fill time]) |
| E-02 | Tue 20 Oct 2026, early hours [Dylan to fill: start time] | [Dylan to fill: setting] | P2: student, new to Brisbane (stated "Yes, I definitely am") | First screen, free look, T1, T2; **T3 and T4 not run**; Q1, Q4, Q8, Q10 and "when would you NOT use it" | Consent to the study and to the recording, given aloud at the start. Permission to quote anonymously, given at the end |

## Findings
Severity is the team's judgement. "Planned" means recorded as a design decision, **not built**; the app was frozen for the tradeshow.

| ID | Finding (evidence, by code) | Concept | Severity | Design change | Status |
|---|---|---|---|---|---|
| F1 | Neither participant could comment, and the cause is now **verified in a test build** (same code; phone-sized browser): after the welcome screens a visitor lands on Today **with no account**. Me says "You're browsing as a guest", but commenting needs an account made through Me > Create account > "Just looking? Join as a guest". The only comment prompt is a "Log in" text link in the Discussion section, about 3,500 px down a ~3,990 px page, and it leads to Login, not to the guest button. P2 never attempted a comment. | Awareness; discoverability; terminology ("guest" means two things) | High: the multi-user feature was invisible | Add a Discussion shortcut to the jump bar; make the prompt say "Join as a guest or log in" with a link to each | Fix written and tested in a sandbox build; **not in the deployed app unless the team applies it** |
| F2 | The "Liner note" row and the "More from Brisbane" control are about **16 px high** (measured in a test build), below the 24 px minimum target size in WCAG 2.2 and well below the 44 px commonly recommended for touch (observer note: "too small"). | Usability | Medium | Make both at least 44 px high | Fix written and tested in a sandbox build; **not deployed unless applied** |
| F3 | P1 read Browse as an events guide: "information about like the festival's happening in my current location", and chose **a venue (Cloudland Ballroom)**, not a track, when asked which pick they would choose. Browse did not lead back into the curated picks (observer). | Mental model; place vs music | High | Link each Nearby item back to the pick or curator that mentions it | Planned |
| F4 | Guest status was unclear. P1: "Do I need to log in?" The facilitator said they were "already logged in as a guest". In the app, anonymous reading is called "browsing as a guest", while "Join as a guest" creates a real account; neither participant was ever signed in. | Onboarding; terminology | Medium to high: it explains F1 | Rename anonymous reading to "reading without an account", or say what "guest" gives you | Planned, not built |
| F5 | **Today's Edition was not published when P2 tested.** P2: "Today's is not released yet. I was just looking at the previous day's edition." P2 did not mind ("information is new to me regardless"), but at the tradeshow an empty Today would hide the core idea. | Edition lifecycle | High, operational | Publish Tuesday's Edition before the tradeshow; show a clear "today's Edition arrives at ..." message when none exists | Edition: do now. Message: planned |
| F6 | Newcomers could not judge the picks. P2 (new to Brisbane): "I'm not exactly familiar with these things" and could not choose a pick to play. P2 did not notice the mix of known and new local artists ("I didn't notice it"), because the Beatles were mentioned in a fact. | Newcomer onboarding; Q8 | High: the core target group did not see the new-artist idea | Mark new local artists visibly on the pick; explain why they are included | Planned |
| F7 | P2's favourite part was **the facts** and the **Aboriginal cultural content**: "I did not know where to educate myself on it better ... a very nice way." P1, in the ethics session, worried it could be tokenistic. The two views differ. | Place; ethics | Informs the ethics decision | Keep the content; get it reviewed by an appropriate person (see ethics record) | Review pending |
| F8 | P2 assumed taste could be exposed: "I would like it if my search history was not exactly on display ... turn it off or keep it private." Folio shows no listening or search history, but nothing in the app says so. | Awareness vs privacy | Medium | Say plainly on the profile or welcome screen: "Nothing you listen to or search is shown to anyone" (only if true; check the privacy register first) | Planned |
| F9 | P2 asked for **a way to connect with other people** around music: "a community built around music". P2 did not mention comments or the artist connection. | Awareness; community | Medium | Surface Discussion and Connect earlier | Planned |
| F10 | Low-cost, low-key options matter: concerts are hard to attend "because of the ticket prices and the booking system. So I think something low-key also would be fun." | Context; newcomer needs | Medium | Show free or low-cost events first in Nearby | Idea; not planned |
| F11 | **The two participants disagree on use pattern.** P1: only Fridays and weekends, not busy weekdays. P2: uses music a quarter of the day, "it's a big hassle to keep picking music myself", wants the decision made for her, and could think of no reason not to open it. | Reasons to open; daily habit | Medium | Daily format is plausible for heavy listeners, not everyone: do not claim a daily habit from this | Open question |
| F12 | Trust was high in both ("completely", "definitely"), but the facilitator's questions led, answers were short, and neither participant opened a Liner Note or source on the recordings. | Trust | Low weight | None: do not claim trust was demonstrated | Limit |

## What surprised us
1. P1 used Folio as a **what's-on guide**, not a music pick list (F3).
2. A newcomer **did not notice** the new-artist mix, the thing the design is built around (F6).
3. The most valued content was **not the music picks**: it was the facts and First Nations content (F7).
4. The two participants disagreed on the daily habit (F11).

## Limits (be upfront)
- Two participants, tested one at a time; **no simultaneous use, no comment or Discussion test completed**. This is the key gap against the unit's expectations.
- Friends/acquaintances of the team; short exposure; first-day novelty; setting [fill].
- The facilitator explained steps, answered questions and asked leading questions ("Did it teach you something new?") in both sessions. F12 especially is weak.
- P1's recording consent was confirmed afterwards, not at the start.
- Today's Edition was unpublished for at least part of E-02; whether the earlier P1 session saw a published Edition or the fallback is [Dylan to fill].
- The facilitator told both participants they were signed in as guests; they were not (F4), so the evaluation could not test commenting at all.
- No change has been made to the deployed app in response to these findings (see the optional patch).

## Reasons-to-open hypotheses
From the participants' own words: planning a weekend outing around events (P1); getting the day's music decision made for you and learning about the place (P2). The other hypotheses the team wrote down were not mentioned and are not findings.

## Privacy
Recordings and full transcripts are kept privately, outside the repo; the P1 evaluation transcript contains a name said by accident and will not be published. All recordings are deleted after marking.
