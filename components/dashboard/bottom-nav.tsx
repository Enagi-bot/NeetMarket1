'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Tab = {
  id: string
  label: string
  icon: LucideIcon
}

export function BottomNav({
  tabs,
  active,
  onChange,
}: {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
}) {
  return (
    <nav
      className="sticky bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur"
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 py-1.5">
        {tabs.map((t) => {
          const isActive = active === t.id
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 text-[0.65rem] font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <span
                className={cn(
                  'grid size-9 place-items-center rounded-xl transition-colors',
                  isActive ? 'bg-primary/12' : 'bg-transparent',
                )}
              >
                <t.icon className="size-5" />
              </span>
              <span className="leading-none">{t.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
