create table if not exists automation_logs (
  id bigint generated always as identity primary key,
  event text not null,
  details jsonb,
  created_at timestamptz default now()
);
