import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the user from the request
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if user is admin
    const { data: adminCheck } = await supabaseAdmin
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    if (!adminCheck) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Fetch pending registrations
    const { data: pendingUsers, error: pendingError } = await supabaseAdmin
      .from('user_registrations')
      .select('*')
      .order('created_at', { ascending: false })

    if (pendingError) {
      throw pendingError
    }

    // Fetch all auth users
    const { data: { users: authUsers }, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      throw authError
    }

    // Get admin user IDs to exclude
    const { data: adminUsers } = await supabaseAdmin
      .from('admin_users')
      .select('user_id')

    const adminUserIds = adminUsers?.map(admin => admin.user_id) || []

    // Combine all users
    const allUsers = []

    // Add users from user_registrations
    if (pendingUsers) {
      pendingUsers.forEach(user => {
        allUsers.push({
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          status: user.status || 'pending',
          created_at: user.created_at,
          admin_notes: user.admin_notes,
          approved_at: user.approved_at,
          approved_by: user.approved_by,
          source: 'registration'
        })
      })
    }

    // Add approved users from auth.users (exclude admins and users already in registrations)
    if (authUsers) {
      authUsers.forEach(user => {
        // Skip admin users and users already in pending list
        if (!adminUserIds.includes(user.id) && 
            !pendingUsers?.find(p => p.email === user.email)) {
          allUsers.push({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown',
            email: user.email,
            phone: user.user_metadata?.phone || user.phone || null,
            status: 'approved',
            created_at: user.created_at,
            admin_notes: null,
            approved_at: user.created_at,
            approved_by: null,
            source: 'auth'
          })
        }
      })
    }

    // Sort by creation date
    const sortedUsers = allUsers.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return new Response(JSON.stringify({ users: sortedUsers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
