alter table drops add column description text not null default '';
alter table drops add column image_urls jsonb not null default '[]'::jsonb;
