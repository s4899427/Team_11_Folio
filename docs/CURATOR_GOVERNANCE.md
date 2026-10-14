# Who curates the curators? Governance v1

Status: **hypotheses to test, not evidence.** Thresholds are design guesses and should be revised from evaluation (`docs/evaluation/EVALUATION_KIT.md`, Q4).

## Problem
Folio replaces an algorithm with named people. That moves power to curators: they choose what a city hears. Winner (1980) asks what politics an artefact builds in; Akrich (1992) asks what users and roles a design scripts in advance. Our scripted roles are *reader*, *curator* and *artist*, and the ladder between them is a political decision. So we make it explicit.

## Design goals
1. Reward creativity and passion, not volume or popularity.
2. Make it hard to game with friends or sign-ups.
3. Never turn votes into a ranking of music or a public leaderboard of people.
4. Stay honest about being a small prototype.

## What v1 implements (code in `prototype/src/lib/standing.js`, rules in `prototype/supabase/schema.sql`)
- **Discovery check**: after an Edition, a reader answers one yes/no: "did this show you something new?". One answer per reader per Edition; a curator cannot answer their own. The rate is hidden until 10 responses so small samples do not shame or inflate anyone.
- **Backs**: each member has 3 per month for curators (not for picks). No self-backs; one per curator per month. Backs count is private to the curator.
- **Standing** is shown as separate components (Editions published, Discovery rate, distinct backers), never one score.
- **Tiers**: Apprentice (under 5 Editions) -> Curator (5+) -> Resident (20+ Editions, 20+ Discovery responses with >=50% "new", >=5 distinct backers in 90 days). Curators are promoted by the team (SQL) and applications are reviewed by people.

## The new-artist mix (implemented, `validate.js`)
Folio's job is both to help newcomers get to know the established names and to surface new ones. Every Edition therefore mixes artists people may already know (established or underrated) with new and upcoming ones from the same scene.
- An Edition has 8 to 12 picks (decided 12 Oct; was 5 to 7). At least 2 and at most 4 are new and upcoming, and never above 45% of the picks: 8 picks allow 2-3, 9-12 picks allow 2-4. Dylan confirmed 2-3 on 12 Oct before the Edition grew to 8-12; the cap of 4 is our proposal and still needs his OK. The rest stay established or underrated, so the Edition still orients people.
- Scope: Australian artists for Brisbane (Brisbane-based or elsewhere in Australia). Music picks marked as from elsewhere are rejected. Places and stories are exempt and cannot be marked emerging.
- Each music pick carries a stage tag and an origin tag, shown to readers. A curator who knows an emerging artist personally must say so (shown as "Curator knows them").
- "New and upcoming" is a curator's declared tag with a sourced Liner Note, not a streaming-number threshold. We have not verified a legitimate, stable data source for a numeric threshold, so we do not invent one.
- The mix is a hypothesis about what a newcomer needs. Test it (Evaluation Kit Q8) and change it if the evidence says so.
- Founding (seed) Editions are history lessons by the team and are exempt.

## Verifying new and local artists: two sources and a signature (implemented 15 Oct, `validate.js`, Studio)
A pick marked "new and upcoming" must carry, before an Edition can publish:
1. **The artist's own page** (SoundCloud, Bandcamp or another artist-owned page). The Studio checks that the link is on the site the curator chose; look-alike domains fail.
2. **An independent source** (radio, venue, press or QMusic) with a name and link, on a different site from the artist's page.
3. **A local note**: how the curator knows the artist is based in the city (profile location, a gig, a venue).
4. **The curator's attestation**: "I confirm this is human-made, local and new. I am accountable for this pick."
Readers see the local note and both links on the pick.

**Limits, stated plainly.** Folio does not connect to SoundCloud, Bandcamp or any streaming service and shows no stream counts: we have not verified API access or terms, and a popularity number would reward the already-popular, against the no-ranking rule. Folio cannot detect AI-generated music; the check is human, and accountability sits with the named curator, not an algorithm. A curator can still sign falsely. The mitigations are visibility (the pick shows its sources to every reader), the discovery check, and removal by the team. Whether two sources is the right bar is a hypothesis to test in evaluation.

**Candidate independent sources (to verify before we name them in the app):** triple j Unearthed profiles, QMusic, 4ZZZ, APRA AMCOS, venue listings. None has been verified by the team yet.

## Why not likes
Likes reward what is already popular and push everyone toward the same taste (Anwar's homogenisation concern in the portfolio readings). Asking "did this show you something new?" rewards the opposite: finding what the reader did not know.

## Further mechanisms (not built; trade-offs)
| Idea | Helps | Risk |
|---|---|---|
| Peer review rubric between curators (novelty, source quality, local relevance) | Quality, curator voice | Cliques; extra load |
| Lottery for trial slots among applicants | Fairness, new voices | Quality variance; needs an editor |
| Open nominations plus a short pitch Edition | Passion visible | Popularity contest |
| Quarterly re-election of Residents | Accountability | Churn; discourages risk |
| Anti-gaming: account age, hidden live counts, rate limits | Resists sockpuppets | Excludes new real users |
| Rewards: featured slot, printed Edition, pitch priority, artist meet-ups | Motivates craft | Goodhart's law: people chase the measure |

## Known risks to discuss on the Ethics page
- Goodhart: once Discovery rate matters, curators may choose obscure for obscurity's sake.
- A small group of backers can make or break a curator.
- Voting by a mostly-student sample is not "the city".
- Seoul and Mumbai have notes but no curators; do not imply otherwise.
- Local touches (greetings, Acknowledgement of Country) need native-speaker/Elder review before public use.

## Artist and fan connection (implemented; ethics notes)
- A fan connects to an artist by choice, and the artist can see the fan's name. Connected fans see the artist's short updates ("dispatches") and may ask one question a day; the artist's reply is visible only to the asker.
- Deliberately not built: public follower counts, likes on updates, open direct messaging. This keeps the no-ranking principle and limits harassment risk. It does not remove it: an artist still receives names and questions, so the Ethics page should cover moderation, blocking and reporting as open work.
- Artists can be real people with a public profile name. Demo mode shows one clearly labelled example artist; remote mode shows only real accounts.
- Evaluate it: do fans feel closer to the culture, or is it noise? Do artists feel exposed?
