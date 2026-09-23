-- Run only in the tamashii-ranking project. This is a one-time setup.
begin;
create table public.rankings (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 name text not null check (char_length(trim(name)) between 1 and 20),
 clear_time double precision not null check (clear_time > 0 and clear_time < 'Infinity'::float8),
 skill_finishes integer not null check (skill_finishes between 0 and 61),
 damage_taken integer not null check (damage_taken between 0 and 19),
 damage_dealt integer not null check (damage_dealt >= 214),
 overkill integer not null check (overkill >= 0),
 time_score integer not null check (time_score >= 0),
 skill_score integer not null check (skill_score >= 0),
 damage_taken_score integer not null check (damage_taken_score >= 0),
 damage_dealt_score integer not null check (damage_dealt_score >= 0),
 total_score bigint generated always as (time_score::bigint + skill_score + damage_taken_score + damage_dealt_score) stored,
 check (damage_dealt::bigint = 214::bigint + overkill)
);
create index rankings_score_order on public.rankings (total_score desc, created_at asc, id);
alter table public.rankings enable row level security;
revoke all on public.rankings from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.rankings to anon, authenticated;
grant insert (name, clear_time, skill_finishes, damage_taken, damage_dealt, overkill, time_score, skill_score, damage_taken_score, damage_dealt_score) on public.rankings to anon, authenticated;
create policy rankings_read on public.rankings for select to anon, authenticated using (true);
create policy rankings_submit on public.rankings for insert to anon, authenticated with check (true);
commit;
