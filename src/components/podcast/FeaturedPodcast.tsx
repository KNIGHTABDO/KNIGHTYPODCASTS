import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDuration } from '../../lib/utils';
import { Database } from '../../types/supabase';

type Podcast = Database['public']['Tables']['podcasts']['Row'];

interface FeaturedPodcastProps {
  podcast: Podcast;
}

export const FeaturedPodcast: React.FC<FeaturedPodcastProps> = ({ podcast }) => {
  return (
    <div className="relative overflow-hidden rounded-lg h-[500px] group">
      <img 
        src={podcast.thumbnail_url} 
        alt={podcast.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <span className="inline-block bg-white text-xs text-black px-2 py-1 rounded-full mb-3 font-medium">
          {podcast.category}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {podcast.title}
        </h2>
        <p className="text-gray-300 mb-4 max-w-2xl">
          {podcast.title}
        </p>
        <div className="flex items-center space-x-4">
          <Link to={`/podcasts/${podcast.id}`}>
            <Button 
              variant="primary" 
              size="lg" 
              leftIcon={<Play className="h-5 w-5" />}
            >
              Watch Now
            </Button>
          </Link>
          <div className="flex items-center text-gray-300">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDuration(podcast.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};