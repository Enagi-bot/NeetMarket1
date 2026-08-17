'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/form'

export function ImageUpload({ value, onChange }: { value?: string; onChange: (url: string) => void }) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(value || '')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = String(reader.result || '')
      // dataUrl = data:<mime>;base64,<data>
      const parts = dataUrl.split(',')
      const base64 = parts[1]
      const payload = {
        filename: file.name,
        contentType: file.type,
        base64,
      }
      try {
        const res = await fetch('/api/upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
        const data = await res.json()
        if (res.ok && data.url) {
          setPreview(data.url)
          onChange(data.url)
        } else {
          console.error('upload failed', data)
          alert(data.error || 'Upload failed')
        }
      } catch (err) {
        console.error(err)
        alert('Upload failed')
      } finally {
        setLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <label className="block">
        <Input type="file" accept="image/*" onChange={handleFile} disabled={loading} />
      </label>
      {loading ? <div className="text-sm text-muted-foreground">Uploading...</div> : null}
      {preview ? <img src={preview} alt="preview" className="w-32 h-32 rounded-md object-cover" /> : null}
      <div>
        <Button type="button" variant="ghost" onClick={() => { setPreview(''); onChange('') }}>Remove</Button>
      </div>
    </div>
  )
}
