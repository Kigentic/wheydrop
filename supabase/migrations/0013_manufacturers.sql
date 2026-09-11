create table manufacturers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  contact_name text,
  contact_email text,
  stripe_account_id text,
  onboarding_status text not null default 'not_started' check (onboarding_status in ('not_started', 'pending', 'complete')),
  created_at timestamptz not null default now()
);

alter table drops
  add column manufacturer_id uuid references manufacturers(id);

create table manufacturer_transfers (
  id uuid primary key default gen_random_uuid(),
  drop_id uuid not null references drops(id),
  manufacturer_id uuid not null references manufacturers(id),
  amount numeric not null,
  stripe_transfer_id text not null,
  created_at timestamptz not null default now()
);
