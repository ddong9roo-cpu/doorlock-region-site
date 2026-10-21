-- Run once in Supabase SQL Editor. Tables are private to the service role.
create table if not exists public.settings (id integer primary key check (id=1), phone text not null default '',brand text not null default '도어락 출장 서비스',hours24 boolean not null default false);
insert into public.settings(id) values (1) on conflict (id) do nothing;
create table if not exists public.regions (id bigint generated always as identity primary key,province text not null,province_slug text not null check (province_slug in ('seoul','gyeonggi','incheon')),district text not null,slug text not null,neighborhoods text not null default '',description text not null default '',published boolean not null default false,updated_at timestamptz not null default now(),unique(province_slug,slug));
alter table public.settings enable row level security;
alter table public.regions enable row level security;
-- No anonymous policies: only the server-side service role can read or write.
-- Add verified regions using /admin. No unverified location is published by default.
