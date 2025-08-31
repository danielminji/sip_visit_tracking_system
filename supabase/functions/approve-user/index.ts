import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.31.0'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { registration_id } = await req.json()

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Get registration details
    const { data: registration, error: regError } = await supabaseAdmin
      .from('user_registrations')
      .select('*')
      .eq('id', registration_id)
      .single()

    if (regError || !registration) {
      throw new Error('Registration not found.')
    }

    if (registration.status !== 'pending') {
      throw new Error('Registration is not pending approval.')
    }

    // 2. Create user in auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: registration.email,
      password: registration.password_hash, // This should be the hashed password
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: registration.full_name,
        phone: registration.phone,
      },
    })

    if (authError) throw authError

    const user = authData.user

    // 3. Create profile in public.profiles
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: user.id,
      full_name: registration.full_name,
      phone: registration.phone,
      role: 'user', // Default role
    })

    if (profileError) throw profileError

    // 4. Update registration status
    const { error: updateError } = await supabaseAdmin
      .from('user_registrations')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', registration_id)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ message: 'User approved successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
