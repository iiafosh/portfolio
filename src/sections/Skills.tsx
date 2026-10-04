import React from 'react'
import { AppWindow, Brain, Code2, Cpu, Gamepad2, Layers, Wrench, type LucideIcon } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { useItemsOfKind } from '@/lib/content'
import { trackSpotlight } from '@/lib/spotlight'

const GROUP_ICONS: [RegExp, LucideIcon][] = [
  [/language/i, Code2],
  [/\bai\b|data|machine/i, Brain],
  [/hardware|iot|embedded/i, Cpu],
  [/game|3d/i, Gamepad2],
  [/web|app/i, AppWindow],
  [/tool|work/i, Wrench],
]

const iconFor = (title: string): LucideIcon => GROUP_ICONS.find(([re]) => re.test(title))?.[1] ?? Layers

/** Skill groups as "inventory slots": icon, title, count, chips. No fake levels. */
export const SkillsSection: React.FC = () => {
  const { items } = useItemsOfKind('skill_group')
  if (items.length === 0) return null

  return (
    <Section id="skills" eyebrow="skills" title="Toolbox">
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((group) => {
          const Icon = iconFor(group.title)
          return (
            <li
              key={group.id}
              onPointerMove={trackSpotlight}
              className="spotlight card card-hover group flex flex-col p-5"
            >
              <h3 className="mb-4 flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/20 bg-accent/[0.06] text-accent transition-colors group-hover:border-accent/40"
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                <span className="min-w-0 flex-1 font-display text-base font-semibold leading-tight text-text">{group.title}</span>
                <span className="font-mono text-[11px] text-faint" aria-label={`${group.tags.length} skills`}>
                  x{group.tags.length}
                </span>
              </h3>
              {group.description && <p className="mb-3 text-sm leading-relaxed text-muted">{group.description}</p>}
              <ul className="flex flex-wrap gap-1.5">
                {group.tags.map((tag) => (
                  <li key={tag} className="chip">
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          )
        })}
      </ul>
    </Section>
  )
}
