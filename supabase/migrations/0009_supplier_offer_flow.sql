alter table supplier_confirmations
  add column contact_name text,
  add column phone text,
  add column message text,
  add column decline_reason text,
  add column declined_by text check (declined_by in ('admin', 'supplier')),
  add column reviewed_at timestamptz;

update supplier_confirmations set status = 'admin_approved' where status = 'pending';

alter table supplier_confirmations drop constraint supplier_confirmations_status_check;
alter table supplier_confirmations add constraint supplier_confirmations_status_check
  check (status in ('submitted', 'admin_approved', 'confirmed', 'declined'));

alter table supplier_confirmations alter column status set default 'submitted';
