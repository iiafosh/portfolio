import React, { useEffect, useState } from 'react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { useProfile } from '@/lib/content'

const cairoTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Cairo',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

/** Cairo local time, re-rendered on each minute boundary. */
function useCairoTime(): string {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let interval: number | undefined
    const align = window.setTimeout(() => {
      setNow(new Date())
      interval = window.setInterval(() => setNow(new Date()), 60_000)
    }, 60_000 - (Date.now() % 60_000) + 50)
    return () => {
      window.clearTimeout(align)
      window.clearInterval(interval)
    }
  }, [])
  return cairoTime.format(now)
}

export const SiteFooter: React.FC = () => {
  const { profile } = useProfile()
  const time = useCairoTime()
  const year = new Date().getFullYear()

  return (
    <footer className="no-print relative z-10 mx-auto w-full max-w-5xl px-4 pb-10 sm:px-6">
      <div className="flex flex-col gap-4 border-t border-line pt-6 text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-relaxed">
          © {year} {profile.name} · built with React, TanStack &amp; Tailwind
        </p>

        <p className="font-mono">
          Damietta, EG · <time aria-label="Local time in Egypt">{time}</time>
        </p>

        <div className="flex items-center gap-3">
          <a
            href={profile.github_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in a new tab)"
            className="icon-btn h-10 w-10"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn (opens in a new tab)"
            className="icon-btn h-10 w-10"
          >
            <LinkedInIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  )
}
