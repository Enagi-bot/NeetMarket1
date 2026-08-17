import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const raw = await req.text()
    const sig = req.headers.get('x-paystack-signature') || ''
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET || ''
    if (!secret) return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })

    // verify signature (HMAC SHA512)
    const hash = crypto.createHmac('sha512', secret).update(raw).digest('hex')
    if (hash !== sig) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const payload = JSON.parse(raw)
    // Persist event for auditing
    await supabaseServer.from('payment_events').insert([{ provider: 'paystack', provider_event_id: payload.reference || payload.id || null, payload }])

    // Example: if event indicates charge.success, mark transaction completed and credit wallet
    // Payload structure varies by provider — adjust mapping as needed.
    const eventType = payload.event || payload.type || payload.status
    if (payload.status === 'success' || payload.event === 'charge.success') {
      const reference = payload.data?.reference || payload.reference
      // find pending transaction
      if (reference) {
        const { data: tx } = await supabaseServer.from('transactions').select('*').eq('reference', reference).maybeSingle()
        if (tx && tx.status !== 'completed') {
          await supabaseServer.from('transactions').update({ status: 'completed' }).eq('id', tx.id)
          // credit wallets table (create if not exists)
          await supabaseServer.raw(`
            insert into public.wallets (user_id, balance, updated_at)
            values ($1, $2, now())
            on conflict (user_id) do update set balance = public.wallets.balance + $2, updated_at = now();
          `, [tx.user_id, tx.amount])
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
