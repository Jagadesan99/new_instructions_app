-- =============================================
-- Contact Instructions App - Supabase Migration
-- Run this in: Supabase Dashboard → SQL Editor
-- =============================================

-- 1. PROFILES TABLE
-- Stores user profile data (linked to auth.users)
create table if not exists public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    display_name text not null default 'Me',
    global_instructions text not null default '',
    email text,
    updated_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Profiles policies: users can only access their own profile
create policy "Users can view own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can insert own profile"
    on public.profiles for insert
    with check (auth.uid() = id);


-- 2. CONTACTS TABLE
-- Stores contacts for each user
create table if not exists public.contacts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) on delete cascade not null,
    name text not null,
    relation text not null check (relation in ('Family', 'Friend', 'Work', 'Other')),
    status text not null default 'pending' check (status in ('pending', 'accepted')),
    color text not null default 'bg-violet-500',
    specific_instructions text not null default '',
    updated_at timestamptz not null default now(),
    created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.contacts enable row level security;

-- Contacts policies: users can only CRUD their own contacts
create policy "Users can view own contacts"
    on public.contacts for select
    using (auth.uid() = user_id);

create policy "Users can insert own contacts"
    on public.contacts for insert
    with check (auth.uid() = user_id);

create policy "Users can update own contacts"
    on public.contacts for update
    using (auth.uid() = user_id);

create policy "Users can delete own contacts"
    on public.contacts for delete
    using (auth.uid() = user_id);


-- 3. INVITATIONS TABLE
-- Stores invitation tokens for sharing instructions with contacts
create table if not exists public.invitations (
    id uuid primary key default gen_random_uuid(),
    contact_id uuid references public.contacts(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    token text unique not null default encode(gen_random_bytes(32), 'hex'),
    accepted_at timestamptz,
    created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.invitations enable row level security;

-- Invitation policies
create policy "Users can view own invitations"
    on public.invitations for select
    using (auth.uid() = user_id);

create policy "Users can create own invitations"
    on public.invitations for insert
    with check (auth.uid() = user_id);

-- Public access by token (for share links - no auth required)
create policy "Anyone can view invitation by token"
    on public.invitations for select
    using (true);


-- 4. AUTO-CREATE PROFILE ON SIGNUP
-- Trigger function to create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, email, display_name)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'display_name', 'Me')
    );
    return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();


-- 5. UPDATED_AT AUTO-UPDATE TRIGGERS
create or replace function public.update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
    before update on public.profiles
    for each row execute function public.update_updated_at();

create trigger contacts_updated_at
    before update on public.contacts
    for each row execute function public.update_updated_at();


-- 6. INDEXES for performance
create index if not exists idx_contacts_user_id on public.contacts(user_id);
create index if not exists idx_invitations_contact_id on public.invitations(contact_id);
create index if not exists idx_invitations_token on public.invitations(token);
