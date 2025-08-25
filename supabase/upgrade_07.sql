-- Remove specific seeded schools from the public.schools table
-- Run with: supabase db reset or psql -f this file after deploying schema

BEGIN;

DELETE FROM public.schools
WHERE name = 'SJK ( C ) CHEROH' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SK Batu Talam' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SK Cheroh' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SK Dong' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SK Gali' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SK Raub' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SK Sega' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SK Sungai Ruan' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SK Tersang' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SK Tras' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SK Ulu Gali' AND category = 'SK';

DELETE FROM public.schools
WHERE name = 'SMK Dong' AND category = 'SMK';

DELETE FROM public.schools
WHERE name = 'SMK Gali' AND category = 'SMK';

DELETE FROM public.schools
WHERE name = 'SMK Mahmud Raub' AND category = 'SMK';

DELETE FROM public.schools
WHERE name = 'SMK Sungai Ruan' AND category = 'SMK';

DELETE FROM public.schools
WHERE name = 'SMK Tengku Kudin' AND category = 'SMK';

DELETE FROM public.schools
WHERE name = 'SMK Tersang' AND category = 'SMK';

COMMIT;
