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
