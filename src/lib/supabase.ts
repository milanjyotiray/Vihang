import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      stories: {
        Row: {
          id: number
          name: string
          email: string
          city: string
          state: string
          category: string
          title: string
          story: string
          photo_url: string | null
          created_at: string
          updated_at: string
          featured: boolean
          verified: boolean
          help_approved: boolean
        }
        Insert: {
          id?: number
          name: string
          email: string
          city: string
          state: string
          category: string
          title: string
          story: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string
          featured?: boolean
          verified?: boolean
          help_approved?: boolean
        }
        Update: {
          id?: number
          name?: string
          email?: string
          city?: string
          state?: string
          category?: string
          title?: string
          story?: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string
          featured?: boolean
          verified?: boolean
          help_approved?: boolean
        }
      }
      ngos: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          website: string | null
          description: string
          focus_areas: string[]
          city: string
          state: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          website?: string | null
          description: string
          focus_areas: string[]
          city: string
          state: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          website?: string | null
          description?: string
          focus_areas?: string[]
          city?: string
          state?: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
