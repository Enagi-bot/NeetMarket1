'use client'

import { useState } from 'react'
import { AlertTriangle, Eye, EyeOff, Lock, ShoppingBag, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, Input, Select } from '@/components/ui/form'
import { VisualCaptcha } from '@/components/auth/visual-captcha'
import { STATES } from '@/lib/nigeria-data'
import { cn } from '@/lib/utils'

export function SignupForm() {
  const [role, setRole] = useState<'buyer' | 'seller'>('buyer')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [nin, setNin] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [state, setState] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [captchaOk, setCaptchaOk] = useState(false)
  const [captchaId, setCaptchaId] = useState<string | null>(null)
  const [captchaEntry, setCaptchaEntry] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address'
    if (phone.replace(/\D/g, '').length !== 11) e.phone = 'Enter your 11-digit phone number'
    if (nin.replace(/\D/g, '').length !== 11) e.nin = 'NIN must be 11 digits'
    if (password.length < 8) e.password = 'Use at least 8 characters'
    if (confirm !== password) e.confirm = 'Passwords do not match'
    if (!state) e.state = 'Select your state'
    if (!captchaOk) e.captcha = 'Complete the security check'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    setBusy(true)
    setMessage('')

    const body = { email, phone, nin, password, role, state, captchaId, captchaEntry }
    const res = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    setBusy(false)
    if (res.ok && data.ok) {
      setMessage('Account created. Proceed to onboarding.')
      // redirect to onboarding or update app state as needed
    } else {
      setMessage(data.error || 'Signup failed')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Join your neighbourhood market in minutes.</p>
      </div>

      {/* Role selection */}
      <div>
        <span className="mb-1.5 block text-sm font-medium">I want to</span>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { key: 'buyer', label: 'Buy', desc: 'Discover local sellers', icon: ShoppingBag },
              { key: 'seller', label: 'Sell', desc: 'Reach nearby buyers', icon: Store },
            ] as const
          ).map((opt) => {
            const active = role === opt.key
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => setRole(opt.key)}
                className={cn(
                  'flex flex-col items-start gap-1 rounded-2xl border p-3.5 text-left transition-all',
                  active
                    ? 'border-primary bg-primary/5 ring-4 ring-primary/10'
                    : 'border-input bg-card hover:border-primary/40',
                )}
                aria-pressed={active}
              >
                <span
                  className={cn(
                    'grid size-9 place-items-center rounded-xl',
                    active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
                  )}
                >
                  <opt.icon className="size-4.5" />
                </span>
                <span className="text-sm font-semibold">{opt.label}</span>
                <span className="text-xs text-muted-foreground">{opt.desc}</span>
              </button>
            )
          })}
        </div>
      </div>

      <Field label="Email address" error={errors.email}>
        <Input type="email" inputMode="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
      </Field>

      <Field label="Phone number" error={errors.phone}>
        <Input type="tel" inputMode="numeric" placeholder="0803 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} aria-invalid={!!errors.phone} />
      </Field>

      <Field label="National ID Number (NIN)" error={errors.nin} hint="Used once to verify your identity. Never shown publicly.">
        <Input inputMode="numeric" placeholder="12345678901" maxLength={11} value={nin} onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))} aria-invalid={!!errors.nin} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Password" error={errors.password}>
          <div className="relative">
            <Input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} className="pr-10" />
            <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPw ? 'Hide password' : 'Show password'}>
              {showPw ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
        </Field>
        <Field label="Confirm password" error={errors.confirm}>
          <Input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={confirm} onChange={(e) => setConfirm(e.target.value)} aria-invalid={!!errors.confirm} />
        </Field>
      </div>

      <Field label="State" error={errors.state}>
        <Select value={state} onChange={(e) => setState(e.target.value)} aria-invalid={!!errors.state}>
          <option value="">Select your state</option>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </Select>
      </Field>

      <div>
        <VisualCaptcha
          onValidChange={(v) => setCaptchaOk(v)}
          onChange={(p) => {
            setCaptchaId(p.id)
            setCaptchaEntry(p.entry)
            setCaptchaOk(p.valid)
          }}
        />
        {errors.captcha ? <p className="mt-1.5 text-xs font-medium text-destructive">{errors.captcha}</p> : null}
      </div>

      <Button type="submit" size="lg" className="h-12 w-full" disabled={busy}>
        <Lock className="size-4" />
        Create account
      </Button>

      {message ? <p className="text-center text-sm text-muted-foreground">{message}</p> : null}

    </form>
  )
}
