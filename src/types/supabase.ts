export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      stories: {
        Row: {
          id: number
          name: string
          email: string
          city: string
          state: string
          category: "education" | "health" | "livelihood" | "other"
          title: string
          story: string
          photo_url: string | null
          created_at: string
          updated_at: string
          featured: boolean
          verified: boolean
        }
        Insert: {
          id?: never
          name: string
          email: string
          city: string
          state: string
          category: "education" | "health" | "livelihood" | "other"
          title: string
          story: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string
          featured?: boolean
          verified?: boolean
        }
        Update: {
          id?: never
          name?: string
          email?: string
          city?: string
          state?: string
          category?: "education" | "health" | "livelihood" | "other"
          title?: string
          story?: string
          photo_url?: string | null
          created_at?: string
          updated_at?: string
          featured?: boolean
          verified?: boolean
        }
        Relationships: []
      }
      contacts: {
        Row: {
          id: number
          name: string
          email: string
          subject: string
          message: string
          created_at: string
        }
        Insert: {
          id?: never
          name: string
          email: string
          subject: string
          message: string
          created_at?: string
        }
        Update: {
          id?: never
          name?: string
          email?: string
          subject?: string
          message?: string
          created_at?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
