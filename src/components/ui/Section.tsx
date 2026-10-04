import React from 'react'

interface SectionProps {
  id: string
  /** Label after the auto number, e.g. "projects". A leading "03 // " is ignored. */
  eyebrow: string
  title: string
  /** Optional element rendered at the right of the heading row (e.g. a "View all" link). */
  action?: React.ReactNode
  children: React.ReactNode
}

/**
 * Standard home-page section: pixel eyebrow, display title, content.
 * The "01 //" number comes from a CSS counter, so numbering stays sequential
 * when empty sections are hidden or the owner reorders them.
 */
export const Section: React.FC<SectionProps> = ({ id, eyebrow, title, action, children }) => (
  <section id={id} className="numbered-section scroll-mt-24 animate-fade-up">
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="space-y-1.5">
        <p className="eyebrow section-eyebrow">{eyebrow.replace(/^\s*\d+\s*\/\/\s*/, '')}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </section>
)
