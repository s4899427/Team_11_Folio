#!/usr/bin/env python3
"""
Applies the small edits for near-live comments, sharing and "reading now" presence to the existing
Folio files. Run from the `prototype/` folder:

    python3 apply_live_share.py

Each edit needs its anchor text to match exactly once. If anything does not
match, NOTHING is written and the script says which edit failed (so a changed
file can never be half-patched). Safe to re-run: already-applied edits are skipped.
"""
import sys, pathlib

EDITS = [
  # (file, old, new, already-applied marker)
  ("src/lib/api.js",
   'export async function listComments(editionId) {\n'
   '  if (REMOTE && !String(editionId).startsWith("seed-")) {\n'
   '    try {\n'
   '      const rows = await rest(`comments?edition_id=eq.${editionId}&select=*&order=created_at.asc`);\n'
   '      return rows.map((r) => ({ id: r.id, author: r.author_name, body: r.body, at: r.created_at }));\n'
   '    } catch { /* fall back to local */ }\n'
   '  }',
   '/** strict: on a failed shared read, throw instead of falling back to this device\'s local list.\n'
   ' *  The open page polls with strict on, so a network blip keeps the comments already on screen. */\n'
   'export async function listComments(editionId, { strict = false } = {}) {\n'
   '  if (REMOTE && !String(editionId).startsWith("seed-")) {\n'
   '    try {\n'
   '      const rows = await rest(`comments?edition_id=eq.${editionId}&select=*&order=created_at.asc`);\n'
   '      return rows.map((r) => ({ id: r.id, author: r.author_name, body: r.body, at: r.created_at }));\n'
   '    } catch (e) { if (strict) throw e; /* otherwise fall back to local */ }\n'
   '  }',
   "{ strict = false } = {}"),

  ("src/components/folio/ItemCard.jsx",
   'import { useFolio } from "@/lib/folio-store";\n',
   'import { useFolio } from "@/lib/folio-store";\n'
   'import ShareButton from "./ShareButton";\n'
   'import { pickShareText } from "@/lib/live";\n',
   'import ShareButton from "./ShareButton";'),

  ("src/components/folio/ItemCard.jsx",
   '          <LinkChip href={findUrl(item)}>Find out more</LinkChip>\n'
   '        )}\n'
   '      </div>',
   '          <LinkChip href={findUrl(item)}>Find out more</LinkChip>\n'
   '        )}\n'
   '        {editionDate && editionDate !== "preview" && (\n'
   '          <ShareButton label="Share" title={item.title} text={pickShareText(item)} date={editionDate} className="py-1.5 min-h-0" />\n'
   '        )}\n'
   '      </div>',
   '<ShareButton label="Share" title={item.title}'),

  ("src/components/folio/EditionView.jsx",
   'import DiscoveryCheck from "./DiscoveryCheck";\n',
   'import DiscoveryCheck from "./DiscoveryCheck";\n'
   'import ShareButton from "./ShareButton";\n'
   'import { editionShareText } from "@/lib/live";\n',
   'import ShareButton from "./ShareButton";'),

  ("src/components/folio/EditionView.jsx",
   '        {!curatorCard && <p className="text-xs text-folio-cream-dim mt-4">Curated by',
   '        {edition.id !== "preview" && (\n'
   '          <div className="mt-4"><ShareButton label="Share this Edition" title={edition.title} text={editionShareText(edition)} date={edition.date} /></div>\n'
   '        )}\n'
   '        {!curatorCard && <p className="text-xs text-folio-cream-dim mt-4">Curated by',
   '<ShareButton label="Share this Edition"'),
  ("src/components/folio/EditionView.jsx",
   'import ShareButton from "./ShareButton";\n',
   'import ShareButton from "./ShareButton";\nimport ReadingNow from "./ReadingNow";\n',
   'import ReadingNow from "./ReadingNow";'),

  ("src/components/folio/EditionView.jsx",
   '        <div className="mt-8 py-5 border-y border-border folio-textile"><Countdown /></div>\n      )}\n',
   '        <div className="mt-8 py-5 border-y border-border folio-textile"><Countdown /></div>\n      )}\n'
   '      {!locked && edition.id !== "preview" && <ReadingNow editionId={edition.id} locked={locked} />}\n',
   '<ReadingNow editionId={edition.id}'),
]

APPENDS = [
  # (file, text to append at the end, already-applied marker)
  ("src/lib/api.js",
   '\n// \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 PRESENCE ("reading now") \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\n'
   '// Needs supabase/migrations/004_presence.sql. Anonymous: a random per-page-load id and an Edition id go in, a number comes out.\n'
   'export async function heartbeatReading(editionId, clientId) {\n'
   '  if (!REMOTE) return 0;\n'
   '  const n = await rest("rpc/heartbeat_reading", { method: "POST", body: { p_edition: editionId, p_client: clientId } });\n'
   '  return Number(n) || 0;\n'
   '}\n',
   "export async function heartbeatReading"),
]

def main():
    root = pathlib.Path(".")
    staged = {}
    for f, old, new, marker in EDITS:
        p = root / f
        if not p.exists():
            sys.exit(f"STOP: {f} not found. Run this from the prototype/ folder. Nothing was written.")
        text = staged.get(f, p.read_text())
        if marker in text:
            print(f"skip (already applied): {f}")
            continue
        n = text.count(old)
        if n != 1:
            sys.exit(f"STOP: expected 1 match in {f}, found {n} for:\n{old[:120]}...\nNothing was written.")
        staged[f] = text.replace(old, new)
    for f, add, marker in APPENDS:
        p = root / f
        if not p.exists():
            sys.exit(f"STOP: {f} not found. Nothing was written.")
        text = staged.get(f, p.read_text())
        if marker in text:
            print(f"skip (already applied): {f} (append)")
            continue
        staged[f] = text.rstrip("\n") + "\n" + add
    for f, text in staged.items():
        (root / f).write_text(text)
        print(f"patched: {f}")
    print("done")

if __name__ == "__main__":
    main()
