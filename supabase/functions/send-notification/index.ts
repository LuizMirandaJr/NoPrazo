
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const RESEND_API_KEY = 're_9uwBJcsf_45krArny2M36fYNc4PX7Zbiv';

Deno.serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            }
        })
    }

    try {
        const { to, subject, html } = await req.json()

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'NoPrazo <onboarding@resend.dev>',
                to: [to],
                subject: subject,
                html: html,
            }),
        })

        const data = await res.json()

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            status: res.status,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            status: 400,
        })
    }
})
