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
    <HoverCardSurface>
      <div className="flex items-center justify-between border-b border-line bg-white/[0.02] px-4 py-2.5">
        <span className="inline-flex items-center gap-2 font-pixel text-[10px] uppercase tracking-[0.16em] text-fg-muted">
          <GithubIcon className="h-3.5 w-3.5 text-fg" />
          GitHub
        </span>
        <span className="font-mono text-[11px] text-fg-faint">github.com/{data?.login ?? username}</span>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar
            src={githubAvatar(profile)}
            name={`${name} on GitHub`}
            fallback={initials(profile.name)}
            className="h-12 w-12 ring-2 ring-slime-400/40 ring-offset-2 ring-offset-ink-900"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-base font-semibold text-fg">{name}</p>
            <p className="truncate font-mono text-xs text-fg-muted">@{data?.login ?? username}</p>
          </div>
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
            className="inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-xs font-semibold text-slime-300 transition-colors hover:bg-white/5 hover:text-slime-200"
          >
            View profile <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </HoverCardSurface>
  )
}
