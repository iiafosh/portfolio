import React from 'react'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { ChapterRail } from '@/components/layout/ChapterRail'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SlimeMascot } from '@/components/mascot/SlimeMascot'

// Faint film grain, inlined so it costs no request.
const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

/** Static backdrop: a soft accent glow at the top of the page and faint grain. Nothing animates. */
const Backdrop: React.FC = () => (
  <div aria-hidden="true" className="no-print pointer-events-none absolute inset-0 z-0 overflow-hidden">
    <div className="page-glow" />
    <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: NOISE }} />
  </div>
)

export const SiteShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative flex min-h-screen flex-col overflow-x-clip bg-bg text-text">
    <a
      href="#main"
      className="sr-only z-[60] rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Skip to content
    </a>

    <Backdrop />
    <SiteHeader />
    <ChapterRail />

    <main
      id="main"
      tabIndex={-1}
      className="relative z-10 mx-auto w-full max-w-content flex-1 px-4 pb-24 pt-10 focus:outline-none sm:px-6 sm:pt-14 lg:px-8"
    >
      {children}
    </main>

    <SiteFooter />
    <SlimeMascot />
  </div>
)
