import React, { useEffect, useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'
import { AlertCircle, Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

/** Reads (and clears) the in-app path saved before the OAuth redirect. Only same-site paths are allowed. */
function takeReturnPath(): string {
  let path: string | null = null
  try {
    path = sessionStorage.getItem('auth_return_to')
    sessionStorage.removeItem('auth_return_to')
  } catch {
    // storage blocked
  }
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/auth/callback')) return '/'
  return path
}

function errorFromUrl(): string | null {
  const query = new URLSearchParams(window.location.search)
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const raw =
    query.get('error_description') ?? hash.get('error_description') ?? query.get('error') ?? hash.get('error')
  return raw ? raw.replace(/\+/g, ' ') : null
}

export const AuthCallback: React.FC = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(() => errorFromUrl())

  useEffect(() => {
    if (error) return
    if (!isSupabaseConfigured) {
      setError('Sign-in is not configured on this site yet.')
      return
    }

    let done = false
    const go = (path: string) => {
      if (done) return
      done = true
      if (path.includes('#')) {
        // Full navigation so the browser scrolls to the hash section once the page renders.
        window.location.replace(path)
      } else {
        router.history.replace(path)
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) go(takeReturnPath())
    })

    supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (done) return
      if (sessionError) {
        done = true
        setError(sessionError.message)
        return
      }
      if (data.session) go(takeReturnPath())
    })

    const timer = window.setTimeout(() => {
      if (done) return
      takeReturnPath() // clear the stale value
      go('/')
    }, 4000)

    return () => {
      done = true
      subscription.unsubscribe()
      window.clearTimeout(timer)
    }
  }, [error, router])

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="card w-full max-w-sm p-8 text-center animate-pop-in" role={error ? 'alert' : 'status'}>
        {error ? (
          <>
            <AlertCircle className="mx-auto h-8 w-8 text-rose-300" aria-hidden="true" />
            <h1 className="mt-3 font-display text-xl font-bold text-fg">Sign-in didn't work</h1>
            <p className="mt-2 break-words text-sm text-fg-muted">{error}</p>
            <Link to="/" className="btn-ghost mt-6">
              Back home
            </Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-slime-400" aria-hidden="true" />
            <h1 className="mt-3 font-display text-lg font-semibold text-fg">Signing you in…</h1>
            <p className="mt-1 text-xs text-fg-faint">Finishing GitHub sign-in with Supabase.</p>
          </>
        )}
      </div>
    </div>
  )
}
