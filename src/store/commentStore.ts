import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { AppError, toAppError } from '../types/errors';

interface Comment {
  id: string;
  created_at: string;
  stream_id: string;
  user_id: string;
  username: string;
  content: string;
  parent_id: string | null;
}

interface CommentState {
  comments: Comment[];
  isLoading: boolean;
  error: AppError | null;
  fetchComments: (streamId: string) => Promise<void>;
  addComment: (streamId: string, content: string, parentId?: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  updateComment: (commentId: string, content: string) => Promise<void>;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [],
  isLoading: false,
  error: null,

  fetchComments: async (streamId) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('stream_id', streamId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ comments: data || [], isLoading: false, error: null });
    } catch (error: unknown) {
      const appError = toAppError(error);
      set({ error: appError, isLoading: false });
    }
  },

  addComment: async (streamId, content, parentId = undefined) => {
    const user = useAuthStore.getState().user;
    if (!user) throw new Error('User not authenticated');

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          stream_id: streamId,
          user_id: user.id,
          username: user.username,
          content,
          parent_id: parentId
        });

      if (error) throw error;
      
      // Refresh comments
      await get().fetchComments(streamId);
    } catch (error: unknown) {
      const appError = toAppError(error);
      set({ error: appError });
    }
  },

  deleteComment: async (commentId) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      set({ comments: get().comments.filter(c => c.id !== commentId) });
    } catch (error: unknown) {
      const appError = toAppError(error);
      set({ error: appError });
    }
  },

  updateComment: async (commentId, content) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content })
        .eq('id', commentId);

      if (error) throw error;

      set({
        comments: get().comments.map(c =>
          c.id === commentId ? { ...c, content } : c
        )
      });
    } catch (error: unknown) {
      const appError = toAppError(error);
      set({ error: appError });
    }
  }
}));
