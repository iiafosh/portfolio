import React, { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, Copy, FileText, MapPin } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { AnghamiIcon } from '@/components/icons/AnghamiIcon'
import { GitHubCard, HoverCard, HoverCardGroup, LinkedInCard, ResumeCard } from '@/components/hovercards'
import { useItemsOfKind, useProfile } from '@/lib/content'
import type { PortfolioItem, Profile } from '@/content/types'
import { pickFeatured } from './Featured'

/** "Mostafa Kamal Shabara" + "Mostafa" -> ["Mostafa", "Kamal Shabara"]. */
function splitName(profile: Profile): [string, string] {
  const first = profile.short_name?.trim() || profile.name.split(/\s+/)[0] || profile.name
  const rest = profile.name.toLowerCase().startsWith(first.toLowerCase())
    ? profile.name.slice(first.length).trim()
    : profile.name.split(/\s+/).slice(1).join(' ')
  return [first, rest]
}

/** "Horus University in Egypt (HUE)" -> "HUE". */
function shortSchool(title: string): string {
  return title.match(/\(([^)]+)\)\s*$/)?.[1] ?? title
}

/** Most-used tags across projects, ties broken by first appearance. */
function topStack(projects: PortfolioItem[], n: number): string[] {
  const counts = new Map<string, number>()
  projects.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)))
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([t]) => t)
}

const CopyEmailButton: React.FC<{ email: string }> = ({ email }) => {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)
  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      if (timer.current !== null) window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${email}`
    }
  }

  return (
    <>
      <button type="button" onClick={copy} className="btn-primary min-h-10" title={email}>
        {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
        <span className="min-w-[5.5rem] text-left">{copied ? 'Copied!' : 'Copy email'}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? `Email address ${email} copied to clipboard` : ''}
      </span>
    </>
  )
}

export const HeroSection: React.FC = () => {
  const { profile } = useProfile()
  const { items: projects } = useItemsOfKind('project')
  const { items: education } = useItemsOfKind('education')

  const [first, rest] = splitName(profile)
  const featured = pickFeatured(projects)
  const school = education[0]
  const stack = topStack(projects, 4)
  const firstSection = profile.section_order[0]

  const facts: { label: string; value: React.ReactNode }[] = []
  if (featured) {
    facts.push({
      label: 'Shipping',
      value: profile.section_order.includes('featured') ? (
        <a href="#featured" className="link">
          {featured.title}
        </a>
      ) : (
        featured.title
      ),
    })
  }
  if (school) {
    facts.push({
      label: 'Studying',
      value: school.subtitle ? `${school.subtitle.split(" · ").pop()} @ ${shortSchool(school.title)}` : school.title,
    })
  }
  if (stack.length > 0) facts.push({ label: 'Stack', value: stack.join(' · ') })

  return (
    <section id="top" className="scroll-mt-24 pt-10 animate-fade-up sm:pt-20" aria-label="Introduction">
      <HoverCardGroup>
        {/* Availability + location */}
        <p className="inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-line bg-white/[0.03] px-3 py-1.5 text-xs text-fg-muted">
          {profile.availability && (
            <>
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
              </span>
              <span className="text-fg">{profile.availability}</span>
              <span className="text-fg-faint" aria-hidden="true">
                ·
              </span>
            </>
          )}
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {profile.location}
          </span>
        </p>

        {/* Name */}
        <p className="mt-8 font-mono text-sm text-fg-muted sm:mt-10">
          hi, i&apos;m{profile.handle && <span className="text-slime-300"> @{profile.handle}</span>}
        </p>
        <h1 className="mt-2">
          <HoverCard id="linkedin-name" label="LinkedIn profile preview" content={<LinkedInCard />} align="start">
            <span className="flex flex-col">
              <span className="bg-gradient-to-r from-slime-200 via-slime-400 to-slime-500 bg-clip-text pb-1 font-hero text-[2.75rem] font-black uppercase leading-none tracking-tight text-transparent min-[400px]:text-5xl sm:text-7xl lg:text-8xl">
                {first}
              </span>
              {rest && (
                <span className="mt-2 font-hero text-lg font-semibold uppercase tracking-[0.2em] text-fg-muted sm:mt-3 sm:text-2xl">
                  {rest}
                </span>
              )}
            </span>
          </HoverCard>
        </h1>

        {/* What I do */}
        <p className="mt-7 max-w-2xl font-display text-lg font-medium text-fg sm:text-xl">{profile.headline}</p>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-fg-muted">{profile.bio}</p>

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <CopyEmailButton email={profile.email} />

          <HoverCard id="resume" label="Resume preview" content={<ResumeCard />} width={300}>
            <Link to="/resume" className="btn-ghost min-h-10">
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

            {profile.anghami_url && (
              <a
                href={profile.anghami_url}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-btn"
                aria-label="What I listen to on Anghami (opens in a new tab)"
              >
                <AnghamiIcon className="h-[18px] w-[18px]" />
              </a>
            )}
          </div>
        </div>

        {/* Quick facts (real data only) */}
        {facts.length > 0 && (
          <dl className="mt-10 grid max-w-3xl gap-x-8 gap-y-4 border-t border-line pt-6 sm:grid-cols-3">
            {facts.map((f) => (
              <div key={f.label} className="min-w-0">
                <dt className="font-pixel text-[10px] uppercase tracking-[0.18em] text-fg-faint">{f.label}</dt>
                <dd className="mt-1 text-sm text-fg">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {firstSection && (
          <a
            href={`#${firstSection}`}
            className="mt-10 hidden items-center gap-2 text-xs text-fg-faint transition-colors hover:text-fg-muted sm:inline-flex"
          >
            <span className="kbd">scroll</span>
            <span>to see what I&apos;ve shipped</span>
          </a>
        )}
      </HoverCardGroup>
    </section>
  )
}
