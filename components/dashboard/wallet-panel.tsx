'use client'

import { useState } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  Wallet as WalletIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatNaira, useApp, type Role } from '@/lib/app-context'
import { cn } from '@/lib/utils'

const TOPUPS = [2000, 5000, 10000, 20000]

export function WalletPanel({ role }: { role: Role }) {
  const { wallet, txns, fundWallet } = useApp()
  const [amount, setAmount] = useState(5000)

  const inEscrow = txns
    .filter((t) => t.status === 'in-escrow')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return (
    <div className="space-y-5">
      {/* Balance card */}
      <div className="overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm text-primary-foreground/80">
            <WalletIcon className="size-4" />
            {role === 'seller' ? 'Payout balance' : 'Wallet balance'}
          </span>
          <span className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs">
            NGN
          </span>
        </div>
        <p className="mt-3 font-display text-4xl font-bold tracking-tight">
          {formatNaira(wallet)}
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-primary-foreground/12 px-3 py-2 text-xs">
          <ShieldCheck className="size-4 text-accent" />
          {formatNaira(inEscrow)} held safely in escrow
        </div>
      </div>

      {/* Fund */}
      <div className="rounded-3xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">
          {role === 'seller' ? 'Add funds' : 'Fund your wallet'}
        </p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {TOPUPS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setAmount(v)}
              className={cn(
                'rounded-xl border py-2 text-sm font-medium transition-colors',
                amount === v
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-input hover:border-primary/40',
              )}
            >
              {(v / 1000).toFixed(0)}k
            </button>
          ))}
        </div>
        <Button
          size="lg"
          className="mt-3 h-11 w-full"
          onClick={() => fundWallet(amount)}
        >
          <Plus className="size-4" />
          Add {formatNaira(amount)}
        </Button>
        <p className="mt-2 text-center text-[0.7rem] text-muted-foreground">
          Simulated top-up · connect a database to process real payments
        </p>
      </div>

      {/* Transactions */}
      <div>
        <p className="mb-2 text-sm font-semibold">Recent activity</p>
        <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
          {txns.map((t) => {
            const credit = t.amount > 0
            return (
              <div key={t.id} className="flex items-center gap-3 p-3.5">
                <span
                  className={cn(
                    'grid size-10 shrink-0 place-items-center rounded-xl',
                    credit ? 'bg-primary/10 text-primary' : 'bg-accent/25 text-accent-foreground',
                  )}
                >
                  {credit ? (
                    <ArrowDownLeft className="size-5" />
                  ) : (
                    <ArrowUpRight className="size-5" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.label}</p>
                  <p className="text-xs text-muted-foreground">{t.date}</p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      'text-sm font-semibold',
                      credit ? 'text-primary' : 'text-foreground',
                    )}
                  >
                    {credit ? '+' : '−'}
                    {formatNaira(Math.abs(t.amount))}
                  </p>
                  {t.status !== 'completed' ? (
                    <span className="text-[0.65rem] font-medium capitalize text-accent-foreground">
                      {t.status.replace('-', ' ')}
                    </span>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
