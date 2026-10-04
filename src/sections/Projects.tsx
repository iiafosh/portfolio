import React, { useId } from 'react'
import {
  ArrowUpRight,
  Bot,
  Calculator,
  Cpu,
  Gamepad2,
  Globe,
  Recycle,
  Sparkles,
  Watch,
  type LucideIcon,
} from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { useItemsOfKind, useProfile } from '@/lib/content'
import { hash, isLinkedIn, pickFeatured } from '@/lib/derive'
import { trackSpotlight } from '@/lib/spotlight'
import type { PortfolioItem } from '@/content/types'

/* ------------------------------------------------------------------ */
/* Layout: a small bento packer                                        */
/* ------------------------------------------------------------------ */

/**
 * Column spans for `count` cards in a `cols`-wide grid: the first card leads
 * at double width, everything else is single, and the last card stretches to
 * close any gap in the final row.
 */
function bentoSpans(count: number, cols: number): number[] {
  if (cols <= 1) return Array(count).fill(1)
  const spans = Array.from({ length: count }, (_, i) => (i === 0 && count > 1 ? Math.min(2, cols) : 1))
  let used = 0
  spans.forEach((s, i) => {
    const room = cols - (used % cols)
    if (s > room) used += room // wraps to the next row
    used += s
    if (i === count - 1) {
      const rem = used % cols
      if (rem !== 0) spans[i] = s + (cols - rem)
    }
  })
  return spans
}

const SM_SPAN: Record<number, string> = { 1: 'sm:col-span-1', 2: 'sm:col-span-2' }
const LG_SPAN: Record<number, string> = { 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3' }

/* ------------------------------------------------------------------ */
/* Generative header                                                   */
/* ------------------------------------------------------------------ */

const ICON_RULES: [RegExp, LucideIcon][] = [
  [/\b(game|godot)\b/, Gamepad2],
  [/recycl|e-waste/, Recycle],
  [/watch|wearable/, Watch],
  [/numerical|calculat|math/, Calculator],
  [/chat|gemini|\bbot\b|llm|assistant/, Bot],
  [/predict|machine|\bml\b|robot|esp32|hardware|sensor/, Cpu],
  [/web|portfolio|site|react/, Globe],
]

function iconFor(item: PortfolioItem): LucideIcon {
  const text = [item.title, item.subtitle, ...item.tags].join(' ').toLowerCase()
  return ICON_RULES.find(([re]) => re.test(text))?.[1] ?? Sparkles
}

type Pattern = 'dots' | 'grid' | 'waves' | 'circuit'
const PATTERNS: Pattern[] = ['dots', 'grid', 'waves', 'circuit']

/** Deterministic pattern + accent position from the project id. */
const GenerativeArt: React.FC<{ item: PortfolioItem; className?: string }> = ({ item, className = '' }) => {
  const uid = useId().replace(/:/g, '')
  const h = hash(item.id)
  const pattern = PATTERNS[h % PATTERNS.length]!
  const glowX = 20 + ((h >>> 4) % 60)
  const glowY = 20 + ((h >>> 10) % 50)
  const Icon = iconFor(item)
  const initial = item.title.replace(/^this\s+/i, '').charAt(0).toUpperCase()

  return (
    <div aria-hidden="true" className={`relative overflow-hidden bg-surface ${className}`}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          {pattern === 'dots' && (
            <pattern id={`p-${uid}`} width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.1" style={{ fill: 'rgb(var(--accent) / 0.28)' }} />
            </pattern>
          )}
          {pattern === 'grid' && (
            <pattern id={`p-${uid}`} width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0H0V24" fill="none" style={{ stroke: 'rgb(var(--accent) / 0.14)' }} strokeWidth="1" />
            </pattern>
          )}
          {pattern === 'waves' && (
            <pattern id={`p-${uid}`} width="48" height="14" patternUnits="userSpaceOnUse">
              <path d="M0 7 Q12 0 24 7 T48 7" fill="none" style={{ stroke: 'rgb(var(--accent) / 0.2)' }} strokeWidth="1.2" />
            </pattern>
          )}
          {pattern === 'circuit' && (
            <pattern id={`p-${uid}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 10H14L20 16V40M40 28H28L24 24V0" fill="none" style={{ stroke: 'rgb(var(--accent) / 0.16)' }} strokeWidth="1" />
              <circle cx="20" cy="16" r="1.8" style={{ fill: 'rgb(var(--accent) / 0.35)' }} />
              <circle cx="24" cy="24" r="1.8" style={{ fill: 'rgb(var(--accent) / 0.35)' }} />
            </pattern>
          )}
          <radialGradient id={`g-${uid}`} cx={`${glowX}%`} cy={`${glowY}%`} r="70%">
            <stop offset="0%" style={{ stopColor: 'rgb(var(--accent) / 0.30)' }} />
            <stop offset="60%" style={{ stopColor: 'rgb(var(--accent) / 0.04)' }} />
            <stop offset="100%" style={{ stopColor: 'rgb(var(--accent) / 0)' }} />
          </radialGradient>
          <linearGradient id={`f-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0.15" />
          </linearGradient>
          <mask id={`m-${uid}`}>
            <rect width="100%" height="100%" fill={`url(#f-${uid})`} />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill={`url(#g-${uid})`} />
        <rect width="100%" height="100%" fill={`url(#p-${uid})`} mask={`url(#m-${uid})`} />
      </svg>

      {/* Ghost initial */}
      <span
        className="absolute -bottom-6 right-3 select-none font-hero text-[7.5rem] font-black leading-none text-transparent"
        style={{ WebkitTextStroke: '1px rgb(var(--accent) / 0.18)' }}
      >
        {initial}
      </span>

      <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-bg/60 text-accent shadow-[0_10px_30px_-10px_rgb(var(--accent)/0.5)] backdrop-blur transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:rotate-[-4deg]">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

const linkClass =
  'inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 -mx-2 text-sm font-medium text-muted transition-colors hover:text-accent'

/** Portrait photos (e.g. ReSpark) look best cropped tall in a side panel. */
const PORTRAIT_HINT = /respark/i

/**
 * Focal points for photos whose subject is off-centre. The hackathon photo is
 * a LinkedIn carousel export with a "1/3" badge in the top corner, so it is
 * anchored to the bottom to crop that away.
 */
const FOCAL_POINTS: [RegExp, string][] = [
  [/respark/i, '50% 30%'],
  [/damietta/i, '50% 100%'],
]

const ProjectCard: React.FC<{ item: PortfolioItem; wide: boolean; className: string }> = ({ item, wide, className }) => {
  const portrait = !!item.image_url && PORTRAIT_HINT.test(item.image_url)
  const media = item.image_url ? (
    <img
      src={item.image_url}
      alt={`${item.title} photo`}
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      style={{ objectPosition: FOCAL_POINTS.find(([re]) => re.test(item.image_url ?? ''))?.[1] }}
      loading="lazy"
      decoding="async"
    />
  ) : (
    <GenerativeArt item={item} className="h-full w-full" />
  )

  return (
    <article
      onPointerMove={trackSpotlight}
      className={`spotlight card card-hover group flex flex-col overflow-hidden ${
        wide ? 'sm:flex-row' : ''
      } ${className}`}
    >
      <div
        className={`relative shrink-0 overflow-hidden border-b border-line ${
          wide
            ? `h-48 sm:h-auto sm:min-h-[17rem] sm:border-b-0 sm:border-r ${portrait ? 'sm:w-[36%] lg:w-[34%]' : 'sm:w-[40%]'}`
            : item.image_url
              ? 'aspect-[16/10]'
              : 'h-36'
        }`}
      >
        {media}
        {item.image_url && (
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/50 via-transparent to-transparent" />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-semibold tracking-tight text-text">{item.title}</h3>
          {item.period && <span className="shrink-0 font-mono text-xs text-faint">{item.period}</span>}
        </div>
        {item.subtitle && <p className="mt-1 text-sm font-medium text-muted">{item.subtitle}</p>}
        {item.description && <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>}

        {item.highlights.length > 0 && (
          <ul className="ticks mt-4 space-y-1.5">
            {item.highlights.slice(0, wide ? 3 : 2).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}

        {item.tags.length > 0 && (
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Built with">
            {item.tags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        )}

        {(item.url || item.repo_url) && (
          <div className="mt-auto pt-5">
            <div className="flex flex-wrap gap-x-5 border-t border-line pt-2">
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-label={`${item.title}: ${isLinkedIn(item.url) ? 'write-up on LinkedIn' : 'live site'} (opens in a new tab)`}
                >
                  {isLinkedIn(item.url) ? 'Read the post' : 'Live'}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              )}
              {item.repo_url && (
                <a
                  href={item.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                  aria-label={`${item.title}: source code on GitHub (opens in a new tab)`}
                >
                  <GithubIcon className="h-4 w-4" />
                  Source
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}

export const ProjectsSection: React.FC = () => {
  const { items } = useItemsOfKind('project')
  const { profile } = useProfile()

  // The featured project already has its own section; only skip it here when
  // that section is actually on the page.
  const featured = profile.section_order.includes('featured') ? pickFeatured(items) : null
  const projects = items.filter((p) => p !== featured)
  if (projects.length === 0) return null

  const sm = bentoSpans(projects.length, 2)
  const lg = bentoSpans(projects.length, 3)

  return (
    <Section id="projects" eyebrow="projects" title="Things I've built">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {projects.map((item, i) => (
          <ProjectCard
            key={item.id}
            item={item}
            // Horizontal layout (from sm up) only when the card is wide in both grids.
            wide={sm[i]! > 1 && lg[i]! > 1}
            className={`${SM_SPAN[sm[i]!] ?? ''} ${LG_SPAN[lg[i]!] ?? ''}`}
          />
        ))}
      </div>
    </Section>
  )
}
