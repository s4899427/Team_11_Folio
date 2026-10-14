# Data verification register: what is checked, what is not, and how to check it

Written 15 Oct 2026. Rule: **a claim is "verified" only when someone opened a primary or official source, read the exact claim in it, and recorded the date and their name.** A source link in the app is not verification. Until a row says Verified, the app and documents must not imply it is.

## How to verify (the same four steps for every row)
1. **Open the cited page.** Does it actually say the claim (dates, numbers, names)? If it only repeats Wikipedia, go to step 2.
2. **Find a primary or official source**: the artist's or venue's own site, ARIA or triple j Hottest 100 pages, State Library of Queensland (Trove, blog), Brisbane City Council, the university, an official label page, a reputable news report.
3. **Record it**: change the source in `seed.js` or `cities.js`, or write "verified, date, initials" in the Status column. If you cannot confirm, soften the wording or remove the fact.
4. **Never fix a fact from memory** and never ask an AI to confirm it without opening the source yourself.

## A. Seed Edition picks marked "Wikipedia only" (11 in code, `seed.js`)
Status for all: **Unverified against primary sources.** Owner: **[DYLAN TO WRITE: name]**. Check each against the sources suggested.

| Pick | Claim to check | Where to check |
|---|---|---|
| The Go-Betweens | Forster and McLennan met at UQ in a theatre arts course | Band or Forster's own account; UQ or SLQ pages |
| Unit (Regurgitator) | Recorded in a condemned Fortitude Valley warehouse; peaked No. 4 on ARIA albums | ARIA chart archive; official band or label page |
| Hungry Ghost (Violent Soho) | Formed 2004 in Mansfield; debuted No. 6; ARIA certification | ARIA charts and certifications page |
| Keepsake (Hatchie) | Released 21 June 2019 via Double Double Whammy, Ivy League, Heavenly | Label pages, Bandcamp |
| Odyssey Number Five (Powderfinger) | No. 1 on ARIA albums; five ARIA Awards in 2001 incl. Album of the Year | ARIA awards history page |
| Savage Garden | 1997 debut No. 1; record ten ARIA Awards in 1997 | ARIA awards history page |
| Apartment (Custard) | Released Oct 1995; No. 7 in the 1995 Hottest 100 | triple j Hottest 100 archive |
| 19 20 20 (The Grates) | Formed 2002; four 2006 Hottest 100 entries; No. 10 | triple j Hottest 100 archive |
| Brisbane Powerhouse | Tram power station from 1928; decommissioned 1971; reopened as arts centre | Brisbane Powerhouse or Brisbane City Council heritage page |
| Go Between Bridge | Named via 2009 council competition; opening date | Brisbane City Council |

(The Wikipedia-only city facts in `cities.js` are Stranglers/Nuclear Device and Razar/Brisbane punk; check them the same way: the Stranglers claim is attributed to a band member, so find that interview.)

## B. Facts from non-Wikipedia sources (spot-check)
Brisbane, Seoul and Mumbai facts cite outlets such as State Library of Queensland, Brisbane City Council, Australian Geographic, Korea Times, The Week and others. Status: **sources opened by the drafting tool; not independently re-read by a team member.** Action: each member re-reads their city's facts against the link. A fact you cannot find in its link is removed.

## C. Content that needs a person, not a document
| Item | Why it matters | How to verify | Status |
|---|---|---|---|
| Acknowledgement of Country wording (Turrbal, Yuggera/Jagera, Meanjin) | Respect and accuracy | Ask UQ's Aboriginal and Torres Strait Islander Studies Unit or an appropriate Turrbal/Yuggera-Jagera contact to read it; do not publish as "approved" until they reply | **Draft, not reviewed** |
| Meanjin meaning ("the spearhead") | Cultural accuracy | Australia Post article quoting Uncle Shannon Ruska was read on 15 Oct; confirm with the same contact | Source read; not used on screen |
| Seoul and Mumbai greetings | Native-speaker accuracy | Ask a native speaker to read each greeting | **Unverified** |
| A Brisbane-specific fact about Aboriginal music | Not in the app | Ask a Turrbal or Yuggera/Jagera body or the State Library of Queensland for a sourced line | **No fact claimed** |
| "Nearby" gigs | Curator-entered tips; Folio does not scrape listings | Check with the venue before a tip is trusted; the app says so on screen | By design unverified |

## D. Claims made in our documents
| Claim | How to verify | Status |
|---|---|---|
| "Algorithms may make it harder to find emerging Australian artists" (Music Australia, *Listening In*, 2025) | Open the actual report PDF, find the sentence and its page; quote the page number | Series page read on 15 Oct; **report itself not yet read** |
| Interview quotes (e.g. R1-P6, "more human focused") | Check each quote word for word against the transcript in `docs/research/` | Quote copied from the transcript file; recheck against the original recording or notes |
| "Six round-1 interviewees complained of algorithmic discovery" | Count in `all-interviews-deidentified.md` | Matches the pivot summary; recount before submitting |
| Test counts (25 unit tests, 31 flow checks, 12 intro checks, 20 end-to-end) | Re-run `npm test` and the scripts in `07_Engineering/e2e/` | Re-run on 15 Oct, passing |
| "65 checks on a throwaway database; 33 on the live project" | Pranav or Dylan re-run the smoke test and attach output | Last live run 12 Oct, before the roles migration; **re-run needed** |

## E. Limits we state openly
- **AI-made music cannot be detected by Folio.** We rely on a named curator's signed attestation and two independent sources. A curator could still sign falsely.
- **No stream counts or streaming-service integration**; we have not verified API access or terms.
- **Evaluation:** no sessions had run at the time of writing. Do not report results that do not exist.
