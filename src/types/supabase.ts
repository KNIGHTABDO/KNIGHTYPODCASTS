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
          username: string
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
          username: string
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
          username?: string
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