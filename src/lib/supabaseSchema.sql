-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Update profiles table
alter table profiles 
add column if not exists team text,
add column if not exists location text;

-- Create shifts table
create table if not exists public.shifts (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) not null,
    start_time timestamp with time zone not null,
    end_time timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies for shifts
alter table public.shifts enable row level security;

-- Managers can do everything
create policy "Managers can do everything" on public.shifts
for all using (
    exists (
        select 1 from profiles
        where profiles.id = auth.uid()
        and profiles.role = 'manager'
    )
);

-- Employees can view their own shifts
create policy "Employees can view their own shifts" on public.shifts
for select using (
    auth.uid() = user_id
);

-- Add some sample data for teams and locations
insert into public.profiles (team, location)
values 
    ('Kitchen', 'Main Restaurant'),
    ('Service', 'Main Restaurant'),
    ('Bar', 'Main Restaurant'),
    ('Kitchen', 'Second Location'),
    ('Service', 'Second Location')
on conflict (id) do update
set 
    team = EXCLUDED.team,
    location = EXCLUDED.location;

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create trigger for shifts table
create trigger handle_shifts_updated_at
    before update on public.shifts
    for each row
    execute function public.handle_updated_at();
