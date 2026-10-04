import React, { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Eye, EyeOff, RotateCcw } from 'lucide-react'
import { ALL_SECTIONS, SECTION_LABELS, type SectionKey } from '@/content/types'
import { useProfile, useUpdateProfile } from '@/lib/content'
import { PanelHeader, SaveStatus, ToolButton } from './ui'

export const SectionOrderPanel: React.FC = () => {
  const { profile } = useProfile()
  const update = useUpdateProfile()
  const saved = profile.section_order.filter((k) => ALL_SECTIONS.includes(k))
  const savedKey = saved.join(',')
  const [order, setOrder] = useState<SectionKey[]>(saved)

  // Pick up server changes (e.g. after save or refetch).
  useEffect(() => {
    setOrder(savedKey ? (savedKey.split(',') as SectionKey[]) : [])
  }, [savedKey])

  const dirty = order.join(',') !== savedKey
  const hidden = ALL_SECTIONS.filter((k) => !order.includes(k))

  const move = (index: number, delta: -1 | 1) => {
    const next = [...order]
    const target = index + delta
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target]!, next[index]!]
    setOrder(next)
  }

  return (
    <div className="card p-5">
      <PanelHeader
        title="Section order"
        description="The home page renders these sections top to bottom. Hidden sections are left out."
      />

      <ol className="divide-y divide-line rounded-xl border border-line">
        {order.map((key, i) => (
          <li key={key} className="flex items-center gap-2 px-3 py-1.5">
            <span className="w-6 font-mono text-xs text-fg-faint">{String(i + 1).padStart(2, '0')}</span>
            <span className="flex-1 text-sm text-fg">{SECTION_LABELS[key]}</span>
            <ToolButton label={`Move ${SECTION_LABELS[key]} up`} disabled={i === 0} onClick={() => move(i, -1)}>
              <ArrowUp className="h-4 w-4" />
            </ToolButton>
            <ToolButton
              label={`Move ${SECTION_LABELS[key]} down`}
              disabled={i === order.length - 1}
              onClick={() => move(i, 1)}
            >
              <ArrowDown className="h-4 w-4" />
            </ToolButton>
            <ToolButton label={`Hide ${SECTION_LABELS[key]}`} onClick={() => setOrder(order.filter((k) => k !== key))}>
              <Eye className="h-4 w-4" />
            </ToolButton>
          </li>
        ))}
        {order.length === 0 && <li className="px-3 py-3 text-sm text-fg-faint">All sections are hidden.</li>}
      </ol>

      {hidden.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-fg-faint">Hidden</p>
          <ul className="flex flex-wrap gap-2">
            {hidden.map((key) => (
              <li key={key}>
                <button
                  type="button"
                  onClick={() => setOrder([...order, key])}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-line px-2.5 py-1.5 text-xs text-fg-faint transition-colors hover:border-slime-400/40 hover:text-fg"
                  title={`Show ${SECTION_LABELS[key]}`}
                >
                  <EyeOff className="h-3.5 w-3.5" /> {SECTION_LABELS[key]}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-primary"
          disabled={!dirty || update.isPending}
          onClick={() => update.mutate({ section_order: order })}
        >
          Save order
        </button>
        {dirty && (
          <button type="button" className="btn-ghost" onClick={() => setOrder(saved)}>
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        )}
        <SaveStatus mutation={update} />
      </div>
    </div>
  )
}
