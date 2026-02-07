import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock, Star } from 'lucide-react';
import { formatDuration } from '../../lib/utils';
import { Database } from '../../types/supabase';
import { useLanguageStore } from '../../store/languageStore';

type Stream = Database['public']['Tables']['streams']['Row'];

interface StreamCardProps {
  stream: Stream;
}

export const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  const { translate } = useLanguageStore();

  return (
    <Link 
      to={`/streams/${stream.id}`}
      className="group relative block bg-knighty-card border border-knighty-border rounded-xl overflow-hidden hover:border-knighty-accent/50 transition-all duration-300"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={stream.thumbnail_url} 
          alt={stream.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-knighty-bg via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-white flex items-center border border-white/10">
          <Clock className="h-3 w-3 mr-1.5 text-knighty-accent" />
          {formatDuration(stream.duration)}
        </div>

        {/* Play Icon Overlay (Visible on Hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[2px]">
          <div className="bg-white/10 border border-white/20 p-3 rounded-full backdrop-blur-md">
            <Play className="h-6 w-6 text-white fill-current" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
             <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-knighty-accent mb-2">
              {stream.category}
            </span>
            <h3 className="text-base font-medium text-white leading-tight group-hover:text-knighty-accent transition-colors">
              {stream.title}
            </h3>
          </div>
          
          {/* Rating Placeholder (Static for now, dynamic later) */}
          <div className="flex items-center text-knighty-muted text-xs shrink-0">
            <Star className="h-3 w-3 mr-1" />
            <span>--</span>
          </div>
        </div>
        
        <p className="mt-2 text-sm text-knighty-muted line-clamp-2 leading-relaxed">
          {stream.description}
        </p>
      </div>
    </Link>
  );
};
