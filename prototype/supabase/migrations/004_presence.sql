-- 004: "reading now" presence for today's Edition (awareness, no identity).
-- Run once in the Supabase SQL Editor. Safe to re-run.
--
-- Privacy by design:
--   * stores only (edition, random per-page-load id, last-seen time); no user id, no name, no IP
--   * the id is generated in the browser on each page load and is never saved, so it cannot
--     be used to follow anyone across visits
--   * rows older than 10 minutes are deleted on every heartbeat
--   * the table has RLS on and NO policies: browsers cannot read or write it directly,
--     they can only call heartbeat_reading(), which returns a number
--
-- Known limits (document, do not hide): anyone can call the function with many fake ids and
-- inflate the count. Acceptable for a prototype whose count carries no ranking or reward.

create table if not exists public.presence (
  edition_id uuid not null references public.editions(id) on delete cascade,
  client_id  text not null check (client_id ~ '^[A-Za-z0-9_-]{8,40}$'),
  seen_at    timestamptz not null default now(),
  primary key (edition_id, client_id)
);
alter table public.presence enable row level security;
revoke all on public.presence from anon, authenticated;

create or replace function public.heartbeat_reading(p_edition uuid, p_client text)
returns integer
language plpgsql security definer set search_path = public
as $$
declare n integer;
begin
  if p_client is null or p_client !~ '^[A-Za-z0-9_-]{8,40}$' then
    raise exception 'bad client id' using errcode = '22023';
  end if;
  -- only an Edition that is open right now (its own city's today) can have readers
  if not exists (select 1 from editions e where e.id = p_edition and e.status = 'published'
                 and e.edition_date = public.city_today(e.city)) then
    return 0;
  end if;
  insert into presence (edition_id, client_id, seen_at) values (p_edition, p_client, now())
    on conflict (edition_id, client_id) do update set seen_at = excluded.seen_at;
  delete from presence where seen_at < now() - interval '10 minutes';
  select count(*) into n from presence where edition_id = p_edition and seen_at > now() - interval '30 seconds';
  return n;
end $$;
revoke all on function public.heartbeat_reading(uuid, text) from public;
grant execute on function public.heartbeat_reading(uuid, text) to anon, authenticated;
