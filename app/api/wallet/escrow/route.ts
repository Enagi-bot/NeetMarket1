import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { seller_id, amount, order_reference } = body || {}
    if (!seller_id || !amount) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    // Create escrow transaction (debit buyer handled by client/server wallet flow); here we just create an in-escrow txn for the seller
    await supabaseServer.from('transactions').insert([{ user_id: seller_id, type: 'escrow', amount: amount, status: 'in-escrow', reference: order_reference }])

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
