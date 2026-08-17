'use client'

import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/form'
import { supabase } from '@/lib/supabase-client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Enter your email and password')
      return
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else {
      // reload the page or update app state
      window.location.reload()
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to your neighbourhood market.</p>
      </div>

      <Field label="Email address" error={error && !email ? error : undefined}>
        <Input type="email" inputMode="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>

      <Field label="Password">
        <div className="relative">
          <Input type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pr-10" />
          <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-label={showPw ? 'Hide password' : 'Show password'}>
            {showPw ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
      </Field>

      {error ? <p className="text-xs font-medium text-destructive">{error}</p> : null}

      <Button type="submit" size="lg" className="h-12 w-full text-base">
        <LogIn className="size-4" />
        Log in
      </Button>
    </form>
  )
}
