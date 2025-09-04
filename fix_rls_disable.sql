-- Fix RLS disable for user_registrations table
-- Run this directly in Supabase SQL Editor

-- First check current RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_registrations';

-- Disable RLS on user_registrations table
ALTER TABLE public.user_registrations DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be blocking access
DROP POLICY IF EXISTS "Admin users can read user registrations" ON public.user_registrations;
DROP POLICY IF EXISTS "Admin users can update user registrations" ON public.user_registrations;
DROP POLICY IF EXISTS "Users can read own registration" ON public.user_registrations;

-- Verify RLS is disabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'user_registrations';

-- Test query to ensure access works
SELECT COUNT(*) as total_users FROM public.user_registrations;
