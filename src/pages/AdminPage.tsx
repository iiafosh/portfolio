import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { AlertTriangle, ArrowLeft, Database, ExternalLink, Loader2, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { supabase } from '@/lib/supabase'
import { useItems, useProfile } from '@/lib/content'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { Avatar } from '@/components/guestbook/Avatar'
import { githubMeta } from '@/components/guestbook/utils'
import { SectionOrderPanel } from '@/components/admin/SectionOrderPanel'
import { ProfilePanel } from '@/components/admin/ProfilePanel'
import { ItemsPanel } from '@/components/admin/ItemsPanel'

type Tab = 'layout' | 'profile' | 'content'
const TABS: { id: Tab; label: string }[] = [
  { id: 'content', label: 'Content' },
  { id: 'profile', label: 'Profile' },
  { id: 'layout', label: 'Layout' },
]

const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-[60vh] items-center justify-center py-16">
    <div className="card w-full max-w-md p-8 text-center animate-pop-in">{children}</div>
  </div>
)

const HomeLink: React.FC = () => (
  <Link to="/" className="btn-ghost mt-6">
    <ArrowLeft className="h-4 w-4" /> Back home
  </Link>
)

/** Definitive owner check straight from Postgres (also tells us if the SQL hasn't been run). */
function useOwnerCheck(userId: string | undefined) {
  return useQuery({
    queryKey: ['portfolio', 'is-owner', userId],
    enabled: Boolean(userId),
    staleTime: 5 * 60_000,
    retry: false,
    queryFn: async () => {
      const { data, error } = await supabase.rpc('is_portfolio_owner')
      if (error) throw error
      return data === true
    },
  })
}

const OwnerEditor: React.FC = () => {
  const [tab, setTab] = useState<Tab>('content')
  const { source: profileSource } = useProfile()
  const { source: itemsSource, isFetching } = useItems()
  const { user, signOut } = useAuth()
  const me = githubMeta(user)
  const fallback = !isFetching && (profileSource === 'fallback' || itemsSource === 'fallback')

  return (
    <div className="space-y-5 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1.5">
          <p className="eyebrow">admin // editor</p>
          <h1 className="section-title">Portfolio editor</h1>
          <p className="text-sm text-fg-muted">Changes go live for every visitor as soon as they're saved.</p>
        </div>
        <div className="flex items-center gap-2">
          <Avatar src={me.avatarUrl} name={me.name} size="sm" />
          <span className="font-mono text-xs text-fg-muted">@{me.username}</span>
          <a href="/" target="_blank" rel="noopener noreferrer" className="icon-btn" aria-label="Open site in a new tab" title="View site">
            <ExternalLink className="h-4 w-4" />
          </a>
          <button type="button" className="btn-ghost px-3 py-2 text-xs" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </header>

      {fallback && (
        <div role="alert" className="flex gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          <p>
            Portfolio tables not found — run <code className="font-mono text-xs">supabase/portfolio.sql</code> in the
            Supabase SQL Editor. Until then the site shows the built-in copy and edits here may fail.
          </p>
        </div>
      )}

      <div role="tablist" aria-label="Editor sections" className="flex gap-1 rounded-xl border border-line bg-ink-900/70 p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`panel-${t.id}`}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              tab === t.id ? 'bg-slime-400/15 text-slime-200' : 'text-fg-muted hover:bg-white/[0.04] hover:text-fg'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'content' && <ItemsPanel />}
        {tab === 'profile' && <ProfilePanel />}
        {tab === 'layout' && <SectionOrderPanel />}
      </div>
    </div>
  )
}

export const AdminPage: React.FC = () => {
  const { user, isLoading, isConfigured, isOwner, signInWithGithub, signOut } = useAuth()
  const ownerCheck = useOwnerCheck(isConfigured ? user?.id : undefined)

  if (!isConfigured) {
    return (
      <Shell>
        <Database className="mx-auto h-8 w-8 text-fg-faint" aria-hidden="true" />
        <h1 className="mt-3 font-display text-xl font-bold text-fg">Supabase isn't configured</h1>
        <p className="mt-2 text-sm text-fg-muted">
          Set <code className="font-mono text-xs text-fg">VITE_SUPABASE_URL</code> and{' '}
          <code className="font-mono text-xs text-fg">VITE_SUPABASE_ANON_KEY</code> in your environment, then rebuild to use the
          editor.
        </p>
        <HomeLink />
      </Shell>
    )
  }

  if (isLoading || (user && !isOwner && ownerCheck.isPending)) {
    return (
      <Shell>
        <Loader2 className="mx-auto h-7 w-7 animate-spin text-slime-400" aria-hidden="true" />
        <p className="mt-3 text-sm text-fg-muted" role="status">
          Checking access…
        </p>
      </Shell>
    )
  }

  if (!user) {
    return (
      <Shell>
        <Lock className="mx-auto h-8 w-8 text-fg-faint" aria-hidden="true" />
        <h1 className="mt-3 font-display text-xl font-bold text-fg">Owner sign-in</h1>
        <p className="mt-2 text-sm text-fg-muted">The editor is only available to the site owner.</p>
        <button type="button" className="btn-primary mt-6" onClick={() => void signInWithGithub('/admin')}>
          <GithubIcon className="h-4 w-4" /> Sign in with GitHub
        </button>
      </Shell>
    )
  }

  if (!isOwner && ownerCheck.data !== true) {
    if (ownerCheck.isError) {
      return (
        <Shell>
          <AlertTriangle className="mx-auto h-8 w-8 text-amber-300" aria-hidden="true" />
          <h1 className="mt-3 font-display text-xl font-bold text-fg">Database setup needed</h1>
          <p className="mt-2 text-sm text-fg-muted">
            Couldn't verify owner access. Run <code className="font-mono text-xs text-fg">supabase/portfolio.sql</code> in the
            Supabase SQL Editor, then reload.
          </p>
          <HomeLink />
        </Shell>
      )
    }
    return (
      <Shell>
        <Lock className="mx-auto h-8 w-8 text-fg-faint" aria-hidden="true" />
        <h1 className="mt-3 font-display text-xl font-bold text-fg">This area is for the site owner.</h1>
        <p className="mt-2 text-sm text-fg-muted">
          You're signed in as <span className="font-mono text-fg">@{githubMeta(user).username ?? 'unknown'}</span>.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/" className="btn-primary">
            <ArrowLeft className="h-4 w-4" /> Back home
          </Link>
          <button type="button" className="btn-ghost" onClick={() => void signOut()}>
            Sign out
          </button>
        </div>
      </Shell>
    )
  }

  return <OwnerEditor />
}
