import React, { useState } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  url: string;
  title: string;
  onDuration?: (duration: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  url, 
  title,
  onDuration 
}) => {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        playing={isPlaying}
        onReady={() => setIsReady(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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
        style={{ backgroundColor: 'black' }}
      />
    </div>
  );
};