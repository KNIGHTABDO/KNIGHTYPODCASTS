import React from 'react';
import { PodcastCard } from './PodcastCard';
import { Database } from '../../types/supabase';

type Podcast = Database['public']['Tables']['podcasts']['Row'];

interface PodcastGridProps {
  podcasts: Podcast[];
  isLoading?: boolean;
}

export const PodcastGrid: React.FC<PodcastGridProps> = ({ 
  podcasts, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div 
            key={index} 
            className="bg-vercel-card border border-vercel-border rounded-lg overflow-hidden animate-pulse h-[350px]"
          >
            <div className="h-48 bg-vercel-subtle" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-vercel-subtle rounded w-1/4" />
              <div className="h-6 bg-vercel-subtle rounded" />
              <div className="h-4 bg-vercel-subtle rounded w-3/4" />
              <div className="h-4 bg-vercel-subtle rounded w-1/2" />
              <div className="h-10 bg-vercel-subtle rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-300">No videos found</h3>
        <p className="mt-2 text-vercel-muted">Check back later for new content</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {podcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </div>
  );
};