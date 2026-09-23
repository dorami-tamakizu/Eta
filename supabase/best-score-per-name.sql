-- tamashii-ranking only. Existing records are untouched.
-- Re-running this migration does not reclassify existing records.
begin;
lock table public.rankings in share row exclusive mode;
alter table public.rankings add column if not exists best_score_entry boolean not null default false;
alter table public.rankings alter column best_score_entry set default true;
create unique index if not exists rankings_new_name_unique
  on public.rankings (name) where best_score_entry;

create or replace function public.rankings_submit_best_name()
returns trigger language plpgsql volatile security definer
set search_path = ''
as $$
declare
  previous public.rankings%rowtype;
  submitted_total bigint;
begin
  perform pg_catalog.pg_advisory_xact_lock(184731, 100);
  new.name := pg_catalog.btrim(new.name);
  new.best_score_entry := true;
  submitted_total := new.time_score::bigint + new.skill_score
    + new.damage_taken_score + new.damage_dealt_score;
  select * into previous from public.rankings
    where best_score_entry and name = new.name for update;
  if found then
    if submitted_total > previous.total_score then
      update public.rankings set
        clear_time = new.clear_time,
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
revoke all on function public.rankings_submit_best_name() from public, anon, authenticated;
create or replace trigger rankings_submit_best_name
before insert on public.rankings
for each row execute function public.rankings_submit_best_name();
commit;
select count(*) filter (where not best_score_entry) as preserved_records,
       count(*) filter (where best_score_entry) as new_records
from public.rankings;
