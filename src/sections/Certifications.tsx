import React from 'react'
import { Award, ExternalLink } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { useItemsOfKind } from '@/lib/content'

/** Certifications and courses. Renders nothing until there are entries. */
export const CertificationsSection: React.FC = () => {
  const { items } = useItemsOfKind('certification')
  if (items.length === 0) return null

  return (
    <Section id="certifications" eyebrow="certifications" title="Certifications">
      <ul className={`grid gap-4 ${items.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {items.map((item) => (
          <li key={item.id} className="card card-hover flex gap-4 p-5">
            <div
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/[0.07] text-accent"
            >
              <Award className="h-5 w-5" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="font-display text-base font-semibold leading-snug text-text">{item.title}</h3>
              {item.subtitle && <p className="mt-0.5 text-sm text-muted">{item.subtitle}</p>}
              {item.period && (
                <p className="mt-1.5 font-mono text-xs text-muted">
                  <span className="sr-only">Issued </span>
                  {item.period}
                </p>
              )}
              {item.description && <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>}
              {item.tags.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Skills covered">
                  {item.tags.map((t) => (
                    <li key={t} className="chip">
                      {t}
                    </li>
                  ))}
                </ul>
              )}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 self-start text-sm font-medium text-accent underline-offset-4 transition-colors hover:underline"
                  aria-label={`View credential: ${item.title}`}
                >
                  View credential
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
