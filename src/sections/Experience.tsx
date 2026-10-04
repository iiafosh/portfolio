import React, { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { isCurrentPeriod } from '@/components/timeline/period'
import { useItemsOfKind } from '@/lib/content'
import { guildName } from '@/lib/derive'
import { EducationList } from '@/sections/Education'
import type { PortfolioItem } from '@/content/types'

type Tab = 'work' | 'education'

/**
 * Work history and education in one section with two tabs (keeps the page
 * short). Linking to #education opens the Education tab. With only one kind
 * of content the tabs are skipped.
 */
export const ExperienceSection: React.FC = () => {
  const { items: work } = useItemsOfKind('experience')
  const { items: education } = useItemsOfKind('education')
  const [tab, setTab] = useState<Tab>(() =>
    typeof window !== 'undefined' && window.location.hash === '#education' ? 'education' : 'work',
  )
  const uid = useId().replace(/:/g, '')
  const tabRefs = useRef<Record<Tab, HTMLButtonElement | null>>({ work: null, education: null })

  useEffect(() => {
    const onHash = () => {
      if (window.location.hash === '#education') setTab('education')
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  if (work.length === 0 && education.length === 0) return null

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'work' as Tab, label: 'Work', count: work.length },
    { id: 'education' as Tab, label: 'Education', count: education.length },
  ].filter((t) => t.count > 0)
  const current: Tab = tabs.some((t) => t.id === tab) ? tab : tabs[0]!.id

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === current)
    const next =
      e.key === 'ArrowRight' ? tabs[(i + 1) % tabs.length] : e.key === 'ArrowLeft' ? tabs[(i - 1 + tabs.length) % tabs.length] : null
    if (!next) return
    e.preventDefault()
    setTab(next.id)
    tabRefs.current[next.id]?.focus()
  }

  const panel = (id: Tab) => (id === 'work' ? <WorkList items={work} /> : <EducationList items={education} />)

  return (
    <Section id="experience" eyebrow="experience" title="Where I've been">
      {tabs.length > 1 ? (
        <>
          <div
            id="education"
            role="tablist"
            aria-label="Experience and education"
            className="mb-5 inline-flex rounded-xl border border-line bg-surface/60 p-1"
            onKeyDown={onKeyDown}
          >
            {tabs.map((t) => {
              const selected = t.id === current
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[t.id] = el
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`${uid}-panel-${t.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${
                    selected ? 'bg-surface-2 text-text shadow-card' : 'text-muted hover:text-text'
                  }`}
                >
                  {t.label}
                  <span className={`font-mono text-[11px] ${selected ? 'text-accent' : 'text-faint'}`}>{t.count}</span>
                </button>
              )
            })}
          </div>
          <div role="tabpanel" id={`${uid}-panel-${current}`} aria-labelledby={`${uid}-tab-${current}`} tabIndex={0} className="rounded-2xl">
            {panel(current)}
          </div>
        </>
      ) : (
        panel(tabs[0]!.id)
      )}
    </Section>
  )
}

/** "AXIS student club · Horus University" -> "A". */
const monogram = (item: PortfolioItem) => (guildName(item) ?? item.title).charAt(0).toUpperCase()

const WorkList: React.FC<{ items: PortfolioItem[] }> = ({ items }) => (
  <ol className="card divide-y divide-line">
    {items.map((item) => (
      <WorkEntry key={item.id} item={item} />
    ))}
  </ol>
)

const WorkEntry: React.FC<{ item: PortfolioItem }> = ({ item }) => {
  const current = isCurrentPeriod(item.period)

  return (
    <li className="flex gap-4 p-5 sm:gap-5 sm:p-6">
      <span
        aria-hidden="true"
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-surface-2 font-hero text-base font-black text-accent"
      >
        {monogram(item)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h3 className="font-display text-lg font-semibold leading-snug text-text">{item.title}</h3>
            {item.subtitle &&
              (item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-sm font-medium text-accent"
                >
                  {item.subtitle}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
              ) : (
                <p className="text-sm font-medium text-muted">{item.subtitle}</p>
              ))}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-1 sm:flex-col sm:items-end sm:pt-1">
            {item.period && (
              <p className="inline-flex items-center gap-2 font-mono text-xs text-muted">
                {current && (
                  <span className="rounded-full border border-ok/25 bg-ok/[0.08] px-2 py-0.5 font-pixel text-[9px] uppercase tracking-[0.14em] text-ok">
                    Active
                  </span>
                )}
                {item.period}
              </p>
            )}
            {item.location && (
              <p className="inline-flex items-center gap-1.5 font-mono text-xs text-faint">
                <MapPin className="h-3 w-3" aria-hidden="true" />
                {item.location}
              </p>
            )}
          </div>
        </div>

        {item.description && <p className="mt-3 max-w-measure text-sm leading-relaxed text-muted">{item.description}</p>}

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
      </div>
    </li>
  )
}
