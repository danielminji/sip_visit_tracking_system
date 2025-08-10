-- Additional table to store per-PDF-page data for visits

create table if not exists public.visit_pages (
  id uuid primary key default gen_random_uuid(),
  visit_id uuid not null references public.visits(id) on delete cascade,
  standard_code text not null check (standard_code in ('1','2','3.1','3.2','3.3')),
  page_code text not null, -- e.g. '1-2', '2-7', '3.1-5'
  data jsonb not null default '{}'::jsonb,
  unique (visit_id, page_code)
);

alter table public.visit_pages enable row level security;

create policy if not exists "read pages of own visits" on public.visit_pages
  for select using (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));
create policy if not exists "write pages of own visits" on public.visit_pages
  for insert with check (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));
create policy if not exists "update pages of own visits" on public.visit_pages
  for update using (exists (select 1 from public.visits v where v.id = visit_id and v.officer_id = auth.uid()));


