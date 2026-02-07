import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, BookOpen, Video, Users } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { FeaturedStream } from '../components/stream/FeaturedStream';
import { StreamGrid } from '../components/stream/StreamGrid';
import { useStreamStore } from '../store/streamStore';
import { useLanguageStore } from '../store/languageStore';

export const HomePage: React.FC = () => {
  const { translate } = useLanguageStore();
  const { 
    featuredStreams, 
    streams, 
    isLoading, 
    fetchFeaturedStreams, 
    fetchStreams 
  } = useStreamStore();

  useEffect(() => {
    fetchFeaturedStreams();
    fetchStreams();
  }, [fetchFeaturedStreams, fetchStreams]);

  const featuredStream = featuredStreams[0];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="relative h-[500px] bg-knighty-card border border-knighty-border rounded-2xl animate-pulse overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-knighty-bg via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-12 space-y-4">
                <div className="flex gap-3">
                  <div className="h-6 bg-knighty-hover rounded w-24" />
                  <div className="h-6 bg-knighty-hover rounded w-20" />
                </div>
                <div className="h-12 bg-knighty-hover rounded w-3/4" />
                <div className="h-4 bg-knighty-hover rounded w-1/2" />
                <div className="h-12 bg-knighty-hover rounded w-40 mt-6" />
              </div>
            </div>
          ) : featuredStream ? (
            <FeaturedStream stream={featuredStream} />
          ) : (
            <div className="relative h-[500px] bg-knighty-card border border-knighty-border rounded-2xl flex items-center justify-center text-center p-8">
              <div className="max-w-md">
                <Video className="h-12 w-12 text-knighty-muted mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">No Featured Content</h3>
                <p className="text-knighty-muted">Check back later for our latest feature.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-knighty-border/50 bg-knighty-card/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">{translate('home.features.title')}</h2>
            <p className="mt-4 text-lg text-knighty-muted max-w-3xl mx-auto">
              {translate('home.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-knighty-card border border-knighty-border p-8 rounded-xl text-center hover:border-knighty-accent/30 transition-all duration-300">
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-knighty-hover text-white mb-6 group-hover:bg-knighty-accent group-hover:text-black transition-colors">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{translate('home.features.authenticity')}</h3>
              <p className="text-knighty-muted text-sm leading-relaxed">
                {translate('home.features.authenticity.desc')}
              </p>
            </div>

            <div className="group bg-knighty-card border border-knighty-border p-8 rounded-xl text-center hover:border-knighty-accent/30 transition-all duration-300">
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-knighty-hover text-white mb-6 group-hover:bg-knighty-accent group-hover:text-black transition-colors">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{translate('home.features.quality')}</h3>
              <p className="text-knighty-muted text-sm leading-relaxed">
                 {translate('home.features.quality.desc')}
              </p>
            </div>

            <div className="group bg-knighty-card border border-knighty-border p-8 rounded-xl text-center hover:border-knighty-accent/30 transition-all duration-300">
              <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-knighty-hover text-white mb-6 group-hover:bg-knighty-accent group-hover:text-black transition-colors">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{translate('home.features.community')}</h3>
              <p className="text-knighty-muted text-sm leading-relaxed">
                 {translate('home.features.community.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Videos Section */}
      <section className="py-24 border-t border-knighty-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{translate('home.recentStreams')}</h2>
              <p className="text-sm text-knighty-muted">Newest uploads from the community</p>
            </div>
            <Link to="/streams">
              <Button variant="outline" className="text-sm">
                {translate('common.viewAll')}
              </Button>
            </Link>
          </div>

          <StreamGrid 
            streams={streams.slice(0, 8)} 
            isLoading={isLoading} 
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 border-t border-knighty-border/50 bg-gradient-to-b from-knighty-bg to-knighty-card/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            {translate('home.cta.title')}
          </h2>
          <p className="text-lg text-knighty-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            {translate('home.cta.subtitle')}
          </p>
          <Link to="/streams">
            <Button 
              variant="primary" 
              size="lg" 
              className="px-8 py-4 text-base font-bold bg-white text-black hover:bg-gray-200"
              leftIcon={<Play className="h-5 w-5 fill-black" />}
            >
              {translate('home.cta.button')}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};
