-- 003: allow Editions of up to 12 picks.
-- The original constraint allowed 5 to 7; the product rule is 8 to 12 (seed Editions keep 5 as a founding exemption).
-- Run once in the Supabase SQL editor. Safe to re-run.
alter table public.editions drop constraint if exists editions_items_check;
alter table public.editions
  add constraint editions_items_check
  check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 5 and 12);
