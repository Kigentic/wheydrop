alter table orders add column customer_id uuid references auth.users(id) on delete set null;
create index orders_customer_id_idx on orders(customer_id);

create policy "customers can view their own orders"
  on orders for select
  using (auth.uid() = customer_id);
