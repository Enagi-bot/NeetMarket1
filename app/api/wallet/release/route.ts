import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { seller_id, amount, order_reference } = body || {}
    if (!seller_id || !amount || !order_reference) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Move escrow to completed and credit seller's wallet
    // Find the escrow transaction
    const { data: tx } = await supabaseServer.from('transactions').select('*').eq('reference', order_reference).maybeSingle()
    if (!tx) return NextResponse.json({ error: 'Escrow not found' }, { status: 404 })

    if (tx.status !== 'in-escrow') return NextResponse.json({ error: 'Escrow not in escrow state' }, { status: 400 })

    await supabaseServer.from('transactions').update({ status: 'completed' }).eq('id', tx.id)

    // credit seller wallet (upsert)
    await supabaseServer.raw(`
      insert into public.wallets (user_id, balance, updated_at)
      values ($1, $2, now())
      on conflict (user_id) do update set balance = public.wallets.balance + $2, updated_at = now();
    `, [seller_id, amount])

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
