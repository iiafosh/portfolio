import React, { useEffect, useId, useState } from 'react'
import confetti from 'canvas-confetti'
import { Check, Send } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { useSignGuestbook } from '@/lib/content'
import { Avatar } from './Avatar'
import { GUESTBOOK_MAX, friendlyError, githubMeta } from './utils'

function celebrate(from: HTMLElement | null) {
  if (typeof window === 'undefined') return
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  const rect = from?.getBoundingClientRect()
  const origin = rect
    ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
    : { x: 0.5, y: 0.7 }
  void confetti({
    particleCount: 50,
    spread: 60,
    startVelocity: 28,
    ticks: 120,
    scalar: 0.8,
    origin,
    colors: ['#4fc8ff', '#86dcff', '#dff6ff', '#a78bfa'],
    disableForReducedMotion: true,
  })
}

interface GuestbookComposerProps {
  user: User
  onSignOut: () => void
}

export const GuestbookComposer: React.FC<GuestbookComposerProps> = ({ user, onSignOut }) => {
  const [message, setMessage] = useState('')
  const [posted, setPosted] = useState(false)
  const sign = useSignGuestbook()
  const me = githubMeta(user)
  const inputId = useId()
  const counterId = useId()

  const trimmed = message.trim()
  const remaining = GUESTBOOK_MAX - message.length
  const canPost = trimmed.length > 0 && trimmed.length <= GUESTBOOK_MAX && !sign.isPending

  useEffect(() => {
    if (!posted) return
    const t = window.setTimeout(() => setPosted(false), 2500)
    return () => window.clearTimeout(t)
  }, [posted])

  const submit = (button: HTMLElement | null) => {
    if (!canPost) return
    sign.mutate(trimmed, {
      onSuccess: () => {
        setMessage('')
        setPosted(true)
        celebrate(button)
      },
    })
  }

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault()
        submit((e.currentTarget.querySelector('button[type=submit]') as HTMLElement | null) ?? null)
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2 text-sm text-fg-muted">
          <Avatar src={me.avatarUrl} name={me.name} size="sm" />
          <span className="truncate">
            Signed in as <span className="font-mono text-fg">@{me.username ?? 'you'}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onSignOut}
          className="shrink-0 px-1 py-2 text-xs text-fg-faint underline-offset-4 transition-colors hover:text-fg hover:underline"
        >
          Sign out
        </button>
      </div>

      <label htmlFor={inputId} className="sr-only">
        Your message
      </label>
      <textarea
        id={inputId}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
          if (sign.isError) sign.reset()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault()
            submit(e.currentTarget.form?.querySelector('button[type=submit]') as HTMLElement | null)
          }
        }}
        maxLength={GUESTBOOK_MAX}
        rows={3}
        placeholder="Say hi, leave a tip, or tell me your favourite anime…"
        aria-describedby={counterId}
        className="w-full resize-y rounded-xl border border-line bg-ink-950/60 px-3.5 py-3 text-sm text-fg placeholder:text-fg-faint focus:border-slime-400/50 focus:outline-none focus:ring-2 focus:ring-slime-400/20"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p id={counterId} className="font-mono text-xs text-fg-faint">
          <span className={remaining <= 20 ? 'text-amber-300' : undefined}>{remaining}</span> left
          <span className="hidden sm:inline">
            {' · '}
            <kbd className="kbd">Ctrl</kbd> <kbd className="kbd">Enter</kbd> to post
          </span>
        </p>
        <div className="flex items-center gap-3">
          {posted && (
            <span role="status" className="inline-flex items-center gap-1 text-xs text-live animate-pop-in">
              <Check className="h-3.5 w-3.5" /> Posted
            </span>
          )}
          <button type="submit" className="btn-primary" disabled={!canPost}>
            <Send className="h-4 w-4" />
            {sign.isPending ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>

      {sign.isError && (
        <p role="alert" className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">
          {friendlyError(sign.error)}
        </p>
      )}
    </form>
  )
}
