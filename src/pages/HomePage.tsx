import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Video, Users } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { FeaturedPodcast } from '../components/podcast/FeaturedPodcast';
import { PodcastGrid } from '../components/podcast/PodcastGrid';
import { usePodcastStore } from '../store/podcastStore';

export const HomePage: React.FC = () => {
  const { 
    featuredPodcasts, 
    podcasts, 
    isLoading, 
    fetchFeaturedPodcasts, 
    fetchPodcasts 
  } = usePodcastStore();

  useEffect(() => {
    fetchFeaturedPodcasts();
    fetchPodcasts();
  }, [fetchFeaturedPodcasts, fetchPodcasts]);

  const featuredPodcast = featuredPodcasts[0];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        {featuredPodcast ? (
          <FeaturedPodcast podcast={featuredPodcast} />
        ) : (
          <div className="relative h-[500px] bg-gray-800 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="h-4 bg-gray-700 rounded w-20 mb-3" />
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-4" />
              <div className="h-10 bg-gray-700 rounded w-32" />
            </div>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Why Choose Our Islamic Podcasts</h2>
            <p className="mt-4 text-xl text-gray-400 max-w-3xl mx-auto">
              Authentic knowledge, engaging content, and spiritual growth all in one place
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-600 text-white mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Authentic Knowledge</h3>
              <p className="text-gray-400">
                Content based on authentic sources from the Quran and Sunnah, verified by scholars
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-600 text-white mb-4">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">High-Quality Content</h3>
              <p className="text-gray-400">
                Professional video and audio production with clear explanations and engaging presentations
              </p>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-600 text-white mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Community Learning</h3>
              <p className="text-gray-400">
                Join thousands of Muslims worldwide seeking knowledge and spiritual growth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Podcasts Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white">Recent Podcasts</h2>
            <Link to="/podcasts">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <PodcastGrid 
            podcasts={podcasts.slice(0, 8)} 
            isLoading={isLoading} 
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Enrich Your Islamic Knowledge?</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Explore our collection of Islamic podcasts and videos to deepen your understanding of Islam
          </p>
          <Link to="/podcasts">
            <Button 
              variant="primary" 
              size="lg" 
              leftIcon={<Play className="h-5 w-5" />}
            >
              Browse All Podcasts
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};