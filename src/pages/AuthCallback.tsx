import React, { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '@/lib/supabase'
import { RefreshCw, AlertCircle } from 'lucide-react'

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Supabase will automatically parse the hash/code in URL
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          setError(error.message)
          return
        }

        if (data.session) {
          navigate({ to: '/database' })
          return
        }

        // If not immediately available, subscribe once
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            navigate({ to: '/database' })
          }
        })

        // Timeout fallback after 4 seconds
        const timeout = setTimeout(() => {
          navigate({ to: '/database' })
        }, 4000)

        return () => {
          authListener.subscription.unsubscribe()
          clearTimeout(timeout)
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unexpected authentication error occurred.')
        }
      }
    }

    checkSession()
  }, [navigate])

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm text-center shadow-xl space-y-4">
        {error ? (
          <>
            <div className="w-12 h-12 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Authentication Failed</h2>
            <p className="text-xs text-rose-300">{error}</p>
            <button
              onClick={() => navigate({ to: '/' })}
              className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl hover:bg-slate-700 transition-colors"
            >
              Back to Overview
            </button>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
            <h2 className="text-xl font-bold text-white">Completing GitHub Sign-In</h2>
            <p className="text-xs text-slate-400">
              Verifying your authentication token with Supabase and preparing your dashboard...
            </p>
          </>
        )}
      </div>
    </div>
  )
}
