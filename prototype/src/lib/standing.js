// ─────────────────────────────────────────────────────────────────
// Curator standing. Two signals, deliberately NOT a popularity count:
//
//   Discovery check: after reading an Edition, a reader says whether it
//     showed them something new. This rewards creativity (novelty to the
//     reader), not fame, and is a rate, so a small city can't be out-voted.
//   Backs: each member gets BACKS_PER_MONTH per month to back curators they
//     want to keep hearing from. No self-backs, one per curator per month.
//     This rewards passion and consistency over time.
//
// Votes decide WHO curates and for how long. They never rank picks or
// change what any reader sees inside an Edition: the "no algorithm"
// promise stays true.
//
// Every threshold below is a v1 hypothesis to tune with real usage, not
// something the research proves.
// ─────────────────────────────────────────────────────────────────

export const BACKS_PER_MONTH = 3;
export const MIN_RESPONSES_TO_SHOW = 10;   // below this, a rate is noise: don't show it
export const TIERS = [
  { id: "apprentice", label: "Apprentice", rule: "Fewer than 5 published Editions" },
  { id: "curator", label: "Curator", rule: "5 or more published Editions" },
  { id: "resident", label: "Resident", rule: "20+ Editions, 20+ discovery responses with at least half saying 'something new', and backs from 5+ different people in 90 days" },
];

export const monthOf = (iso) => iso.slice(0, 7);

/** May this person back this curator right now? Returns { ok, reason }. */
export function canBack({ voterId, curatorId, month, backs }) {
  if (!voterId) return { ok: false, reason: "Log in to back a curator." };
  if (voterId === curatorId) return { ok: false, reason: "You can't back yourself." };
  const mine = backs.filter((b) => b.voterId === voterId && b.month === month);
  if (mine.some((b) => b.curatorId === curatorId)) return { ok: false, reason: "You've already backed this curator this month." };
  if (mine.length >= BACKS_PER_MONTH) return { ok: false, reason: `You've used your ${BACKS_PER_MONTH} backs for this month.` };
  return { ok: true, reason: "" };
}

export const backsLeft = ({ voterId, month, backs }) =>
  Math.max(0, BACKS_PER_MONTH - backs.filter((b) => b.voterId === voterId && b.month === month).length);

/** Share of readers who found something new, or null when there are too few responses to mean anything. */
export function discoveryRate({ responses, foundNew }) {
  if (!responses || responses < MIN_RESPONSES_TO_SHOW) return null;
  return foundNew / responses;
}

export function tierFor({ editions = 0, responses = 0, foundNew = 0, distinctBackers90 = 0 }) {
  const rate = discoveryRate({ responses, foundNew });
  if (editions >= 20 && responses >= 20 && rate !== null && rate >= 0.5 && distinctBackers90 >= 5) return TIERS[2];
  if (editions >= 5) return TIERS[1];
  return TIERS[0];
}
