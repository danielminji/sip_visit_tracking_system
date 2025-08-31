-- Enable the pgcrypto extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop the old function to redefine it
DROP FUNCTION IF EXISTS public.create_pending_user(text, text, text);
DROP FUNCTION IF EXISTS public.create_pending_user(text, text, text, text);

-- Create the function to handle new user registration with password
CREATE OR REPLACE FUNCTION public.create_pending_user(
  p_full_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_password TEXT
)
RETURNS void AS $$
BEGIN
  -- Check if a user with the same email already exists in auth.users or user_registrations
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) OR 
     EXISTS (SELECT 1 FROM public.user_registrations WHERE email = p_email) THEN
    RAISE EXCEPTION 'A user with this email has already registered.';
  END IF;

  -- Insert the new user registration with a hashed password
  INSERT INTO public.user_registrations (full_name, email, phone, password_hash, status)
  VALUES (p_full_name, p_email, p_phone, crypt(p_password, gen_salt('bf')), 'pending');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function to the authenticated role
-- Note: For a public-facing signup, you might grant to 'anon' instead.
GRANT EXECUTE ON FUNCTION public.create_pending_user(text, text, text, text) TO authenticated; 
GRANT EXECUTE ON FUNCTION public.create_pending_user(text, text, text, text) TO anon;
