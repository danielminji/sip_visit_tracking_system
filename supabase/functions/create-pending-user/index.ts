import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0'
import { corsHeaders } from '../_shared/cors.ts'
import { hash } from 'https://deno.land/x/bcrypt@v0.4.1/mod.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password, fullName, phone } = await req.json()

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Missing environment variables.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // Check if user already exists in auth.users or user_registrations
    const { data: existingUser } = await supabaseAdmin
      .from('user_registrations')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'User with this email already exists.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 409,
      })
    }

    if (typeof password !== 'string' || password.length === 0) {
      return new Response(JSON.stringify({ error: 'Password is required and must be a string.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const passwordHash = await hash(password);

    const { error } = await supabaseAdmin.from('user_registrations').insert({
      email,
      password_hash: passwordHash,
      full_name: fullName,
      phone,
      status: 'pending',
    })

    if (error) throw error

    return new Response(JSON.stringify({ message: 'Registration submitted successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
