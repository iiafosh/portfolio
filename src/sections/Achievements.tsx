import React from 'react'
import { ExternalLink, Trophy } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { useItemsOfKind } from '@/lib/content'

/**
 * Competition results and rankings. The first word group before " · " in the
 * title (e.g. "3rd place") is shown as the badge, so keep titles in the form
 * "<result> · <event>".
 */
export const AchievementsSection: React.FC = () => {
  const { items } = useItemsOfKind('achievement')
  if (items.length === 0) return null

  return (
    <Section id="achievements" eyebrow="achievements" title="Wins so far">
      <ul className={`grid gap-4 ${items.length > 1 ? 'md:grid-cols-3' : ''}`}>
        {items.map((item) => {
          const [badge, ...rest] = item.title.split(' · ')
          const heading = rest.length > 0 ? rest.join(' · ') : null
          return (
            <li key={item.id} className="card card-hover relative flex flex-col overflow-hidden p-5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-slime-400/10 blur-2xl"
              />
              <div className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slime-400/25 bg-slime-400/[0.08] text-slime-300"
                >
                  <Trophy className="h-4 w-4" />
                </span>
                <span className="font-display text-lg font-bold leading-tight text-slime-200">{badge}</span>
              </div>
              {heading && <h3 className="mt-3 font-display text-base font-semibold leading-snug text-fg">{heading}</h3>}
              {item.subtitle && <p className="mt-1 text-sm text-fg-muted">{item.subtitle}</p>}
              {item.description && <p className="mt-3 text-sm leading-relaxed text-fg-muted">{item.description}</p>}
              <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                {item.period && <span className="font-mono text-xs text-fg-faint">{item.period}</span>}
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[40px] items-center gap-1.5 text-sm font-medium text-slime-300 transition-colors hover:text-slime-200"
                  >
                    Details
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
