import { useQuery } from '@tanstack/react-query'
import type { Profile } from '@/content/types'

/** "https://github.com/iiafosh" -> "iiafosh". */
export function githubUsername(profile: Pick<Profile, 'github_url'>): string {
  try {
    const user = new URL(profile.github_url).pathname.split('/').filter(Boolean)[0]
    if (user) return user
  } catch {
    // fall through
  }
  return 'iiafosh'
}

export function githubAvatar(profile: Pick<Profile, 'github_url'>): string {
  return `https://github.com/${githubUsername(profile)}.png`
}

/** "Mostafa Kamal Shabara" -> "MK". */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join('')
}

export interface GitHubUser {
  login: string
  name: string | null
  bio: string | null
  public_repos: number
  html_url: string
}

/** Live GitHub profile. Only fetched when `enabled` (i.e. when a card opens). */
export function useGitHubUser(username: string, enabled: boolean) {
  return useQuery({
    queryKey: ['github', 'user', username],
    enabled,
    staleTime: 60 * 60 * 1000,
    retry: false,
    queryFn: async (): Promise<GitHubUser> => {
      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers: { Accept: 'application/vnd.github+json' },
      })
      if (!res.ok) throw new Error(`GitHub API ${res.status}`)
      return res.json()
    },
  })
}
