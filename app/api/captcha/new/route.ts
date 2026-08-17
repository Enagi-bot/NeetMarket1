import { NextResponse } from 'next/server'
import { createCaptcha } from '@/lib/captcha-store'

export async function GET() {
  const { id, code } = createCaptcha()
  // For development we return the raw code so the client can draw it locally.
  // In production you may prefer a server-rendered image or an external captcha provider.
  return NextResponse.json({ id, code })
}
