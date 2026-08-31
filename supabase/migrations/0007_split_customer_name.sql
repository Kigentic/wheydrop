alter table orders add column customer_first_name text;
alter table orders add column customer_last_name text;

update orders
set
  customer_first_name = split_part(customer_name, ' ', 1),
  customer_last_name = coalesce(substr(customer_name, length(split_part(customer_name, ' ', 1)) + 2), '')
where customer_name is not null;

alter table orders alter column customer_first_name set not null;
alter table orders alter column customer_last_name set not null;

alter table orders drop column customer_name;
