import { cn } from '@/lib/utils'
import { Store, Star } from 'lucide-react'

export function Logo({
  className,
  showText = true,
}: {
  className?: string
  showText?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Store className="size-5" />
      </span>
      {showText ? (
        <span className="font-display text-lg font-bold leading-none tracking-tight">
          Naija<span className="text-primary">Market</span>
        </span>
      ) : null}
    </div>
  )
}

export function StarRating({
  value,
  size = 14,
  className,
}: {
  value: number
  size?: number
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-0.5', className)} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = value >= i - 0.25
        return (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={cn(
              filled ? 'fill-accent text-accent' : 'fill-none text-muted-foreground/40',
            )}
          />
        )
      })}
    </span>
  )
}
