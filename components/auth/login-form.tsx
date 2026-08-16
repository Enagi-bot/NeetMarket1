'use client'

import { useState } from 'react'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/form'
import { useApp } from '@/lib/app-context'

export function LoginForm() {
  const { login, goTo, accounts } = useApp()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Enter your email and password')
      return
    }
    const ok = login(email)
    if (!ok) {
      setError('No account found for this email on this device. Create one first.')
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Log in to your neighbourhood market.
        </p>
      </div>

      <Field label="Email address" error={error && !email ? error : undefined}>
        <Input
          type="email"
          inputMode="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>

      <Field label="Password">
        <div className="relative">
          <Input
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-label={showPw ? 'Hide password' : 'Show password'}
          >
            {showPw ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
          </button>
        </div>
      </Field>

      {error && email ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : null}

      {accounts.length > 0 ? (
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            Accounts on this device
          </p>
          <div className="flex flex-wrap gap-1.5">
            {accounts.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setEmail(a.email)}
                className="rounded-lg bg-card px-2.5 py-1 text-xs font-medium text-foreground shadow-sm hover:bg-primary/10"
              >
                {a.email}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <Button type="submit" size="lg" className="h-12 w-full text-base">
        <LogIn className="size-4" />
        Log in
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New here?{' '}
        <button
          type="button"
          onClick={() => goTo('signup')}
          className="font-semibold text-primary hover:underline"
        >
          Create an account
        </button>
      </p>
    </form>
  )
}
