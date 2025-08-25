-- Migration 04: Add officer_name column to visits table
-- Run this in Supabase SQL editor

-- Add officer_name column to visits table if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'visits' 
    and column_name = 'officer_name'
    and table_schema = 'public'
  ) then
    alter table public.visits add column officer_name text;
  end if;
end $$;

-- Add pgb column to visits table if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'visits' 
    and column_name = 'pgb'
    and table_schema = 'public'
  ) then
    alter table public.visits add column pgb text;
  end if;
end $$;

-- Add sesi_bimbingan column to visits table if it doesn't exist
do $$
begin
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'visits' 
    and column_name = 'sesi_bimbingan'
    and table_schema = 'public'
  ) then
    alter table public.visits add column sesi_bimbingan text;
  end if;
end $$;
