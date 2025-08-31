-- This function correctly creates a pending user without a password hash.
CREATE OR REPLACE FUNCTION public.create_pending_user(
    p_email TEXT,
    p_full_name TEXT,
    p_phone TEXT DEFAULT NULL
) 
RETURNS JSON 
LANGUAGE plpgsql
AS $$
BEGIN
    -- Insert the new user registration without a password
    INSERT INTO public.user_registrations (email, full_name, phone_number, status)
    VALUES (p_email, p_full_name, p_phone, 'pending');

    RETURN json_build_object('message', 'Registration submitted successfully. Please wait for admin approval.');
END;
$$;
