# Ethics framework: how we apply it, and our pre-filled draft

The brief asks for "a dedicated wiki page assessing the ethical risks and implications of your project, using an ethics framework (for example Loke and Matthews 2020) or the Ethical Disclaimer canvas at ethicsfordesigners.com". We use the **Ethical Disclaimer** method from the Ethics for Designers Toolkit. Its six steps below are paraphrased from the method page (https://everydayethics.uxp2.com/methods/ethical-disclaimer/, checked 14 Oct 2026). The page does not name the canvas sections beyond a left and a right area for sorting situations by whether the team takes responsibility, so **check the real worksheet before you copy this onto it**.

We have **not** verified the content of Loke and Matthews (2020) and do not cite it. If you want to use it as a second lens, take the full reference from the unit reading list.

## Part A. Run the workshop (60 minutes, all three members, tonight or tomorrow)
Materials: the Ethical Disclaimer worksheet (download from the toolkit), sticky notes, pens, a phone for photos, the draft in Part B.

1. **Describe the context (5 min).** One person reads Part B step 1 aloud. Edit until everyone agrees.
2. **List stakeholders (10 min).** Each person writes stakeholders on sticky notes, direct (users, curators, artists, the team) and indirect (venues, First Nations communities, hosts, future maintainers). Compare with the draft; add what is missing.
3. **Write intentions (5 min).** Users, context, purpose, in one sentence each.
4. **Imagine unethical situations (20 min).** For each stakeholder, silently write on sticky notes: "How could Folio harm or wrong this person?" Aim for 3 or more per stakeholder. Then compare with the draft table.
5. **Sort and justify (15 min).** Move each situation to "we take responsibility" or "we do not / cannot, and here is why". Write the justification on the note. Use the draft's suggested column as a starting point and argue with it.
6. **Update plan (5 min).** Agree when you will revisit it (after the evaluation sessions, and again before 26 Oct). The method calls the disclaimer a living document.

**Evidence to keep (this is what a marker sees):** a photo of the filled worksheet, the date, who attended, what changed after the discussion, and one change made to the app or the evaluation protocol because of the exercise. Put the photo and a short written account on the wiki Ethical Considerations page.

## Part B. Pre-filled draft (REVIEW: drafted by Claude from what we know; the team must challenge and own it)

**1. Context.** Folio is a mobile-first web app giving each city one human-picked music Edition per day. Live in Brisbane. Used asynchronously on phones, sometimes at venues. Roles: guest, member, artist, curator, Folio team. Prototype for a university course, built by three students, hosted on free tiers (GitHub Pages, Supabase).

**2. Stakeholders.**
- *Direct:* listeners and guests; artists (including emerging artists); curators; Folio team members; research participants.
- *Indirect:* venues and gig organisers; Traditional Custodians and First Nations musicians and communities; friends and family of users who appear in comments or bios; platform hosts (GitHub, Supabase); future maintainers; teaching staff who assess the project.

**3. Intentions.** Users: people in Brisbane, especially newcomers, who want to find local music. Context: daily, short, on a phone, sometimes near a venue. Purpose: discovery through an accountable human, with extra visibility for new local artists, without popularity ranking or tracking.

**4 and 5. Unethical situations and who is responsible (suggested sort; the team decides).**

| # | Stakeholder | How Folio could harm or wrong them | Suggested: we take responsibility? | What we do or would do |
|---|---|---|---|---|
| 1 | Listeners | A few curators narrow taste; "human picked" hides bias | Yes | Named curators; reasons and sources on every pick; Discovery check; curators approved by the team; mix rule keeps familiar and new together |
| 2 | Listeners | Name, suburb, bio and picture are publicly readable | Yes | All optional except name; guests give a first name only; disclosed in the privacy register; consider hiding suburb |
| 3 | Listeners | Location tracked | Yes | Opt-in, in the browser only, never stored |
| 4 | Listeners | Under-18 users (age not collected) | Partly | We do not collect age; no direct messages; state this limit; recommend an age gate before any real release |
| 5 | Listeners | Feeling watched or pressured by social signals | Yes | No likes, counts or rankings; comments never reorder anything |
| 6 | Artists | Curators favour friends; pay-to-play perception | Yes | Pitches go to a named curator; no payment features; curators declare a conflict when picking their own or friends' music **[add this rule]** |
| 7 | Artists | Unfair exclusion because of the new-artist quota | Partly | Quota is 2 to 4 of 8 to 12, a judgement we will test; no artist is guaranteed a slot |
| 8 | Artists | Harassment through fan questions | Yes | One question a day, private reply, fan must connect first and is named to the artist |
| 9 | Artists | Their music linked without consent | Partly | We link to public sources only and do not host audio; an artist can ask us to remove a pick |
| 10 | Curators | Burnout from a daily obligation; legal exposure if a Liner Note fact is wrong | Yes | One day each, not every day; sources required; the Folio Desk covers gaps; corrections process **[add]** |
| 11 | Folio team | Misuse of admin power (approving friends, reading applications) | Yes | Team cannot decide their own application; decisions are recorded with who and when; flag set only in the database |
| 12 | First Nations people and communities | Acknowledgement of Country as tokenism; using Indigenous art or language without permission; mislabelling First Nations artists as "emerging" | Yes | Acknowledgement text reviewed with an appropriate person before the tradeshow; no Indigenous-style art without permission and credit; see the art note in the decision log |
| 13 | People in other cities (Seoul, Mumbai) | Greetings and facts in languages the team cannot check | Yes | Marked draft; unreviewed text hidden for non-live cities until native speakers review |
| 14 | Venues and organisers | Wrong gig information; unfair promotion | Yes | Gig tips come from curators; the planned verification step is not built, so Nearby is labelled as curator tips |
| 15 | Research participants | Being identified; unclear consent; recordings kept | Yes | Codes only; consent first; no names in the repo; names remain in old git history (the team chose not to rewrite it) **[confirm with tutor]** |
| 16 | Hosts and future maintainers | Data on third-party servers whose region we have not confirmed; no incident process | Partly | State it; use only what is needed; no sensitive data collected |
| 17 | Everyone | AI-written code or documents containing errors or invented facts | Yes | Every AI use disclosed (`AI_USE.md`); every cited source checked by a human |
| 18 | Teaching staff | Project presented as validated when it is not | Yes | We label findings as formative and list limits |

**6. Update plan.** Revisit after the evaluation sessions; add situations the participants raise; review before 26 Oct 3:00 pm.

## Part C. How this goes on the wiki page
1. Short framing: which method, why (it asks what we will take responsibility for, which fits a design with named human curators).
2. The filled worksheet (photo) and the table above, edited by the team.
3. Winner (1980) and Akrich (1992): which design decisions are political (no likes; curator approval; the script of read, react, close), and what we did about them.
4. The Facebook Beacon lesson from the unit: nothing is posted about listening; saves are private.
5. What changed because of the ethics exercise, and what we did not fix (with reasons).
6. Link to the data and privacy register.
