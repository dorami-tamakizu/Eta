-- Run once in the tamashii-ranking Supabase SQL Editor.
-- Creates the independent Stage 3 spell-stage ranking.
begin;

create table if not exists public.rankings_spell (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(trim(name)) between 1 and 20),
  clear_time double precision not null check (clear_time > 0 and clear_time < 'Infinity'::float8),
  road_time double precision check (road_time >= 0 and road_time <= clear_time and road_time < 'Infinity'::float8),
  skill_finishes integer not null check (skill_finishes between 0 and 61),
  damage_taken integer not null check (damage_taken between 0 and 20),
  damage_dealt integer not null check (damage_dealt >= 0),
  overkill integer not null check (overkill >= 0),
  time_score integer not null check (time_score >= 0),
  skill_score integer not null check (skill_score >= 0),
  damage_taken_score integer not null check (damage_taken_score >= 0),
  damage_dealt_score integer not null check (damage_dealt_score >= 0),
  total_score bigint generated always as (
    time_score::bigint + skill_score + damage_taken_score + damage_dealt_score
  ) stored,
  best_score_entry boolean not null default true
);

create index if not exists rankings_spell_score_order
  on public.rankings_spell (total_score desc, created_at asc, id);
create unique index if not exists rankings_spell_name_unique
  on public.rankings_spell (name) where best_score_entry;

alter table public.rankings_spell enable row level security;
revoke all on public.rankings_spell from anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on public.rankings_spell to anon, authenticated;
grant insert (
  name, clear_time, road_time, skill_finishes, damage_taken, damage_dealt,
  overkill, time_score, skill_score, damage_taken_score, damage_dealt_score
) on public.rankings_spell to anon, authenticated;

drop policy if exists rankings_spell_read on public.rankings_spell;
create policy rankings_spell_read on public.rankings_spell
  for select to anon, authenticated using (true);
drop policy if exists rankings_spell_submit on public.rankings_spell;
create policy rankings_spell_submit on public.rankings_spell
  for insert to anon, authenticated with check (true);

create or replace function public.rankings_spell_submit_best_name()
returns trigger language plpgsql volatile security definer
set search_path = ''
as $$
declare
  previous public.rankings_spell%rowtype;
  submitted_total bigint;
begin
  perform pg_catalog.pg_advisory_xact_lock(184731, 103);
  new.name := pg_catalog.btrim(new.name);
  new.best_score_entry := true;
  submitted_total := new.time_score::bigint + new.skill_score
    + new.damage_taken_score + new.damage_dealt_score;
  select * into previous from public.rankings_spell
    where best_score_entry and name = new.name for update;
  if found then
    if submitted_total > previous.total_score then
      update public.rankings_spell set
        clear_time = new.clear_time,
        road_time = new.road_time,
        skill_finishes = new.skill_finishes,
        damage_taken = new.damage_taken,
        damage_dealt = new.damage_dealt,
        overkill = new.overkill,
        time_score = new.time_score,
        skill_score = new.skill_score,
        damage_taken_score = new.damage_taken_score,
        damage_dealt_score = new.damage_dealt_score,
        created_at = new.created_at
      where id = previous.id;
    end if;
    return null;
  end if;
  return new;
end;
$$;
revoke all on function public.rankings_spell_submit_best_name() from public, anon, authenticated;
drop trigger if exists rankings_spell_submit_best_name on public.rankings_spell;
create trigger rankings_spell_submit_best_name
before insert on public.rankings_spell
for each row execute function public.rankings_spell_submit_best_name();

create or replace function public.rankings_spell_keep_top_100()
returns trigger language plpgsql volatile security definer
set search_path = ''
as $$
begin
  if TG_WHEN = 'BEFORE' then
    perform pg_catalog.pg_advisory_xact_lock(184731, 103);
  else
    delete from public.rankings_spell
    where id in (
      select id from public.rankings_spell
      order by total_score desc, created_at asc, id asc
      offset 100
    );
  end if;
  return null;
end;
$$;
revoke all on function public.rankings_spell_keep_top_100() from public, anon, authenticated;
drop trigger if exists rankings_spell_top_100_lock on public.rankings_spell;
create trigger rankings_spell_top_100_lock
before insert or update on public.rankings_spell
for each statement execute function public.rankings_spell_keep_top_100();
drop trigger if exists rankings_spell_top_100_trim on public.rankings_spell;
create trigger rankings_spell_top_100_trim
after insert or update on public.rankings_spell
for each statement execute function public.rankings_spell_keep_top_100();

commit;
