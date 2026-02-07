import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { PostgrestError, AuthError } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  username: string;
}

interface Profile {
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  twitter_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  bio: string | null;
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, username: string) => Promise<{ error: AuthError | PostgrestError | null }>;
  signOut: () => Promise<void>;
  checkUser: () => Promise<void>;
  fetchProfile: (username: string) => Promise<{ data: Profile | null; error: PostgrestError | null }>;
  updateProfile: (profile: Partial<Profile>) => Promise<{ error: PostgrestError | null }>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAdmin: false,
  isLoading: true,
  
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (!error && data?.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      set({ 
        user: { 
          id: data.user.id, 
          email: data.user.email || '',
          username: data.user.user_metadata.username
        },
        profile,
        isAdmin: true,
      });
    }
    
    return { error };
  },
  
  signUp: async (email, password, username) => {
    // First check if username exists
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existingUser) {
      return { 
        error: {
          message: 'Username already taken',
          details: '',
          hint: '',
          code: 'USERNAME_TAKEN'
        } as PostgrestError 
      };
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username
        }
      }
    });
    
    if (signUpError) return { error: signUpError };
    
    if (data?.user) {
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single();

      if (!existingProfile) {
        // Only create profile if it doesn't exist
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            full_name: null,
            avatar_url: null,
          });

        if (profileError) return { error: profileError };
      }

      set({ 
        user: { 
          id: data.user.id, 
          email: data.user.email || '',
          username
        },
        profile: null,
        isAdmin: true,
      });
    }
    
    return { error: null };
  },
  
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, isAdmin: false });
  },
  
  checkUser: async () => {
    set({ isLoading: true });
    
    try {
      const { data } = await supabase.auth.getUser();
      
      if (data?.user) {
        set({ 
          user: { 
            id: data.user.id, 
            email: data.user.email || '',
            username: data.user.user_metadata.username
          },
          isAdmin: true, // For simplicity, all authenticated users are admins
        });
      }
    } catch (error) {
      console.warn('Could not check user session:', error);
    }
    
    set({ isLoading: false });
  },

  updateProfile: async (profile) => {
    const { user } = get();
    if (!user) return { error: { message: 'No user logged in', details: '', hint: '', code: 'NOT_AUTHENTICATED' } as PostgrestError };

    const { error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id);

    if (!error) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (data) {
        set({ profile: data });
      }
    }

    return { error };
  },

  fetchProfile: async (username) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    return { data, error };
  },
}));