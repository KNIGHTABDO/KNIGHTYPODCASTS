import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { useAuthStore } from '../store/authStore';
import { useLanguageStore } from '../store/languageStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Globe, Shield, Bell } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  const { currentLanguage, setLanguage } = useLanguageStore();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [form, setForm] = useState({
    full_name: '',
    username: '', // Read only usually
    website: '',
    bio: '',
  });

  // Load initial data
  React.useEffect(() => {
    if (user) {
      setForm({
        full_name: user.full_name || '',
        username: user.username || '',
        website: user.website || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      await updateProfile({
        full_name: form.full_name,
        website: form.website,
        bio: form.bio,
      });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-knighty-accent text-black' 
                  : 'text-knighty-muted hover:text-white hover:bg-knighty-card'
              }`}
            >
              <User className="h-4 w-4 mr-3" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'preferences' 
                  ? 'bg-knighty-accent text-black' 
                  : 'text-knighty-muted hover:text-white hover:bg-knighty-card'
              }`}
            >
              <Globe className="h-4 w-4 mr-3" />
              Preferences
            </button>
            <button
              disabled
              className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-knighty-muted/50 cursor-not-allowed"
            >
              <Shield className="h-4 w-4 mr-3" />
              Security (Coming Soon)
            </button>
            <button
              disabled
              className="w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium text-knighty-muted/50 cursor-not-allowed"
            >
              <Bell className="h-4 w-4 mr-3" />
              Notifications (Coming Soon)
            </button>
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3">
            <div className="bg-knighty-card border border-knighty-border rounded-xl p-6 md:p-8">
              
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Profile Information</h2>
                    <p className="text-sm text-knighty-muted">Update your public profile details.</p>
                  </div>

                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-1">Username</label>
                        <input 
                          type="text" 
                          value={form.username}
                          disabled
                          className="w-full bg-knighty-bg border border-knighty-border rounded-lg px-3 py-2 text-knighty-muted cursor-not-allowed"
                        />
                      </div>
                      <Input 
                        label="Full Name" 
                        value={form.full_name} 
                        onChange={(e) => setForm({...form, full_name: e.target.value})}
                      />
                    </div>
                    
                    <Input 
                      label="Website" 
                      value={form.website} 
                      onChange={(e) => setForm({...form, website: e.target.value})}
                      placeholder="https://your-site.com"
                    />
                    
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-white">Bio</label>
                      <textarea
                        value={form.bio}
                        onChange={(e) => setForm({...form, bio: e.target.value})}
                        rows={4}
                        className="w-full bg-knighty-bg border border-knighty-border rounded-lg px-3 py-2 text-white text-sm focus:border-knighty-accent focus:ring-1 focus:ring-knighty-accent outline-none transition-all resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {message && (
                      <div className={`p-3 rounded-lg text-sm ${
                        message.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {message.text}
                      </div>
                    )}

                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={isLoading}
                        className="bg-white text-black hover:bg-gray-200 font-bold"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Preferences Settings */}
              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">Language</h2>
                    <p className="text-sm text-knighty-muted">Select your preferred language for the interface.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        currentLanguage === 'en'
                          ? 'border-knighty-accent bg-knighty-accent/10'
                          : 'border-knighty-border bg-knighty-bg hover:border-knighty-muted'
                      }`}
                    >
                      <div className="font-bold text-white mb-1">English</div>
                      <div className="text-sm text-knighty-muted">Default interface language</div>
                    </button>

                    <button
                      onClick={() => setLanguage('ar')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        currentLanguage === 'ar'
                          ? 'border-knighty-accent bg-knighty-accent/10'
                          : 'border-knighty-border bg-knighty-bg hover:border-knighty-muted'
                      }`}
                    >
                      <div className="font-bold text-white mb-1">Arabic (العربية)</div>
                      <div className="text-sm text-knighty-muted">Right-to-left interface support</div>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
