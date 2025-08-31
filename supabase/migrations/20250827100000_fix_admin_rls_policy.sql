-- Drop the old function and any dependent objects (like RLS policies)
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;

-- Create a helper function to check if a user is an admin.
-- This avoids direct subqueries in RLS policies, which can be inefficient.
CREATE OR REPLACE FUNCTION is_admin(user_id uuid)
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE admin_users.user_id = is_admin.user_id
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS Policy: Allow admin users to view all user registrations.
CREATE POLICY "Allow admin users to read all registrations"
ON public.user_registrations
FOR SELECT
TO authenticated
USING (is_admin(auth.uid()));

-- Grant execute permission on the function to authenticated users
GRANT EXECUTE ON FUNCTION is_admin(uuid) TO authenticated;
