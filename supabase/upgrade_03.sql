-- Migration 03: Add image upload functionality
-- Run this in Supabase SQL editor

-- Create visit_images table
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

-- Enable RLS
alter table public.visit_images enable row level security;

-- Create RLS policies
create policy if not exists "read images of own visits" on public.visit_images
  for select using (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));

create policy if not exists "insert images for own visits" on public.visit_images
  for insert with check (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));

create policy if not exists "delete images of own visits" on public.visit_images
  for delete using (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));

-- Create storage bucket for visit images
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('visit-images', 'visit-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'])
on conflict (id) do nothing;

-- Create storage policies
create policy if not exists "authenticated users can upload images" on storage.objects
  for insert with check (bucket_id = 'visit-images' and auth.role() = 'authenticated');

create policy if not exists "authenticated users can view images" on storage.objects
  for select using (bucket_id = 'visit-images' and auth.role() = 'authenticated');

create policy if not exists "users can delete their own images" on storage.objects
  for delete using (bucket_id = 'visit-images' and auth.role() = 'authenticated');
