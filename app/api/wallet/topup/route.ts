import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { randomUUID } from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { amount, currency } = body || {}
    if (!amount || Number(amount) <= 0) return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })

    // Authenticate user
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const userResp = await supabaseServer.auth.getUser(token as string)
    const user = (userResp as any).data?.user
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    // Create a pending transaction and return a simulated checkout link (or provider integration)
    const reference = `topup_${Date.now()}_${randomUUID()}`
    await supabaseServer.from('transactions').insert([{ user_id: user.id, type: 'topup', amount, currency: currency || 'NGN', status: 'pending', reference }])

    // In a real integration you'd call Paystack/Stripe to create a checkout session and return the URL.
    // For now return a simulated url the tester can "complete" which triggers webhook handling in tests.
    const checkoutUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/_simulate/topup?ref=${reference}`

    return NextResponse.json({ ok: true, reference, checkoutUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
