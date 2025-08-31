-- supabase/migrations/20250826195200_create_pending_user_function.sql

CREATE OR REPLACE FUNCTION public.create_pending_user(
    p_email TEXT,
    p_password TEXT,
    p_full_name TEXT,
    p_phone TEXT DEFAULT NULL
) 
RETURNS JSON 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    existing_user_id UUID;
    password_hash TEXT;
BEGIN
    -- Check if a user with this email already exists in user_registrations
    SELECT id INTO existing_user_id
    FROM public.user_registrations
    WHERE email = p_email;

    IF FOUND THEN
        RETURN json_build_object('error', 'User with this email already exists.');
    END IF;

    -- Validate password
    IF p_password IS NULL OR LENGTH(p_password) = 0 THEN
        RETURN json_build_object('error', 'Password is required.');
    END IF;

    -- Hash the password using pgcrypto
    password_hash := crypt(p_password, gen_salt('bf'));

    -- Insert the new user registration
    INSERT INTO public.user_registrations (email, password_hash, full_name, phone, status)
    VALUES (p_email, password_hash, p_full_name, p_phone, 'pending');

    RETURN json_build_object('message', 'Registration submitted successfully');
END;
$$;
