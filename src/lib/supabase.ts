import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

// Supabase configuration
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

console.log('Supabase configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  anonKeyLength: supabaseAnonKey?.length || 0
})

if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
  console.error('Invalid Supabase URL:', supabaseUrl)
  throw new Error(
    'Missing or invalid VITE_SUPABASE_URL. Please check your .env file.'
  )
}

if (!supabaseAnonKey || supabaseAnonKey === 'your-anon-key') {
  console.error('Invalid Supabase anon key')
  throw new Error(
    'Missing or invalid VITE_SUPABASE_ANON_KEY. Please check your .env file.'
  )
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'vihang-web-app'
    }
  }
})

// Test connection on initialization
supabase.from('stories').select('count', { count: 'exact', head: true })
  .then(({ error, count }) => {
    if (error) {
      console.error('Supabase connection test failed:', error)
    } else {
      console.log('✅ Supabase connected successfully, stories count:', count)
    }
  })
  .catch((error: any) => {
    console.error('❌ Supabase connection failed:', error)
  })

// Database table types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
