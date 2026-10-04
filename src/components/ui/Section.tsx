import React from 'react'

interface SectionProps {
  id: string
  eyebrow: string
  title: string
  /** Optional element rendered at the right of the heading row (e.g. a "View all" link). */
  action?: React.ReactNode
  children: React.ReactNode
}

/** Standard home-page section: pixel eyebrow, display title, content. */
export const Section: React.FC<SectionProps> = ({ id, eyebrow, title, action, children }) => (
  <section id={id} className="scroll-mt-24 animate-fade-up">
    <div className="mb-5 flex items-end justify-between gap-4">
      <div className="space-y-1.5">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title">{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </section>
)
