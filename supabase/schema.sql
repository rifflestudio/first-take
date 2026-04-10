-- First Take Event App — Supabase Schema
-- Run this in the Supabase SQL editor to set up the database.

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- TEAMS
-- ============================================================
create table if not exists teams (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  color       text not null default '#d0ff54',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- USERS (attendees)
-- ============================================================
create type user_role as enum ('rapper', 'producer', 'dj', 'singer', 'artist', 'other');

create table if not exists users (
  id          uuid primary key default uuid_generate_v4(),
  display_name text not null,
  instagram   text,
  role        user_role not null default 'other',
  team_id     uuid references teams(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- QUEUE
-- ============================================================
create type queue_status as enum ('waiting', 'active', 'done', 'no_show');

create table if not exists queue (
  id           uuid primary key default uuid_generate_v4(),
  display_name text not null,
  user_id      uuid references users(id) on delete set null,
  position     integer not null,
  status       queue_status not null default 'waiting',
  started_at   timestamptz,
  ended_at     timestamptz,
  created_at   timestamptz not null default now()
);

-- Unique constraint to prevent duplicate position numbers
create unique index if not exists queue_position_unique on queue(position) where status in ('waiting', 'active');

-- ============================================================
-- ENABLE REALTIME
-- ============================================================
alter publication supabase_realtime add table teams;
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table queue;

-- ============================================================
-- RLS POLICIES (allow all for this event app — single-use internal tool)
-- ============================================================
alter table teams enable row level security;
alter table users enable row level security;
alter table queue enable row level security;

-- Allow all operations (this is an internal event tool, not public-facing auth)
create policy "allow_all_teams" on teams for all using (true) with check (true);
create policy "allow_all_users" on users for all using (true) with check (true);
create policy "allow_all_queue" on queue for all using (true) with check (true);
