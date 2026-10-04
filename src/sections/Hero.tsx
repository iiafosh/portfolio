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
  return (key: SectionKey) => (profile.section_order.includes(key) ? `#${key}` : undefined)
}

const StatusChip: React.FC = () => {
  const { profile } = useProfile()
  return (
    <p className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-2xl border border-line-strong bg-ink-900/60 px-3 py-1.5 text-xs text-fg-muted backdrop-blur sm:rounded-full">
      {profile.availability && (
        <>
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
          </span>
          <span className="font-medium text-fg">{profile.availability}</span>
          <span className="hidden text-fg-faint sm:inline" aria-hidden="true">
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
        <a href={target} className="group inline-flex items-center gap-1 text-slime-200 transition-colors hover:text-slime-100">
          {quest}
          <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      ) : (
        quest
      ),
    })
  }

  return (
    <aside
      aria-label="Player card"
      className="holo-group card hud relative overflow-hidden rounded-3xl p-5 sm:p-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(79,200,255,0.22), transparent)' }}
      />

      <div className="relative flex items-center justify-between">
        <span className="label text-slime-300">Player card</span>
        <span className="font-mono text-[11px] text-fg-faint">@{profile.handle}</span>
      </div>

      {/* Portrait: desktop only; phones show a smaller one at the top of the hero. */}
      <div className="relative mt-5 hidden flex-col items-center lg:flex">
        <Portrait src={profile.avatar_url} name={profile.name} size={168} orbit eager />
        <p className="mt-4 font-display text-lg font-semibold leading-tight text-fg">{profile.name}</p>
        {profile.availability && (
          <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-fg-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-live" aria-hidden="true" />
            {profile.availability}
          </p>
        )}
      </div>

      <dl className="relative mt-5 divide-y divide-line border-t border-line lg:mt-6">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[6.25rem_1fr] items-baseline gap-3 py-2.5">
            <dt className="label">{r.label}</dt>
            <dd className="min-w-0 text-sm leading-snug text-fg">{r.value}</dd>
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
          <span className="mr-1 align-top font-pixel text-xs text-slime-300">LV</span>
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
      className={`mt-12 grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-ink-900/50 backdrop-blur-sm sm:mt-16 ${
        stats.length >= 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'sm:grid-cols-3' : ''
      }`}
    >
      {stats.map((s, i) => {
        const body = (
          <>
            <span className="block font-display text-4xl font-bold tabular-nums leading-none tracking-tight text-fg sm:text-5xl">{s.value}</span>
            <span className="mt-2 block text-xs leading-snug text-fg-muted">{s.label}</span>
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
              <a href={s.href} className="group block h-full p-4 transition-colors hover:bg-white/[0.03] sm:p-5">
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
    <section id="top" className="scroll-mt-24 pt-4 sm:pt-12 lg:pt-16" aria-label="Introduction">
      <HoverCardGroup>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 animate-fade-up">
            <div className="flex items-center gap-3">
              <span className="holo-group lg:hidden">
                <Portrait src={profile.avatar_url} name={profile.name} size={60} eager />
              </span>
              <StatusChip />
            </div>

            <p className="mt-7 font-mono text-sm text-fg-muted sm:mt-10">
              hi, i&apos;m{profile.handle && <span className="text-slime-300"> @{profile.handle}</span>}
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
                    <span className="mt-2 font-hero text-base font-bold uppercase tracking-[0.28em] text-fg-muted min-[400px]:text-lg sm:mt-3 sm:text-2xl">
                      {rest}
                    </span>
                  )}
                </span>
              </HoverCard>
            </h1>

            <p className="mt-7 max-w-xl font-display text-lg font-semibold leading-snug text-fg sm:text-xl">
              {profile.headline}
            </p>
            <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-fg-muted">{profile.bio}</p>

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

          <div className="animate-fade-up [animation-delay:120ms]">
            <PlayerCard />
          </div>
        </div>

        <StatsStrip />

        {firstSection && (
          <a
            href={`#${firstSection}`}
            className="mt-8 hidden items-center gap-2 text-xs text-fg-faint transition-colors hover:text-fg-muted sm:inline-flex"
          >
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Scroll to see what I&apos;ve shipped</span>
          </a>
        )}
      </HoverCardGroup>
    </section>
  )
}
