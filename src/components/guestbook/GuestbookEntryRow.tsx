import React from 'react'
import { Trash2 } from 'lucide-react'
import type { GuestbookEntry } from '@/content/types'
import { Avatar } from './Avatar'
import { OWNER_GITHUB, relativeTime } from './utils'

interface GuestbookEntryRowProps {
  entry: GuestbookEntry
  now: number
  canDelete: boolean
  deleting: boolean
  onDelete: (id: string) => void
}

export const GuestbookEntryRow: React.FC<GuestbookEntryRowProps> = ({ entry, now, canDelete, deleting, onDelete }) => {
  const username = entry.github_username
  const name = entry.display_name || username || 'Anonymous'
  const isAuthor = username?.toLowerCase() === OWNER_GITHUB

  return (
    <li className="flex gap-3 py-4 first:pt-0 last:pb-0 animate-pop-in">
      <Avatar src={entry.avatar_url} name={name} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="truncate font-medium text-fg">{name}</span>
          {isAuthor && (
            <span className="rounded border border-slime-400/40 bg-slime-400/10 px-1.5 py-px font-pixel text-[9px] uppercase tracking-widest text-slime-300">
              author
            </span>
          )}
          {username && (
            <a
              href={`https://github.com/${encodeURIComponent(username)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="truncate font-mono text-xs text-fg-faint transition-colors hover:text-slime-300"
            >
              @{username}
            </a>
          )}
          <time dateTime={entry.created_at} title={new Date(entry.created_at).toLocaleString()} className="font-mono text-xs text-fg-faint">
            · {relativeTime(entry.created_at, now)}
          </time>
        </div>
        <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-fg-muted">{entry.message}</p>
      </div>
      {canDelete && (
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          disabled={deleting}
          aria-label={`Delete message from ${name}`}
          title="Delete"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center self-start rounded-xl text-fg-faint transition-colors hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </li>
  )
}

export const GuestbookSkeleton: React.FC = () => (
  <ul className="divide-y divide-line" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <li key={i} className="flex gap-3 py-4 first:pt-0 last:pb-0">
        <span className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-ink-800" />
        <div className="flex-1 space-y-2 pt-1">
          <span className="block h-3 w-40 animate-pulse rounded bg-ink-800" />
          <span className="block h-3 w-full max-w-md animate-pulse rounded bg-ink-800/70" />
        </div>
      </li>
    ))}
  </ul>
)
