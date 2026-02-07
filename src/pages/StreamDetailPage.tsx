import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, Edit, ArrowLeft, Star, Plus } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { VideoPlayer } from '../components/stream/VideoPlayer';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { StreamCard } from '../components/stream/StreamCard';
import { formatDuration } from '../lib/utils';
import { useStreamStore } from '../store/streamStore';
import { useAuthStore } from '../store/authStore';
import { useReviewStore } from '../store/reviewStore';
import { Comments } from '../components/comments/Comments';
import { ReviewModal } from '../components/reviews/ReviewModal';

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
  const { userReview, fetchUserReview } = useReviewStore();
  
  const [relatedStreams, setRelatedStreams] = useState<typeof streams>([]);
  const [uploaderProfile, setUploaderProfile] = useState<Profile | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchStreamById(id);
      if (user) {
        fetchUserReview(id);
      }
    }
    
    if (streams.length === 0) {
      fetchStreams();
    }
  }, [id, fetchStreamById, streams.length, fetchStreams, user, fetchUserReview]);
  
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
            <div className="aspect-video bg-knighty-card rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-knighty-card rounded w-3/4" />
              <div className="h-4 bg-knighty-card rounded w-1/4" />
              <div className="h-4 bg-knighty-card rounded w-full" />
              <div className="h-4 bg-knighty-card rounded w-full" />
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
          <Link to="/streams" className="inline-flex items-center text-knighty-muted hover:text-white transition-colors duration-200">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Videos
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VideoPlayer 
              url={currentStream.video_url} 
              title={currentStream.title}
              streamId={currentStream.id} 
            />
            
            <div className="mt-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-white leading-tight mb-2">{currentStream.title}</h1>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-knighty-muted flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formattedDate}
                    </span>
                    <span className="text-knighty-muted flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDuration(currentStream.duration)}
                    </span>
                    <span className="bg-knighty-card border border-knighty-border px-2 py-0.5 rounded text-xs uppercase tracking-wide text-white">
                      {currentStream.category}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {/* Log / Rate Button */}
                  <Button
                    variant={userReview ? "primary" : "outline"}
                    size="sm"
                    onClick={() => setIsReviewModalOpen(true)}
                    leftIcon={userReview ? <Star className="h-4 w-4 fill-black" /> : <Plus className="h-4 w-4" />}
                    className={userReview ? "bg-knighty-accent text-black font-bold border-none hover:bg-knighty-accent/90" : ""}
                  >
                    {userReview ? `Rated ${userReview.rating}` : 'Log & Rate'}
                  </Button>

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
              </div>

              {/* Updated Uploader Info */}
              {streamUsername && (
              <Link 
                to={`/profile/${streamUsername}`}
                className="flex items-center gap-3 mb-6 p-3 rounded-lg hover:bg-knighty-card transition-colors w-fit -ml-3"
              >
                <div className="w-10 h-10 rounded-full bg-knighty-subtle overflow-hidden border border-knighty-border">
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
                  <p className="text-white font-medium leading-none">
                    {uploaderProfile?.full_name || `@${streamUsername}`}
                  </p>
                  <p className="text-sm text-knighty-muted mt-1">
                    {uploaderProfile?.full_name ? `@${streamUsername}` : 'Uploader'}
                  </p>
                </div>
              </Link>
              )}
              
              <div className="prose prose-invert max-w-none text-knighty-text/90">
                <p className="whitespace-pre-line leading-relaxed">{currentStream.description}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <span className="w-1 h-6 bg-knighty-accent rounded-full mr-3"></span>
              Related Videos
            </h2>
            
            {relatedStreams.length > 0 ? (
              <div className="space-y-4">
                {relatedStreams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center border border-knighty-border rounded-xl bg-knighty-card/50">
                <p className="text-knighty-muted text-sm">No related videos found</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Comments Section */}
      {id && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 border-t border-knighty-border pt-12 mt-12">
          <Comments streamId={id} />
        </div>
      )}

      {/* Review Modal */}
      {id && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          streamId={id}
          streamTitle={currentStream.title}
        />
      )}
    </Layout>
  );
};
