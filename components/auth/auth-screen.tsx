'use client'

import { MapPin, ShieldCheck, Wallet } from 'lucide-react'
import { Logo } from '@/components/brand'
import { SignupForm } from '@/components/auth/signup-form'
import { LoginForm } from '@/components/auth/login-form'
import { useApp } from '@/lib/app-context'

const HIGHLIGHTS = [
  { icon: MapPin, title: 'Truly local', desc: 'Find sellers on your street, not the next city.' },
  { icon: ShieldCheck, title: 'Trust ratings', desc: 'Verified accounts and honest 5-star scores.' },
  { icon: Wallet, title: 'Safe payments', desc: 'In-app wallet with escrow to stop fraud.' },
]

export function AuthScreen() {
  const { view } = useApp()
  const isLogin = view === 'login'

  return (
    <main className="flex min-h-dvh flex-col lg:flex-row">
      {/* Hero panel */}
      <section className="relative hidden overflow-hidden bg-primary text-primary-foreground lg:flex lg:w-[46%] lg:flex-col lg:justify-between lg:p-12">
        <img
          src="/brand/market-hero.png"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary" />
        <div className="relative">
          <Logo className="[&_span:last-child]:text-primary-foreground [&_.text-primary]:text-accent" />
        </div>
        <div className="relative max-w-md">
          <h2 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight">
            Your neighbourhood market, now in your pocket.
          </h2>
          <p className="mt-4 text-pretty text-primary-foreground/80">
            Buy and sell with people around you — from Lekki to Zaria — with trust
            ratings and protected payments built in.
          </p>
          <ul className="mt-8 space-y-4">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title} className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-foreground/15 backdrop-blur">
                  <h.icon className="size-4.5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">{h.title}</p>
                  <p className="text-sm text-primary-foreground/75">{h.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-primary-foreground/60">
          Trusted by traders in 8 states and counting.
        </p>
      </section>

      {/* Form panel */}
      <section className="flex flex-1 flex-col">
        <header className="flex items-center justify-between p-5 lg:hidden">
          <Logo />
        </header>
        <div className="flex flex-1 items-center justify-center px-5 pb-10 lg:px-10">
          <div className="w-full max-w-md">{isLogin ? <LoginForm /> : <SignupForm />}</div>
        </div>
      </section>
    </main>
  )
}
