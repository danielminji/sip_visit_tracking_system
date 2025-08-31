-- Fix RLS permissions for admin users to access user_registrations table
-- This allows admins to read all user registrations in the AdminDashboard

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin users can read user registrations" ON public.user_registrations;
DROP POLICY IF EXISTS "Admin users can update user registrations" ON public.user_registrations;

-- Create comprehensive admin access policies for user_registrations
CREATE POLICY "Admin users can read user registrations"
ON public.user_registrations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

CREATE POLICY "Admin users can update user registrations"
ON public.user_registrations
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);

-- Also ensure admin users can insert new registrations if needed
CREATE POLICY "Admin users can insert user registrations"
ON public.user_registrations
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.uid()
  )
);
