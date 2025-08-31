-- Manual script to populate user_registrations with existing auth users
-- Run this in the Supabase SQL editor

-- Insert existing auth users into user_registrations
INSERT INTO public.user_registrations (
  id,
  full_name,
  email,
  phone,
  status,
  created_at,
  approved_at,
  admin_notes
)
SELECT 
  gen_random_uuid() as id,
  COALESCE(
    (raw_user_meta_data->>'full_name')::text,
    split_part(email, '@', 1)
  ) as full_name,
  email,
  COALESCE(
    (raw_user_meta_data->>'phone')::text,
    phone
  ) as phone,
  'approved' as status,
  created_at,
  created_at as approved_at,
  'Existing user - migrated from auth.users' as admin_notes
FROM auth.users
WHERE 
  email_confirmed_at IS NOT NULL
  AND id NOT IN (SELECT user_id FROM public.admin_users WHERE user_id IS NOT NULL)
  AND email NOT IN (SELECT email FROM public.user_registrations WHERE email IS NOT NULL);
