import React from 'react';
import { StreamCard } from './StreamCard';
import { Database } from '../../types/supabase';

type Stream = Database['public']['Tables']['streams']['Row'];

interface StreamGridProps {
  streams: Stream[];
  isLoading?: boolean;
}

export const StreamGrid: React.FC<StreamGridProps> = ({ 
  streams, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="bg-knighty-card border border-knighty-border rounded-xl overflow-hidden animate-pulse h-full"
          >
            {/* Thumbnail Skeleton */}
            <div className="aspect-video bg-knighty-hover" />
            
            {/* Content Skeleton */}
            <div className="p-4 space-y-3">
              <div className="flex justify-between">
                <div className="h-3 bg-knighty-hover rounded w-1/4" />
                <div className="h-3 bg-knighty-hover rounded w-8" />
              </div>
              <div className="h-5 bg-knighty-hover rounded w-3/4" />
              <div className="h-3 bg-knighty-hover rounded w-full" />
              <div className="h-3 bg-knighty-hover rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (streams.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-medium text-white">No videos found</h3>
        <p className="mt-2 text-knighty-muted">Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {streams.map((stream) => (
        <StreamCard key={stream.id} stream={stream} />
      ))}
    </div>
  );
};
