-- Populate user_registrations with existing auth.users
-- This migration adds existing authenticated users to the user_registrations table
-- so the admin dashboard can show all users (not just new pending registrations)

-- Create a temporary function to populate existing users
CREATE OR REPLACE FUNCTION populate_auth_users_to_registrations()
RETURNS void AS $$
DECLARE
  auth_user_record RECORD;
  admin_user_ids UUID[];
BEGIN
  -- Get all admin user IDs to exclude them
  SELECT ARRAY(SELECT user_id FROM public.admin_users) INTO admin_user_ids;
  
  -- Loop through auth.users and add them to user_registrations if not already there
  FOR auth_user_record IN 
    SELECT id, email, created_at, raw_user_meta_data, phone, email_confirmed_at
    FROM auth.users 
    WHERE email_confirmed_at IS NOT NULL -- Only confirmed users
      AND id != ALL(admin_user_ids) -- Exclude admin users
  LOOP
    -- Insert if email doesn't already exist in user_registrations
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
      gen_random_uuid(),
      COALESCE(
        (auth_user_record.raw_user_meta_data->>'full_name')::text,
        split_part(auth_user_record.email, '@', 1)
      ),
      auth_user_record.email,
      COALESCE(
        (auth_user_record.raw_user_meta_data->>'phone')::text,
        auth_user_record.phone
      ),
      'approved',
      auth_user_record.created_at,
      auth_user_record.created_at,
      'Existing user - migrated from auth.users'
    WHERE NOT EXISTS (
      SELECT 1 FROM public.user_registrations 
      WHERE email = auth_user_record.email
    );
  END LOOP;
  
  -- Log the operation
  RAISE NOTICE 'Populated existing auth users into user_registrations table';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function
SELECT populate_auth_users_to_registrations();

-- Clean up - drop the temporary function
DROP FUNCTION populate_auth_users_to_registrations();
