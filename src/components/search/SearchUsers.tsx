import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Profile {
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

export const SearchUsers: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url')
          .ilike('username', `%${searchTerm}%`)
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error('Error searching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  return (
    <div ref={searchRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-vercel-hover transition-colors duration-200"
      >
        <Search className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-vercel-card border border-vercel-border rounded-lg shadow-lg p-3 z-50">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search users..."
              className="w-full bg-black border border-vercel-border text-white rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-gray-500 transition-colors duration-200"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : results.length > 0 ? (
            <div className="mt-2 space-y-2">
              {results.map((profile) => (
                <Link
                  key={profile.username}
                  to={`/profile/${profile.username}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 hover:bg-vercel-hover rounded-lg transition-colors duration-200"
                >
                  <img
                    src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}`}
                    alt={profile.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-medium">
                      {profile.full_name || `@${profile.username}`}
                    </p>
                    {profile.full_name && (
                      <p className="text-sm text-gray-400">@{profile.username}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : searchTerm && !isLoading ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No users found
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};
