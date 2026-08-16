'use client'

import {
  ChevronRight,
  Headphones,
  LogOut,
  MapPin,
  MessageSquare,
  Plus,
  RefreshCw,
  Star,
  UserCircle2,
} from 'lucide-react'
import { StarRating } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { useApp } from '@/lib/app-context'
import { CATEGORIES } from '@/lib/nigeria-data'
import { cn } from '@/lib/utils'

const REVIEWS = [
  { who: 'aisha_ng', stars: 5, text: 'Fast delivery and exactly as described. Will buy again!' },
  { who: 'tunde_k', stars: 5, text: 'Very reliable seller, good communication.' },
  { who: 'ngozi_v', stars: 4, text: 'Great quality, packaging could be better.' },
]

export function ProfilePanel() {
  const { user, accounts, switchAccount, logout, goTo } = useApp()
  if (!user) return null
  const isSeller = user.role === 'seller'
  const others = accounts.filter((a) => a.id !== user.id)

  return (
    <div className="space-y-5">
      {/* Identity */}
      <div className="rounded-3xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <div className="size-16 shrink-0 overflow-hidden rounded-2xl bg-muted">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image || "/placeholder.svg"} alt="" className="size-full object-cover" />
            ) : (
              <span className="grid size-full place-items-center text-muted-foreground">
                <UserCircle2 className="size-8" />
              </span>
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold leading-tight">
              {isSeller ? user.business : `@${user.username}`}
            </p>
            <p className="truncate text-sm text-muted-foreground">@{user.username}</p>
            <span className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3.5 text-primary" />
              {user.locality}, {user.state}
            </span>
          </div>
        </div>

        <span
          className={cn(
            'mt-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
            isSeller ? 'bg-primary/10 text-primary' : 'bg-accent/25 text-accent-foreground',
          )}
        >
          {isSeller ? 'Seller account' : 'Buyer account'}
        </span>
      </div>

      {/* Seller trust / Buyer interests */}
      {isSeller ? (
        <div className="rounded-3xl border border-accent/40 bg-gradient-to-b from-accent/15 to-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Trust rating</p>
              <p className="font-display text-3xl font-bold">
                {(user.rating ?? 5).toFixed(1)}
                <span className="text-lg text-muted-foreground"> / 5</span>
              </p>
              <StarRating value={user.rating ?? 5} size={16} className="mt-1" />
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Trust points</p>
              <p className="font-display text-3xl font-bold text-primary">
                {user.points ?? 5}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <MessageSquare className="size-4 text-primary" /> Recent reviews
            </p>
            {REVIEWS.map((r) => (
              <div key={r.who} className="rounded-2xl bg-card/70 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">@{r.who}</span>
                  <span className="inline-flex items-center gap-0.5 text-xs text-accent-foreground">
                    {r.stars} <Star className="size-3 fill-accent text-accent" />
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card p-5">
          <p className="text-sm font-semibold">Your interests</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(user.interests ?? []).map((id) => {
              const label = CATEGORIES.find((c) => c.id === id)?.label ?? id
              return (
                <span
                  key={id}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {label}
                </span>
              )
            })}
            {(user.interests ?? []).length === 0 ? (
              <span className="text-sm text-muted-foreground">No interests selected yet.</span>
            ) : null}
          </div>
        </div>
      )}

      {/* Account switching */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <p className="border-b border-border px-4 py-3 text-sm font-semibold">
          Switch account
        </p>
        {others.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => switchAccount(a.id)}
            className="flex w-full items-center gap-3 border-b border-border px-4 py-3 text-left last:border-0 hover:bg-muted/50"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-muted text-muted-foreground">
              <RefreshCw className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {a.username ? `@${a.username}` : a.email}
              </p>
              <p className="text-xs capitalize text-muted-foreground">{a.role} account</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
        <button
          type="button"
          onClick={() => goTo('signup')}
          className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted/50"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary">
            <Plus className="size-4" />
          </span>
          <span className="text-sm font-medium">Add another account</span>
        </button>
      </div>

      {/* Support */}
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <button
          type="button"
          className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left hover:bg-muted/50"
        >
          <Headphones className="size-5 text-primary" />
          <span className="flex-1 text-sm font-medium">Support & customer service</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/50"
        >
          <MessageSquare className="size-5 text-primary" />
          <span className="flex-1 text-sm font-medium">Send feedback</span>
          <ChevronRight className="size-4 text-muted-foreground" />
        </button>
      </div>

      <Button
        variant="destructive"
        size="lg"
        className="h-12 w-full"
        onClick={logout}
      >
        <LogOut className="size-4" />
        Log out
      </Button>
    </div>
  )
}
