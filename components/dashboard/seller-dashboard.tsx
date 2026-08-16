'use client'

import { useMemo, useState } from 'react'
import { useApp, formatNaira } from '@/lib/app-context'
import { CATEGORIES } from '@/lib/nigeria-data'
import { categoryIcon } from '@/lib/category-icons'
import { BottomNav, type Tab } from '@/components/dashboard/bottom-nav'
import { WalletPanel } from '@/components/dashboard/wallet-panel'
import { HistoryPanel } from '@/components/dashboard/history-panel'
import { ProfilePanel } from '@/components/dashboard/profile-panel'
import { StarRating } from '@/components/brand'
import {
  TrendingUp,
  Search as SearchIcon,
  MapPin,
  Sparkles,
  Lightbulb,
  History as HistoryIcon,
  Wallet as WalletIcon,
  UserCircle2,
} from 'lucide-react'

const SELLER_TABS: Tab[] = [
  { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  { id: 'search', label: 'Search', icon: SearchIcon },
  { id: 'history', label: 'History', icon: HistoryIcon },
  { id: 'wallet', label: 'Wallet', icon: WalletIcon },
  { id: 'profile', label: 'Profile', icon: UserCircle2 },
]

type Demand = {
  id: string
  item: string
  categoryId: string
  trend: string
  requests: number
}

export function SellerDashboard() {
  const { user } = useApp()
  const [tab, setTab] = useState<string>('suggestions')

  const locality = user?.locality || 'your area'

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-background">
      <main className="flex-1 pb-24">
        {tab === 'suggestions' && <SellerSuggestions locality={locality} />}
        {tab === 'search' && <SellerSearch />}
        {tab === 'history' && (
          <div className="p-5">
            <HistoryPanel role="seller" />
          </div>
        )}
        {tab === 'wallet' && (
          <div className="p-5">
            <WalletPanel role="seller" />
          </div>
        )}
        {tab === 'profile' && (
          <div className="p-5">
            <ProfilePanel />
          </div>
        )}
      </main>
      <BottomNav tabs={SELLER_TABS} active={tab} onChange={setTab} />
    </div>
  )
}

function SellerSuggestions({ locality }: { locality: string }) {
  const demands: Demand[] = [
    { id: 'd1', item: 'Small chops (party trays)', categoryId: 'food', trend: '+38% this week', requests: 62 },
    { id: 'd2', item: 'UK-used iPhone 12/13', categoryId: 'electronics', trend: '+21% this week', requests: 47 },
    { id: 'd3', item: 'Ankara ready-to-wear', categoryId: 'fashion', trend: '+16% this week', requests: 33 },
    { id: 'd4', item: 'Fresh pepper & tomato baskets', categoryId: 'farm', trend: '+12% this week', requests: 28 },
  ]

  return (
    <div className="flex flex-col gap-5 p-5">
      <header className="flex flex-col gap-1">
        <p className="font-sans text-sm text-muted-foreground">Demand near you</p>
        <h1 className="font-display text-2xl font-bold text-foreground text-balance">
          Trending in {locality}
        </h1>
        <p className="font-sans text-sm text-muted-foreground text-pretty">
          What buyers around you are searching for right now. Stock these to get recommended first.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        {demands.map((d) => {
          const Icon = categoryIcon(d.categoryId)
          return (
            <div
              key={d.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Icon className="size-6" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate font-sans font-semibold text-card-foreground">{d.item}</p>
                <span className="inline-flex items-center gap-1 font-sans text-xs font-medium text-primary">
                  <TrendingUp className="size-3.5" /> {d.trend}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-display text-lg font-bold text-foreground">{d.requests}</span>
                <span className="font-sans text-[11px] text-muted-foreground">requests</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-accent/40 bg-accent/15 p-4">
        <Sparkles className="mt-0.5 size-5 shrink-0 text-accent-foreground" />
        <p className="font-sans text-sm text-accent-foreground text-pretty">
          Sellers who restock trending items keep a higher local ranking and a 5-star trust score.
        </p>
      </div>
    </div>
  )
}

function SellerSearch() {
  const { sellers } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('all')

  const results = useMemo(() => {
    return sellers.filter((s) => {
      const matchesQ =
        !q ||
        s.business.toLowerCase().includes(q.toLowerCase()) ||
        s.username.toLowerCase().includes(q.toLowerCase())
      const matchesCat = cat === 'all' || s.categoryId === cat
      return matchesQ && matchesCat
    })
  }, [sellers, q, cat])

  return (
    <div className="flex flex-col gap-4 p-5">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-foreground">Market lookup</h1>
        <p className="font-sans text-sm text-muted-foreground">
          Research other sellers and pricing in your category.
        </p>
      </header>

      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search sellers or products"
          className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-3 font-sans text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterChip active={cat === 'all'} onClick={() => setCat('all')} label="All" />
        {CATEGORIES.map((c) => (
          <FilterChip
            key={c.id}
            active={cat === c.id}
            onClick={() => setCat(c.id)}
            label={c.label}
          />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {results.map((s) => (
          <div
            key={s.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <img
              src={s.image || '/placeholder.svg'}
              alt={s.business}
              className="size-14 shrink-0 rounded-xl object-cover"
            />
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="truncate font-sans font-semibold text-card-foreground">{s.business}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-muted-foreground">
                <MapPin className="size-3.5" /> {s.locality}
              </span>
              <div className="mt-1">
                <StarRating value={s.rating} size={13} />
              </div>
            </div>
          </div>
        ))}
        {results.length === 0 && (
          <p className="py-10 text-center font-sans text-sm text-muted-foreground">
            No sellers match your search.
          </p>
        )}
      </div>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'rounded-full border px-3.5 py-1.5 font-sans text-xs font-medium transition-colors ' +
        (active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:border-primary/40')
      }
    >
      {label}
    </button>
  )
}
