
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const DEFAULT_TEMPLATE = `Olá,

Este é um lembrete automático para informar que o contrato **{NOME_DO_CONTRATO}** está próximo do seu vencimento.

**Detalhes do contrato:**

* Responsável: {RESPONSAVEL}
* Data de início: {DATA_INICIO}
* Data de término: {DATA_FIM}

⚠️ **Atenção:**
O contrato vence em **{DIAS_RESTANTES} dias**. Recomendamos que as providências necessárias sejam avaliadas com antecedência, seja para renovação, encerramento ou ajustes contratuais.

Caso este contrato já tenha sido renovado ou encerrado, por favor, desconsidere esta mensagem.

Este é um e-mail automático enviado pelo sistema de controle de contratos.

Atenciosamente,

Controle inteligente de contratos`;

Deno.serve(async (req) => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    try {
        // 1. Fetch contracts that need notification today
        // Query: end_date - notification_days = current_date
        const { data: contracts, error: fetchError } = await supabase
            .from('contracts')
            .select('*')
            .not('customer_email', 'is', null)

        if (fetchError) throw fetchError

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const results = []

        for (const contract of contracts) {
            const endDate = new Date(contract.end_date)
            endDate.setHours(0, 0, 0, 0)

            const notificationDays = contract.notification_days || 7
            const alertDate = new Date(endDate)
            alertDate.setDate(alertDate.getDate() - notificationDays)

            if (alertDate.getTime() === today.getTime()) {
                // Send email
                const template = contract.custom_message || DEFAULT_TEMPLATE
                let message = template
                    .replace(/{NOME_DO_CONTRATO}/g, contract.title)
                    .replace(/{RESPONSAVEL}/g, contract.responsible_agent || 'Não informado')
                    .replace(/{DATA_INICIO}/g, new Date(contract.start_date).toLocaleDateString('pt-BR'))
                    .replace(/{DATA_FIM}/g, new Date(contract.end_date).toLocaleDateString('pt-BR'))
                    .replace(/{DIAS_RESTANTES}/g, String(notificationDays))

                const res = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                    },
                    body: JSON.stringify({
                        from: 'NoPrazo <onboarding@resend.dev>',
                        to: [contract.customer_email],
                        subject: `Lembrete de Vencimento: ${contract.title}`,
                        html: message.replace(/\n/g, '<br/>'),
                    }),
                })

                if (res.ok) {
                    await supabase.from('contract_history').insert({
                        contract_id: contract.id,
                        action: 'updated',
                        changes: { status: 'Notificação Enviada Automaticamente' }
                    })
                    results.push({ id: contract.id, status: 'sent' })
                } else {
                    results.push({ id: contract.id, status: 'error', detail: await res.text() })
                }
            }
        }

        return new Response(JSON.stringify({ processed: results.length, results }), {
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
