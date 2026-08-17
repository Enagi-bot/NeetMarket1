import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export const config = { runtime: 'edge' } // keep lightweight; remove if your env doesn't support edge

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const { filename, contentType, base64 } = body || {}
    if (!filename || !contentType || !base64) {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 })
    }

    // Authenticate user from Authorization: Bearer <token>
    const authHeader = req.headers.get('authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // get user from token
    const userResp = await supabaseServer.auth.getUser(token as string)
    const user = (userResp as any).data?.user
    if (!user) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    // check profile role
    const { data: profile } = await supabaseServer.from('profiles').select('role').eq('id', user.id).maybeSingle()
    if (!profile || profile.role !== 'seller') {
      return NextResponse.json({ error: 'Only seller accounts can upload' }, { status: 403 })
    }

    // upload to storage
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'neetmarket'
    const path = `avatars/${user.id}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-]/g, '_')}`
    const buffer = Buffer.from(base64, 'base64')

    const { data: upData, error: upErr } = await supabaseServer.storage.from(bucket).upload(path, buffer, { contentType })
    if (upErr) {
      return NextResponse.json({ error: upErr.message || 'Upload failed' }, { status: 500 })
    }

    // get public or signed URL
    let fileUrl = ''
    // Try to get public URL
    const { data: pub } = supabaseServer.storage.from(bucket).getPublicUrl(path)
    if (pub?.publicUrl) fileUrl = pub.publicUrl

    // If private bucket (publicUrl may still be returned but depending on bucket settings). Provide signed URL as fallback
    if (!fileUrl) {
      const { data: signed } = await supabaseServer.storage.from(bucket).createSignedUrl(path, 60 * 60)
      fileUrl = signed?.signedUrl || ''
    }

    // insert metadata into files table
    await supabaseServer.from('files').insert([{ owner_id: user.id, bucket, path, content_type: contentType, size: buffer.length, is_public: false }])

    return NextResponse.json({ ok: true, url: fileUrl })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 })
  }
}
