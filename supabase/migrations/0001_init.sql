-- Proteinbörse initial schema

create type drop_status as enum ('upcoming', 'active', 'closed');
create type order_status as enum ('authorized', 'captured', 'cancelled', 'refunded');

create table drops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  brand_name text not null,
  status drop_status not null default 'upcoming',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  price_tiers jsonb not null, -- [{min_units, max_units, price}]
  max_units integer not null,
  total_ordered integer not null default 0,
  current_price numeric not null,
  created_at timestamptz not null default now()
);

create table variants (
  id uuid primary key default gen_random_uuid(),
  drop_id uuid not null references drops(id) on delete cascade,
  flavor text not null,
  available_units integer not null,
  ordered_units integer not null default 0
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  drop_id uuid not null references drops(id) on delete restrict,
  variant_id uuid not null references variants(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  authorized_amount numeric not null,
  final_amount numeric,
  stripe_payment_intent text,
  status order_status not null default 'authorized',
  customer_name text not null,
  customer_email text not null,
  customer_address jsonb not null,
  created_at timestamptz not null default now()
);

create index orders_drop_id_idx on orders(drop_id);
create index orders_variant_id_idx on orders(variant_id);
create index variants_drop_id_idx on variants(drop_id);

-- price lookup: given ordered units + tiers, find current price
create or replace function price_for_units(tiers jsonb, units integer)
returns numeric
language sql
immutable
as $$
  select (tier->>'price')::numeric
  from jsonb_array_elements(tiers) as tier
  where units >= (tier->>'min_units')::integer
    and (
      (tier->>'max_units') is null
      or units <= (tier->>'max_units')::integer
    )
  order by (tier->>'min_units')::integer desc
  limit 1
$$;

-- after an order is inserted: bump counters and recompute current_price
create or replace function apply_order_to_drop()
returns trigger
language plpgsql
as $$
begin
  update variants
  set ordered_units = ordered_units + new.quantity
  where id = new.variant_id;

  update drops
  set
    total_ordered = total_ordered + new.quantity,
    current_price = price_for_units(price_tiers, total_ordered + new.quantity)
  where id = new.drop_id;

  return new;
end;
$$;

create trigger orders_after_insert
after insert on orders
for each row
execute function apply_order_to_drop();

-- realtime
alter publication supabase_realtime add table drops;
alter publication supabase_realtime add table variants;

-- RLS
alter table drops enable row level security;
alter table variants enable row level security;
alter table orders enable row level security;

create policy "drops are publicly readable"
  on drops for select
  using (true);

create policy "variants are publicly readable"
  on variants for select
  using (true);

-- orders: no public select/insert; all writes go through service role (API routes)
