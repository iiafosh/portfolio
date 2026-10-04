import React from 'react'
import { Dock } from '@/components/Dock'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SlimeMascot } from '@/components/mascot/SlimeMascot'
import { useScrollReveal } from '@/lib/reveal'

// Faint film grain, inlined so it costs no request.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/**
 * Fixed backdrop: three slow aurora blobs (transform-only animation, frozen
 * by prefers-reduced-motion), a hairline grid near the top and film grain.
 */
const Backdrop: React.FC = () => (
  <div aria-hidden="true" className="no-print pointer-events-none fixed inset-0 z-0 overflow-hidden">
    <div className="aurora aurora-a" />
    <div className="aurora aurora-b" />
    <div className="aurora aurora-c" />
    {/* Hairline grid that fades out away from the top. */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'linear-gradient(to right, rgba(148,180,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,180,255,0.045) 1px, transparent 1px)',
        backgroundSize: '56px 56px',
        backgroundPosition: 'center top',
        maskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, #000 25%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(ellipse 70% 50% at 50% 0%, #000 25%, transparent 75%)',
      }}
    />
    {/* Vignette keeps the edges calm. */}
    <div
      className="absolute inset-0"
      style={{ background: 'radial-gradient(ellipse 120% 90% at 50% 40%, transparent 55%, rgba(3,4,8,0.55))' }}
    />
    <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: NOISE }} />
  </div>
)

export const SiteShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useScrollReveal()

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-ink-950 text-fg">
      <a
        href="#main"
        className="sr-only z-[60] rounded-xl bg-slime-400 px-4 py-2 text-sm font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <Backdrop />
      <Dock />

      <main
        id="main"
        tabIndex={-1}
        className="relative z-10 mx-auto w-full max-w-content flex-1 px-4 pb-24 pt-24 focus:outline-none sm:px-6 sm:pt-28 lg:px-8"
      >
        {children}
      </main>

      <SiteFooter />
      <SlimeMascot />
    </div>
  )
}
