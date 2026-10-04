import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { LiveDot } from '@/components/timeline/LiveDot'
import { isCurrentPeriod } from '@/components/timeline/period'
import { useItemsOfKind } from '@/lib/content'
import type { PortfolioItem } from '@/content/types'

/** Work history as a vertical timeline. Renders nothing until there are entries. */
export const ExperienceSection: React.FC = () => {
  const { items } = useItemsOfKind('experience')
  if (items.length === 0) return null

  return (
    <Section id="experience" eyebrow="experience" title="Where I've worked">
      <ol className="relative space-y-4">
        {items.map((item, i) => (
          <TimelineEntry key={item.id} item={item} isLast={i === items.length - 1} />
        ))}
      </ol>
    </Section>
  )
}

const TimelineEntry: React.FC<{ item: PortfolioItem; isLast: boolean }> = ({ item, isLast }) => {
  const current = isCurrentPeriod(item.period)
  const meta = [item.period, item.location].filter(Boolean).join(' · ')

  return (
    <li className="relative pl-8 sm:pl-10">
      {/* Rail: line down to the next entry */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute bottom-[-36px] left-[7px] top-[35px] w-px bg-gradient-to-b from-slime-400/40 to-line sm:left-[11px]"
        />
      )}
      {/* Node */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-slime-400/50 bg-ink-950 sm:left-1"
      >
        {current ? <LiveDot /> : <span className="h-1.5 w-1.5 rounded-full bg-slime-400" />}
      </span>

      <article className="card card-hover p-5 sm:p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold leading-snug text-fg">{item.title}</h3>
            {item.subtitle &&
              (item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-sm font-medium text-slime-300 transition-colors hover:text-slime-200"
                >
                  {item.subtitle}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              ) : (
                <p className="text-sm font-medium text-fg-muted">{item.subtitle}</p>
              ))}
          </div>
          {meta && (
            <p className="flex shrink-0 items-center gap-2 font-mono text-xs text-fg-faint sm:pt-1">
              {current && <span className="sr-only">Current role.</span>}
              {meta}
            </p>
          )}
        </div>

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
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
            {item.tags.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        )}
      </article>
    </li>
  )
}
