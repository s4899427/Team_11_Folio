-- ─────────────────────────────────────────────────────────────────
-- Folio: Supabase schema (run once in the SQL editor of a new project).
--
-- Rules enforced by the DATABASE, not just the UI:
--   * Location-based: every Edition, tip and curator belongs to a city, and the
--     city's own time zone decides "today" and the midnight lock.
--   * One Edition per city per day (unique city + edition_date).
--   * Editions are hidden until their city-date; a curator sees their own staged ones.
--   * Midnight lock: an Edition cannot be updated or deleted once its day has passed.
--   * Only profiles with role = 'curator' may publish, and only for their own city.
--     Nobody can promote themselves (role is not client-updatable; see bottom).
--   * No likes table exists, by design. Comments are chronological only.
--   * Curator standing uses two signals, neither of which is popularity:
--       discovery  one yes/no per reader per Edition ("did it show you something new?")
--       backs      3 per member per month, no self-backs, one per curator per month
--     Neither can reorder or hide anything inside an Edition.
-- ─────────────────────────────────────────────────────────────────

create extension if not exists pgcrypto;

create table if not exists public.cities (
  id text primary key,
  name text not null,
  tz text not null
);
insert into public.cities (id, name, tz) values
  ('brisbane', 'Brisbane', 'Australia/Brisbane'),
  ('seoul',    'Seoul',    'Asia/Seoul'),
  ('mumbai',   'Mumbai',   'Asia/Kolkata')
on conflict (id) do nothing;

-- "Today" in a city's own time zone.
create or replace function public.city_today(p_city text) returns date
language sql stable as $$
  select (now() at time zone coalesce((select tz from public.cities where id = p_city), 'Australia/Brisbane'))::date
$$;

-- Existing databases: alter table public.profiles add column if not exists avatar text not null default '' check (char_length(avatar) <= 150000);
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  suburb text not null default '',
  city text not null default 'brisbane' references public.cities(id),
  bio text not null default '' check (char_length(bio) <= 280),
  -- Stopgap: a 256px JPEG data URL made in the browser. Proper home is Supabase Storage.
  avatar text not null default '' check (char_length(avatar) <= 150000),
  role text not null default 'listener' check (role in ('listener','artist','curator')),
  created_at timestamptz not null default now()
);

-- New auth user -> profile. Self-service roles are limited to listener/artist.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, suburb, city, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'suburb',''),
    coalesce((select id from public.cities where id = new.raw_user_meta_data->>'city'), 'brisbane'),
    case when new.raw_user_meta_data->>'role' = 'artist' then 'artist' else 'listener' end
  );
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_curator() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'curator')
$$;
create or replace function public.my_city() returns text
language sql stable security definer set search_path = public as $$
  select city from public.profiles where id = auth.uid()
$$;

create table if not exists public.editions (
  id uuid primary key default gen_random_uuid(),
  city text not null default 'brisbane' references public.cities(id),
  edition_date date not null,
  title text not null check (char_length(title) between 1 and 80),
  blurb text not null default '',
  items jsonb not null check (jsonb_typeof(items) = 'array' and jsonb_array_length(items) between 5 and 12),
  curator_id uuid not null references public.profiles(id),
  curator_name text not null,
  status text not null default 'published',
  created_at timestamptz not null default now(),
  unique (city, edition_date)
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid not null references public.editions(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  author_name text not null,
  body text not null check (char_length(body) between 1 and 500),
  created_at timestamptz not null default now()
);

create table if not exists public.pitches (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.profiles(id),
  artist_name text not null,
  curator_id uuid references public.profiles(id),   -- null = the Folio Desk (any curator)
  title text not null,
  link text not null,
  note text not null default '' check (char_length(note) <= 500),
  created_at timestamptz not null default now()
);

create table if not exists public.gig_tips (
  id uuid primary key default gen_random_uuid(),
  city text not null default 'brisbane' references public.cities(id),
  curator_id uuid not null references public.profiles(id),
  curator_name text not null,
  act text not null, venue text not null,
  starts_on date not null, time text not null default '', link text not null default '',
  created_at timestamptz not null default now()
);

-- Reader signal: did this Edition show you something new? One answer per reader per Edition.
create table if not exists public.discovery (
  edition_id uuid not null references public.editions(id) on delete cascade,
  voter_id uuid not null references public.profiles(id),
  found_new boolean not null,
  created_at timestamptz not null default now(),
  primary key (edition_id, voter_id)
);

-- Backs: 3 per member per month, one per curator per month, never yourself.
create table if not exists public.backs (
  voter_id uuid not null references public.profiles(id),
  curator_id uuid not null references public.profiles(id),
  month text not null check (month ~ '^\d{4}-\d{2}$'),
  created_at timestamptz not null default now(),
  primary key (voter_id, curator_id, month),
  check (voter_id <> curator_id)
);

-- Anyone can apply to curate a city; the Folio team reads these in the dashboard and approves.
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  applicant_id uuid not null references public.profiles(id),
  applicant_name text not null,
  city text not null,
  why text not null check (char_length(why) between 20 and 600),
  link text not null default '',
  created_at timestamptz not null default now()
);

alter table public.cities       enable row level security;
alter table public.profiles     enable row level security;
alter table public.editions     enable row level security;
alter table public.comments     enable row level security;
alter table public.pitches      enable row level security;
alter table public.gig_tips     enable row level security;
alter table public.discovery    enable row level security;
alter table public.backs        enable row level security;
alter table public.applications enable row level security;

create policy "cities readable" on public.cities for select using (true);

-- profiles: names are public (curators are named humans); users edit only name/suburb/bio
create policy "profiles readable"  on public.profiles for select using (true);
create policy "profile own update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
revoke update on public.profiles from anon, authenticated;
grant update (name, suburb, bio, avatar) on public.profiles to authenticated;

-- editions
create policy "editions public once their day arrives" on public.editions for select
  using (status = 'published' and (edition_date <= public.city_today(city) or curator_id = auth.uid()));
create policy "curators publish own, own city" on public.editions for insert
  with check (public.is_curator() and curator_id = auth.uid() and city = public.my_city() and edition_date >= public.city_today(city));
create policy "curators edit own until the day locks" on public.editions for update
  using (public.is_curator() and curator_id = auth.uid() and edition_date >= public.city_today(city))
  with check (public.is_curator() and curator_id = auth.uid() and city = public.my_city() and edition_date >= public.city_today(city));
create policy "curators delete own until the day locks" on public.editions for delete
  using (public.is_curator() and curator_id = auth.uid() and edition_date > public.city_today(city));

-- comments: anyone can read; signed-in users post as themselves, only on that city's current Edition
create policy "comments readable" on public.comments for select using (true);
create policy "comment as self on today" on public.comments for insert
  with check (
    auth.uid() = author_id
    and exists (select 1 from public.editions e where e.id = edition_id and e.edition_date = public.city_today(e.city))
  );

-- pitches
create policy "artists send pitches" on public.pitches for insert
  with check (auth.uid() = artist_id and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'artist'));
create policy "curators read pitches" on public.pitches for select
  using (public.is_curator() and (curator_id is null or curator_id = auth.uid()));
create policy "artists read own pitches" on public.pitches for select using (auth.uid() = artist_id);

-- gig tips: public read, curator write for their own city
create policy "tips readable" on public.gig_tips for select using (true);
create policy "curators add tips" on public.gig_tips for insert
  with check (public.is_curator() and curator_id = auth.uid() and city = public.my_city());

-- discovery: answer as yourself, once, never for your own Edition; you can read only your own answers
create policy "discovery as self, not own edition" on public.discovery for insert
  with check (
    auth.uid() = voter_id
    and not exists (select 1 from public.editions e where e.id = edition_id and e.curator_id = auth.uid())
  );
create policy "discovery read own" on public.discovery for select using (auth.uid() = voter_id);

-- backs: as yourself, never for yourself, max 3 per month. Your own backs are visible to you only.
create policy "back as self within limit" on public.backs for insert
  with check (
    auth.uid() = voter_id and voter_id <> curator_id
    and (select count(*) from public.backs b where b.voter_id = auth.uid() and b.month = backs.month) < 3
    and exists (select 1 from public.profiles p where p.id = curator_id and p.role = 'curator')
  );
create policy "backs read own" on public.backs for select using (auth.uid() = voter_id);

-- applications: apply as yourself; only you can read your own (the team reads all in the dashboard)
create policy "apply as self" on public.applications for insert with check (auth.uid() = applicant_id);
create policy "applications read own" on public.applications for select using (auth.uid() = applicant_id);

-- Aggregate standing for a curator card. Counts only, never who answered or backed.
-- distinct_backers_90 is returned only to the curator themselves.
create or replace function public.curator_stats(p_curator uuid) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'editions',  (select count(*) from editions e where e.curator_id = p_curator and e.edition_date <= city_today(e.city)),
    'responses', (select count(*) from discovery d join editions e on e.id = d.edition_id where e.curator_id = p_curator),
    'found_new', (select count(*) from discovery d join editions e on e.id = d.edition_id where e.curator_id = p_curator and d.found_new),
    'distinct_backers_90', case when auth.uid() = p_curator
      then (select count(distinct voter_id) from backs b where b.curator_id = p_curator and b.created_at > now() - interval '90 days')
      else null end
  )
$$;
grant execute on function public.curator_stats(uuid) to anon, authenticated;

-- ── Artist and fan connection ──
-- A fan connects to an artist (the fan chooses this, and the artist can see the fan's name).
-- Connected fans see the artist's short dispatches and may ask one question per day.
-- No public follower counts, no open messaging: the artist replies to a question, and only
-- the asker sees the reply.
create table if not exists public.connections (
  fan_id uuid not null references public.profiles(id) on delete cascade,
  artist_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (fan_id, artist_id),
  check (fan_id <> artist_id)
);
create table if not exists public.dispatches (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid not null references public.profiles(id) on delete cascade,
  artist_name text not null,
  body text not null check (char_length(body) between 1 and 280),
  link text not null default '',
  created_at timestamptz not null default now()
);
create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  fan_id uuid not null references public.profiles(id) on delete cascade,
  fan_name text not null,
  artist_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 200),
  answer text check (answer is null or char_length(answer) between 1 and 300),
  answered_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.connections enable row level security;
alter table public.dispatches  enable row level security;
alter table public.questions   enable row level security;

create policy "connect as self to an artist" on public.connections for insert
  with check (auth.uid() = fan_id and exists (select 1 from public.profiles p where p.id = artist_id and p.role = 'artist'));
create policy "connections visible to both sides" on public.connections for select
  using (auth.uid() = fan_id or auth.uid() = artist_id);
create policy "fan can disconnect" on public.connections for delete using (auth.uid() = fan_id);

create policy "artists post dispatches" on public.dispatches for insert
  with check (auth.uid() = artist_id and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'artist'));
create policy "dispatches for the artist and connected fans" on public.dispatches for select
  using (auth.uid() = artist_id or exists (select 1 from public.connections c where c.fan_id = auth.uid() and c.artist_id = dispatches.artist_id));
create policy "artists delete own dispatches" on public.dispatches for delete using (auth.uid() = artist_id);

create policy "connected fans ask one question a day" on public.questions for insert
  with check (
    auth.uid() = fan_id and answer is null
    and exists (select 1 from public.connections c where c.fan_id = auth.uid() and c.artist_id = questions.artist_id)
    and (select count(*) from public.questions q where q.fan_id = auth.uid() and q.artist_id = questions.artist_id and q.created_at > now() - interval '1 day') < 1
  );
create policy "questions visible to asker and artist" on public.questions for select
  using (auth.uid() = fan_id or auth.uid() = artist_id);
create policy "artist answers own questions" on public.questions for update
  using (auth.uid() = artist_id) with check (auth.uid() = artist_id);
revoke update on public.questions from anon, authenticated;
grant update (answer, answered_at) on public.questions to authenticated;

-- ── Promote a founding curator (run manually, once per person) ──
--   update public.profiles set role = 'curator', city = 'brisbane' where id = '<user uuid from Authentication > Users>';
-- To open a new city: insert into public.cities (id, name, tz) values ('tokyo','Tokyo','Asia/Tokyo');
-- and add the city to src/lib/cities.js.

-- ════════ Round 2: roles, admin, delete account (also in migrations/002_roles_admin.sql) ════════
-- Folio round 2: admin role, curator application decisions, delete my account.
-- Safe to run more than once. Paste into Supabase > SQL Editor > Run.

-- 1. Folio team flag. Not client-updatable (profiles has column-level grants: name, suburb, bio, avatar only).
alter table public.profiles add column if not exists is_admin boolean not null default false;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = auth.uid()), false)
$$;
grant execute on function public.is_admin() to authenticated;

-- 2. Applications get a status, and only the team can read all of them.
alter table public.applications add column if not exists status text not null default 'pending'
  check (status in ('pending','approved','declined'));
alter table public.applications add column if not exists decided_by uuid references public.profiles(id);
alter table public.applications add column if not exists decided_at timestamptz;

drop policy if exists "apply as self" on public.applications;
create policy "apply as self" on public.applications for insert
  with check (auth.uid() = applicant_id and status = 'pending');
drop policy if exists "admins read applications" on public.applications;
create policy "admins read applications" on public.applications for select using (public.is_admin());
revoke update, delete on public.applications from anon, authenticated;

-- 3. The only way to approve: a function that checks the caller is on the team.
--    Approving makes the applicant a curator of the matching city (if Folio has that city).
create or replace function public.decide_application(p_id uuid, p_approve boolean) returns jsonb
language plpgsql security definer set search_path = public as $$
declare a public.applications; c text;
begin
  if not public.is_admin() then raise exception 'Only the Folio team can decide applications' using errcode = '42501'; end if;
  select * into a from public.applications where id = p_id for update;
  if not found then raise exception 'Application not found'; end if;
  if a.status <> 'pending' then raise exception 'Already decided'; end if;
  if a.applicant_id = auth.uid() then raise exception 'You cannot decide your own application' using errcode = '42501'; end if;
  update public.applications
     set status = case when p_approve then 'approved' else 'declined' end, decided_by = auth.uid(), decided_at = now()
   where id = p_id;
  if p_approve then
    select id into c from public.cities where lower(id) = lower(a.city) or lower(name) = lower(a.city) limit 1;
    update public.profiles set role = 'curator', city = coalesce(c, city) where id = a.applicant_id;
  end if;
  return jsonb_build_object('status', case when p_approve then 'approved' else 'declined' end);
end $$;
grant execute on function public.decide_application(uuid, boolean) to authenticated;

-- 4. Delete my account. Listeners, artists and guests only: curators and the team have published
--    Editions that must stay in the archive, so the team removes those by hand.
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
declare me public.profiles;
begin
  select * into me from public.profiles where id = auth.uid();
  if not found then raise exception 'Not signed in' using errcode = '42501'; end if;
  if me.role = 'curator' or me.is_admin then
    raise exception 'Curators and the Folio team: ask the team to remove your account, so published Editions stay intact' using errcode = '42501';
  end if;
  delete from public.comments     where author_id = me.id;
  delete from public.pitches      where artist_id = me.id;
  delete from public.discovery    where voter_id  = me.id;
  delete from public.backs        where voter_id  = me.id;
  delete from public.applications where applicant_id = me.id;
  delete from auth.users where id = me.id;   -- profiles, connections, dispatches, questions cascade
end $$;
grant execute on function public.delete_my_account() to authenticated;

-- 5. Make a Folio team member (run by hand, once per person; use their own account's uuid from Authentication > Users):
--    update public.profiles set is_admin = true where id = '<uuid>';
