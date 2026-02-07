import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import { useProgressStore } from '../../store/progressStore';
import { useAuthStore } from '../../store/authStore';

interface VideoPlayerProps {
  url: string;
  title: string;
  streamId?: string; // Optional for now to maintain backward compat, but we'll use it
  onDuration?: (duration: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  url, 
  title,
  streamId,
  onDuration 
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasSeeked, setHasSeeked] = useState(false);
  const [savedProgress, setSavedProgress] = useState(0);
  
  const playerRef = useRef<ReactPlayer>(null);
  const { getProgress, saveProgress } = useProgressStore();
  const { user } = useAuthStore();

  // 1. Fetch saved progress when streamId loads
  useEffect(() => {
    const loadProgress = async () => {
      if (streamId && user) {
        const seconds = await getProgress(streamId);
        if (seconds > 0) {
          setSavedProgress(seconds);
          setHasSeeked(false); // Reset seek flag so we seek again for new video
        }
      }
    };
    loadProgress();
  }, [streamId, user, getProgress]);

  // 2. Handle Player Ready - Seek to saved time
  const handleReady = useCallback(() => {
    setIsReady(true);
    if (!hasSeeked && savedProgress > 0 && playerRef.current) {
      playerRef.current.seekTo(savedProgress, 'seconds');
      setHasSeeked(true);
    }
  }, [hasSeeked, savedProgress]);

  // 3. Save progress periodically (every ~1s provided by onProgress)
  const handleProgress = useCallback((state: { playedSeconds: number }) => {
    // Only save if playing and we have a valid streamId
    if (isPlaying && streamId && state.playedSeconds > 5) {
      // We debounce/throttle this inside the store logic or just let Supabase handle it?
      // Supabase is fast, but let's only save every 10 seconds effectively
      // A simple check: if Math.floor(seconds) % 10 === 0
      if (Math.floor(state.playedSeconds) % 5 === 0) {
        saveProgress(streamId, state.playedSeconds);
      }
    }
  }, [isPlaying, streamId, saveProgress]);

  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden border border-knighty-border shadow-2xl">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-knighty-card">
          <div className="w-12 h-12 border-4 border-knighty-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <ReactPlayer
        ref={playerRef}
        url={url}
        width="100%"
        height="100%"
        controls
        playing={isPlaying}
        onReady={handleReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onProgress={handleProgress}
        onDuration={onDuration}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0,
            },
          },
          file: {
            attributes: {
              controlsList: 'nodownload',
            },
          },
        }}
        style={{ backgroundColor: '#050505' }}
      />
    </div>
  );
};
