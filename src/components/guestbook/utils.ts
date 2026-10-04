import type { User } from '@supabase/supabase-js'

export const OWNER_GITHUB = 'iiafosh'
export const GUESTBOOK_MAX = 280

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto', style: 'narrow' })

const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

/** "just now", "5m ago", "3h ago", "yesterday", ... */
export function relativeTime(iso: string, now = Date.now()): string {
  const seconds = Math.round((new Date(iso).getTime() - now) / 1000)
  if (!Number.isFinite(seconds)) return ''
  if (Math.abs(seconds) < 45) return 'just now'
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size || unit === 'minute') {
      return rtf.format(Math.round(seconds / size), unit)
    }
  }
  return ''
}

export function initials(name: string | null | undefined): string {
  const parts = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return parts
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join('')
}

/** GitHub identity fields Supabase copies into user_metadata. */
export function githubMeta(user: User | null) {
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>
  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : null)
  const username = str(meta.user_name) ?? str(meta.preferred_username)
  return {
    username,
    name: str(meta.full_name) ?? str(meta.name) ?? username,
    avatarUrl: str(meta.avatar_url),
  }
}

/** Turns Postgres / PostgREST errors into something a visitor can act on. */
export function friendlyError(err: unknown): string {
  const message =
    err && typeof err === 'object' && 'message' in err ? String((err as { message: unknown }).message) : ''
  if (/limit reached/i.test(message)) return "That's 3 messages today — the daily limit. Come back tomorrow!"
  if (/check constraint|char_length/i.test(message)) return 'Messages need to be between 1 and 280 characters.'
  if (/jwt|not authenticated|401|row-level security/i.test(message))
    return 'Your session expired. Sign out and sign in again, then retry.'
  if (/failed to fetch|network/i.test(message)) return "Couldn't reach the server. Check your connection and retry."
  return message || 'Something went wrong. Please try again.'
}
