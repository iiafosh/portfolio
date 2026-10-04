import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowDown, ArrowUpRight, FileText, MapPin } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { GitHubCard, HoverCard, HoverCardGroup, LinkedInCard, ResumeCard } from '@/components/hovercards'
import { CopyEmailButton } from '@/components/ui/CopyEmailButton'
import { Portrait } from '@/components/ui/Portrait'
import { useItemsOfKind, useProfile } from '@/lib/content'
import {
  guildName,
  levelsCleared,
  pickFeatured,
  programName,
  releaseTag,
  shipsTo,
  splitName,
} from '@/lib/derive'
import type { SectionKey } from '@/content/types'

/** Anchor to a home section only when that section is actually rendered. */
function useSectionHref() {
  const { profile } = useProfile()
  return (key: SectionKey) => {
    if (profile.section_order.includes(key)) return `#${key}`
    // Education lives in a tab of the Experience section (#education selects it).
    if (key === 'education' && profile.section_order.includes('experience')) return '#education'
    return undefined
  }
}

/** "AI … student · games, apps & hardware" -> ["games", "apps", "hardware"] (the part that is a list). */
function headlineWords(headline: string): string[] {
  const list = headline.split(' · ').find((part) => /,|&|\band\b/.test(part) && !/\(/.test(part))
  if (!list) return []
  return list
    .split(/,|&|\band\b/)
    .map((w) => w.trim())
    .filter(Boolean)
}

const WORD_COLORS = ['text-accent', 'text-accent-2', 'text-accent-3']

/** "I build games, apps & hardware." with one accent per word. Falls back to the plain headline. */
const ColoredHeadline: React.FC<{ headline: string }> = ({ headline }) => {
  const words = headlineWords(headline)
  if (words.length < 2) {
    return <p className="mt-6 max-w-measure font-display text-xl font-semibold leading-snug text-text sm:text-2xl">{headline}</p>
  }
  return (
    <p className="mt-6 font-display text-[1.65rem] font-semibold leading-tight tracking-tight text-text sm:text-[2rem]">
      I build{' '}
      {words.map((w, i) => (
        <React.Fragment key={w}>
          <span className={WORD_COLORS[i % WORD_COLORS.length]}>{w}</span>
          {i < words.length - 2 ? ', ' : i === words.length - 2 ? ' & ' : '.'}
        </React.Fragment>
      ))}
    </p>
  )
}

const StatusChip: React.FC = () => {
  const { profile } = useProfile()
  return (
    <p className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-line-strong bg-surface/60 px-3 py-1.5 text-xs text-muted sm:rounded-full">
      {profile.availability && (
        <>
          <span className="h-2 w-2 rounded-full bg-ok shadow-[0_0_0_3px_rgb(var(--ok)/0.15)]" aria-hidden="true" />
          <span className="font-medium text-text">{profile.availability}</span>
          <span className="hidden text-faint sm:inline" aria-hidden="true">
            /
          </span>
        </>
      )}
      <span className="inline-flex items-center gap-1">
        <MapPin className="h-3 w-3" aria-hidden="true" />
        {profile.location}
      </span>
    </p>
  )
}

/** Hand-drawn arrow for the margin note. */
const ScribbleArrow: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 40 44" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 3c-6 3-15 9-16 20-.6 6 1 11 3 16" />
    <path d="M10 33l7 7 5-9" />
  </svg>
)

/**
 * Portrait with two tilted snapshots behind it (Ted-style photo stack): the
 * fosh&fish app icon and the Damietta Hackathon team photo. A handwritten
 * note points at the game.
 */
const PhotoStack: React.FC = () => {
  const { profile } = useProfile()
  const { items: projects } = useItemsOfKind('project')
  const featured = pickFeatured(projects)
  const game = featured && (featured.image_url ?? '').includes('fosh-and-fish') ? featured : null
  const firstGame = !!game?.subtitle && /\bfirst game\b/i.test(game.subtitle)
  const hackathon = projects.find((p) => (p.image_url ?? '').includes('damietta'))

  return (
    <div className="relative mx-auto mt-4 hidden h-[212px] w-full max-w-[290px] sm:block">
      {game && (
        <span className="snap snap-left left-0 top-[58px] h-[112px] w-[100px]" aria-hidden="true">
          <img src="/media/fosh-and-fish-icon.png" alt="" width={90} height={90} loading="eager" decoding="async" />
        </span>
      )}
      {hackathon?.image_url && (
        <span className="snap snap-right right-0 top-[44px] h-[112px] w-[110px]" aria-hidden="true">
          <img
            src={hackathon.image_url}
            alt=""
            width={100}
            height={90}
            style={{ objectPosition: '45% 100%' }}
            loading="eager"
            decoding="async"
          />
        </span>
      )}
      <div className="absolute left-1/2 top-[30px] -translate-x-1/2">
        <Portrait src={profile.avatar_url} name={profile.name} size={150} eager />
      </div>

      {game && firstGame && (
        <p className="pointer-events-none absolute -left-1 -top-1 text-accent-2" aria-hidden="true">
          <span className="hand block -rotate-6 text-[1.35rem]">my first game</span>
          <ScribbleArrow className="ml-2 h-10 w-9" />
        </p>
      )}
    </div>
  )
}

/** Character sheet built from real profile data. */
const PlayerCard: React.FC = () => {
  const { profile } = useProfile()
  const { items: projects } = useItemsOfKind('project')
  const { items: education } = useItemsOfKind('education')
  const { items: experience } = useItemsOfKind('experience')
  const href = useSectionHref()

  const school = education[0]
  const program = programName(school)
  const featured = pickFeatured(projects)
  const release = releaseTag(featured)
  const guilds = [...new Set(experience.map(guildName).filter((g): g is string => !!g))]

  const rows: { label: string; value: React.ReactNode }[] = []
  if (program) rows.push({ label: 'Class', value: `${program} student` })
  if (school) rows.push({ label: 'School', value: school.title })
  if (guilds.length > 0) rows.push({ label: 'Guild', value: guilds.join(' · ') })
  rows.push({ label: 'Region', value: profile.location })
  if (featured) {
    const quest = `${featured.title}${release ? ` ${release}` : ''}`
    const target = href('featured')
    rows.push({
      label: 'Main quest',
      value: target ? (
        <a href={target} className="group -my-3 inline-flex min-h-11 items-center gap-1 text-accent underline decoration-accent/0 underline-offset-4 transition-colors hover:decoration-accent/60">
          {quest}
          <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      ) : (
        quest
      ),
    })
  }

  return (
    <aside aria-label="Player card" className="holo-group card hud relative rounded-3xl p-5 sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-48 overflow-hidden rounded-t-3xl"
        style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgb(var(--accent) / 0.14), transparent)' }}
      />

      <div className="relative flex items-center justify-between">
        <span className="label text-accent">Player card</span>
        <span className="font-mono text-[11px] text-faint">@{profile.handle}</span>
      </div>

      <PhotoStack />

      <dl className="relative mt-5 divide-y divide-line border-t border-line">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[6rem_1fr] items-baseline gap-3 py-2.5">
            <dt className="label">{r.label}</dt>
            <dd className="min-w-0 text-sm leading-snug text-text">{r.value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

interface Stat {
  value: React.ReactNode
  label: string
  href?: string
}

/** Counts computed from data.ts; a stat is skipped when its source is missing. */
const StatsStrip: React.FC = () => {
  const { items: projects } = useItemsOfKind('project')
  const { items: achievements } = useItemsOfKind('achievement')
  const { items: education } = useItemsOfKind('education')
  const href = useSectionHref()

  const featured = pickFeatured(projects)
  const platforms = shipsTo(featured)
  const level = levelsCleared(education[0])

  const stats: Stat[] = []
  if (projects.length > 0) stats.push({ value: projects.length, label: 'Projects built', href: href('projects') })
  if (achievements.length > 0)
    stats.push({ value: achievements.length, label: 'Contests placed or qualified', href: href('achievements') })
  if (featured && platforms.length > 0)
    stats.push({ value: platforms.length, label: `Platforms ${featured.title} ships to`, href: href('featured') })
  if (level !== null)
    stats.push({
      value: (
        <>
          <span className="mr-1 align-top font-pixel text-xs text-accent">LV</span>
          {level}
        </>
      ),
      label: `University level cleared`,
      href: href('education'),
    })
  if (stats.length === 0) return null

  return (
    <ul
      aria-label="At a glance"
      className={`mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-surface/50 sm:mt-14 ${
        stats.length >= 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'sm:grid-cols-3' : ''
      }`}
    >
      {stats.map((s, i) => {
        const body = (
          <>
            <span className="block font-display text-4xl font-bold tabular-nums leading-none tracking-tight text-text sm:text-[2.75rem]">{s.value}</span>
            <span className="mt-2 block text-xs leading-snug text-muted">{s.label}</span>
          </>
        )
        // Hairlines between cells for both the 2x2 and the 1x4 layouts.
        const borders = [
          i % 2 === 1 ? 'border-l border-line' : '',
          i >= 2 ? 'border-t border-line lg:border-t-0' : '',
          i === 2 ? 'lg:border-l' : '',
        ].join(' ')
        return (
          <li key={s.label} className={borders}>
            {s.href ? (
              <a href={s.href} className="group block h-full p-4 transition-colors hover:bg-text/[0.03] sm:p-5">
                {body}
              </a>
            ) : (
              <div className="p-4 sm:p-5">{body}</div>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export const HeroSection: React.FC = () => {
  const { profile } = useProfile()
  const [first, rest] = splitName(profile)
  const firstSection = profile.section_order[0]

  return (
    <section id="top" className="pt-2 sm:pt-6" aria-label="Introduction">
      <HoverCardGroup>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="holo-group sm:hidden">
                <Portrait src={profile.avatar_url} name={profile.name} size={56} eager />
              </span>
              <StatusChip />
            </div>

            <p className="mt-7 font-mono text-sm text-muted sm:mt-9">
              hi, i&apos;m{profile.handle && <span className="text-accent"> @{profile.handle}</span>}
            </p>
            <h1 className="mt-2">
              <HoverCard id="linkedin-name" label="LinkedIn profile preview" content={<LinkedInCard />} align="start">
                <span className="flex flex-col">
                  <span className="hero-name pb-1 font-hero font-black uppercase leading-none tracking-tight">
                    {first}
                    <span className="hero-sheen" aria-hidden="true">
                      <span>{first}</span>
                    </span>
                  </span>
                  {rest && (
                    <span className="mt-2 font-hero text-base font-bold uppercase tracking-[0.28em] text-muted min-[400px]:text-lg sm:mt-3 sm:text-xl">
                      {rest}
                    </span>
                  )}
                </span>
              </HoverCard>
            </h1>

            <ColoredHeadline headline={profile.headline} />
            <p className="mt-4 max-w-measure text-[15px] leading-relaxed text-muted">{profile.bio}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CopyEmailButton email={profile.email} />

              <HoverCard id="resume" label="Resume preview" content={<ResumeCard />} width={300}>
                <Link to="/resume" className="btn-ghost">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Resume
                </Link>
              </HoverCard>

              <div className="flex items-center gap-2">
                <HoverCard id="github" label="GitHub profile preview" content={<GitHubCard />}>
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    aria-label="GitHub profile (opens in a new tab)"
                  >
                    <GithubIcon className="h-[18px] w-[18px]" />
                  </a>
                </HoverCard>

                <HoverCard id="linkedin" label="LinkedIn profile preview" content={<LinkedInCard />}>
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-btn"
                    aria-label="LinkedIn profile (opens in a new tab)"
                  >
                    <LinkedInIcon className="h-[18px] w-[18px]" />
                  </a>
                </HoverCard>
              </div>
            </div>
          </div>

          <PlayerCard />
        </div>

        <StatsStrip />

        {firstSection && (
          <a
            href={`#${firstSection}`}
            className="mt-6 hidden min-h-11 items-center gap-2 text-xs text-faint transition-colors hover:text-text sm:inline-flex"
          >
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Scroll to see what I&apos;ve shipped</span>
          </a>
        )}
      </HoverCardGroup>
    </section>
  )
}
