import type { PortfolioItem, Profile } from '@/content/types'

// Small, pure helpers that turn the content in data.ts into display facts.
// Nothing here invents data: every value is read or counted from an item.

/** The project shown in the Featured section: first featured project by sort_order. */
export function pickFeatured(projects: PortfolioItem[]): PortfolioItem | null {
  return projects.find((p) => p.featured) ?? null
}

/** "Mostafa Kamal Shabara" + "Mostafa" -> ["Mostafa", "Kamal Shabara"]. */
export function splitName(profile: Profile): [string, string] {
  const first = profile.short_name?.trim() || profile.name.split(/\s+/)[0] || profile.name
  const rest = profile.name.toLowerCase().startsWith(first.toLowerCase())
    ? profile.name.slice(first.length).trim()
    : profile.name.split(/\s+/).slice(1).join(' ')
  return [first, rest]
}

/** "Horus University in Egypt (HUE)" -> "HUE". */
export function shortSchool(title: string): string {
  return title.match(/\(([^)]+)\)\s*$/)?.[1] ?? title
}

/**
 * Platforms from a highlight like "Ships to Web, Windows, Linux and Android ...".
 * Returns [] when no item highlight mentions shipping targets.
 */
export function shipsTo(item: PortfolioItem | null): string[] {
  if (!item) return []
  const line = item.highlights.find((h) => /\bships? to\b/i.test(h))
  if (!line) return []
  const list = line.replace(/^.*?\bships? to\s+/i, '').replace(/\s+from\b.*$/i, '')
  return list
    .split(/,|\band\b/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** "…/releases/download/v0.1-beta/…" -> "v0.1 beta". */
export function releaseTag(item: PortfolioItem | null): string | null {
  const url = item?.video_url ?? item?.url ?? ''
  const m = url.match(/\/v(\d+(?:\.\d+)*)(?:-([a-z]+))?\//i)
  if (!m) return null
  return `v${m[1]}${m[2] ? ` ${m[2].toLowerCase()}` : ''}`
}

/** "AXIS student club · Horus University" -> "AXIS"; "ICPC HUE community" -> "ICPC HUE". */
export function guildName(item: PortfolioItem): string | null {
  const org = item.subtitle?.split(' · ')[0]?.trim()
  if (!org) return null
  return org.replace(/\s+(student club|club|community)$/i, '').trim() || org
}

/** "Faculty of AI · AI & Informatics (Robotics)" -> "AI & Informatics (Robotics)". */
export function programName(item: PortfolioItem | undefined): string | null {
  if (!item?.subtitle) return null
  return item.subtitle.split(' · ').pop()?.trim() ?? null
}

/** "Finished Level 1. …" -> 1. */
export function levelsCleared(item: PortfolioItem | undefined): number | null {
  const m = item?.description?.match(/finished level\s+(\d+)/i)
  return m ? Number(m[1]) : null
}

export const isLinkedIn = (url: string) => url.includes('linkedin.com')

/** Stable 32-bit hash for deterministic generative art. */
export function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
