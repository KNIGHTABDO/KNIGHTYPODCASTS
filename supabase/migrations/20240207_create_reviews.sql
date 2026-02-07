-- Create reviews table for "Letterboxd-style" logging
create table if not exists public.reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  stream_id uuid references public.streams(id) on delete cascade not null,
  rating numeric(2,1) check (rating >= 0 and rating <= 5), -- Allows 3.5, 4.0 etc
  content text, -- The review text
  watched_at timestamp with time zone default timezone('utc'::text, now()),
  
  -- Ensure one review per user per stream (Letterboxd style usually allows multiple logs, but let's start simple)
  unique(user_id, stream_id)
);

-- Enable RLS
alter table public.reviews enable row level security;

-- Policies
create policy "Reviews are viewable by everyone" 
  on public.reviews for select 
  using (true);

create policy "Users can insert their own reviews" 
  on public.reviews for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own reviews" 
  on public.reviews for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own reviews" 
  on public.reviews for delete 
  using (auth.uid() = user_id);

-- Add average rating to streams (optional, but good for performance later)
-- For now we can calculate it on the fly or add a trigger later.
