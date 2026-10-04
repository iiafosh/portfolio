import React from 'react'
import { ArrowUpRight, Calendar, GraduationCap, MapPin } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { LiveDot } from '@/components/timeline/LiveDot'
import { isCurrentPeriod } from '@/components/timeline/period'
import { useItemsOfKind } from '@/lib/content'
import { levelsCleared } from '@/lib/derive'
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
  const level = levelsCleared(item)

  return (
    <article className="reveal card card-hover relative flex flex-col gap-5 overflow-hidden p-5 sm:flex-row sm:gap-6 sm:p-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-24 h-56 w-56 rounded-full"
        style={{ background: 'radial-gradient(closest-side, rgba(79,200,255,0.12), transparent)' }}
      />
      <div
        aria-hidden="true"
        className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slime-400/25 bg-slime-400/[0.07] text-slime-200"
      >
        <GraduationCap className="h-7 w-7" strokeWidth={1.75} />
      </div>

      <div className="relative min-w-0 flex-1">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h3 className="font-display text-xl font-semibold leading-snug text-fg">
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
          </div>

          {level !== null && (
            <div className="w-full max-w-[15rem] shrink-0 rounded-xl border border-line-strong bg-ink-950/40 px-3.5 py-2.5 md:w-44">
              <div className="flex items-center justify-between gap-3">
                <span className="label text-slime-300">Level {level}</span>
                <span className="font-mono text-[11px] text-fg-muted">cleared</span>
              </div>
              {/* A finished level is a full bar: no invented percentages. */}
              <span aria-hidden="true" className="mt-2 block h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <span className="block h-full w-full rounded-full bg-gradient-to-r from-slime-500 to-slime-300" />
              </span>
            </div>
          )}
        </div>

        {(item.period || item.location) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs text-fg-muted">
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

        {item.description && <p className="mt-4 text-sm leading-relaxed text-fg-muted">{item.description}</p>}

        {item.highlights.length > 0 && (
          <ul className="ticks mt-3 space-y-1.5">
            {item.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        )}

        {item.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Topics">
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
