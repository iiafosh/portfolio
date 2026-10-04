import type { PortfolioItem, Profile, SectionKey } from '@/content/types'

/** Where a showcase bubble's call-to-action goes. */
export type ShowcaseLink =
  | { type: 'section'; id: SectionKey | 'top'; label: string }
  | { type: 'route'; to: '/resume'; label: string }
  | { type: 'external'; href: string; label: string }

export interface ShowcaseItem {
  id: string
  /** Tiny eyebrow above the title, e.g. "Project". */
  category: string
  title: string
  description?: string
  link?: ShowcaseLink
}

/**
 * Hand-written items the slime can show in addition to the ones derived from
 * site content. Mostafa will send exclusive items later — add them here. Keep
 * them factual: no invented numbers, awards or employers.
 */
export const EXCLUSIVE_SHOWCASE_ITEMS: ShowcaseItem[] = []

const SLIME_TIPS: ShowcaseItem[] = [
  {
    id: 'tip-drag',
    category: 'Slime tip',
    title: 'You can drag me around!',
    description: "If I'm sitting on something you want to read, just pick me up and move me.",
  },
  {
    id: 'tip-hover',
    category: 'Slime tip',
    title: 'Hover a bubble to keep it open.',
    description: 'Or close it with the X. I will be back with something else in a minute.',
  },
  {
    id: 'tip-reincarnated',
    category: 'Slime tip',
    title: 'Yes, I am that slime.',
    description: 'Mostafa watches a lot of anime. I came along to show you around.',
  },
]

function truncate(text: string, max = 120): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 60 ? lastSpace : max).trimEnd()}…`
}

function listTags(tags: string[], max = 4): string {
  if (tags.length <= max) return tags.join(', ')
  return `${tags.slice(0, max).join(', ')}…`
}

/**
 * Builds the speech-bubble rotation from real site content (profile + items).
 * Every item links to something that exists; nothing here is invented.
 */
export function buildShowcaseItems(profile: Profile, items: PortfolioItem[]): ShowcaseItem[] {
  const visible = items.filter((i) => i.visible).sort((a, b) => a.sort_order - b.sort_order)
  const order = new Set(profile.section_order)
  const out: ShowcaseItem[] = []

  const projects = visible.filter((i) => i.kind === 'project')
  const featured = projects.find((p) => p.featured)

  if (featured) {
    out.push({
      id: `featured-${featured.id}`,
      category: 'Featured project',
      title: `Have you played ${featured.title}?`,
      description: featured.description ? truncate(featured.description) : featured.subtitle ?? undefined,
      link: featured.url
        ? { type: 'external', href: featured.url, label: 'Play it' }
        : order.has('featured')
          ? { type: 'section', id: 'featured', label: 'Take a look' }
          : undefined,
    })
  }

  for (const p of projects) {
    if (p.id === featured?.id) continue
    const section: SectionKey | null = order.has('projects') ? 'projects' : null
    out.push({
      id: `project-${p.id}`,
      category: 'Project',
      title: p.title,
      description: p.description ? truncate(p.description) : p.subtitle ?? undefined,
      link: p.url
        ? { type: 'external', href: p.url, label: 'Open it' }
        : p.repo_url
          ? { type: 'external', href: p.repo_url, label: 'Read the code' }
          : section
            ? { type: 'section', id: section, label: 'See projects' }
            : undefined,
    })
  }

  if (order.has('skills')) {
    for (const g of visible.filter((i) => i.kind === 'skill_group' && i.tags.length > 0)) {
      out.push({
        id: `skills-${g.id}`,
        category: 'Toolbox',
        title: `${g.title}: ${listTags(g.tags)}`,
        link: { type: 'section', id: 'skills', label: 'Full toolbox' },
      })
    }
  }

  if (order.has('achievements')) {
    for (const a of visible.filter((i) => i.kind === 'achievement')) {
      out.push({
        id: `win-${a.id}`,
        category: 'Achievement',
        title: a.title,
        description: a.subtitle ?? undefined,
        link: { type: 'section', id: 'achievements', label: 'See all wins' },
      })
    }
  }

  for (const e of visible.filter((i) => i.kind === 'education')) {
    out.push({
      id: `edu-${e.id}`,
      category: 'Education',
      title: e.subtitle ? `Studying ${e.subtitle}` : e.title,
      description: e.subtitle ? `at ${e.title}${e.location ? `, ${e.location}` : ''}.` : e.location ?? undefined,
      link: order.has('education') ? { type: 'section', id: 'education', label: 'Details' } : undefined,
    })
  }


  out.push({
    id: 'resume',
    category: 'Resume',
    title: 'Grab my resume',
    description: 'A clean, printable version of this page.',
    link: { type: 'route', to: '/resume', label: 'Open resume' },
  })


  return [...out, ...SLIME_TIPS, ...EXCLUSIVE_SHOWCASE_ITEMS]
}
