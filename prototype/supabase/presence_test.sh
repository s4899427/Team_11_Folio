#!/usr/bin/env bash
# Tests migration 004 (presence) on a throwaway local Postgres that already has
# rls_stub.sql, schema.sql and migrations 002-004 loaded.
# Usage: PGHOST=... PGPORT=... PGUSER=postgres PGDATABASE=... ./presence_test.sh
set -u
P="psql -X -q -At -v ON_ERROR_STOP=1"
pass=0; fail=0
ok()  { echo "PASS $1"; pass=$((pass+1)); }
bad() { echo "FAIL $1"; fail=$((fail+1)); }
as() { local role="$1" uid="$2" sql="$3"; $P -c "set role $role; select set_config('request.jwt.claim.sub','$uid',false); $sql" 2>&1 | tail -n +2; return ${PIPESTATUS[0]}; }
expect_ok()   { local n="$1"; shift; if out=$(as "$@" 2>&1); then ok "$n"; else bad "$n :: $out"; fi; }
expect_fail() { local n="$1"; shift; if out=$(as "$@" 2>&1); then bad "$n (should have failed)"; else ok "$n"; fi; }
expect_val()  { local n="$1" want="$2"; shift 2; out=$(as "$@" 2>&1 | tail -n 1); if [ "$out" = "$want" ]; then ok "$n"; else bad "$n :: got '$out' want '$want'"; fi; }

C=00000000-0000-0000-0000-0000000000c1
$P <<SQL
truncate public.presence, public.comments, public.editions, public.profiles cascade;
delete from auth.users;
insert into auth.users (id,email,raw_user_meta_data) values ('$C','c@t','{"name":"Cy","role":"curator","city":"brisbane"}');
insert into public.profiles (id,name,city,role) values ('$C','Cy','brisbane','curator') on conflict do nothing;
update public.profiles set role='curator' where id='$C';
SQL
items5="'[{\"a\":1},{\"a\":2},{\"a\":3},{\"a\":4},{\"a\":5}]'::jsonb"
$P -c "insert into public.editions (id,city,edition_date,title,items,curator_id,curator_name) values
 ('11111111-1111-1111-1111-111111111111','brisbane',public.city_today('brisbane'),'Today',$items5,'$C','x'),
 ('22222222-2222-2222-2222-222222222222','brisbane',public.city_today('brisbane')+1,'Tomorrow',$items5,'$C','x'),
 ('33333333-3333-3333-3333-333333333333','brisbane',public.city_today('brisbane')-2,'Past',$items5,'$C','x');"
TODAY=11111111-1111-1111-1111-111111111111; TOMORROW=22222222-2222-2222-2222-222222222222; PAST=33333333-3333-3333-3333-333333333333

echo "── presence ──"
expect_val  "anon heartbeat on today's Edition counts the caller"        "1" anon "" "select public.heartbeat_reading('$TODAY','AAAAAAAAAAAA')"
expect_val  "a second reader makes it 2"                                 "2" anon "" "select public.heartbeat_reading('$TODAY','BBBBBBBBBBBB')"
expect_val  "the same reader heartbeating again is not double counted"   "2" anon "" "select public.heartbeat_reading('$TODAY','AAAAAAAAAAAA')"
expect_val  "signed-in users can call it too"                            "3" authenticated "$C" "select public.heartbeat_reading('$TODAY','CCCCCCCCCCCC')"
expect_val  "tomorrow's (unpublished-to-public) Edition has no readers"  "0" anon "" "select public.heartbeat_reading('$TOMORROW','AAAAAAAAAAAA')"
expect_val  "a locked (past) Edition has no readers"                     "0" anon "" "select public.heartbeat_reading('$PAST','AAAAAAAAAAAA')"
expect_val  "an unknown Edition returns 0, no error"                     "0" anon "" "select public.heartbeat_reading('99999999-9999-9999-9999-999999999999','AAAAAAAAAAAA')"
expect_fail "too-short client id is rejected"                                anon "" "select public.heartbeat_reading('$TODAY','short')"
expect_fail "client id with odd characters is rejected"                      anon "" "select public.heartbeat_reading('$TODAY','bad id with spaces!!')"
expect_fail "null client id is rejected"                                     anon "" "select public.heartbeat_reading('$TODAY', null)"

echo "── privacy and access ──"
expect_fail "anon cannot read the presence table"                            anon "" "select * from public.presence"
expect_fail "signed-in users cannot read the presence table"                 authenticated "$C" "select * from public.presence"
expect_fail "anon cannot insert directly"                                    anon "" "insert into public.presence (edition_id, client_id) values ('$TODAY','DIRECTINSERT1')"
expect_fail "anon cannot delete directly"                                    anon "" "delete from public.presence"
expect_val  "table stores no user id, name or ip (columns)"  "edition_id,client_id,seen_at" postgres "" "select string_agg(column_name, ',' order by ordinal_position) from information_schema.columns where table_schema='public' and table_name='presence'"

echo "── freshness and cleanup ──"
$P -c "update public.presence set seen_at = now() - interval '45 seconds' where client_id='BBBBBBBBBBBB';"
expect_val  "a reader silent for 45s no longer counts (window is 30s)"   "2" anon "" "select public.heartbeat_reading('$TODAY','AAAAAAAAAAAA')"
$P -c "update public.presence set seen_at = now() - interval '11 minutes' where client_id='CCCCCCCCCCCC';"
anon_ping=$(as anon "" "select public.heartbeat_reading('$TODAY','AAAAAAAAAAAA')" | tail -n1)
left=$($P -c "select count(*) from public.presence where client_id='CCCCCCCCCCCC'")
[ "$left" = "0" ] && ok "rows older than 10 minutes are deleted on heartbeat" || bad "old row not deleted ($left)"
$P -c "delete from public.editions where id='$TODAY';" >/dev/null
rows=$($P -c "select count(*) from public.presence where edition_id='$TODAY'")
[ "$rows" = "0" ] && ok "cascade confirmed: no orphan presence rows" || bad "orphan rows: $rows"

echo; echo "passed: $pass  failed: $fail"; [ "$fail" = "0" ]
