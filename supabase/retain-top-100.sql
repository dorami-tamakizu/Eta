-- Execute once in tamashii-ranking's SQL Editor (safe to re-run).
begin;
lock table public.rankings in share row exclusive mode;

create or replace function public.rankings_keep_top_100()
returns trigger
language plpgsql
volatile
security definer
set search_path = ''
as $$
begin
  if TG_WHEN = 'BEFORE' then
    perform pg_catalog.pg_advisory_xact_lock(184731, 100);
  else
    delete from public.rankings
    where id in (
      select id from public.rankings
      order by total_score desc, created_at asc, id asc
      offset 100
    );
  end if;
  return null;
end;
$$;

revoke all on function public.rankings_keep_top_100()
from public, anon, authenticated;

create or replace trigger rankings_top_100_lock
before insert or update on public.rankings
for each statement execute function public.rankings_keep_top_100();

create or replace trigger rankings_top_100_trim
 after insert or update on public.rankings
for each statement execute function public.rankings_keep_top_100();

-- Also remove existing records outside the top 100.
delete from public.rankings
where id in (
  select id from public.rankings
  order by total_score desc, created_at asc, id asc
  offset 100
);
commit;

select count(*) as saved_records from public.rankings;
