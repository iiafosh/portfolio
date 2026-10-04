import React from 'react'
import { ArrowUpRight, Calendar, GraduationCap, MapPin } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { LiveDot } from '@/components/timeline/LiveDot'
import { isCurrentPeriod } from '@/components/timeline/period'
import { useItemsOfKind } from '@/lib/content'
import type { PortfolioItem } from '@/content/types'

/** Schools and programs as compact cards. */
export const EducationSection: React.FC = () => {
  const { items } = useItemsOfKind('education')
  if (items.length === 0) return null

  return (
    <Section id="education" eyebrow="education" title="Where I study">
      <div className={`grid gap-4 ${items.length > 1 ? 'sm:grid-cols-2' : ''}`}>
        {items.map((item) => (
          <EducationCard key={item.id} item={item} />
        ))}
      </div>
    </Section>
  )
}

const EducationCard: React.FC<{ item: PortfolioItem }> = ({ item }) => {
  const current = isCurrentPeriod(item.period)

  return (
    <article className="card card-hover flex gap-4 p-5 sm:p-6">
      <div
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slime-400/20 bg-slime-400/[0.07] text-slime-300"
      >
        <GraduationCap className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-lg font-semibold leading-snug text-fg">
          {item.url ? (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 transition-colors hover:text-slime-200"
            >
              {item.title}
              <ArrowUpRight
                className="h-4 w-4 text-fg-faint transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-slime-300"
                aria-hidden="true"
              />
            </a>
          ) : (
            item.title
          )}
        </h3>
        {item.subtitle && <p className="mt-0.5 text-sm font-medium text-slime-300">{item.subtitle}</p>}

        {(item.period || item.location) && (
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-fg-faint">
            {item.period && (
              <span className="inline-flex items-center gap-1.5">
                {current ? <LiveDot /> : <Calendar className="h-3.5 w-3.5" aria-hidden="true" />}
                {item.period}
              </span>
            )}
            {item.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                {item.location}
              </span>
            )}
          </div>
        )}

        {item.description && <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.description}</p>}

        {item.highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {item.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
                <span aria-hidden="true" className="mt-[0.55rem] h-1 w-1 shrink-0 rounded-full bg-slime-400/70" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}

        {item.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Topics">
            {item.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}
