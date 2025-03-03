import React, { useState } from 'react';
import { Upload, Link2, Youtube, File } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

interface PodcastUploaderProps {
  onUrlChange: (url: string) => void;
  onDurationChange: (duration: number) => void;
  onMethodChange: (method: 'file' | 'url' | 'youtube') => void;
  onMetadataChange?: (metadata: { title: string; description: string; thumbnail?: string }) => void;
  initialMethod?: 'file' | 'url' | 'youtube';
}

export const PodcastUploader: React.FC<PodcastUploaderProps> = ({
  onUrlChange,
  onDurationChange,
  onMethodChange,
  onMetadataChange,
  initialMethod = 'url'
}) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url' | 'youtube'>(initialMethod);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { user } = useAuthStore();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
      alert('Please upload a valid video or audio file');
      return;
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('File size must be less than 500MB');
      return;
    }

    setIsUploading(true);
    try {
      // Create unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file with progress tracking
      const { error: uploadError } = await supabase.storage
        .from('podcast-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('podcast-files')
        .getPublicUrl(fileName);

      onUrlChange(publicUrl);

      // Get duration for audio/video files
      if (file.type.startsWith('video/') || file.type.startsWith('audio/')) {
        const media = document.createElement(file.type.startsWith('video/') ? 'video' : 'audio');
        media.src = URL.createObjectURL(file);
        media.onloadedmetadata = () => {
          onDurationChange(Math.round(media.duration));
        };
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getYoutubeVideoData = async (videoId: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=snippet,contentDetails&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`
      );
      const data = await response.json();

      if (data.items?.[0]) {
        const { snippet, contentDetails } = data.items[0];
        
        // Convert duration to seconds
        const duration = contentDetails.duration
          .match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = parseInt(duration[1] || '0');
        const minutes = parseInt(duration[2] || '0');
        const seconds = parseInt(duration[3] || '0');
        const durationInSeconds = hours * 3600 + minutes * 60 + seconds;

        // Update duration
        onDurationChange(durationInSeconds);

        // Update metadata
        if (onMetadataChange) {
          onMetadataChange({
            title: snippet.title,
            description: snippet.description,
            thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.default?.url
          });
        }
      }
    } catch (error) {
      console.error('Error fetching YouTube data:', error);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onUrlChange(url);

    if (uploadMethod === 'youtube') {
      // Extract video ID from different YouTube URL formats
      const youtubeMatch = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/v\/))([^&?]*)/
      );
      
      if (youtubeMatch?.[1]) {
        getYoutubeVideoData(youtubeMatch[1]);
      }
    }
  };

  const handleMethodChange = (method: 'file' | 'url' | 'youtube') => {
    setUploadMethod(method);
    onMethodChange(method);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          type="button"
          variant={uploadMethod === 'url' ? 'primary' : 'ghost'}
          onClick={() => handleMethodChange('url')}
          leftIcon={<Link2 className="h-4 w-4" />}
        >
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMethod === 'youtube' ? 'primary' : 'ghost'}
          onClick={() => handleMethodChange('youtube')}
          leftIcon={<Youtube className="h-4 w-4" />}
        >
          YouTube
        </Button>
        <Button
          type="button"
          variant={uploadMethod === 'file' ? 'primary' : 'ghost'}
          onClick={() => handleMethodChange('file')}
          leftIcon={<File className="h-4 w-4" />}
        >
          File Upload
        </Button>
      </div>

      {uploadMethod === 'file' ? (
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept="video/*,audio/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-400">
              {isUploading 
                ? `Uploading... ${uploadProgress}%`
                : 'Click to upload or drag and drop video/audio files'}
            </p>
            <p className="text-gray-500 text-sm mt-1">
              Max file size: 500MB
            </p>
          </label>
          {isUploading && (
            <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <Input
          placeholder={
            uploadMethod === 'youtube'
              ? 'Enter YouTube video URL'
              : 'Enter media URL'
          }
          onChange={handleUrlChange}
          fullWidth
        />
      )}
    </div>
  );
};
