'use client'

import { useState } from 'react'
import { MapPin, Phone, TrendingUp } from 'lucide-react'
import { StarRating } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { maskPhone, type Seller } from '@/lib/app-context'
import { CATEGORY_ICON } from '@/lib/category-icons'
import { CATEGORIES } from '@/lib/nigeria-data'
import { cn } from '@/lib/utils'

function categoryLabel(id: string) {
  return CATEGORIES.find((c) => c.id === id)?.label ?? 'General'
}

export function SellerCard({
  seller,
  onOrder,
}: {
  seller: Seller
  onOrder?: (seller: Seller) => void
}) {
  const [revealed, setRevealed] = useState(false)
  const Icon = CATEGORY_ICON[seller.categoryId]

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="relative h-40 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={seller.image || "/placeholder.svg"} alt={seller.business} className="size-full object-cover" />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/90 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur">
          {Icon ? <Icon className="size-3.5 text-primary" /> : null}
          {categoryLabel(seller.categoryId)}
        </span>
        {seller.trending ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
            <TrendingUp className="size-3.5" />
            Trending
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-base font-bold leading-tight">{seller.business}</h3>
            <p className="text-xs text-muted-foreground">@{seller.username}</p>
          </div>
          <div className="flex flex-col items-end">
            <StarRating value={seller.rating} />
            <span className="mt-0.5 text-xs text-muted-foreground">
              {seller.rating.toFixed(1)} · {seller.reviews} reviews
            </span>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">{seller.description}</p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MapPin className="size-3.5 text-primary" />
          {seller.locality}, {seller.lga} · {seller.state}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className={cn(
              'inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-muted/50 px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted',
            )}
          >
            <Phone className="size-4 text-primary" />
            {revealed ? seller.contact : maskPhone(seller.contact)}
          </button>
          <Button size="lg" className="h-10.5" onClick={() => onOrder?.(seller)}>
            Order
          </Button>
        </div>
        {!revealed ? (
          <p className="text-[0.7rem] text-muted-foreground">
            Number partly hidden to prevent spam · tap to reveal
          </p>
        ) : null}
      </div>
    </article>
  )
}
