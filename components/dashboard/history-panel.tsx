'use client'

import { CheckCircle2, Clock, Package, Receipt } from 'lucide-react'
import { formatNaira, type Role } from '@/lib/app-context'
import { cn } from '@/lib/utils'

type Order = {
  id: string
  who: string
  item: string
  amount: number
  date: string
  status: 'completed' | 'in-transit' | 'pending'
}

const SELLER_ORDERS: Order[] = [
  { id: '#NM-2041', who: 'chidi_buys', item: '2x Ankara tops', amount: 12000, date: 'Today, 10:24', status: 'in-transit' },
  { id: '#NM-2038', who: 'aisha_ng', item: 'Party jollof (5 plates)', amount: 6500, date: 'Yesterday', status: 'completed' },
  { id: '#NM-2033', who: 'tunde_k', item: 'Sneakers (size 43)', amount: 18500, date: '3 days ago', status: 'completed' },
  { id: '#NM-2027', who: 'ngozi_v', item: 'Shea butter x3', amount: 4500, date: 'Last week', status: 'completed' },
]

const BUYER_ORDERS: Order[] = [
  { id: '#NM-2041', who: "Mama Tayo's Kitchen", item: 'Party jollof (5 plates)', amount: 6500, date: 'Today, 10:24', status: 'in-transit' },
  { id: '#NM-2019', who: 'Ada Thrift Store', item: 'Denim jacket', amount: 9000, date: '2 days ago', status: 'completed' },
  { id: '#NM-1998', who: 'Gadget Hub NG', item: 'Phone case + charger', amount: 7500, date: 'Last week', status: 'completed' },
]

const STATUS = {
  completed: { label: 'Completed', icon: CheckCircle2, cls: 'text-primary bg-primary/10' },
  'in-transit': { label: 'In transit', icon: Package, cls: 'text-accent-foreground bg-accent/25' },
  pending: { label: 'Pending', icon: Clock, cls: 'text-muted-foreground bg-muted' },
} as const

export function HistoryPanel({ role }: { role: Role }) {
  const orders = role === 'seller' ? SELLER_ORDERS : BUYER_ORDERS
  const total = orders
    .filter((o) => o.status === 'completed')
    .reduce((s, o) => s + o.amount, 0)

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            {role === 'seller' ? 'Total sales' : 'Total spent'}
          </p>
          <p className="mt-1 font-display text-xl font-bold">{formatNaira(total)}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">
            {role === 'seller' ? 'Orders fulfilled' : 'Orders placed'}
          </p>
          <p className="mt-1 font-display text-xl font-bold">{orders.length}</p>
        </div>
      </div>

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
          <Receipt className="size-4 text-primary" />
          {role === 'seller' ? 'Sales history' : 'Purchase history'}
        </p>
        <div className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-card">
          {orders.map((o) => {
            const s = STATUS[o.status]
            return (
              <div key={o.id} className="flex items-center gap-3 p-3.5">
                <span className={cn('grid size-10 shrink-0 place-items-center rounded-xl', s.cls)}>
                  <s.icon className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{o.item}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {role === 'seller' ? '@' : ''}
                    {o.who} · {o.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatNaira(o.amount)}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{o.date}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
