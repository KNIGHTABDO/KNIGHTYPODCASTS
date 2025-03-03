-- Create comments table
CREATE TABLE public.comments (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at timestamptz DEFAULT now(),
    podcast_id uuid REFERENCES public.podcasts(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    username text REFERENCES public.profiles(username) ON DELETE CASCADE,
    content text NOT NULL,
    parent_id uuid REFERENCES public.comments(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create policies for comments
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

-- Add indexes
CREATE INDEX comments_podcast_id_idx ON public.comments(podcast_id);
CREATE INDEX comments_parent_id_idx ON public.comments(parent_id);
