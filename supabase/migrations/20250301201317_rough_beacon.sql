/*
  # Create podcasts table

  1. New Tables
    - `podcasts`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `description` (text)
      - `video_url` (text)
      - `thumbnail_url` (text)
      - `category` (text)
      - `duration` (integer)
      - `user_id` (uuid, references auth.users)
  2. Security
    - Enable RLS on `podcasts` table
    - Add policy for authenticated users to read all podcasts
    - Add policy for authenticated users to insert their own podcasts
    - Add policy for authenticated users to update their own podcasts
    - Add policy for authenticated users to delete their own podcasts
*/

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

-- Everyone can view all podcasts
CREATE POLICY "Anyone can view podcasts"
  ON podcasts
  FOR SELECT
  USING (true);

-- Only authenticated users can insert their own podcasts
CREATE POLICY "Users can insert their own podcasts"
  ON podcasts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Only podcast owners can update their podcasts
CREATE POLICY "Users can update their own podcasts"
  ON podcasts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Only podcast owners can delete their podcasts
CREATE POLICY "Users can delete their own podcasts"
  ON podcasts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);