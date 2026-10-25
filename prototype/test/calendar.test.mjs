import test from "node:test";
import assert from "node:assert/strict";
import { monthOf, shiftMonth, monthGrid, monthsWithEditions } from "../src/lib/calendar.js";

test("month keys shift across year boundaries", () => {
  assert.equal(shiftMonth("2026-01", -1), "2025-12");
  assert.equal(shiftMonth("2026-12", 1), "2027-01");
  assert.equal(shiftMonth("2026-10", 0), "2026-10");
  assert.equal(monthOf("2026-10-24"), "2026-10");
});

test("month grid is Monday-first, padded to whole weeks, with every day once", () => {
  const g = monthGrid("2026-10"); // 1 Oct 2026 is a Thursday
  assert.ok(g.every((r) => r.length === 7));
  assert.equal(g[0].findIndex((c) => c && c.day === 1), 3);
  const days = g.flat().filter(Boolean);
  assert.equal(days.length, 31);
  assert.equal(days[30].iso, "2026-10-31");
  assert.equal(monthGrid("2026-02").flat().filter(Boolean).length, 28);
  assert.equal(monthGrid("2028-02").flat().filter(Boolean).length, 29);
});

test("months with Editions are distinct and newest first", () => {
  const eds = [{ date: "2026-09-30" }, { date: "2026-10-02" }, { date: "2026-10-01" }, { date: "2026-08-15" }];
  assert.deepEqual(monthsWithEditions(eds), ["2026-10", "2026-09", "2026-08"]);
  assert.deepEqual(monthsWithEditions([]), []);
});
