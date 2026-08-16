'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { RefreshCw, ShieldCheck } from 'lucide-react'
import { Input, Label } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function randomCode(len = 5) {
  let s = ''
  for (let i = 0; i < len; i++) s += CHARS[Math.floor(Math.random() * CHARS.length)]
  return s
}

export function VisualCaptcha({
  onValidChange,
}: {
  onValidChange: (valid: boolean) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [code, setCode] = useState('')
  const [entry, setEntry] = useState('')
  const [captchaId, setCaptchaId] = useState<string | null>(null)

  const draw = useCallback((value: string) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // background
    ctx.fillStyle = '#f4efe2'
    ctx.fillRect(0, 0, w, h)

    // noise dots
    for (let i = 0; i < 90; i++) {
      ctx.fillStyle = `rgba(31,122,77,${Math.random() * 0.35})`
      ctx.beginPath()
      ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.6, 0, Math.PI * 2)
      ctx.fill()
    }

    // interference lines
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = `rgba(140,90,20,${0.25 + Math.random() * 0.3})`
      ctx.lineWidth = 1 + Math.random()
      ctx.beginPath()
      ctx.moveTo(Math.random() * w, Math.random() * h)
      ctx.bezierCurveTo(
        Math.random() * w,
        Math.random() * h,
        Math.random() * w,
        Math.random() * h,
        Math.random() * w,
        Math.random() * h,
      )
      ctx.stroke()
    }

    // characters
    const colors = ['#1f7a4d', '#8a5a12', '#245a3f', '#4a3a10']
    const step = w / (value.length + 1)
    for (let i = 0; i < value.length; i++) {
      ctx.save()
      const x = step * (i + 1)
      const y = h / 2 + (Math.random() * 8 - 4)
      ctx.translate(x, y)
      ctx.rotate((Math.random() - 0.5) * 0.6)
      ctx.font = `bold ${26 + Math.floor(Math.random() * 8)}px Georgia, serif`
      ctx.fillStyle = colors[i % colors.length]
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(value[i], 0, 0)
      ctx.restore()
    }
  }, [])

  const refresh = useCallback(() => {
    // request a server-side challenge; fallback to local generation on error
    fetch('/api/captcha/new')
      .then((r) => r.json())
      .then((data) => {
        if (data?.code) {
          setCaptchaId(data.id || null)
          setCode(String(data.code || ''))
          setEntry('')
          onValidChange(false)
          draw(String(data.code || ''))
        } else {
          const next = randomCode()
          setCode(next)
          setEntry('')
          onValidChange(false)
          draw(next)
        }
      })
      .catch(() => {
        const next = randomCode()
        setCode(next)
        setEntry('')
        onValidChange(false)
        draw(next)
      })
  }, [draw, onValidChange])

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const matched = entry.length === code.length && entry.toUpperCase() === code

  useEffect(() => {
    onValidChange(matched)
  }, [matched, onValidChange])

  return (
    <div>
      <Label>Security check</Label>
      <div className="flex items-center gap-2">
        <canvas
          ref={canvasRef}
          width={170}
          height={56}
          className="rounded-xl border border-input"
          aria-label="CAPTCHA image"
        />
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          onClick={refresh}
          aria-label="Get a new CAPTCHA"
          className="shrink-0"
        >
          <RefreshCw className="size-4" />
        </Button>
      </div>
      <div className="relative mt-2">
        <Input
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Type the characters above"
          autoCapitalize="characters"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={entry.length > 0 && !matched}
          className={cn(matched && 'border-primary ring-4 ring-primary/15')}
        />
        {matched ? (
          <ShieldCheck className="absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-primary" />
        ) : null}
      </div>
    </div>
  )
}
