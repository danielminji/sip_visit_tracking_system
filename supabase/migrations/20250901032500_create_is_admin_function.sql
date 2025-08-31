-- Drop the function if it exists to ensure a clean slate
DROP FUNCTION IF EXISTS is_admin();

-- Create the function to check if the current user is in the admin_users table
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
