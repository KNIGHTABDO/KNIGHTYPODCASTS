# KnightyPodcasts — Full Deployment Guide (Supabase + Vercel)

This guide walks you through deploying KnightyPodcasts from scratch using **Supabase** (database, auth, storage) and **Vercel** (frontend hosting).

---

## Prerequisites

- A [GitHub](https://github.com) account (repository forked or cloned)
- A [Supabase](https://supabase.com) account (free tier works)
- A [Vercel](https://vercel.com) account (free tier works)
- *(Optional)* A [YouTube Data API v3](https://console.cloud.google.com/) key

---

## Step 1 — Create a Supabase Project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard) and click **New project**.
2. Choose your organization (or create one).
3. Fill in:
   - **Name:** `knighty-podcasts` (or any name you like)
   - **Database Password:** choose a strong password and save it somewhere safe
   - **Region:** pick the region closest to your users
4. Click **Create new project** and wait for provisioning to finish.

---

## Step 2 — Disable Email Verification in Supabase Auth

> **⚠️ IMPORTANT:** By default Supabase requires email confirmation before a user can sign in. This app does **not** implement a confirmation flow, so you **must** disable it or users will not be able to log in after signing up.

1. In your Supabase dashboard, go to **Authentication → Providers** (left sidebar → Authentication → Providers).
2. Under the **Email** provider, find the toggle **Confirm email**.
3. **Turn it OFF** (disable it).
4. Click **Save**.

---

## Step 3 — Run Database Migrations

You need to run **five** SQL migration scripts in order. Go to your Supabase dashboard → **SQL Editor** (left sidebar), click **New query**, paste each script below, and click **Run**. Run them **one at a time, in order**.

### Migration 1 — Create podcasts table

```sql
CREATE TABLE IF NOT EXISTS podcasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  category text NOT NULL,
  duration integer NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id)
);

ALTER TABLE podcasts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view podcasts"
  ON podcasts
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own podcasts"
  ON podcasts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own podcasts"
  ON podcasts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own podcasts"
  ON podcasts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
```

### Migration 2 — Create profiles table and rebuild podcasts

> This migration drops the initial podcasts table and recreates it with profile support. This is safe on a fresh project.

```sql
DROP TABLE IF EXISTS public.podcasts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.temp_get_username CASCADE;

DO $$ 
BEGIN
    ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS username text UNIQUE;
EXCEPTION
    WHEN duplicate_column THEN NULL;
END $$;

CREATE TABLE public.profiles (
    id uuid PRIMARY KEY,
    username text UNIQUE NOT NULL,
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
    username text REFERENCES profiles(username) ON DELETE CASCADE
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS podcasts_user_id_idx ON public.podcasts(user_id);
CREATE INDEX IF NOT EXISTS podcasts_username_idx ON public.podcasts(username);
```

### Migration 3 — Create comments table

```sql
CREATE TABLE public.comments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    podcast_id uuid REFERENCES public.podcasts(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    username text REFERENCES public.profiles(username) ON DELETE CASCADE,
    content text NOT NULL,
    parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public comments are viewable by everyone" 
    ON public.comments FOR SELECT 
    USING (true);

CREATE POLICY "Users can create comments" 
    ON public.comments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments" 
    ON public.comments FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments" 
    ON public.comments FOR DELETE 
    USING (auth.uid() = user_id);

CREATE INDEX comments_podcast_id_idx ON public.comments(podcast_id);
CREATE INDEX comments_parent_id_idx ON public.comments(parent_id);
```

### Migration 4 — Create avatars storage bucket

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### Migration 5 — Create podcast-files storage bucket

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('podcast-files', 'podcast-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload their own podcast files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'podcast-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own podcast files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'podcast-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own podcast files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'podcast-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view podcast files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'podcast-files');
```

---

## Step 4 — Get Your Supabase Credentials

You need two values from Supabase to connect the app:

1. In the Supabase dashboard, go to **Settings → API** (left sidebar → Project Settings → API).
2. Copy:
   - **Project URL** — looks like `https://abcdefghij.supabase.co`
   - **anon / public** key — the key under "Project API keys" labeled `anon` `public`

Keep these values ready for the next step.

---

## Step 5 — Deploy to Vercel

### 5.1 — Import the Repository

1. Go to [https://vercel.com/new](https://vercel.com/new).
2. Click **Import Git Repository**.
3. Select your GitHub account and find `KNIGHTYPODCASTS` (or your fork).
4. Click **Import**.

### 5.2 — Configure Build Settings

Vercel should auto-detect the framework as **Vite**. Verify these settings match (they are also defined in `vercel.json`):

| Setting            | Value                          |
| ------------------ | ------------------------------ |
| Framework Preset   | Vite                           |
| Build Command      | `npm run build`                |
| Output Directory   | `dist`                         |
| Install Command    | `npm install --legacy-peer-deps` |

### 5.3 — Add Environment Variables

Before clicking Deploy, expand the **Environment Variables** section and add the following three variables:

| Name                      | Value                                      |
| ------------------------- | ------------------------------------------ |
| `VITE_SUPABASE_URL`       | Your Supabase Project URL (from Step 4)    |
| `VITE_SUPABASE_ANON_KEY`  | Your Supabase anon/public key (from Step 4)|
| `VITE_YOUTUBE_API_KEY`    | Your YouTube Data API v3 key *(optional)*  |

> **Note:** All three variables must be prefixed with `VITE_` so Vite exposes them to the client bundle. Without the prefix the app cannot read them.

### 5.4 — Deploy

Click **Deploy**. Vercel will install dependencies, build the project, and give you a live URL (e.g., `https://your-app.vercel.app`).

---

## Step 6 — Configure Supabase Redirect URL

After deploying, tell Supabase about your production URL:

1. In the Supabase dashboard, go to **Authentication → URL Configuration**.
2. Set **Site URL** to your Vercel deployment URL (e.g., `https://your-app.vercel.app`).
3. Under **Redirect URLs**, add your Vercel URL if it is not already listed.
4. Click **Save**.

---

## Step 7 — Verify the Deployment

1. Open your Vercel deployment URL in a browser.
2. Click **Sign Up** and create an account with a username, email, and password.
3. You should be logged in immediately (because email confirmation is disabled).
4. Try uploading a podcast, leaving a comment, and editing your profile to confirm everything works.

---

## Troubleshooting

| Problem | Solution |
| ------- | -------- |
| Sign-up succeeds but can't log in | Make sure you disabled **Confirm email** in Supabase Auth → Providers → Email (see Step 2). |
| "Invalid API key" or blank page | Double-check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly in Vercel → Settings → Environment Variables. Redeploy after changing them. |
| Storage uploads fail | Ensure you ran Migrations 4 and 5 to create the `avatars` and `podcast-files` buckets with the correct RLS policies. |
| 404 on page refresh | The `vercel.json` rewrite rule (`/(.*) → /index.html`) handles client-side routing. Make sure `vercel.json` is committed to the repo. |
| YouTube features not working | Add a valid `VITE_YOUTUBE_API_KEY` in Vercel environment variables and redeploy. |

---

## Summary of Environment Variables

| Variable                 | Required | Where to Find                                      |
| ------------------------ | -------- | -------------------------------------------------- |
| `VITE_SUPABASE_URL`      | Yes      | Supabase → Settings → API → Project URL            |
| `VITE_SUPABASE_ANON_KEY` | Yes      | Supabase → Settings → API → anon / public key      |
| `VITE_YOUTUBE_API_KEY`   | Optional | Google Cloud Console → APIs & Services → Credentials|

---

## Reminder Checklist

- [x] Created Supabase project
- [x] **Disabled email confirmation** in Supabase Auth settings
- [x] Ran all 5 SQL migrations in the SQL Editor
- [x] Copied Supabase URL and anon key
- [x] Imported repo into Vercel
- [x] Added all `VITE_*` environment variables in Vercel
- [x] Set Site URL in Supabase Auth → URL Configuration
- [x] Deployed and verified sign-up / sign-in works
