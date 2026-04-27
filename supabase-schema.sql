-- Run this in your Supabase SQL editor

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  preferred_name text,
  email text not null,
  phone text,
  license_number text,
  headshot_url text,
  created_at timestamptz default now()
);

create table public.module_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  module_id text not null,
  section_id text not null,
  completed boolean default false,
  completed_at timestamptz,
  unique(user_id, module_id, section_id)
);

-- RLS
alter table public.profiles enable row level security;
alter table public.module_progress enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can view own progress" on public.module_progress
  for select using (auth.uid() = user_id);

create policy "Users can upsert own progress" on public.module_progress
  for all using (auth.uid() = user_id);

-- Admin: service role bypasses RLS automatically
-- For the admin page, use the service role key (server-side only)

-- Trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
