-- members table (email-keyed)
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- subscriptions table
create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references members(id) on delete cascade,
  plan text check (plan in ('basic','pro','vip')) not null,
  status text check (status in ('active','canceled','expired')) not null default 'active',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  period text check (period in ('monthly','yearly')) not null default 'monthly',
  provider text,
  provider_ref text,
  updated_at timestamptz default now()
);
create unique index if not exists subscriptions_member_unique on subscriptions(member_id);

-- signals to send
create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  title text,
  symbol text,
  pair text,
  type text,
  entry text,
  sl text,
  tp1 text,
  tp2 text,
  risk text,
  audience text check (audience in ('basic','pro','vip')) not null,
  scheduled_at timestamptz not null default now(),
  status text check (status in ('queued','sent','canceled')) not null default 'queued',
  sent_at timestamptz
);

-- deliveries log
create table if not exists deliveries (
  id uuid primary key default gen_random_uuid(),
  signal_id uuid references signals(id) on delete cascade,
  email text not null,
  channel text check (channel in ('email','telegram')) not null default 'email',
  delivered_at timestamptz default now()
);

-- RPC: list active subscribers (email) for a given audience
create or replace function active_subscribers_for_audience(p_audience text)
returns table(email text)
language sql stable as $$
  select m.email
  from subscriptions s
  join members m on m.id = s.member_id
  where s.status = 'active'
    and s.ends_at > now()
    and (
      (p_audience = 'basic' and s.plan in ('basic','pro','vip')) or
      (p_audience = 'pro' and s.plan in ('pro','vip')) or
      (p_audience = 'vip' and s.plan = 'vip')
    );
$$;
