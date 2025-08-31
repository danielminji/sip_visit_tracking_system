-- Create a function to check if the current user is an admin
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

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;

-- Enable RLS on the user_registrations table
ALTER TABLE public.user_registrations ENABLE ROW LEVEL SECURITY;

-- Drop old policies to ensure a clean state
DROP POLICY IF EXISTS "Allow admins to read all user registrations" ON public.user_registrations;
DROP POLICY IF EXISTS "Enable read access for admins" ON public.user_registrations;
DROP POLICY IF EXISTS "Allow admins to update user registrations" ON public.user_registrations;

-- Create a new policy to allow admins to view all user registrations
CREATE POLICY "Enable read access for admins"
ON public.user_registrations
FOR SELECT
TO authenticated
USING (is_admin());

-- Create a new policy to allow admins to update user registrations
CREATE POLICY "Allow admins to update user registrations"
ON public.user_registrations
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
