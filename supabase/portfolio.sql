-- ==============================================================================
-- Portfolio schema: content, ordering, guestbook and visit counter.
-- Run once in the Supabase SQL Editor. Safe to re-run (idempotent).
-- ==============================================================================

-- ---------- Owner check ------------------------------------------------------
-- The owner is whoever signs in with the GitHub account @iiafosh (GitHub user id
-- 256016032). auth.identities is written by Supabase from GitHub's response, so a
-- visitor cannot fake it the way they could edit user_metadata.
create or replace function public.is_portfolio_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from auth.identities
    where user_id = auth.uid()
      and provider = 'github'
      and provider_id = '256016032'
  );
$$;

grant execute on function public.is_portfolio_owner() to anon, authenticated;

-- ---------- Profile (single row) ---------------------------------------------
create table if not exists public.portfolio_profile (
  id int primary key default 1 check (id = 1),
  name text not null,
  short_name text not null,
  handle text not null,
  headline text not null,
  location text not null,
  bio text not null,
  email text not null,
  availability text,
  github_url text not null,
  linkedin_url text not null,
  anghami_url text,
  avatar_url text,
  section_order text[] not null default array['featured','projects','experience','education','skills','certifications','guestbook'],
  updated_at timestamptz not null default now()
);

-- ---------- Items: projects, experience, education, certs, skill groups -------
create table if not exists public.portfolio_items (
  id text primary key default gen_random_uuid()::text,
  kind text not null check (kind in ('project','experience','education','certification','skill_group','achievement')),
  title text not null,
  subtitle text,
  period text,
  location text,
  description text,
  highlights text[] not null default '{}',
  tags text[] not null default '{}',
  url text,
  repo_url text,
  image_url text,
  video_url text,
  featured boolean not null default false,
  sort_order int not null default 100,
  visible boolean not null default true,
  updated_at timestamptz not null default now()
);

create index if not exists portfolio_items_kind_order on public.portfolio_items (kind, sort_order);

-- ---------- Guestbook --------------------------------------------------------
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  github_username text,
  display_name text,
  avatar_url text,
  message text not null check (char_length(btrim(message)) between 1 and 280),
  created_at timestamptz not null default now()
);

create index if not exists guestbook_created_at on public.guestbook (created_at desc);

-- Fill author fields from the GitHub identity (not from client input) and
-- limit each visitor to 3 messages per day.
create or replace function public.guestbook_before_insert()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  ident jsonb;
begin
  new.user_id := auth.uid();
  new.message := btrim(new.message);

  if (select count(*) from public.guestbook
      where user_id = new.user_id and created_at > now() - interval '1 day') >= 3 then
    raise exception 'Guestbook limit reached: 3 messages per day';
  end if;

  select identity_data into ident
  from auth.identities
  where user_id = new.user_id and provider = 'github'
  limit 1;

  new.github_username := coalesce(ident->>'user_name', ident->>'preferred_username');
  new.display_name := coalesce(nullif(ident->>'full_name', ''), nullif(ident->>'name', ''), new.github_username);
  new.avatar_url := ident->>'avatar_url';
  new.created_at := now();
  return new;
end;
$$;

drop trigger if exists guestbook_before_insert on public.guestbook;
create trigger guestbook_before_insert
  before insert on public.guestbook
  for each row execute function public.guestbook_before_insert();

-- ---------- Visit counter ----------------------------------------------------
create table if not exists public.site_stats (
  key text primary key,
  value bigint not null default 0
);

create or replace function public.bump_views()
returns bigint
language sql
security definer
set search_path = ''
as $$
  insert into public.site_stats (key, value) values ('views', 1)
  on conflict (key) do update set value = public.site_stats.value + 1
  returning value;
$$;

grant execute on function public.bump_views() to anon, authenticated;

-- ---------- updated_at triggers ----------------------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists touch_portfolio_profile on public.portfolio_profile;
create trigger touch_portfolio_profile before update on public.portfolio_profile
  for each row execute function public.touch_updated_at();

drop trigger if exists touch_portfolio_items on public.portfolio_items;
create trigger touch_portfolio_items before update on public.portfolio_items
  for each row execute function public.touch_updated_at();

-- ---------- Row Level Security -----------------------------------------------
alter table public.portfolio_profile enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.guestbook enable row level security;
alter table public.site_stats enable row level security;

drop policy if exists "Profile is public" on public.portfolio_profile;
create policy "Profile is public" on public.portfolio_profile
  for select to anon, authenticated using (true);

drop policy if exists "Owner edits profile" on public.portfolio_profile;
create policy "Owner edits profile" on public.portfolio_profile
  for all to authenticated
  using (public.is_portfolio_owner()) with check (public.is_portfolio_owner());

drop policy if exists "Visible items are public" on public.portfolio_items;
create policy "Visible items are public" on public.portfolio_items
  for select to anon, authenticated using (visible or public.is_portfolio_owner());

drop policy if exists "Owner edits items" on public.portfolio_items;
create policy "Owner edits items" on public.portfolio_items
  for all to authenticated
  using (public.is_portfolio_owner()) with check (public.is_portfolio_owner());

drop policy if exists "Guestbook is public" on public.guestbook;
create policy "Guestbook is public" on public.guestbook
  for select to anon, authenticated using (true);

drop policy if exists "Signed-in visitors sign the guestbook" on public.guestbook;
create policy "Signed-in visitors sign the guestbook" on public.guestbook
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "Authors or owner delete guestbook entries" on public.guestbook;
create policy "Authors or owner delete guestbook entries" on public.guestbook
  for delete to authenticated using (auth.uid() = user_id or public.is_portfolio_owner());

drop policy if exists "Stats are public" on public.site_stats;
create policy "Stats are public" on public.site_stats
  for select to anon, authenticated using (true);

-- Realtime for the live guestbook
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'guestbook'
  ) then
    alter publication supabase_realtime add table public.guestbook;
  end if;
end $$;

-- Content lives in supabase/content.sql (generated from src/content/fallback.ts).
-- Run it after this file.
