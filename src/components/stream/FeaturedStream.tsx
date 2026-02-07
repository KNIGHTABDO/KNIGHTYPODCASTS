import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { formatDuration } from '../../lib/utils';
import { Database } from '../../types/supabase';
import { useLanguageStore } from '../../store/languageStore';

type Stream = Database['public']['Tables']['streams']['Row'];

interface FeaturedStreamProps {
  stream: Stream;
}

export const FeaturedStream: React.FC<FeaturedStreamProps> = ({ stream }) => {
  const { translate } = useLanguageStore();

  return (
    <div className="relative overflow-hidden rounded-2xl h-[500px] group border border-knighty-border">
      {/* Background Image with Scale Effect */}
      <img 
        src={stream.thumbnail_url} 
        alt={stream.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Cinematic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-knighty-bg via-knighty-bg/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-knighty-bg/90 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
        <div className="flex items-center gap-3 mb-4">
           <span className="inline-block bg-knighty-accent text-black text-xs px-3 py-1 rounded font-bold uppercase tracking-wider">
            {translate('common.featured')}
          </span>
          <span className="inline-block border border-white/20 backdrop-blur-md text-xs text-white px-3 py-1 rounded font-medium uppercase tracking-wider">
            {stream.category}
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight leading-tight max-w-3xl">
          {stream.title}
        </h2>
        
        <p className="text-knighty-muted mb-8 max-w-2xl text-lg leading-relaxed line-clamp-2">
          {stream.description || stream.title}
        </p>
        
        <div className="flex items-center gap-4">
          <Link to={`/streams/${stream.id}`}>
            <Button 
              variant="primary" 
              size="lg" 
              className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-base font-bold rounded-lg transition-transform active:scale-95"
              leftIcon={<Play className="h-5 w-5 fill-black" />}
            >
              {translate('common.watchNow')}
            </Button>
          </Link>
          
          <div className="flex items-center text-white/80 bg-white/5 backdrop-blur-md px-4 py-3 rounded-lg border border-white/10">
            <Clock className="h-5 w-5 mr-2 text-knighty-accent" />
            <span className="font-medium">{formatDuration(stream.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
