import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { usePodcastStore } from '../store/podcastStore';
import { useAuthStore } from '../store/authStore';
import { Edit2, Globe, Twitter, Facebook, Instagram, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Profile {
  full_name: string | null;
  bio: string | null;
  website: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  avatar_url: string | null;
}

export const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { user, updateProfile, fetchProfile } = useAuthStore();
  const { podcasts, fetchPodcastsByUsername } = usePodcastStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
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
    const { data } = await fetchProfile(username!);
    setProfile(data);
    if (user?.username === username) {
      setForm({
        full_name: data?.full_name || '',
        bio: data?.bio || '',
        website: data?.website || '',
        twitter_url: data?.twitter_url || '',
        facebook_url: data?.facebook_url || '',
        instagram_url: data?.instagram_url || '',
      });
    }
  }, [fetchProfile, username, user?.username]);

  useEffect(() => {
    if (username) {
      loadProfile();
      fetchPodcastsByUsername(username);
    }
  }, [fetchPodcastsByUsername, loadProfile, username]);

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

      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB');
      }

      // Check file type
      if (!file.type.match(/^image\/(jpeg|png|gif)$/)) {
        throw new Error('File must be an image (JPG, PNG, or GIF)');
      }

      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      await updateProfile({ avatar_url: publicUrl });
      
      // Reload profile to show new avatar
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-vercel-card border border-vercel-border rounded-lg shadow-xl p-8">
          {/* Profile Header with Avatar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${username}`}
                  alt={username}
                  className="w-20 h-20 rounded-full object-cover"
                />
                {isOwnProfile && (
                  <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer hover:bg-gray-200 transition-colors">
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
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {profile?.full_name || username}
                </h1>
                <p className="text-vercel-muted">@{username}</p>
              </div>
            </div>
            {isOwnProfile && (
              <Button
                variant="ghost"
                onClick={() => setIsEditing(!isEditing)}
                leftIcon={<Edit2 className="h-4 w-4" />}
              >
                Edit Profile
              </Button>
            )}
          </div>

          {/* Profile Content */}
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
              <Input
                label="Bio"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                multiple
              />
              <Input
                label="Website"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://"
              />
              <Input
                label="Twitter URL"
                value={form.twitter_url}
                onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
                placeholder="https://twitter.com/"
              />
              <Input
                label="Facebook URL"
                value={form.facebook_url}
                onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                placeholder="https://facebook.com/"
              />
              <Input
                label="Instagram URL"
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                placeholder="https://instagram.com/"
              />
              <div className="flex space-x-4">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {profile?.bio && (
                <div className="text-gray-300">{profile.bio}</div>
              )}
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {profile?.website && (
                  <a
                    href={profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vercel-muted hover:text-white transition-colors duration-200"
                  >
                    <Globe className="h-5 w-5" />
                  </a>
                )}
                {profile?.twitter_url && (
                  <a
                    href={profile.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vercel-muted hover:text-white transition-colors duration-200"
                  >
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {profile?.facebook_url && (
                  <a
                    href={profile.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vercel-muted hover:text-white transition-colors duration-200"
                  >
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {profile?.instagram_url && (
                  <a
                    href={profile.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vercel-muted hover:text-white transition-colors duration-200"
                  >
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* User's Videos */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-white mb-6">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {podcasts.map((podcast) => (
                <div
                  key={podcast.id}
                  className="bg-black border border-vercel-border rounded-lg overflow-hidden cursor-pointer transform transition-all duration-200 hover:border-gray-500 hover:scale-[1.02]"
                  onClick={() => navigate(`/podcasts/${podcast.id}`)}
                >
                  <img
                    src={podcast.thumbnail_url}
                    alt={podcast.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-semibold mb-2">{podcast.title}</h3>
                    <p className="text-vercel-muted text-sm line-clamp-2">
                      {podcast.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
