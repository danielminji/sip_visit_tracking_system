-- Populate user_registrations with existing auth.users
-- This ensures the admin dashboard shows all users, not just new registrations

-- First, let's create a function to safely populate existing users
CREATE OR REPLACE FUNCTION populate_existing_auth_users()
RETURNS void AS $$
DECLARE
  auth_user RECORD;
  admin_user_ids UUID[];
BEGIN
  -- Get all admin user IDs to exclude them
  SELECT ARRAY(SELECT user_id FROM public.admin_users) INTO admin_user_ids;
  
  -- Insert existing auth users into user_registrations if they don't exist
  -- Note: This requires RLS to be temporarily disabled for this operation
  
  -- We'll use a simpler approach: create entries for users not already tracked
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
    'Existing user - auto-populated' as admin_notes
  FROM auth.users
  WHERE 
    -- Exclude admin users
    id != ALL(admin_user_ids)
    -- Only include users not already in user_registrations
    AND email NOT IN (
      SELECT email FROM public.user_registrations WHERE email IS NOT NULL
    )
    -- Only include confirmed users
    AND email_confirmed_at IS NOT NULL;
    
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Execute the function to populate existing users
SELECT populate_existing_auth_users();

-- Drop the function as it's no longer needed
DROP FUNCTION populate_existing_auth_users();
