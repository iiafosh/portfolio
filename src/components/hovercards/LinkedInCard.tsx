import React from 'react'
import { ArrowUpRight, GraduationCap, MapPin } from 'lucide-react'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { Portrait } from '@/components/ui/Portrait'
import { useItemsOfKind, useProfile } from '@/lib/content'
import { HoverCardSurface } from './HoverCard'

/** LinkedIn-style profile preview. Real profile data only: no follower or connection counts. */
export const LinkedInCard: React.FC = () => {
  const { profile } = useProfile()
  const { items: education } = useItemsOfKind('education')
  const school = education[0]

  return (
    <HoverCardSurface className="holo-group">
      {/* Banner */}
      <div aria-hidden="true" className="relative h-20 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 160% at 0% 0%, rgb(var(--accent) / 0.5), rgb(var(--accent-strong) / 0.2) 45%, rgb(var(--surface) / 0) 80%), rgb(var(--surface))',
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: 'radial-gradient(rgb(var(--text) / 0.35) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
            maskImage: 'linear-gradient(to left, #000, transparent 70%)',
            WebkitMaskImage: 'linear-gradient(to left, #000, transparent 70%)',
          }}
        />
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md bg-[#0a66c2] text-white shadow-card">
          <LinkedInIcon className="h-4 w-4" />
        </span>
      </div>

      <div className="relative px-4 pb-4">
        <div className="-mt-10">
          <Portrait src={profile.avatar_url} name={profile.name} size={76} />
        </div>
        <p className="mt-2.5 font-display text-lg font-semibold leading-tight text-text">{profile.name}</p>
        <p className="mt-1 text-sm leading-snug text-muted">{profile.headline}</p>

        <div className="mt-3 space-y-1.5 border-t border-line pt-3 text-xs text-muted">
          {school && (
            <p className="flex items-start gap-2">
              <GraduationCap className="mt-px h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
              <span>{school.title}</span>
            </p>
          )}
          <p className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            {profile.location}
          </p>
          {profile.availability && (
            <p className="flex items-center gap-2">
              <span className="mx-[3px] h-2 w-2 shrink-0 rounded-full bg-ok" aria-hidden="true" />
              {profile.availability}
            </p>
          )}
        </div>

        <a
          href={profile.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost mt-4 w-full rounded-full border-accent/40 text-accent hover:bg-accent/10"
        >
          View profile
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </HoverCardSurface>
  )
}
