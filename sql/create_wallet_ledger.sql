-- Create transactions ledger and wallets tables
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  amount numeric(12,2) not null,
  currency text default 'NGN',
  status text default 'pending',
  reference text,
  related_order uuid,
  metadata jsonb,
  created_at timestamptz default now()
);
create index if not exists transactions_user_idx on public.transactions (user_id);

create table if not exists public.wallets (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  balance numeric(12,2) default 0.00,
  updated_at timestamptz default now()
);

-- payment events table
create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text,
  payload jsonb,
  processed boolean default false,
  created_at timestamptz default now()
);
create index if not exists payment_events_provider_event_id_idx on public.payment_events (provider_event_id);
