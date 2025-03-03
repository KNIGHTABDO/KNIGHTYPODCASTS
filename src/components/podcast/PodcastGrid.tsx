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
            className="bg-gray-800 rounded-lg overflow-hidden animate-pulse h-[350px]"
          >
            <div className="h-48 bg-gray-700" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-700 rounded w-1/4" />
              <div className="h-6 bg-gray-700 rounded" />
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="h-4 bg-gray-700 rounded w-1/2" />
              <div className="h-10 bg-gray-700 rounded mt-4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (podcasts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-300">No podcasts found</h3>
        <p className="mt-2 text-gray-400">Check back later for new content</p>
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