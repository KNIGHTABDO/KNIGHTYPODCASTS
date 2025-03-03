import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { PodcastGrid } from '../components/podcast/PodcastGrid';
import { Input } from '../components/ui/Input';
import { usePodcastStore } from '../store/podcastStore';

const CATEGORIES = [
  'All',
  'Quran',
  'Hadith',
  'Fiqh',
  'Seerah',
  'History',
  'Family',
  'Youth',
  'Spirituality',
];

export const PodcastsPage: React.FC = () => {
  const { podcasts, isLoading, fetchPodcasts } = usePodcastStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  useEffect(() => {
    fetchPodcasts();
  }, [fetchPodcasts]);
  
  const filteredPodcasts = podcasts.filter((podcast) => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         podcast.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                           podcast.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Islamic Podcasts</h1>
          <p className="text-gray-400 max-w-3xl">
            Explore our collection of authentic Islamic podcasts covering various topics including Quran, Hadith, Fiqh, and more.
          </p>
        </div>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Input
              placeholder="Search podcasts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
          
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 w-full rounded-md border border-gray-700 bg-gray-800 pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredPodcasts.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <h3 className="text-xl font-medium text-gray-300">No podcasts found</h3>
            <p className="mt-2 text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <PodcastGrid podcasts={filteredPodcasts} isLoading={isLoading} />
        )}
      </div>
    </Layout>
  );
};