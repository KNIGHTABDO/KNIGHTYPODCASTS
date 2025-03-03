import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Database } from '../types/supabase';
import { useAuthStore } from './authStore';

type Podcast = Database['public']['Tables']['podcasts']['Row'];

interface PodcastState {
  podcasts: Podcast[];
  featuredPodcasts: Podcast[];
  currentPodcast: Podcast | null;
  isLoading: boolean;
  error: string | null;
  fetchPodcasts: () => Promise<void>;
  fetchFeaturedPodcasts: () => Promise<void>;
  fetchPodcastById: (id: string) => Promise<void>;
  fetchPodcastsByUsername: (username: string) => Promise<void>;
  addPodcast: (podcast: Omit<Podcast, 'id' | 'created_at'>) => Promise<{ error: string | null }>;
  updatePodcast: (id: string, podcast: Partial<Podcast>) => Promise<{ error: string | null }>;
  deletePodcast: (id: string) => Promise<{ error: string | null }>;
  fetchUserPodcasts: () => Promise<void>;
}

type ErrorWithMessage = {
  message: string;
};

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>).message === 'string'
  );
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    return new Error(String(maybeError));
  }
}

export const usePodcastStore = create<PodcastState>((set, get) => ({
  podcasts: [],
  featuredPodcasts: [],
  currentPodcast: null,
  isLoading: false,
  error: null,

  fetchPodcasts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ podcasts: data || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  fetchFeaturedPodcasts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      
      set({ featuredPodcasts: data || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  fetchPodcastById: async (id: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      set({ currentPodcast: data, isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  fetchPodcastsByUsername: async (username: string) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .eq('username', username)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ podcasts: data || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },

  addPodcast: async (podcast) => {
    try {
      const user = useAuthStore.getState().user;
      if (!user?.username) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('podcasts')
        .insert([{ ...podcast, username: user.username }])
        .select();
      
      if (error) throw error;
      
      if (data) {
        set({ podcasts: [data[0], ...get().podcasts] });
      }
      
      return { error: null };
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      return { error: errorWithMessage.message };
    }
  },

  updatePodcast: async (id, podcast) => {
    try {
      const { data, error } = await supabase
        .from('podcasts')
        .update(podcast)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      
      if (data) {
        set({
          podcasts: get().podcasts.map(p => p.id === id ? data[0] : p),
          currentPodcast: data[0]
        });
      }
      
      return { error: null };
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      return { error: errorWithMessage.message };
    }
  },

  deletePodcast: async (id) => {
    try {
      const { error } = await supabase
        .from('podcasts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      set({
        podcasts: get().podcasts.filter(p => p.id !== id),
        currentPodcast: null
      });
      
      return { error: null };
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      return { error: errorWithMessage.message };
    }
  },

  fetchUserPodcasts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const user = useAuthStore.getState().user;
      if (!user?.username) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .eq('username', user.username)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set({ podcasts: data || [], isLoading: false });
    } catch (error) {
      const errorWithMessage = toErrorWithMessage(error);
      set({ error: errorWithMessage.message, isLoading: false });
    }
  },
}));