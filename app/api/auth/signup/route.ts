import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'
import { encrypt } from '@/lib/crypt'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { email, phone, nin, password, role, state, captchaId, captchaEntry } = body || {}
    if (!email || !phone || !nin || !password || !role || !state || !captchaId || !captchaEntry) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    // Verify captcha by calling internal route
    const verify = await fetch(new URL('/api/captcha/verify', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: captchaId, entry: captchaEntry }),
    }).then((r) => r.json())

    if (!verify?.ok) return NextResponse.json({ error: 'Captcha failed' }, { status: 400 })

    // Create Supabase auth user using service role key
    const { data: userData, error: createErr } = await supabaseServer.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { phone },
    } as any)

    if (createErr || !userData?.user) {
      return NextResponse.json({ error: createErr?.message || 'Failed to create user' }, { status: 500 })
    }

    const userId = userData.user.id

    // encrypt NIN using COOKIE_SECRET-derived key
    const cookieSecret = process.env.COOKIE_SECRET || 'replace-me'
    const nin_encrypted = encrypt(String(nin), cookieSecret)

    await supabaseServer
      .from('profiles')
      .insert([
        {
          id: userId,
          phone,
          nin_encrypted,
          role,
          state,
          onboarded: false,
        },
      ])

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
