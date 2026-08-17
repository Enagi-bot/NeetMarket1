import { NextResponse } from 'next/server'
import { verifyCaptcha } from '@/lib/captcha-store'

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const { id, entry } = body || {}
  if (!id || !entry) return NextResponse.json({ ok: false }, { status: 400 })
  const ok = verifyCaptcha(String(id), String(entry))
  return NextResponse.json({ ok })
}
