import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Clock } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDuration, truncateText } from '../../lib/utils';
import { Database } from '../../types/supabase';
import { useLanguageStore } from '../../store/languageStore';

type Podcast = Database['public']['Tables']['podcasts']['Row'];

interface PodcastCardProps {
  podcast: Podcast;
}

export const PodcastCard: React.FC<PodcastCardProps> = ({ podcast }) => {
  const { translate } = useLanguageStore();

  return (
    <Card hoverable className="overflow-hidden h-full flex flex-col">
      <div className="relative">
        <img 
          src={podcast.thumbnail_url} 
          alt={podcast.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/75 px-2 py-1 rounded-md flex items-center">
          <Clock className="h-3 w-3 text-gray-300 mr-1" />
          <span className="text-xs text-gray-300">{formatDuration(podcast.duration)}</span>
        </div>
      </div>
      <CardContent className="flex-grow flex flex-col">
        <div className="mt-2">
          <span className="inline-block bg-white text-xs text-black px-2 py-1 rounded-full font-medium">
            {podcast.category}
          </span>
        </div>
        <h3 className="mt-2 text-lg font-semibold text-white">{podcast.title}</h3>
        <p className="mt-1 text-sm text-vercel-muted flex-grow">
          {truncateText(podcast.description, 100)}
        </p>
        <div className="mt-4">
          <Link to={`/podcasts/${podcast.id}`}>
            <Button 
              variant="primary" 
              fullWidth 
              leftIcon={<Play className="h-4 w-4" />}
            >
              {translate('common.watchNow')}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};