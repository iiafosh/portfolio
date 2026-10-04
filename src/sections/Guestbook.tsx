import React, { useEffect, useState } from 'react'
import { MessageSquareDashed } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { useAuth } from '@/context/AuthContext'
import { useDeleteGuestbookEntry, useGuestbook, useGuestbookRealtime } from '@/lib/content'
import { GuestbookComposer } from '@/components/guestbook/GuestbookComposer'
import { GuestbookEntryRow, GuestbookSkeleton } from '@/components/guestbook/GuestbookEntryRow'
import { friendlyError } from '@/components/guestbook/utils'

const PAGE = 10

/** Re-renders every minute so relative timestamps stay fresh. */
function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), intervalMs)
    return () => window.clearInterval(t)
  }, [intervalMs])
  return now
}

const WarmingUp: React.FC = () => (
  <div className="card flex items-center gap-3 p-5 text-sm text-fg-muted">
    <MessageSquareDashed className="h-5 w-5 shrink-0 text-fg-faint" aria-hidden="true" />
    Guestbook is warming up — check back soon.
  </div>
)

export const GuestbookSection: React.FC = () => {
  const { user, isConfigured, isLoading: authLoading, isOwner, signInWithGithub, signOut } = useAuth()
  const guestbook = useGuestbook()
  const del = useDeleteGuestbookEntry()
  const [shown, setShown] = useState(PAGE)
  const now = useNow()

  useGuestbookRealtime(isConfigured && !guestbook.isError)

  const header = { id: 'guestbook', eyebrow: 'guestbook', title: 'Leave a mark' }

  if (!isConfigured || guestbook.isError) {
    return (
      <Section {...header}>
        <WarmingUp />
      </Section>
    )
  }

  const entries = guestbook.data ?? []
  const visible = entries.slice(0, shown)

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this message?')) del.mutate(id)
  }

  return (
    <Section {...header}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* Composer / sign-in */}
        <div className="card h-fit p-5">
          {authLoading ? (
            <div className="h-24 animate-pulse rounded-xl bg-ink-800/60" aria-hidden="true" />
          ) : user ? (
            <GuestbookComposer user={user} onSignOut={() => void signOut()} />
          ) : (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-fg-muted">
                Sign in with GitHub and say hi — it's stored in Postgres with Row Level Security.
              </p>
              <button type="button" className="btn-primary w-full sm:w-auto" onClick={() => void signInWithGithub('/#guestbook')}>
                <GithubIcon className="h-4 w-4" />
                Sign in with GitHub
              </button>
              <p className="font-mono text-[11px] text-fg-faint">Only your public username and avatar are shown.</p>
            </div>
          )}
        </div>

        {/* Entries */}
        <div className="card p-5" aria-live="polite" aria-busy={guestbook.isLoading}>
          {guestbook.isLoading ? (
            <GuestbookSkeleton />
          ) : entries.length === 0 ? (
            <p className="py-6 text-center text-sm text-fg-muted">Be the first to sign.</p>
          ) : (
            <>
              <ul className="divide-y divide-line">
                {visible.map((entry) => (
                  <GuestbookEntryRow
                    key={entry.id}
                    entry={entry}
                    now={now}
                    canDelete={Boolean(user) && (entry.user_id === user?.id || isOwner)}
                    deleting={del.isPending && del.variables === entry.id}
                    onDelete={handleDelete}
                  />
                ))}
              </ul>
              {entries.length > shown && (
                <button
                  type="button"
                  onClick={() => setShown((n) => n + PAGE)}
                  className="btn-ghost mt-4 w-full"
                >
                  Show more ({entries.length - shown})
                </button>
              )}
            </>
          )}
          {del.isError && (
            <p role="alert" className="mt-3 text-xs text-rose-300">
              Couldn't delete: {friendlyError(del.error)}
            </p>
          )}
        </div>
      </div>
    </Section>
  )
}
