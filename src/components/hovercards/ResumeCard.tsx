import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, FileText, GraduationCap } from 'lucide-react'
import { useItemsOfKind, useProfile } from '@/lib/content'
import { HoverCardSurface } from './HoverCard'

/** Mini resume preview: who, what, top skills, education. Styled as a tiny sheet of paper. */
export const ResumeCard: React.FC = () => {
  const { profile } = useProfile()
  const { items: skills } = useItemsOfKind('skill_group')
  const { items: education } = useItemsOfKind('education')
  const school = education[0]
  const topSkills = skills.slice(0, 3)

  return (
    <HoverCardSurface>
      <div className="flex items-center justify-between border-b border-line bg-text/[0.02] px-4 py-2.5">
        <span className="inline-flex items-center gap-2 font-pixel text-[10px] uppercase tracking-[0.16em] text-muted">
          <FileText className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          Resume
        </span>
        <span className="font-mono text-[11px] text-faint">1 page · A4</span>
      </div>

      <div className="p-3">
        {/* Paper */}
        <div className="rounded-lg bg-white px-3.5 py-3 text-zinc-700 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.8)]">
          <p className="font-display text-[15px] font-semibold leading-tight text-zinc-900">{profile.name}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-sky-700">{profile.headline}</p>
          <span aria-hidden="true" className="my-2 block h-px bg-zinc-200" />

          {topSkills.length > 0 && (
            <dl className="space-y-1">
              {topSkills.map((group) => (
                <div key={group.id} className="grid grid-cols-[5.25rem_1fr] gap-2 text-[11px]">
                  <dt className="truncate font-semibold text-zinc-900">{group.title}</dt>
                  <dd className="truncate">{group.tags.slice(0, 3).join(' · ')}</dd>
                </div>
              ))}
            </dl>
          )}

          {school && (
            <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-snug">
              <GraduationCap className="mt-px h-3 w-3 shrink-0 text-sky-700" aria-hidden="true" />
              <span>{school.title}</span>
            </p>
          )}
        </div>

        <Link
          to="/resume"
          className="mt-2 inline-flex min-h-9 items-center gap-1 rounded-lg px-1 text-xs font-semibold text-accent underline-offset-4 transition-colors hover:underline"
        >
          Open resume <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </HoverCardSurface>
  )
}
