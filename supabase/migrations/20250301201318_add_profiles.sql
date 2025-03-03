-- First, drop all existing tables and their dependencies
DROP TABLE IF EXISTS public.podcasts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop any existing trigger functions
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.temp_get_username CASCADE;

-- Add username column to auth.users (if not exists)
DO $$ 
BEGIN
    ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS username text UNIQUE;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY,
    username text UNIQUE NOT NULL,  -- Made username UNIQUE and NOT NULL
    full_name text,
    avatar_url text,
    website text,
    twitter_url text,
    facebook_url text,
    instagram_url text,
    bio text,
    created_at timestamptz DEFAULT now(),
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create podcasts table
CREATE TABLE public.podcasts (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    title text NOT NULL,
    description text,
    video_url text,
    thumbnail_url text,
    category text,
    duration integer,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    username text REFERENCES profiles(username) ON DELETE CASCADE  -- Now this will work
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can insert their own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can delete own profile" 
    ON public.profiles FOR DELETE 
    USING (auth.uid() = id);

-- Create policies for podcasts
CREATE POLICY "Public podcasts are viewable by everyone" 
    ON public.podcasts FOR SELECT 
    USING (true);

CREATE POLICY "Users can create podcasts" 
    ON public.podcasts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own podcasts" 
    ON public.podcasts FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own podcasts" 
    ON public.podcasts FOR DELETE 
    USING (auth.uid() = user_id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS podcasts_user_id_idx ON public.podcasts(user_id);
CREATE INDEX IF NOT EXISTS podcasts_username_idx ON public.podcasts(username);
