import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDuration } from '../../lib/utils';
import { Database } from '../../types/supabase';

type Stream = Database['public']['Tables']['streams']['Row'];

interface FeaturedStreamProps {
  stream: Stream;
}

export const FeaturedStream: React.FC<FeaturedStreamProps> = ({ stream }) => {
  return (
    <div className="relative overflow-hidden rounded-lg h-[500px] group">
      <img 
        src={stream.thumbnail_url} 
        alt={stream.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <span className="inline-block bg-white text-xs text-black px-2 py-1 rounded-full mb-3 font-medium">
          {stream.category}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {stream.title}
        </h2>
        <p className="text-gray-300 mb-4 max-w-2xl">
          {stream.title}
        </p>
        <div className="flex items-center space-x-4">
          <Link to={`/streams/${stream.id}`}>
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
            <span>{formatDuration(stream.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};