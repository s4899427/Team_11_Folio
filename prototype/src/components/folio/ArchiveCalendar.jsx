import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WEEKDAYS, monthOf, shiftMonth, monthGrid, monthsWithEditions } from "@/lib/calendar";
import { formatShort, monthKey } from "@/lib/time";
import { cn } from "@/lib/utils";

/** Archive as a month calendar: days with an Edition are links; the month's Editions are listed underneath. */
export default function ArchiveCalendar({ editions, today }) {
  const months = monthsWithEditions(editions); // newest first
  const [picked, setPicked] = useState(null);
  const month = picked && months.includes(picked) ? picked : (months[0] || monthOf(today));
  const byDate = new Map(editions.map((e) => [e.date, e]));
  const inMonth = editions.filter((e) => monthOf(e.date) === month).sort((a, b) => (a.date < b.date ? 1 : -1));
  const newest = months[0], oldest = months[months.length - 1];
  const label = monthKey(`${month}-01`);

  return (
    <div data-testid="archive-calendar">
      <div className="flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" data-testid="cal-prev" disabled={!oldest || month <= oldest}
          onClick={() => setPicked(shiftMonth(month, -1))}
          className="p-2 border border-border text-folio-cream-dim disabled:opacity-30"><ChevronLeft size={16} /></button>
        <label className="flex-1 min-w-0">
          <span className="sr-only">Jump to month</span>
          <select value={month} onChange={(e) => setPicked(e.target.value)} data-testid="cal-month"
            className="w-full bg-transparent border border-border px-3 py-2 text-sm text-folio-cream">
            {(months.length ? months : [month]).map((k) => <option key={k} value={k} className="bg-black">{monthKey(`${k}-01`)}</option>)}
          </select>
        </label>
        <button type="button" aria-label="Next month" data-testid="cal-next" disabled={!newest || month >= newest}
          onClick={() => setPicked(shiftMonth(month, 1))}
          className="p-2 border border-border text-folio-cream-dim disabled:opacity-30"><ChevronRight size={16} /></button>
      </div>

      <table className="w-full mt-4 text-center" aria-label={`Editions in ${label}`}>
        <thead><tr>{WEEKDAYS.map((d, i) => <th key={i} scope="col" className="folio-eyebrow text-folio-cream-dim/70 font-normal py-1">{d}</th>)}</tr></thead>
        <tbody>
          {monthGrid(month).map((row, r) => (
            <tr key={r}>
              {row.map((c, i) => {
                if (!c) return <td key={i} />;
                const e = byDate.get(c.iso);
                return (
                  <td key={i} className="p-0.5">
                    {e
                      ? <Link to={`/edition/${c.iso}`} aria-label={`${formatShort(c.iso)}: ${e.title}`} data-testid="cal-day"
                          className="block py-2 border border-folio-saffron/60 text-folio-saffron hover:bg-folio-saffron/10 text-sm">{c.day}</Link>
                      : <span className={cn("block py-2 text-sm text-folio-cream-dim/40", c.iso === today && "text-folio-cream-dim")}>{c.day}</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-folio-cream-dim/80 mt-2">Outlined days have an Edition. Today's Edition stays open until midnight, then locks.</p>

      <ul className="mt-4 divide-y divide-border border-y border-border">
        {inMonth.length === 0 && <li className="py-4 text-sm text-folio-cream-dim">No Editions in {label}.</li>}
        {inMonth.map((e) => (
          <li key={e.id}>
            <Link to={`/edition/${e.date}`} data-testid="archive-row" className="flex items-baseline gap-4 py-4 group">
              <span className="font-mono text-xs text-folio-cream-dim w-14 shrink-0">{e.date === today ? "Today" : formatShort(e.date)}</span>
              <span className="min-w-0">
                <span className="block folio-serif text-xl text-folio-cream group-hover:text-folio-saffron transition-colors">{e.title}</span>
                <span className="block text-xs text-folio-cream-dim mt-0.5">{e.items.length} picks · {e.curatorName}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
