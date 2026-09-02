create or replace function public.apply_order_to_drop()
returns trigger
language plpgsql
as $function$
declare
  v_available_units int;
  v_ordered_units int;
  v_max_units int;
  v_total_ordered int;
begin
  select available_units, ordered_units into v_available_units, v_ordered_units
  from variants
  where id = new.variant_id
  for update;

  select max_units, total_ordered into v_max_units, v_total_ordered
  from drops
  where id = new.drop_id
  for update;

  if v_ordered_units + new.quantity > v_available_units then
    raise exception 'not enough stock for variant %', new.variant_id
      using errcode = 'P0001';
  end if;

  if v_total_ordered + new.quantity > v_max_units then
    raise exception 'not enough stock for drop %', new.drop_id
      using errcode = 'P0001';
  end if;

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
$function$;
