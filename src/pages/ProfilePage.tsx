import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useStreamStore } from '../store/streamStore';
import { useAuthStore } from '../store/authStore';
import { useReviewStore } from '../store/reviewStore';
import { Edit2, Globe, Twitter, Facebook, Instagram, Upload, Film, History, Star, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { StreamCard } from '../components/stream/StreamCard';

interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  website: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  avatar_url: string | null;
  created_at: string;
}

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, updateProfile, fetchProfile } = useAuthStore();
  const { streams, fetchStreamsByUserId } = useStreamStore();
  const { userHistory, fetchUserHistory } = useReviewStore();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'diary'>('videos');
  const [form, setForm] = useState({
    full_name: '',
    bio: '',
    website: '',
    twitter_url: '',
    facebook_url: '',
    instagram_url: '',
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!username) return;
    
    const { data } = await fetchProfile(username);
    if (!data) return;
    
    const profileData = data as Profile;
    setProfile(profileData);
    
    // Sync form if it's my profile
    if (user?.username === username) {
      setForm({
        full_name: profileData.full_name || '',
        bio: profileData.bio || '',
        website: profileData.website || '',
        twitter_url: profileData.twitter_url || '',
        facebook_url: profileData.facebook_url || '',
        instagram_url: profileData.instagram_url || '',
      });
    }

    // Fetch Content
    await Promise.all([
      fetchStreamsByUserId(profileData.id),
      fetchUserHistory(profileData.id)
    ]);
    
  }, [fetchProfile, fetchStreamsByUserId, fetchUserHistory, username, user?.username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(form);
    setIsEditing(false);
    loadProfile();
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploadingAvatar(true);
      const file = event.target.files?.[0];
      if (!file) return;

      if (!user?.id) throw new Error('User not authenticated');

      if (file.size > 2 * 1024 * 1024) throw new Error('File size must be less than 2MB');
      if (!file.type.match(/^image\/(jpeg|png|gif)$/)) throw new Error('File must be an image');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      await updateProfile({ avatar_url: publicUrl });
      await loadProfile();

    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert(error instanceof Error ? error.message : 'Error uploading avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const isOwnProfile = user?.username === username;

  return (
    <Layout>
      {/* Banner / Header */}
      <div className="bg-knighty-card border-b border-knighty-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            
            {/* User Info */}
            <div className="flex items-end gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-knighty-bg overflow-hidden bg-knighty-subtle">
                  <img
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${username}`}
                    alt={username}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isOwnProfile && (
                  <label className="absolute bottom-0 right-0 bg-knighty-accent p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg">
                    <Upload className="h-4 w-4 text-black" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      disabled={uploadingAvatar}
                    />
                  </label>
                )}
              </div>
              
              <div className="mb-2">
                <h1 className="text-3xl font-bold text-white mb-1">
                  {profile?.full_name || username}
                </h1>
                <p className="text-knighty-muted mb-3">@{username}</p>
                
                {/* Stats Row */}
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center text-white">
                    <span className="font-bold mr-1">{streams.length}</span>
                    <span className="text-knighty-muted">Videos</span>
                  </div>
                  <div className="flex items-center text-white">
                    <span className="font-bold mr-1">{userHistory.length}</span>
                    <span className="text-knighty-muted">Watched</span>
                  </div>
                  <div className="text-knighty-muted">
                    Joined {profile?.created_at ? new Date(profile.created_at).getFullYear() : '2025'}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-2">
              {isOwnProfile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  leftIcon={<Edit2 className="h-4 w-4" />}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Sidebar (Bio & Socials) */}
          <div className="space-y-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4 bg-knighty-card p-4 rounded-lg border border-knighty-border">
                <Input label="Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-white">Bio</label>
                  <textarea 
                    value={form.bio} 
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full bg-knighty-bg border border-knighty-border rounded-lg px-3 py-2 text-white text-sm focus:border-knighty-accent outline-none"
                    rows={4}
                  />
                </div>
                <Input label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
                <Input label="Twitter" value={form.twitter_url} onChange={(e) => setForm({ ...form, twitter_url: e.target.value })} />
                <div className="flex gap-2 pt-2">
                  <Button type="submit" variant="primary" fullWidth size="sm">Save</Button>
                  <Button type="button" variant="ghost" fullWidth size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                </div>
              </form>
            ) : (
              <>
                {profile?.bio && (
                  <div className="prose prose-invert prose-sm">
                    <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                  </div>
                )}
                
                <div className="flex flex-col gap-2">
                  {profile?.website && (
                    <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-knighty-accent hover:underline text-sm">
                      <Globe className="h-4 w-4 mr-2" /> {profile.website.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                  {profile?.twitter_url && (
                    <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-knighty-muted hover:text-white text-sm">
                      <Twitter className="h-4 w-4 mr-2" /> Twitter
                    </a>
                  )}
                  {profile?.facebook_url && (
                    <a href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-knighty-muted hover:text-white text-sm">
                      <Facebook className="h-4 w-4 mr-2" /> Facebook
                    </a>
                  )}
                  {profile?.instagram_url && (
                    <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center text-knighty-muted hover:text-white text-sm">
                      <Instagram className="h-4 w-4 mr-2" /> Instagram
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Main Content (Tabs) */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex border-b border-knighty-border mb-6">
              <button
                onClick={() => setActiveTab('videos')}
                className={`pb-3 px-1 mr-8 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'videos' 
                    ? 'border-knighty-accent text-white' 
                    : 'border-transparent text-knighty-muted hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  Videos <span className="text-xs bg-knighty-card px-2 py-0.5 rounded text-knighty-muted">{streams.length}</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('diary')}
                className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${
                  activeTab === 'diary' 
                    ? 'border-knighty-accent text-white' 
                    : 'border-transparent text-knighty-muted hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Diary <span className="text-xs bg-knighty-card px-2 py-0.5 rounded text-knighty-muted">{userHistory.length}</span>
                </div>
              </button>
            </div>

            {/* Content Render */}
            {activeTab === 'videos' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {streams.length > 0 ? streams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                )) : (
                  <div className="col-span-full py-12 text-center border border-knighty-border border-dashed rounded-lg">
                    <p className="text-knighty-muted">No videos uploaded yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'diary' && (
              <div className="space-y-4">
                {userHistory.length > 0 ? userHistory.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-knighty-card border border-knighty-border p-4 rounded-lg hover:border-knighty-accent/30 transition-colors">
                    <Link to={`/streams/${item.stream_id}`} className="shrink-0 w-32 aspect-video bg-black rounded overflow-hidden">
                      {item.streams?.thumbnail_url ? (
                        <img src={item.streams.thumbnail_url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <div className="w-full h-full bg-knighty-subtle" />
                      )}
                    </Link>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <Link to={`/streams/${item.stream_id}`} className="font-bold text-white hover:text-knighty-accent text-lg">
                            {item.streams?.title || 'Unknown Stream'}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-knighty-muted mt-1">
                            <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {new Date(item.watched_at).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="uppercase tracking-wider">{item.streams?.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-knighty-accent">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="ml-1 font-bold">{item.rating}</span>
                        </div>
                      </div>
                      {item.content && (
                        <p className="mt-3 text-knighty-muted text-sm border-l-2 border-knighty-border pl-3 italic">
                          "{item.content}"
                        </p>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-12 text-center border border-knighty-border border-dashed rounded-lg">
                    <p className="text-knighty-muted">No watch history yet. Log some streams!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};
