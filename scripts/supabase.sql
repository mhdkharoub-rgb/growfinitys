-- Run this in Supabase SQL editor
create table if not exists profiles (
id uuid primary key references auth.users(id) on delete cascade,
email text unique,
role text default 'user' check (role in ('user','admin')),
created_at timestamptz default now()
);


create table if not exists subscriptions (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users(id) on delete cascade,
plan text not null check (plan in ('basic','basic-yearly','pro','pro-yearly','vip','vip-yearly')),
status text not null check (status in ('active','canceled','expired','trial')) default 'active',
expires_at timestamptz,
created_at timestamptz default now()
);


create index if not exists idx_subscriptions_user on subscriptions(user_id);


create table if not exists signals (
id uuid primary key default gen_random_uuid(),
kind text not null check (kind in ('hourly','daily','monthly')),
payload jsonb not null,
created_at timestamptz default now()
);


-- RLS
alter table profiles enable row level security;
alter table subscriptions enable row level security;
alter table signals enable row level security;


create policy "profiles self or admin" on profiles
for select using (auth.uid() = id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));


create policy "subscriptions by user or admin" on subscriptions
for select using (user_id = auth.uid() or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));


create policy "signals read for all" on signals for select using (true);


-- Upsert helper function (optional)
create or replace function public.ensure_profile()
returns trigger as $$
begin
insert into public.profiles(id, email)
values (new.id, new.email)
on conflict (id) do update set email = excluded.email;
return new;
end;
$$ language plpgsql security definer;


create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.ensure_profile();
