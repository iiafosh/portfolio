-- ==============================================================================
-- Supabase Database Schema: User Items & Row Level Security (RLS)
-- ==============================================================================
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new

-- 1. Create the user_items table
create table if not exists public.user_items (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    title text not null,
    description text,
    is_completed boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.user_items enable row level security;

-- 3. Create RLS Policies so each authenticated user can only access their own items
-- Policy: SELECT (Read)
create policy "Users can read own items"
    on public.user_items
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Policy: INSERT (Create)
create policy "Users can insert own items"
    on public.user_items
    for insert
    to authenticated
    with check (auth.uid() = user_id);

-- Policy: UPDATE (Edit / Toggle completed)
create policy "Users can update own items"
    on public.user_items
    for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- Policy: DELETE (Remove)
create policy "Users can delete own items"
    on public.user_items
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- 4. Enable Supabase Realtime for this table (optional, for live sync)
alter publication supabase_realtime add table public.user_items;

-- 5. Auto-update timestamp trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create or replace trigger set_user_items_updated_at
    before update on public.user_items
    for each row
    execute function public.handle_updated_at();
