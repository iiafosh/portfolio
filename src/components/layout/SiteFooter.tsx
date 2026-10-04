import React, { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, FileText, Mail, MapPin } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { CopyEmailButton } from '@/components/ui/CopyEmailButton'
import { Portrait } from '@/components/ui/Portrait'
import { SkinPicker } from '@/components/SkinPicker'
import { useProfile } from '@/lib/content'
import { scrollBehavior } from '@/lib/motion'

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
    <footer id="contact" className="no-print relative z-10 mx-auto w-full max-w-content px-4 pb-10 sm:px-6 lg:px-8">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Closing call to action */}
        <section
          aria-labelledby="contact-title"
          className="holo-group relative overflow-hidden rounded-3xl border border-line-strong px-5 py-9 sm:px-9 sm:py-11 md:col-span-2 md:row-span-2"
          style={{
            background:
              'radial-gradient(120% 140% at 0% 0%, rgb(var(--accent) / 0.13), rgb(var(--accent) / 0) 55%), rgb(var(--surface) / 0.9)',
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60"
            style={{
              backgroundImage: 'radial-gradient(rgb(var(--accent) / 0.14) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
              maskImage: 'linear-gradient(to left, #000, transparent 60%)',
              WebkitMaskImage: 'linear-gradient(to left, #000, transparent 60%)',
            }}
          />

          <div className="relative">
            <div className="flex items-center gap-3">
              <Portrait src={profile.avatar_url} name={profile.name} size={44} />
              {profile.availability && (
                <span className="inline-flex items-center gap-2 text-sm text-muted">
                  <span className="h-2 w-2 rounded-full bg-ok" aria-hidden="true" />
                  {profile.availability}
                </span>
              )}
            </div>
            <h2 id="contact-title" className="mt-6 font-display text-[2rem] font-bold leading-[1.05] tracking-tight text-text sm:text-5xl">
              Let&apos;s build <span className="text-accent-2">something.</span>
            </h2>
            <p className="mt-3 max-w-measure text-[15px] leading-relaxed text-muted">
              Open to internships and freelance work. The fastest way to reach me is email.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="group mt-5 inline-flex min-h-11 max-w-full items-center gap-2 break-all font-mono text-base text-accent sm:text-lg"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="underline decoration-accent/30 underline-offset-[6px] transition-colors group-hover:decoration-accent">
                {profile.email}
              </span>
            </a>

            <div className="mt-6 flex flex-wrap items-center gap-3">
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

        {/* Skin picker: the playful one */}
        <section aria-labelledby="skin-title" className="card flex flex-col p-5">
          <h2 id="skin-title" className="font-display text-lg font-semibold leading-tight text-text">
            Pick a slime skin
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">Recolours the whole site. Saved for your next visit.</p>
          <SkinPicker variant="large" className="mt-4" />
        </section>

        {/* Where and when */}
        <section aria-label="Location and local time" className="card flex flex-col justify-between gap-4 p-5">
          <p className="inline-flex items-center gap-1.5 text-sm text-muted">
            <MapPin className="h-4 w-4 text-accent-3" aria-hidden="true" />
            {profile.location}
          </p>
          <p>
            <time
              className="block font-hero text-4xl font-bold tabular-nums tracking-tight text-text"
              aria-label={`Local time in Egypt: ${time}`}
            >
              {time}
            </time>
            <span className="mt-1 block font-mono text-xs text-faint">local time in Egypt</span>
          </p>
        </section>
      </div>

      {/* Fine print */}
      <div className="mt-8 flex flex-col gap-3 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
        <p className="leading-relaxed">
          © {year} {profile.name} · built with React, TanStack &amp; Tailwind
        </p>
        <button
          type="button"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: scrollBehavior() })
            document.getElementById('main')?.focus({ preventScroll: true })
          }}
          className="inline-flex min-h-11 items-center gap-1 self-start text-faint transition-colors hover:text-text sm:self-auto"
        >
          Back to top <ArrowUpRight className="h-3.5 w-3.5 -rotate-45" aria-hidden="true" />
        </button>
      </div>
    </footer>
  )
}
