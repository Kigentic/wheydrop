alter table drop_alerts add column confirmed boolean not null default false;
alter table drop_alerts add column confirm_token uuid not null default gen_random_uuid();
alter table drop_alerts add column confirmed_at timestamptz;

alter table drops add column reminder_24h_sent_at timestamptz;
alter table drops add column reminder_start_sent_at timestamptz;
