import React from 'react'

interface SectionProps {
  id: string
  /** Label shown above the title, e.g. "projects". A leading "03 // " is ignored. */
  eyebrow: string
  title: string
  /** Optional one-liner under the title. */
  lede?: React.ReactNode
  /** Optional element rendered at the right end of the hairline (e.g. a "View all" link). */
  action?: React.ReactNode
  children: React.ReactNode
}

/**
 * Standard home-page section: ghost index numeral, pixel eyebrow, display
 * title and a hairline running to the right edge. The numeral comes from a
 * CSS counter, so numbering stays sequential when empty sections are hidden
 * or the owner reorders them.
 */
export const Section: React.FC<SectionProps> = ({ id, eyebrow, title, lede, action, children }) => (
  <section id={id} className="numbered-section scroll-mt-24" aria-labelledby={`${id}-title`}>
    <header className="reveal mb-8 flex items-end gap-4 sm:mb-10 sm:gap-6">
      <span aria-hidden="true" className="section-index -mb-1 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="eyebrow section-eyebrow">{eyebrow.replace(/^\s*\d+\s*\/\/\s*/, '')}</p>
        <div className="mt-2 flex items-center gap-4 sm:gap-6">
          <h2 id={`${id}-title`} className="section-title">
            {title}
          </h2>
          <span aria-hidden="true" className="section-rule hidden translate-y-1 sm:block" />
          {action}
        </div>
        {lede && <p className="mt-2 max-w-2xl text-sm leading-relaxed text-fg-muted">{lede}</p>}
      </div>
    </header>
    {children}
  </section>
)
