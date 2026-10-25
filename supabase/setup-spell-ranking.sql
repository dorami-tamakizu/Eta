-- Stage 3 spell ranking. Safe to re-run in tamashii-ranking.
create table if not exists public.rankings_spell (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(btrim(name)) between 1 and 20),
  clear_time double precision not null check (clear_time > 0 and clear_time < 'Infinity'::float8),
  road_time double precision check (road_time >= 0 and road_time <= clear_time and road_time < 'Infinity'::float8),
  skill_finishes integer not null check (skill_finishes between 0 and 61),
  damage_taken integer not null check (damage_taken >= 0),
  damage_dealt integer not null check (damage_dealt >= 0),
  overkill integer not null check (overkill >= 0),
  time_score integer not null check (time_score >= 0),
  skill_score integer not null check (skill_score >= 0),
  damage_taken_score integer not null check (damage_taken_score >= 0),
  damage_dealt_score integer not null check (damage_dealt_score >= 0),
  total_score bigint not null,
  best_score_entry boolean not null default true
);

create index if not exists rankings_spell_score_order
  on public.rankings_spell (total_score desc, created_at asc, id);
create unique index if not exists rankings_spell_name_unique
  on public.rankings_spell (name) where best_score_entry;

alter table public.rankings_spell enable row level security;
drop policy if exists rankings_spell_read on public.rankings_spell;
create policy rankings_spell_read on public.rankings_spell
  for select to anon, authenticated using (true);
drop policy if exists rankings_spell_submit on public.rankings_spell;
create policy rankings_spell_submit on public.rankings_spell
  for insert to anon, authenticated with check (true);

revoke all on table public.rankings_spell from public, anon, authenticated;
grant select on table public.rankings_spell to anon, authenticated;
grant insert (
  name, clear_time, road_time, skill_finishes, damage_taken, damage_dealt,
  overkill, time_score, skill_score, damage_taken_score, damage_dealt_score
) on table public.rankings_spell to anon, authenticated;

drop trigger if exists rankings_spell_submit_best_name on public.rankings_spell;
create trigger rankings_spell_submit_best_name
before insert on public.rankings_spell
for each row execute function public.rankings_stage_submit_best_name();

drop trigger if exists rankings_spell_top_100_trim on public.rankings_spell;
create trigger rankings_spell_top_100_trim
after insert or update on public.rankings_spell
for each statement execute function public.rankings_stage_keep_top_100();

-- Trigger functions remain usable by their triggers but are not callable as public RPCs.
revoke execute on function public.rankings_stage_submit_best_name()
  from public, anon, authenticated;
revoke execute on function public.rankings_stage_keep_top_100()
  from public, anon, authenticated;
revoke execute on function public.rls_auto_enable()
  from public, anon, authenticated;
