import React from 'react'
import { ArrowUpRight, FolderGit2 } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { useProfile } from '@/lib/content'
import { HoverCardSurface } from './HoverCard'
import { Avatar } from './Avatar'
import { githubAvatar, githubUsername, initials, useGitHubUser } from './profileUtils'

const FALLBACK_BIO = 'Trying to try'

/** GitHub profile preview. Repo count is fetched live; everything degrades gracefully. */
export const GitHubCard: React.FC = () => {
  const { profile } = useProfile()
  const username = githubUsername(profile)
  const { data, isLoading } = useGitHubUser(username, true)

  const name = data?.name || profile.name
  const bio = data?.bio?.trim() || FALLBACK_BIO
  const url = data?.html_url || profile.github_url

  return (
    <HoverCardSurface className="p-4">
      <div className="flex items-start gap-3">
        <Avatar src={githubAvatar(profile)} name={`${name} on GitHub`} fallback={initials(profile.name)} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-semibold text-fg">{name}</p>
          <p className="truncate font-mono text-xs text-fg-muted">@{data?.login ?? username}</p>
        </div>
        <GithubIcon className="h-5 w-5 shrink-0 text-fg-faint" />
      </div>

      <p className="mt-3 text-sm text-fg-muted">{bio}</p>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs text-fg-muted">
          <FolderGit2 className="h-3.5 w-3.5 text-slime-300" aria-hidden="true" />
          {data ? (
            <>
              <span className="text-fg">{data.public_repos}</span> public repos
            </>
          ) : isLoading ? (
            <span className="inline-block h-3 w-20 animate-pulse rounded bg-white/10" aria-label="Loading" />
          ) : (
            'Public repos'
          )}
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slime-300 transition-colors hover:bg-white/5 hover:text-slime-200"
        >
          View profile <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </a>
      </div>
    </HoverCardSurface>
  )
}
