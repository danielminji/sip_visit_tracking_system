-- Add the password_hash column to the user_registrations table if it doesn't exist.
-- This column was removed in a previous schema update and is being restored to support the registration flow.
ALTER TABLE public.user_registrations ADD COLUMN IF NOT EXISTS password_hash TEXT;
