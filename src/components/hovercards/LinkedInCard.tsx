import React from 'react'
import { MapPin } from 'lucide-react'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { useItemsOfKind, useProfile } from '@/lib/content'
import { HoverCardSurface } from './HoverCard'
import { Avatar } from './Avatar'
import { githubAvatar, initials } from './profileUtils'

/** LinkedIn-style profile preview. Real profile data only: no follower or connection counts. */
export const LinkedInCard: React.FC = () => {
  const { profile } = useProfile()
  const { items: education } = useItemsOfKind('education')
  const school = education[0]

  return (
    <HoverCardSurface>
      <div
        className="relative h-16 bg-gradient-to-r from-slime-600/70 via-slime-500/40 to-ink-800"
        aria-hidden="true"
      >
        <LinkedInIcon className="absolute right-3 top-3 h-5 w-5 text-white/70" />
      </div>
      <div className="px-4 pb-4">
        <Avatar
          src={profile.avatar_url ?? githubAvatar(profile)}
          name={profile.name}
          fallback={initials(profile.name)}
          className="-mt-8 h-16 w-16 border-2 border-ink-900 text-lg"
        />
        <p className="mt-2 font-display text-base font-semibold leading-tight text-fg">{profile.name}</p>
        <p className="mt-1 text-sm leading-snug text-fg-muted">{profile.headline}</p>
        {school && (
          <p className="mt-2 text-xs text-fg-muted">
            {school.title}
          </p>
        )}
        <p className="mt-1 inline-flex items-center gap-1 text-xs text-fg-faint">
          <MapPin className="h-3 w-3" aria-hidden="true" />
          {profile.location}
        </p>
        <a
          href={profile.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost mt-4 w-full rounded-full border-slime-400/40 py-2 text-slime-200"
        >
          View profile
        </a>
      </div>
    </HoverCardSurface>
  )
}
