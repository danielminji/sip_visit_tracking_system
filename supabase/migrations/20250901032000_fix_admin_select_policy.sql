-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Allow admins to read all user registrations" ON public.user_registrations;

-- Create a new policy that allows users in the admin_users table to select records
CREATE POLICY "Allow admins to read all user registrations"
ON public.user_registrations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM admin_users
    WHERE admin_users.user_id = auth.uid()
  )
);
