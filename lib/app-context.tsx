'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Role = 'buyer' | 'seller'

export type Txn = {
  id: string
  type: 'fund' | 'payment' | 'escrow' | 'payout'
  label: string
  amount: number // positive = credit, negative = debit
  date: string
  status: 'completed' | 'pending' | 'in-escrow'
}

export type Seller = {
  id: string
  username: string
  business: string
  description: string
  image: string
  categoryId: string
  rating: number
  points: number
  reviews: number
  contact: string // full number, masked on display
  state: string
  lga: string
  locality: string
  area: string
  lat: number
  lng: number
  trending?: boolean
}

export type User = {
  id: string
  email: string
  phone: string
  nin: string
  role: Role
  state: string // locked after registration
  username?: string
  onboarded: boolean
  // shared profile
  contact?: string
  lga?: string
  locality?: string
  area?: string
  image?: string
  // seller
  business?: string
  description?: string
  categoryId?: string
  rating?: number
  points?: number
  // buyer
  interests?: string[]
}

export type View = 'signup' | 'login' | 'onboarding' | 'app'

type SignupInput = {
  email: string
  phone: string
  nin: string
  password: string
  role: Role
  state: string
}

type AppState = {
  view: View
  user: User | null
  accounts: User[]
  wallet: number
  txns: Txn[]
  sellers: Seller[]
  // actions
  signup: (input: SignupInput) => void
  login: (email: string) => boolean
  logout: () => void
  finishSellerOnboarding: (data: Partial<User>) => void
  finishBuyerOnboarding: (data: Partial<User>) => void
  switchAccount: (id: string) => void
  goTo: (view: View) => void
  fundWallet: (amount: number) => void
  payToEscrow: (sellerName: string, amount: number) => void
}

export function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.length < 7) return '•••• ••• ••••'
  return `${digits.slice(0, 4)} ••• ${digits.slice(-2)}**`
}

export function formatNaira(n: number) {
  return '₦' + n.toLocaleString('en-NG')
}

const SEED_SELLERS: Seller[] = [
  {
    id: 's1',
    username: 'mama_tayo_foods',
    business: "Mama Tayo's Kitchen",
    description: 'Fresh jollof, soups & small chops made to order daily.',
    image: '/sellers/foods.png',
    categoryId: 'food',
    rating: 4.9,
    points: 5,
    reviews: 214,
    contact: '08031234567',
    state: 'Lagos',
    lga: 'Eti-Osa',
    locality: 'Lekki Phase 1',
    area: 'Admiralty Way',
    lat: 6.4478,
    lng: 3.4723,
    trending: true,
  },
  {
    id: 's2',
    username: 'gadget_hub_ng',
    business: 'Gadget Hub NG',
    description: 'UK-used phones, laptops & accessories with warranty.',
    image: '/sellers/electronics.png',
    categoryId: 'electronics',
    rating: 4.7,
    points: 5,
    reviews: 156,
    contact: '07098765432',
    state: 'Lagos',
    lga: 'Eti-Osa',
    locality: 'Victoria Island',
    area: 'Adeola Odeku',
    lat: 6.4281,
    lng: 3.4219,
    trending: true,
  },
  {
    id: 's3',
    username: 'ada_thrift',
    business: 'Ada Thrift Store',
    description: 'Grade-A okrika, bags & sneakers. New drops every week.',
    image: '/sellers/fashion.png',
    categoryId: 'fashion',
    rating: 4.8,
    points: 5,
    reviews: 98,
    contact: '08123456789',
    state: 'Lagos',
    lga: 'Surulere',
    locality: 'Aguda',
    area: 'Enitan Street',
    lat: 6.4969,
    lng: 3.3548,
  },
  {
    id: 's4',
    username: 'glow_by_bisi',
    business: 'Glow by Bisi',
    description: 'Natural skincare, shea butter & hair products.',
    image: '/sellers/beauty.png',
    categoryId: 'beauty',
    rating: 4.6,
    points: 5,
    reviews: 73,
    contact: '09011223344',
    state: 'Lagos',
    lga: 'Ikeja',
    locality: 'GRA Ikeja',
    area: 'Isaac John',
    lat: 6.5833,
    lng: 3.3556,
    trending: true,
  },
  {
    id: 's5',
    username: 'farm_fresh_lekki',
    business: 'Farm Fresh Lekki',
    description: 'Vegetables, tubers & poultry direct from the farm.',
    image: '/sellers/farm.png',
    categoryId: 'farm',
    rating: 4.9,
    points: 5,
    reviews: 141,
    contact: '08067788990',
    state: 'Lagos',
    lga: 'Eti-Osa',
    locality: 'Ajah',
    area: 'Addo Road',
    lat: 6.4698,
    lng: 3.5852,
  },
  {
    id: 's6',
    username: 'fixit_artisans',
    business: 'FixIt Artisans',
    description: 'Plumbing, electrical & AC repair. Same-day service.',
    image: '/sellers/services.png',
    categoryId: 'services',
    rating: 4.5,
    points: 5,
    reviews: 52,
    contact: '07033445566',
    state: 'Lagos',
    lga: 'Kosofe',
    locality: 'Ketu',
    area: 'Demurin Road',
    lat: 6.5921,
    lng: 3.3841,
  },
]

const SEED_TXNS: Txn[] = [
  {
    id: 't1',
    type: 'fund',
    label: 'Wallet top-up • Card',
    amount: 25000,
    date: '2 days ago',
    status: 'completed',
  },
  {
    id: 't2',
    type: 'escrow',
    label: "Order held • Mama Tayo's Kitchen",
    amount: -6500,
    date: 'Yesterday',
    status: 'in-escrow',
  },
]

const AppContext = createContext<AppState | null>(null)

let idc = 100
const nextId = () => `id_${++idc}`

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>('signup')
  const [user, setUser] = useState<User | null>(null)
  const [accounts, setAccounts] = useState<User[]>([])
  const [wallet, setWallet] = useState<number>(18500)
  const [txns, setTxns] = useState<Txn[]>(SEED_TXNS)
  const [sellers] = useState<Seller[]>(SEED_SELLERS)

  const signup = useCallback((input: SignupInput) => {
    const u: User = {
      id: nextId(),
      email: input.email,
      phone: input.phone,
      nin: input.nin,
      role: input.role,
      state: input.state,
      onboarded: false,
      rating: input.role === 'seller' ? 5 : undefined,
      points: input.role === 'seller' ? 5 : undefined,
    }
    setUser(u)
    setAccounts((prev) => [...prev, u])
    setView('onboarding')
  }, [])

  const login = useCallback(
    (email: string) => {
      const found = accounts.find((a) => a.email === email)
      if (found) {
        setUser(found)
        setView(found.onboarded ? 'app' : 'onboarding')
        return true
      }
      return false
    },
    [accounts],
  )

  const persist = useCallback((updated: User) => {
    setUser(updated)
    setAccounts((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }, [])

  const finishSellerOnboarding = useCallback(
    (data: Partial<User>) => {
      if (!user) return
      persist({ ...user, ...data, onboarded: true, rating: 5, points: 5 })
      setView('app')
    },
    [user, persist],
  )

  const finishBuyerOnboarding = useCallback(
    (data: Partial<User>) => {
      if (!user) return
      persist({ ...user, ...data, onboarded: true })
      setView('app')
    },
    [user, persist],
  )

  const switchAccount = useCallback(
    (id: string) => {
      const found = accounts.find((a) => a.id === id)
      if (found) {
        setUser(found)
        setView(found.onboarded ? 'app' : 'onboarding')
      }
    },
    [accounts],
  )

  const logout = useCallback(() => {
    setUser(null)
    setView('login')
  }, [])

  const goTo = useCallback((v: View) => setView(v), [])

  const fundWallet = useCallback((amount: number) => {
    setWallet((w) => w + amount)
    setTxns((prev) => [
      {
        id: nextId(),
        type: 'fund',
        label: 'Wallet top-up • Card',
        amount,
        date: 'Just now',
        status: 'completed',
      },
      ...prev,
    ])
  }, [])

  const payToEscrow = useCallback((sellerName: string, amount: number) => {
    setWallet((w) => Math.max(0, w - amount))
    setTxns((prev) => [
      {
        id: nextId(),
        type: 'escrow',
        label: `Order held • ${sellerName}`,
        amount: -amount,
        date: 'Just now',
        status: 'in-escrow',
      },
      ...prev,
    ])
  }, [])

  const value = useMemo<AppState>(
    () => ({
      view,
      user,
      accounts,
      wallet,
      txns,
      sellers,
      signup,
      login,
      logout,
      finishSellerOnboarding,
      finishBuyerOnboarding,
      switchAccount,
      goTo,
      fundWallet,
      payToEscrow,
    }),
    [
      view,
      user,
      accounts,
      wallet,
      txns,
      sellers,
      signup,
      login,
      logout,
      finishSellerOnboarding,
      finishBuyerOnboarding,
      switchAccount,
      goTo,
      fundWallet,
      payToEscrow,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
