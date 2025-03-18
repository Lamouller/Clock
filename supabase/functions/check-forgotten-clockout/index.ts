// supabase/functions/check-forgotten-clockout/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get all active clock-ins from yesterday
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: forgottenClockouts, error } = await supabase
      .from('time_logs')
      .select(`
        *,
        profiles:user_id (
          email,
          first_name,
          last_name
        )
      `)
      .is('clock_out', null)
      .gte('clock_in', yesterday.toISOString())
      .lt('clock_in', today.toISOString())

    if (error) throw error

    // Send email notifications
    for (const log of forgottenClockouts) {
      await supabase
        .from('email_queue')
        .insert([{
          to: log.profiles.email,
          subject: 'Forgotten Clock-out Reminder',
          content: `Hi ${log.profiles.first_name},\n\nIt seems you forgot to clock out for your ${log.shift_type} shift yesterday. Please contact your manager to update your time log.\n\nBest regards,\nTime Clock System`
        }])
    }

    return new Response(
      JSON.stringify({ processed: forgottenClockouts.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
