import React from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { LiveDot } from '@/components/timeline/LiveDot'
import { isCurrentPeriod } from '@/components/timeline/period'
import { useItemsOfKind } from '@/lib/content'
import { revealDelay } from '@/lib/reveal'
import type { PortfolioItem } from '@/content/types'

/** Work history as a vertical timeline. Renders nothing until there are entries. */
export const ExperienceSection: React.FC = () => {
  const { items } = useItemsOfKind('experience')
  if (items.length === 0) return null

  return (
    <Section id="experience" eyebrow="experience" title="Where I've worked">
      <ol className="relative">
        {/* Rail */}
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[7px] top-6 w-px bg-gradient-to-b from-slime-400/60 via-slime-400/20 to-transparent md:left-[172px]"
        />
        {items.map((item, i) => (
          <TimelineEntry key={item.id} item={item} index={i} />
        ))}
      </ol>
    </Section>
  )
}

const TimelineEntry: React.FC<{ item: PortfolioItem; index: number }> = ({ item, index }) => {
  const current = isCurrentPeriod(item.period)

  return (
    <li className="reveal relative pb-5 pl-8 last:pb-0 md:grid md:grid-cols-[148px_1fr] md:gap-12 md:pl-0" style={revealDelay(index)}>
      {/* Date column (desktop) */}
      <div className="hidden pt-6 text-right md:block">
        {item.period && <p className="font-mono text-xs leading-relaxed text-fg-muted">{item.period}</p>}
        {current && (
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-live/25 bg-live/[0.08] px-2 py-0.5 font-pixel text-[9px] uppercase tracking-[0.14em] text-live">
            Active
          </span>
        )}
      </div>

      {/* Node */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-7 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-slime-400/60 bg-ink-950 shadow-[0_0_0_4px_rgba(6,8,15,1),0_0_14px_rgba(79,200,255,0.45)] md:left-[165px]"
      >
        {current ? <LiveDot /> : <span className="h-1.5 w-1.5 rounded-full bg-slime-400" />}
      </span>

      <article className="card card-hover p-5 sm:p-6">
        {/* Date row (phones) */}
        {item.period && (
          <p className="mb-2 flex items-center gap-2 font-mono text-xs text-fg-muted md:hidden">
            {item.period}
            {current && <span className="sr-only">(current role)</span>}
          </p>
        )}

        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold leading-snug text-fg">{item.title}</h3>
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
                <p className="text-sm font-medium text-slime-300">{item.subtitle}</p>
              ))}
          </div>
          {item.location && (
            <p className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs text-fg-faint sm:pt-1.5">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              {item.location}
            </p>
          )}
        </div>

        {item.description && <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.description}</p>}

        {item.highlights.length > 0 && (
          <ul className="ticks mt-3 space-y-1.5">
            {item.highlights.map((h) => (
              <li key={h}>{h}</li>
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
