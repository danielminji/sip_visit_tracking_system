-- Add admin user and user approval system
-- Run with: supabase db reset or psql -f this file after deploying schema

BEGIN;

-- Add admin column to auth.users (we'll use a custom table instead)
-- Create admin_users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_registrations table for pending approvals
CREATE TABLE IF NOT EXISTS public.user_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  position TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_registrations ENABLE ROW LEVEL SECURITY;

-- Admin users can see all admin users
CREATE POLICY "Admin users can view all admin users" ON public.admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Admin users can manage admin users
CREATE POLICY "Admin users can manage admin users" ON public.admin_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid() AND au.role = 'super_admin'
    )
  );

-- Admin users can view all registrations
CREATE POLICY "Admin users can view all registrations" ON public.user_registrations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Admin users can update registrations
CREATE POLICY "Admin users can update registrations" ON public.user_registrations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_users au 
      WHERE au.user_id = auth.uid()
    )
  );

-- Users can view their own registration
CREATE POLICY "Users can view own registration" ON public.user_registrations
  FOR SELECT USING (
    email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- Users can insert their own registration
CREATE POLICY "Users can insert own registration" ON public.user_registrations
  FOR INSERT WITH CHECK (
    email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

-- Insert admin user
INSERT INTO public.admin_users (user_id, email, role) 
VALUES (
  (SELECT id FROM auth.users WHERE email = 'jailanitasman3@gmail.com'),
  'jailanitasman3@gmail.com',
  'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE user_id = user_uuid AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMIT;
