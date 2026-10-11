-- Permit unfinished sword-stage scores without updating existing records.
-- Spear and EX already accept nonnegative damage and damage >= player HP.
begin;
alter table public.rankings drop constraint if exists rankings_damage_taken_check;
alter table public.rankings add constraint rankings_damage_taken_check check (damage_taken >= 0);
alter table public.rankings drop constraint if exists rankings_damage_dealt_check;
alter table public.rankings add constraint rankings_damage_dealt_check check (damage_dealt >= 0);
alter table public.rankings drop constraint if exists rankings_check;
alter table public.rankings add constraint rankings_check
  check (damage_dealt >= overkill and (time_score = 0 or damage_dealt::bigint = 214::bigint + overkill));
commit;
