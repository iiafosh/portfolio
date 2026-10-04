import React, { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, FileText, Mail } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { CopyEmailButton } from '@/components/ui/CopyEmailButton'
import { Portrait } from '@/components/ui/Portrait'
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
    <footer id="contact" className="no-print relative z-10 mx-auto w-full max-w-content scroll-mt-24 px-4 pb-10 sm:px-6 lg:px-8">
      {/* Closing call to action */}
      <section
        aria-labelledby="contact-title"
        className="reveal holo-group relative overflow-hidden rounded-3xl border border-slime-400/20 px-5 py-10 sm:px-10 sm:py-14"
        style={{
          background:
            'radial-gradient(120% 140% at 0% 0%, rgba(79,200,255,0.16), rgba(79,200,255,0) 55%), linear-gradient(180deg, rgba(14,19,34,0.92), rgba(10,14,25,0.92))',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(rgba(134,220,255,0.14) 1px, transparent 1px)',
            backgroundSize: '18px 18px',
            maskImage: 'linear-gradient(to left, #000, transparent 60%)',
            WebkitMaskImage: 'linear-gradient(to left, #000, transparent 60%)',
          }}
        />

        <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <Portrait src={profile.avatar_url} name={profile.name} size={44} />
              {profile.availability && (
                <span className="inline-flex items-center gap-2 text-sm text-fg-muted">
                  <span className="h-2 w-2 rounded-full bg-live" aria-hidden="true" />
                  {profile.availability}
                </span>
              )}
            </div>
            <h2 id="contact-title" className="mt-6 font-display text-[2rem] font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl">
              Let&apos;s build something.
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-fg-muted">
              Open to internships and freelance work. The fastest way to reach me is email.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="group mt-5 inline-flex max-w-full items-center gap-2 break-all font-mono text-base text-slime-200 transition-colors hover:text-slime-100 sm:text-lg"
            >
              <Mail className="h-4 w-4 shrink-0 text-slime-300" aria-hidden="true" />
              <span className="underline decoration-slime-400/30 underline-offset-[6px] group-hover:decoration-slime-300">
                {profile.email}
              </span>
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <CopyEmailButton email={profile.email} />
            <Link to="/resume" className="btn-ghost">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Resume
            </Link>
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub (opens in a new tab)"
              className="icon-btn"
            >
              <GithubIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn (opens in a new tab)"
              className="icon-btn"
            >
              <LinkedInIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </div>
      </section>

      {/* Fine print */}
      <div className="mt-8 flex flex-col gap-3 text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-relaxed">
          © {year} {profile.name} · built with React, TanStack &amp; Tailwind
        </p>
        <p className="font-mono">
          {profile.location} · <time aria-label="Local time in Egypt">{time}</time> local
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex min-h-10 items-center gap-1 self-start text-fg-faint transition-colors hover:text-fg-muted sm:self-auto"
        >
          Back to top <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" aria-hidden="true" />
        </button>
      </div>
    </footer>
  )
}
