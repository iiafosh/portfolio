import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check whether real credentials have been configured
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-supabase-anon-key')
)

// Fallback dummy URL to prevent createClient throwing during early startup before .env is configured
const safeUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co'
const safeKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key'

export const supabase = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Database model definition matching supabase/schema.sql
export interface UserItem {
  id: string
  user_id: string
  title: string
  description?: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
}
