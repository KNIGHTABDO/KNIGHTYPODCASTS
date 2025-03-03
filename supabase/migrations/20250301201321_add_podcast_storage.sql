-- Create podcasts bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('podcast-files', 'podcast-files', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy to allow authenticated users to upload podcast files
CREATE POLICY "Users can upload their own podcast files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'podcast-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to update their own podcast files
CREATE POLICY "Users can update their own podcast files"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'podcast-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow users to delete their own podcast files
CREATE POLICY "Users can delete their own podcast files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'podcast-files' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy to allow public viewing of podcast files
CREATE POLICY "Anyone can view podcast files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'podcast-files');
