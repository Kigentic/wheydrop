create table supplier_confirmations (
  id uuid primary key default gen_random_uuid(),
  drop_id uuid references drops(id),
  supplier_name text not null,
  supplier_email text not null,
  product_title text not null,
  flavors jsonb not null, -- [{ "flavor": "Vanille", "quantity": 1000 }]
  unit_price numeric not null,
  delivery_note text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'declined')),
  confirm_token uuid not null default gen_random_uuid(),
  confirmed_at timestamptz,
  confirmed_ip text,
  created_at timestamptz not null default now()
);

alter table supplier_confirmations enable row level security;
-- no public policies: service-role (admin client) only
