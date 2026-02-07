import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, Edit, ArrowLeft } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { VideoPlayer } from '../components/stream/VideoPlayer';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { StreamCard } from '../components/stream/StreamCard';
import { formatDuration } from '../lib/utils';
import { useStreamStore } from '../store/streamStore';
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

export const StreamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentStream, streams, isLoading, fetchStreamById, fetchStreams } = useStreamStore();
  const { user, fetchProfile } = useAuthStore();
  const [relatedStreams, setRelatedStreams] = useState<typeof streams>([]);
  const [uploaderProfile, setUploaderProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (id) {
      fetchStreamById(id);
    }
    
    if (streams.length === 0) {
      fetchStreams();
    }
  }, [id, fetchStreamById, streams.length, fetchStreams]);
  
  useEffect(() => {
    if (currentStream && streams.length > 0) {
      const related = streams
        .filter(p => p.id !== currentStream.id && p.category === currentStream.category)
        .slice(0, 4);
      setRelatedStreams(related);
    }
  }, [currentStream, streams]);

  const streamUsername = currentStream?.profiles?.username;

  useEffect(() => {
    const loadUploaderProfile = async () => {
      if (streamUsername) {
        const { data } = await fetchProfile(streamUsername);
        if (data && 'id' in data && 'username' in data && 'created_at' in data) {
          setUploaderProfile(data as Profile);
        } else {
          setUploaderProfile(null);
        }
      }
    };
    
    loadUploaderProfile();
  }, [streamUsername, fetchProfile]);
  
  if (isLoading || !currentStream) {
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
  
  const formattedDate = new Date(currentStream.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Link to="/streams" className="inline-flex items-center text-vercel-muted hover:text-white transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Videos
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VideoPlayer 
              url={currentStream.video_url} 
              title={currentStream.title} 
            />
            
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white">{currentStream.title}</h1>
                
                {user?.id === currentStream.user_id && (
                  <Link to={`/admin/streams/${currentStream.id}/edit`}>
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
              {streamUsername && (
              <Link 
                to={`/profile/${streamUsername}`}
                className="flex items-center gap-3 mb-4 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 rounded-full bg-vercel-subtle overflow-hidden">
                  <img
                    src={uploaderProfile?.avatar_url || `https://ui-avatars.com/api/?name=${streamUsername}`}
                    alt={streamUsername}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${streamUsername}`;
                    }}
                  />
                </div>
                <div>
                  <p className="text-white font-medium">
                    {uploaderProfile?.full_name || `@${streamUsername}`}
                  </p>
                  <p className="text-sm text-gray-400">
                    {uploaderProfile?.full_name ? `@${streamUsername}` : 'Uploaded by'}
                  </p>
                </div>
              </Link>
              )}
              
              <div className="flex flex-wrap gap-4 mb-4">
                <span className="inline-flex items-center text-gray-400 text-sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  {formattedDate}
                </span>
                <span className="inline-flex items-center text-gray-400 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDuration(currentStream.duration)}
                </span>
                <span className="inline-block bg-white text-xs text-black px-2 py-1 rounded-full">
                  {currentStream.category}
                </span>
              </div>
              
              <Card>
                <CardContent className="pt-4">
                  <h2 className="text-xl font-semibold text-white mb-2">Description</h2>
                  <p className="text-gray-300 whitespace-pre-line">{currentStream.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Related Videos</h2>
            
            {relatedStreams.length > 0 ? (
              <div className="space-y-6">
                {relatedStreams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
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
          <Comments streamId={id} />
        </div>
      )}
    </Layout>
  );
};