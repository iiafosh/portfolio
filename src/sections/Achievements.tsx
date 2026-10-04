import React from 'react'
import { ArrowUpRight, Check } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { useItemsOfKind } from '@/lib/content'
import { revealDelay } from '@/lib/reveal'

type Tier = 'gold' | 'silver' | 'bronze' | 'slime'

interface Rank {
  /** Big glyph inside the medal ("#1", "3rd"), or null to show a check. */
  glyph: string | null
  /** Full result text shown under the medal ("3rd place"). */
  result: string
  tier: Tier
}

/**
 * "3rd place" -> bronze "3RD"; "#1 at Horus" -> gold "#1"; "Qualified" -> slime check.
 * Titles are "<result> · <event>", so the part before " · " is the result.
 */
function rankOf(result: string): Rank {
  const r = result.trim()
  const lower = r.toLowerCase()
  const num = lower.match(/^#?(\d+)(st|nd|rd|th)?\b/)
  if (num) {
    const n = Number(num[1])
    const tier: Tier = n === 1 ? 'gold' : n === 2 ? 'silver' : n === 3 ? 'bronze' : 'slime'
    return { glyph: r.split(/\s+/)[0]!.toUpperCase(), result: r, tier }
  }
  if (/\b(gold|winner|champion)\b/.test(lower)) return { glyph: '#1', result: r, tier: 'gold' }
  return { glyph: null, result: r, tier: 'slime' }
}

const TIER_CLASS: Record<Tier, string> = {
  gold: 'medal medal-gold',
  silver: 'medal medal-silver',
  bronze: 'medal medal-bronze',
  slime: 'medal',
}

/** Competition results and rankings as medal cards. */
export const AchievementsSection: React.FC = () => {
  const { items } = useItemsOfKind('achievement')
  if (items.length === 0) return null

  return (
    <Section id="achievements" eyebrow="achievements" title="Wins so far">
      <ul className={`grid gap-4 sm:gap-5 ${items.length > 1 ? 'lg:grid-cols-3' : ''}`}>
        {items.map((item, i) => {
          const [result, ...rest] = item.title.split(' · ')
          const event = rest.length > 0 ? rest.join(' · ') : null
          const rank = rankOf(result!)
          const long = (rank.glyph?.length ?? 0) > 3

          return (
            <li
              key={item.id}
              style={revealDelay(i)}
              className={`reveal medal-card card card-hover group relative flex flex-col overflow-hidden p-5 sm:p-6 ${TIER_CLASS[rank.tier]}`}
            >
              <div aria-hidden="true" className="medal-glow pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full" />

              <div className="relative flex items-center gap-4">
                <span
                  aria-hidden="true"
                  className="medal-disc flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-ink-950"
                >
                  {rank.glyph ? (
                    <span className={`relative z-10 font-hero font-black tracking-tight ${long ? 'text-sm' : 'text-lg'}`}>
                      {rank.glyph}
                    </span>
                  ) : (
                    <Check className="relative z-10 h-7 w-7" strokeWidth={3} />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="medal-text font-hero text-[13px] font-bold uppercase tracking-[0.12em]">{rank.result}</p>
                  {event && <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-fg">{event}</h3>}
                </div>
              </div>

              {item.subtitle && <p className="relative mt-4 text-sm font-medium text-fg">{item.subtitle}</p>}
              {item.description && <p className="relative mt-1.5 text-sm leading-relaxed text-fg-muted">{item.description}</p>}

              <div className="relative mt-auto pt-5">
                <span aria-hidden="true" className="medal-rule block h-px w-full" />
                <div className="flex items-center justify-between gap-3 pt-1">
                  {item.period && <span className="font-mono text-xs text-fg-faint">{item.period}</span>}
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="medal-text -mr-2 inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-medium transition-opacity hover:opacity-80"
                      aria-label={`Details: ${item.title} (opens in a new tab)`}
                    >
                      Details
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
