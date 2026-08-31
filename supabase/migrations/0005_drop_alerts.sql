create table drop_alerts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table drop_alerts enable row level security;
-- no public policies: only accessed via service role in the API route
