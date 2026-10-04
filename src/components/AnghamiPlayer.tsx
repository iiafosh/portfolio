import React, { useState } from 'react'
import { ArrowUpRight, ChevronUp, Pencil, Play } from 'lucide-react'
import { AnghamiIcon } from '@/components/icons/AnghamiIcon'
import { useAuth } from '@/context/AuthContext'
import { useProfile } from '@/lib/content'

// "On repeat" card with the official Anghami embed. Collapsed to a slim bar by
// default; the iframe only mounts once a visitor opens it.
//
// The owner can swap the embedded track/playlist. That choice is stored in
// localStorage (key below), so it only applies to the owner's own browser.
// TODO: move it to a portfolio_profile column (e.g. anghami_embed) so visitors
// see the owner's pick too.

type EmbedType = 'song' | 'playlist' | 'album' | 'artist'

interface PlayerTarget {
  type: EmbedType
  id: string
}

const STORAGE_KEY = 'anghami_player_target'
const DEFAULT_TARGET: PlayerTarget = { type: 'song', id: '82145914' }
const EMBED_TYPES: EmbedType[] = ['song', 'playlist', 'album', 'artist']

function readStoredTarget(): PlayerTarget {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_TARGET
    const parsed = JSON.parse(raw) as Partial<PlayerTarget>
    if (parsed && EMBED_TYPES.includes(parsed.type as EmbedType) && /^[\w-]+$/.test(String(parsed.id ?? ''))) {
      return { type: parsed.type as EmbedType, id: String(parsed.id) }
    }
  } catch {
    // storage blocked or bad JSON
  }
  return DEFAULT_TARGET
}

/** Accepts an Anghami URL (song/playlist/album/artist) or a bare numeric song id. */
function parseTarget(input: string): PlayerTarget | null {
  const value = input.trim()
  if (/^\d+$/.test(value)) return { type: 'song', id: value }
  const match = value.match(/\/(song|playlist|album|artist)\/([\w-]+)/i)
  if (match) return { type: match[1].toLowerCase() as EmbedType, id: match[2] }
  return null
}

export const AnghamiPlayer: React.FC = () => {
  const { profile } = useProfile()
  const { isOwner } = useAuth()
  const [open, setOpen] = useState(false)
  const [target, setTarget] = useState<PlayerTarget>(readStoredTarget)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const [error, setError] = useState<string | null>(null)

  const profileUrl = profile.anghami_url ?? 'https://play.anghami.com'
  const embedSrc = `https://widget.anghami.com/${target.type}/${encodeURIComponent(target.id)}?theme=fulldark&layout=wide&lang=en`

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const next = parseTarget(draft)
    if (!next) {
      setError('Paste an Anghami song, playlist, album or artist link.')
      return
    }
    setTarget(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // storage blocked: keep it for this visit only
    }
    setError(null)
    setEditing(false)
    setOpen(true)
  }

  return (
    <section aria-label="Music" className="card overflow-hidden border-arcane-400/15">
      <div className="flex items-center gap-3 px-3 py-2.5 sm:px-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-arcane-400/20 bg-arcane-500/10">
          <AnghamiIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-arcane-300">On repeat</p>
          <p className="truncate text-sm text-fg-muted">My current pick on Anghami</p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          {isOwner && (
            <button
              type="button"
              onClick={() => {
                setEditing((v) => !v)
                setError(null)
                setDraft('')
              }}
              aria-label="Change the embedded track"
              aria-expanded={editing}
              className="icon-btn h-9 w-9"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Anghami (opens in a new tab)"
            className="icon-btn h-9 w-9 sm:w-auto sm:gap-1.5 sm:px-3 sm:text-xs"
          >
            <span className="hidden sm:inline">Open Anghami</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="anghami-embed"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-arcane-400/30 bg-arcane-500/10 px-3 text-xs font-semibold text-arcane-300 transition-colors hover:border-arcane-400/50 hover:bg-arcane-500/20 hover:text-fg"
          >
            {open ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                Hide
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                Play
              </>
            )}
          </button>
        </div>
      </div>

      {isOwner && editing && (
        <form onSubmit={save} className="flex flex-col gap-2 border-t border-line px-3 py-3 sm:flex-row sm:items-start sm:px-4">
          <label htmlFor="anghami-target" className="sr-only">
            Anghami link or song id
          </label>
          <div className="min-w-0 flex-1">
            <input
              id="anghami-target"
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="https://play.anghami.com/playlist/… or a song id"
              autoComplete="off"
              className="h-9 w-full rounded-lg border border-line bg-ink-950/60 px-3 font-mono text-xs text-fg placeholder:text-fg-faint focus:border-arcane-400/50 focus:outline-none"
            />
            <p className={`mt-1 text-[11px] ${error ? 'text-rose-300' : 'text-fg-faint'}`}>
              {error ?? `Now: ${target.type} ${target.id}. Saved in this browser only.`}
            </p>
          </div>
          <button type="submit" className="btn-ghost h-9 px-3 py-0 text-xs">
            Save
          </button>
        </form>
      )}

      {open && (
        <div id="anghami-embed" className="border-t border-line bg-ink-950">
          <iframe
            key={embedSrc}
            src={embedSrc}
            title="Anghami player"
            height={150}
            loading="lazy"
            allow="autoplay *; encrypted-media *; clipboard-write *"
            className="block h-[150px] w-full border-0"
          />
        </div>
      )}
    </section>
  )
}
