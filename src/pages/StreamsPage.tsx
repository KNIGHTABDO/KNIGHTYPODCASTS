import React, { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { StreamGrid } from '../components/stream/StreamGrid';
import { Input } from '../components/ui/Input';
import { useStreamStore } from '../store/streamStore';

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

export const StreamsPage: React.FC = () => {
  const { streams, isLoading, fetchStreams } = useStreamStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);
  
  const filteredStreams = streams.filter((stream) => {
    const matchesSearch = stream.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         stream.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                           stream.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Videos</h1>
          <p className="text-vercel-muted max-w-3xl">
            Explore our collection of videos covering various topics including Quran, Hadith, Fiqh, and more.
          </p>
        </div>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
            <Input
              placeholder="Search videos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
          </div>
          
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 h-5 w-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-10 w-full rounded-lg border border-vercel-border bg-black pl-10 pr-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-gray-500 transition-colors duration-200"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {filteredStreams.length === 0 && !isLoading ? (
          <div className="text-center py-12 bg-vercel-card border border-vercel-border rounded-lg">
            <h3 className="text-xl font-medium text-gray-300">No videos found</h3>
            <p className="mt-2 text-vercel-muted">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <StreamGrid streams={filteredStreams} isLoading={isLoading} />
        )}
      </div>
    </Layout>
  );
};