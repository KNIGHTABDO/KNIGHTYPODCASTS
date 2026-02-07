export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      podcasts: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          video_url: string
          thumbnail_url: string
          category: string
          duration: number
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          video_url: string
          thumbnail_url: string
          category: string
          duration: number
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          video_url?: string
          thumbnail_url?: string
          category?: string
          duration?: number
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          website: string | null
          twitter_url: string | null
          facebook_url: string | null
          instagram_url: string | null
          bio: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          twitter_url?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          twitter_url?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          bio?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}