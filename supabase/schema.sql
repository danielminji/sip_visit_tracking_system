-- Schema for SIP+ Tracking
-- Run this in Supabase SQL editor

-- profiles (link to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text check (role in ('officer','admin')) default 'officer'
);
alter table public.profiles enable row level security;
drop policy if exists "profiles are self-readable" on public.profiles;
create policy "profiles are self-readable" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles are self-writable" on public.profiles;
create policy "profiles are self-writable" on public.profiles
  for update using (auth.uid() = id);
-- Allow officers to insert their own profile row on first sign-in
drop policy if exists "profiles are self-insertable" on public.profiles;
create policy "profiles are self-insertable" on public.profiles
  for insert with check (auth.uid() = id);

-- schools
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in ('SK','SMK')),
  district text not null,
  address text,
  contact text
);
-- Prevent duplicate schools when reseeding
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'schools_name_district_category_key'
      and conrelid = 'public.schools'::regclass
  ) then
    alter table public.schools
      add constraint schools_name_district_category_key unique (name, district, category);
  end if;
end $$;
alter table public.schools enable row level security;
drop policy if exists "schools readable to authenticated" on public.schools;
create policy "schools readable to authenticated" on public.schools
  for select using (auth.role() = 'authenticated');
drop policy if exists "schools insert by authenticated" on public.schools;
create policy "schools insert by authenticated" on public.schools
  for insert with check (auth.role() = 'authenticated');
drop policy if exists "schools update by authenticated" on public.schools;
create policy "schools update by authenticated" on public.schools
  for update using (auth.role() = 'authenticated');
drop policy if exists "schools delete by authenticated" on public.schools;
create policy "schools delete by authenticated" on public.schools
  for delete using (auth.role() = 'authenticated');

-- visits
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete restrict,
  officer_id uuid not null references public.profiles(id) on delete restrict,
  visit_date date not null default (now()::date),
  status text default 'draft',
  officer_name text,
  pgb text,
  sesi_bimbingan text,
  created_at timestamptz not null default now()
);
alter table public.visits enable row level security;
drop policy if exists "officers read own visits" on public.visits;
create policy "officers read own visits" on public.visits
  for select using (officer_id = auth.uid());
drop policy if exists "officers insert own visits" on public.visits;
create policy "officers insert own visits" on public.visits
  for insert with check (officer_id = auth.uid());
drop policy if exists "officers update own visits" on public.visits;
create policy "officers update own visits" on public.visits
  for update using (officer_id = auth.uid());

-- visit_sections
create table if not exists public.visit_sections (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  section_code text not null check (section_code in ('1','2','3.1','3.2','3.3')),
  evidences jsonb default '[]'::jsonb,
  remarks text,
  score int check (score between 0 and 4),
  unique (visit_id, section_code)
);
alter table public.visit_sections enable row level security;
drop policy if exists "read sections of own visits" on public.visit_sections;
create policy "read sections of own visits" on public.visit_sections
  for select using (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));
drop policy if exists "write sections of own visits" on public.visit_sections;
create policy "write sections of own visits" on public.visit_sections
  for insert with check (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));
drop policy if exists "update sections of own visits" on public.visit_sections;
create policy "update sections of own visits" on public.visit_sections
  for update using (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));

-- visit_images (NEW TABLE for storing image metadata)
create table if not exists public.visit_images (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  filename text not null,
  original_name text not null,
  mime_type text not null,
  size integer not null,
  description text,
  section_code text check (section_code in ('1','2','3.1','3.2','3.3')),
  uploaded_at timestamptz not null default now()
);
alter table public.visit_images enable row level security;
drop policy if exists "read images of own visits" on public.visit_images;
create policy "read images of own visits" on public.visit_images
  for select using (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));
drop policy if exists "insert images for own visits" on public.visit_images;
create policy "insert images for own visits" on public.visit_images
  for insert with check (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));
drop policy if exists "delete images of own visits" on public.visit_images;
create policy "delete images of own visits" on public.visit_images
  for delete using (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));

-- visit_pages
create table if not exists public.visit_pages (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  standard_code text not null check (standard_code in ('1','2','3.1','3.2','3.3')),
  page_code text not null,
  data jsonb default '{}'::jsonb,
  unique (visit_id, standard_code, page_code)
);
alter table public.visit_pages enable row level security;
drop policy if exists "read pages of own visits" on public.visit_pages;
create policy "read pages of own visits" on public.visit_pages
  for select using (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));
drop policy if exists "write pages of own visits" on public.visit_pages;
create policy "write pages of own visits" on public.visit_pages
  for insert with check (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));
drop policy if exists "update pages of own visits" on public.visit_pages;
create policy "update pages of own visits" on public.visit_pages
  for update using (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));

-- Seed: Raub district schools (SK & SMK)
insert into public.schools (name, category, district)
values
  -- SK (Primary)
  ('SK Gali', 'SK', 'Raub'),
  ('SK Dong', 'SK', 'Raub'),
  ('SK Raub', 'SK', 'Raub'),
  ('SK Sungai Ruan', 'SK', 'Raub'),
  ('SK Cheroh', 'SK', 'Raub'),
  ('SK Tras', 'SK', 'Raub'),
  ('SK Batu Talam', 'SK', 'Raub'),
  ('SK Ulu Gali', 'SK', 'Raub'),
  ('SK Sega', 'SK', 'Raub'),
  ('SK Tersang', 'SK', 'Raub')
on conflict (name, district, category) do nothing;

insert into public.schools (name, category, district)
values
  -- SMK (Secondary)
  ('SMK Mahmud Raub', 'SMK', 'Raub'),
  ('SMK Gali', 'SMK', 'Raub'),
  ('SMK Dong', 'SMK', 'Raub'),
  ('SMK Sungai Ruan', 'SMK', 'Raub'),
  ('SMK Tengku Kudin', 'SMK', 'Raub'),
  ('SMK Tersang', 'SMK', 'Raub')
on conflict (name, district, category) do nothing;


