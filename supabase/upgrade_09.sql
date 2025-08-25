-- Remove organization and position from user_registrations table
-- Run with: supabase db reset or psql -f this file after deploying schema

BEGIN;

-- Drop the organization and position columns
ALTER TABLE public.user_registrations 
DROP COLUMN IF EXISTS organization,
DROP COLUMN IF EXISTS position;

COMMIT;
