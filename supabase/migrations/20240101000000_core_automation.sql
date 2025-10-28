create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  plan text check (plan in ('basic','pro','vip')),
  status text check (status in ('active','expired')),
  starts_at timestamptz,
  ends_at timestamptz,
  period text,
  provider text,
  provider_ref text
);

create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  title text,
  symbol text,
  type text,
  audience text check (audience in ('basic','pro','vip')),
  scheduled_at timestamptz default now(),
  status text default 'queued'
);

create or replace function active_subscribers_for_audience(p_audience text)
returns table(email text)
language sql stable as $$
  select m.email from subscriptions s
  join members m on m.id = s.member_id
  where s.status='active' and s.ends_at>now()
  and (
    (p_audience='basic' and s.plan in ('basic','pro','vip')) or
    (p_audience='pro' and s.plan in ('pro','vip')) or
    (p_audience='vip' and s.plan='vip')
  );
$$;
