import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, Edit, ArrowLeft } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { VideoPlayer } from '../components/podcast/VideoPlayer';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { PodcastCard } from '../components/podcast/PodcastCard';
import { formatDuration } from '../lib/utils';
import { usePodcastStore } from '../store/podcastStore';
import { useAuthStore } from '../store/authStore';
import { Comments } from '../components/comments/Comments';

interface Profile {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  bio: string | null;
  created_at: string;
}

export const PodcastDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentPodcast, podcasts, isLoading, fetchPodcastById, fetchPodcasts } = usePodcastStore();
  const { user, fetchProfile } = useAuthStore();
  const [relatedPodcasts, setRelatedPodcasts] = useState<typeof podcasts>([]);
  const [uploaderProfile, setUploaderProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (id) {
      fetchPodcastById(id);
    }
    
    if (podcasts.length === 0) {
      fetchPodcasts();
    }
  }, [id, fetchPodcastById, podcasts.length, fetchPodcasts]);
  
  useEffect(() => {
    if (currentPodcast && podcasts.length > 0) {
      const related = podcasts
        .filter(p => p.id !== currentPodcast.id && p.category === currentPodcast.category)
        .slice(0, 4);
      setRelatedPodcasts(related);
    }
  }, [currentPodcast, podcasts]);

  useEffect(() => {
    const loadUploaderProfile = async () => {
      if (currentPodcast?.username) {
        const { data } = await fetchProfile(currentPodcast.username);
        if (data && 'id' in data && 'username' in data && 'created_at' in data) {
          setUploaderProfile(data as Profile);
        } else {
          setUploaderProfile(null);
        }
      }
    };
    
    loadUploaderProfile();
  }, [currentPodcast?.username, fetchProfile]);
  
  if (isLoading || !currentPodcast) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="aspect-video bg-vercel-card rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-vercel-card rounded w-3/4" />
              <div className="h-4 bg-vercel-card rounded w-1/4" />
              <div className="h-4 bg-vercel-card rounded w-full" />
              <div className="h-4 bg-vercel-card rounded w-full" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  const formattedDate = new Date(currentPodcast.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link to="/podcasts" className="inline-flex items-center text-vercel-muted hover:text-white transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Videos
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VideoPlayer 
              url={currentPodcast.video_url} 
              title={currentPodcast.title} 
            />
            
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{currentPodcast.title}</h1>
                
                {user?.username === currentPodcast.username && (
                  <Link to={`/admin/podcasts/${currentPodcast.id}/edit`}>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      leftIcon={<Edit className="h-4 w-4" />}
                    >
                      Edit
                    </Button>
                  </Link>
                )}
              </div>

              {/* Updated Uploader Info */}
              <Link 
                to={`/profile/${currentPodcast.username}`}
                className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-vercel-subtle overflow-hidden">
                  <img
                    src={uploaderProfile?.avatar_url || `https://ui-avatars.com/api/?name=${currentPodcast.username}`}
                    alt={currentPodcast.username}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${currentPodcast.username}`;
                    }}
                  />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {uploaderProfile?.full_name || `@${currentPodcast.username}`}
                  </p>
                  <p className="text-sm text-gray-400">
                    {uploaderProfile?.full_name ? `@${currentPodcast.username}` : 'Uploaded by'}
                  </p>
                </div>
              </Link>
              
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="inline-flex items-center text-gray-400 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formattedDate}
                </span>
                <span className="inline-flex items-center text-gray-400 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(currentPodcast.duration)}
                </span>
                <span className="inline-block bg-white text-xs text-black px-2 py-1 rounded-full">
                  {currentPodcast.category}
                </span>
              </div>
              
              <Card>
                <CardContent className="pt-4">
                  <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
                  <p className="text-gray-300 whitespace-pre-line">{currentPodcast.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Related Videos</h2>
            
            {relatedPodcasts.length > 0 ? (
              <div className="space-y-6">
                {relatedPodcasts.map((podcast) => (
                  <PodcastCard key={podcast.id} podcast={podcast} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-6 text-center">
                  <p className="text-vercel-muted">No related videos found</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Add Comments Section */}
      {id && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <Comments podcastId={id} />
        </div>
      )}
    </Layout>
  );
};