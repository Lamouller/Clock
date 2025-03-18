// supabase/functions/send-invitation/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, role, team } = await req.json()
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate a signup link with magic link
    const { data: { user }, error: signUpError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
      options: {
        data: {
          role,
          team,
        },
      },
    })

    if (signUpError) throw signUpError

    // Configure SMTP client
    const client = new SmtpClient()
    await client.connectTLS({
      hostname: Deno.env.get('SMTP_HOSTNAME')!,
      port: parseInt(Deno.env.get('SMTP_PORT')!),
      username: Deno.env.get('SMTP_USERNAME')!,
      password: Deno.env.get('SMTP_PASSWORD')!,
    })

    // Send invitation email
    await client.send({
      from: Deno.env.get('SMTP_FROM')!,
      to: email,
      subject: "Invitation to join Restaurant Time Clock",
      content: `
        <h1>Welcome to Restaurant Time Clock!</h1>
        <p>You've been invited to join the ${team} team as a ${role}.</p>
        <p>Click the link below to set up your account:</p>
        <a href="${user?.confirmation_sent_at}" style="
          display: inline-block;
          padding: 10px 20px;
          background-