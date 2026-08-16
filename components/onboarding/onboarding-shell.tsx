'use client'

import { Logo } from '@/components/brand'
import { cn } from '@/lib/utils'

export function OnboardingShell({
  step,
  total,
  title,
  subtitle,
  children,
}: {
  step: number
  total: number
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pb-10">
      <header className="flex items-center justify-between py-5">
        <Logo />
        <span className="text-xs font-medium text-muted-foreground">
          Step {step} of {total}
        </span>
      </header>

      <div className="mb-6 flex gap-1.5" aria-hidden="true">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-colors',
              i < step ? 'bg-primary' : 'bg-border',
            )}
          />
        ))}
      </div>

      <div className="mb-6">
        <h1 className="text-balance font-display text-2xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-1 text-pretty text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="flex-1">{children}</div>
    </main>
  )
}
