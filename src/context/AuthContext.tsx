import React, { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  isConfigured: boolean
  /** True when signed in as the site owner (GitHub @iiafosh). Server-side RLS is the real gate. */
  isOwner: boolean
  /** Starts GitHub OAuth. `returnTo` is the in-app path to land on afterwards (default: current path). */
  signInWithGithub: (returnTo?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOwner, setIsOwner] = useState(false)

  useEffect(() => {
    if (!user || !isSupabaseConfigured) {
      setIsOwner(false)
      return
    }
    let cancelled = false
    supabase.rpc('is_portfolio_owner').then(({ data, error }) => {
      if (!cancelled) setIsOwner(!error && data === true)
    })
    return () => {
      cancelled = true
    }
  }, [user])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error fetching initial session:', error)
      }
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // 2. Subscribe to auth changes (sign in, sign out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signInWithGithub = async (returnTo?: string) => {
    if (!isSupabaseConfigured) {
      alert('Supabase credentials are not configured yet. Please update your .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
      return
    }

    const next = returnTo ?? `${window.location.pathname}${window.location.hash}`
    try {
      sessionStorage.setItem('auth_return_to', next)
    } catch {
      // storage blocked: callback falls back to home
    }
    const redirectUrl = `${window.location.origin}/auth/callback`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: redirectUrl,
        scopes: 'read:user user:email',
      },
    })

    if (error) {
      console.error('Error initiating GitHub sign-in:', error)
      alert(`GitHub login failed: ${error.message}`)
    }
  }

  const signOut = async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      setSession(null)
      return
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
    } else {
      setUser(null)
      setSession(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured: isSupabaseConfigured,
        isOwner,
        signInWithGithub,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
