import React from 'react'
import { Section } from '@/components/ui/Section'
import { useItemsOfKind } from '@/lib/content'

/** Skill groups as "inventory" cards: indexed pixel label + chips. No fake levels. */
export const SkillsSection: React.FC = () => {
  const { items } = useItemsOfKind('skill_group')
  if (items.length === 0) return null

  return (
    <Section id="skills" eyebrow="skills" title="Toolbox">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((group, i) => (
          <li key={group.id} className="card card-hover group flex flex-col p-5">
            <h3 className="mb-3 flex items-baseline justify-between gap-3">
              <span className="font-pixel text-[11px] uppercase tracking-[0.14em] text-fg">
                <span className="text-slime-400 transition-colors group-hover:text-slime-300">
                  [{String(i + 1).padStart(2, '0')}]
                </span>{' '}
                {group.title}
              </span>
              <span className="font-mono text-[10px] text-fg-faint" aria-label={`${group.tags.length} skills`}>
                x{group.tags.length}
              </span>
            </h3>
            {group.description && <p className="mb-3 text-sm leading-relaxed text-fg-muted">{group.description}</p>}
            <ul className="flex flex-wrap gap-1.5">
              {group.tags.map((tag) => (
                <li key={tag} className="chip text-fg-muted">
                  {tag}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  )
}
