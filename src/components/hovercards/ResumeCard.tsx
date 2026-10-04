import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, FileText, GraduationCap } from 'lucide-react'
import { useItemsOfKind, useProfile } from '@/lib/content'
import { HoverCardSurface } from './HoverCard'

/** Mini resume preview: who, what, top skills, education. */
export const ResumeCard: React.FC = () => {
  const { profile } = useProfile()
  const { items: skills } = useItemsOfKind('skill_group')
  const { items: education } = useItemsOfKind('education')
  const school = education[0]
  const topSkills = skills.slice(0, 3)

  return (
    <HoverCardSurface>
      <div className="flex items-center gap-2 border-b border-line bg-white/[0.02] px-4 py-2.5">
        <FileText className="h-4 w-4 text-slime-300" aria-hidden="true" />
        <span className="font-pixel text-[10px] uppercase tracking-[0.18em] text-fg-muted">Resume</span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <p className="font-display text-base font-semibold leading-tight text-fg">{profile.name}</p>
          <p className="mt-1 text-xs leading-snug text-fg-muted">{profile.headline}</p>
        </div>

        {topSkills.length > 0 && (
          <dl className="space-y-1.5">
            {topSkills.map((group) => (
              <div key={group.id} className="grid grid-cols-[5.5rem_1fr] gap-2 text-xs">
                <dt className="truncate font-mono text-fg-faint">{group.title}</dt>
                <dd className="truncate text-fg-muted">{group.tags.slice(0, 3).join(' · ')}</dd>
              </div>
            ))}
          </dl>
        )}

        {school && (
          <p className="flex items-start gap-2 text-xs text-fg-muted">
            <GraduationCap className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slime-300" aria-hidden="true" />
            <span>
              {school.subtitle ? `${school.subtitle}, ` : ''}
              {school.title}
            </span>
          </p>
        )}

        <Link
          to="/resume"
          className="inline-flex items-center gap-1 rounded-lg py-1 text-xs font-semibold text-slime-300 transition-colors hover:text-slime-200"
        >
          Open resume <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </HoverCardSurface>
  )
}
