#!/usr/bin/env bash
# Tests the database rules (schema.sql) on a throwaway local Postgres.
# Needs a Postgres with the schema loaded and a stand-in for Supabase's auth schema
# (auth.users + auth.uid() reading request.jwt.claim.sub). See submission/07_Engineering/SUPABASE_SETUP.md.
# Usage: PGHOST=... PGPORT=... PGUSER=postgres ./rls_test.sh
set -u
P="psql -X -q -At -v ON_ERROR_STOP=1"
pass=0; fail=0
ok()   { echo "PASS $1"; pass=$((pass+1)); }
bad()  { echo "FAIL $1"; fail=$((fail+1)); }
# run SQL as a role + user; prints output; returns psql exit status
as() { local role="$1" uid="$2" sql="$3"; $P -c "set role $role; select set_config('request.jwt.claim.sub','$uid',false); $sql" 2>&1 | tail -n +2; return ${PIPESTATUS[0]}; }
expect_ok()   { local n="$1"; shift; if out=$(as "$@" 2>&1); then ok "$n"; else bad "$n :: $out"; fi; }
expect_fail() { local n="$1"; shift; if out=$(as "$@" 2>&1); then bad "$n (should have failed)"; else ok "$n"; fi; }
expect_val()  { local n="$1" want="$2"; shift 2; out=$(as "$@" 2>&1 | tail -n 1); if [ "$out" = "$want" ]; then ok "$n"; else bad "$n :: got '$out' want '$want'"; fi; }

$P <<'SQL'
truncate public.questions, public.dispatches, public.connections, public.backs, public.discovery, public.comments, public.pitches, public.gig_tips, public.applications, public.editions, public.profiles cascade;
delete from auth.users;
insert into auth.users (id,email,raw_user_meta_data) values
 ('00000000-0000-0000-0000-00000000000a','a@t','{"name":"Ann","role":"listener","city":"brisbane"}'),
 ('00000000-0000-0000-0000-00000000000b','b@t','{"name":"Bo","role":"artist","city":"brisbane"}'),
 ('00000000-0000-0000-0000-00000000000c','c@t','{"name":"Cy","role":"curator","city":"brisbane"}'),
 ('00000000-0000-0000-0000-00000000000d','d@t','{"name":"Dee","role":"listener","city":"seoul"}'),
 ('00000000-0000-0000-0000-00000000000e','e@t','{"name":"Eli","role":"listener","city":"brisbane"}'),
 ('00000000-0000-0000-0000-00000000000f','f@t','{"name":"Fay","role":"listener","city":"brisbane"}'),
 ('00000000-0000-0000-0000-000000000010','g@t','{"name":"Gus","role":"listener","city":"brisbane"}');
SQL
A=00000000-0000-0000-0000-00000000000a; B=00000000-0000-0000-0000-00000000000b; C=00000000-0000-0000-0000-00000000000c
D=00000000-0000-0000-0000-00000000000d; E=00000000-0000-0000-0000-00000000000e; F=00000000-0000-0000-0000-00000000000f; G=00000000-0000-0000-0000-000000000010
# the trigger is not installed on the stub's auth.users in some setups; make sure profiles exist
$P -c "insert into public.profiles (id,name,city,role) select id, raw_user_meta_data->>'name', coalesce(raw_user_meta_data->>'city','brisbane'), case when raw_user_meta_data->>'role'='artist' then 'artist' else 'listener' end from auth.users on conflict do nothing;"
# promote curators (done by the Folio team in the dashboard)
$P -c "update public.profiles set role='curator' where id in ('$C','$D'); update public.profiles set role='curator' where id in ('$E','$F');"
$P -c "update public.profiles set role='listener' where id in ('$E','$F');"   # E/F stay listeners except where promoted below

items5="'[{\"a\":1},{\"a\":2},{\"a\":3},{\"a\":4},{\"a\":5}]'::jsonb"
items4="'[{\"a\":1},{\"a\":2},{\"a\":3},{\"a\":4}]'::jsonb"
TODAY_BNE=$($P -c "select public.city_today('brisbane')")
# $2 is a raw SQL date expression
ins() { echo "insert into public.editions (city,edition_date,title,items,curator_id,curator_name) values ('$1',$2,'T',$3,'$4','x');"; }

echo "── editions ──"
expect_ok   "curator publishes for tomorrow in own city"        authenticated $C "$(ins brisbane "public.city_today('brisbane')+1" "$items5" $C)"
expect_ok   "curator publishes for today in own city"            authenticated $C "$(ins brisbane "public.city_today('brisbane')" "$items5" $C)"
expect_fail "listener cannot publish"                            authenticated $A "$(ins brisbane "public.city_today('brisbane')+2" "$items5" $A)"
expect_fail "curator cannot publish for another city"            authenticated $C "$(ins seoul "public.city_today('brisbane')+2" "$items5" $C)"
expect_fail "curator cannot publish in the past"                 authenticated $C "$(ins brisbane "public.city_today('brisbane')-1" "$items5" $C)"
expect_fail "4 picks rejected (need 5 to 12)"                     authenticated $C "$(ins brisbane "public.city_today('brisbane')+3" "$items4" $C)"
$P -c "update public.profiles set role='curator' where id='$E';"
expect_fail "second curator cannot claim the same day"           authenticated $E "$(ins brisbane "public.city_today('brisbane')" "$items5" $E)"
expect_fail "curator cannot publish as someone else"             authenticated $C "$(ins brisbane "public.city_today('brisbane')+4" "$items5" $E)"
expect_val  "anon sees today's edition but not tomorrow's"  "1"  anon "" "select count(*) from public.editions where city='brisbane'"
expect_val  "the owner sees today's and their staged one"   "2"  authenticated $C "select count(*) from public.editions where city='brisbane'"

echo "── midnight lock ──"
$P -c "insert into public.editions (city,edition_date,title,items,curator_id,curator_name) values ('brisbane',public.city_today('brisbane')-2,'Old',$items5,'$C','x');"
expect_val  "cannot update a locked (past) edition"        "0"   authenticated $C "with u as (update public.editions set title='hacked' where title='Old' returning 1) select count(*) from u"
expect_val  "cannot delete a locked (past) edition"        "0"   authenticated $C "with d as (delete from public.editions where title='Old' returning 1) select count(*) from d"
expect_val  "can update today's edition before it locks"   "1"   authenticated $C "with u as (update public.editions set title='Edited' where edition_date=public.city_today('brisbane') returning 1) select count(*) from u"

echo "── city time zones ──"
expect_val  "Brisbane today = UTC+10" "$($P -c "select (now() at time zone 'Australia/Brisbane')::date")" authenticated $A "select public.city_today('brisbane')"
expect_val  "unknown city falls back to Brisbane time"  "$TODAY_BNE" authenticated $A "select public.city_today('nowhere')"

echo "── comments ──"
TODAY_ED=$($P -c "select id from public.editions where edition_date=public.city_today('brisbane') and city='brisbane'")
OLD_ED=$($P -c "select id from public.editions where title='Old'")
expect_ok   "reader comments on today's edition"            authenticated $A "insert into public.comments (edition_id,author_id,author_name,body) values ('$TODAY_ED','$A','Ann','hi')"
expect_fail "cannot comment on a locked edition"            authenticated $A "insert into public.comments (edition_id,author_id,author_name,body) values ('$OLD_ED','$A','Ann','hi')"
expect_fail "cannot comment as someone else"                authenticated $A "insert into public.comments (edition_id,author_id,author_name,body) values ('$TODAY_ED','$B','Bo','hi')"
expect_val  "anyone can read comments"               "1"    anon "" "select count(*) from public.comments"

echo "── discovery check ──"
expect_ok   "reader answers once"                           authenticated $A "insert into public.discovery values ('$TODAY_ED','$A',true)"
expect_fail "reader cannot answer twice"                    authenticated $A "insert into public.discovery values ('$TODAY_ED','$A',false)"
expect_fail "curator cannot answer for own edition"         authenticated $C "insert into public.discovery values ('$TODAY_ED','$C',true)"
expect_fail "cannot answer as someone else"                 authenticated $A "insert into public.discovery values ('$TODAY_ED','$B',true)"
expect_val  "readers can't see others' answers"      "0"    authenticated $B "select count(*) from public.discovery"

echo "── backs ──"
$P -c "update public.profiles set role='curator' where id in ('$F','$G');"
expect_ok   "member backs a curator"                        authenticated $A "insert into public.backs values ('$A','$C','2026-10')"
expect_fail "cannot back the same curator twice a month"    authenticated $A "insert into public.backs values ('$A','$C','2026-10')"
expect_fail "cannot back yourself"                          authenticated $C "insert into public.backs values ('$C','$C','2026-10')"
expect_fail "cannot back a non-curator"                     authenticated $A "insert into public.backs values ('$A','$B','2026-10')"
expect_ok   "second back"                                   authenticated $A "insert into public.backs values ('$A','$E','2026-10')"
expect_ok   "third back"                                    authenticated $A "insert into public.backs values ('$A','$F','2026-10')"
expect_fail "fourth back in a month is refused (limit 3)"   authenticated $A "insert into public.backs values ('$A','$G','2026-10')"
expect_ok   "backs reset next month"                        authenticated $A "insert into public.backs values ('$A','$G','2026-11')"
expect_val  "members see only their own backs"       "0"    authenticated $B "select count(*) from public.backs"

echo "── standing aggregates ──"
expect_val  "public sees responses without identities" "1"   anon "" "select (public.curator_stats('$C')->>'responses')"
expect_val  "found_new counted"                        "1"   anon "" "select (public.curator_stats('$C')->>'found_new')"
expect_val  "backer count hidden from the public"      "null" anon "" "select coalesce(public.curator_stats('$C')->>'distinct_backers_90','null')"
expect_val  "backer count visible to the curator"      "1"   authenticated $C "select (public.curator_stats('$C')->>'distinct_backers_90')"

echo "── profiles and applications ──"
expect_fail "user cannot promote themselves"                authenticated $A "update public.profiles set role='curator' where id='$A'"
expect_ok   "user can edit own bio"                         authenticated $A "update public.profiles set bio='hello' where id='$A'"
expect_ok   "anyone signed in can apply to curate"          authenticated $D "insert into public.applications (applicant_id,applicant_name,city,why) values ('$D','Dee','Seoul','I know Hongdae well and could curate it.')"
expect_val  "applications are private to the applicant" "0" authenticated $A "select count(*) from public.applications"
expect_ok   "artist can pitch"                              authenticated $B "insert into public.pitches (artist_id,artist_name,title,link) values ('$B','Bo','Song','https://x.y')"
expect_fail "listener cannot pitch"                         authenticated $A "insert into public.pitches (artist_id,artist_name,title,link) values ('$A','Ann','Song','https://x.y')"
expect_ok   "curator adds gig tip for own city"             authenticated $C "insert into public.gig_tips (city,curator_id,curator_name,act,venue,starts_on) values ('brisbane','$C','Cy','Band','Zoo',current_date)"
expect_fail "curator can't add tip for another city"        authenticated $C "insert into public.gig_tips (city,curator_id,curator_name,act,venue,starts_on) values ('seoul','$C','Cy','Band','Zoo',current_date)"

echo "── artist and fan connection ──"
expect_ok   "fan connects to an artist"                      authenticated $A "insert into public.connections (fan_id,artist_id) values ('$A','$B')"
expect_fail "cannot connect to a non-artist"                 authenticated $A "insert into public.connections (fan_id,artist_id) values ('$A','$C')"
expect_fail "cannot connect as someone else"                 authenticated $A "insert into public.connections (fan_id,artist_id) values ('$D','$B')"
expect_val  "artist sees who connected"             "1"      authenticated $B "select count(*) from public.connections"
expect_val  "other people cannot see connections"   "0"      authenticated $D "select count(*) from public.connections"
expect_ok   "artist posts a dispatch"                        authenticated $B "insert into public.dispatches (artist_id,artist_name,body) values ('$B','Bo','Rehearsing tonight.')"
expect_fail "listener cannot post a dispatch"                authenticated $A "insert into public.dispatches (artist_id,artist_name,body) values ('$A','Ann','hi')"
expect_val  "connected fan sees the dispatch"       "1"      authenticated $A "select count(*) from public.dispatches"
expect_val  "unconnected user does not"             "0"      authenticated $D "select count(*) from public.dispatches"
expect_val  "anon does not"                         "0"      anon "" "select count(*) from public.dispatches"
expect_ok   "connected fan asks a question"                  authenticated $A "insert into public.questions (fan_id,fan_name,artist_id,body) values ('$A','Ann','$B','What are you listening to?')"
expect_fail "second question the same day is refused"        authenticated $A "insert into public.questions (fan_id,fan_name,artist_id,body) values ('$A','Ann','$B','And another?')"
expect_fail "unconnected user cannot ask"                    authenticated $D "insert into public.questions (fan_id,fan_name,artist_id,body) values ('$D','Dee','$B','Hi')"
expect_fail "fan cannot pre-fill an answer"                  authenticated $E "insert into public.questions (fan_id,fan_name,artist_id,body,answer) values ('$E','Eli','$B','Q','A')"
expect_val  "fan cannot answer or edit questions"   "0"      authenticated $A "with u as (update public.questions set answer='me' returning 1) select count(*) from u"
expect_val  "artist can answer"                     "1"      authenticated $B "with u as (update public.questions set answer='Lots of Hatchie.', answered_at=now() returning 1) select count(*) from u"
expect_val  "asker sees the reply"                  "Lots of Hatchie." authenticated $A "select answer from public.questions"
expect_val  "others cannot see the question"        "0"      authenticated $D "select count(*) from public.questions"
expect_ok   "fan can disconnect"                             authenticated $A "delete from public.connections where fan_id='$A'"
expect_val  "after disconnecting the fan loses the dispatch" "0" authenticated $A "select count(*) from public.dispatches"

echo; echo "passed: $pass  failed: $fail"; [ "$fail" -eq 0 ]
