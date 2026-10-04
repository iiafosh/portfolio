import React, { useState } from 'react'
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import type { ItemKind, PortfolioItem } from '@/content/types'
import { useDeleteItem, useItems, useReorderItems, useUpsertItem } from '@/lib/content'
import { ItemForm } from './ItemForm'
import { PanelHeader, SaveStatus, ToolButton, errorText } from './ui'

const KINDS: { kind: ItemKind; label: string; singular: string }[] = [
  { kind: 'project', label: 'Projects', singular: 'project' },
  { kind: 'experience', label: 'Experience', singular: 'experience' },
  { kind: 'education', label: 'Education', singular: 'education entry' },
  { kind: 'certification', label: 'Certifications', singular: 'certification' },
  { kind: 'skill_group', label: 'Skill groups', singular: 'skill group' },
]

function newItem(kind: ItemKind, existing: PortfolioItem[]): PortfolioItem {
  const max = existing.reduce((m, i) => Math.max(m, i.sort_order), 0)
  return {
    id: crypto.randomUUID(),
    kind,
    title: '',
    subtitle: null,
    period: null,
    location: null,
    description: null,
    highlights: [],
    tags: [],
    url: null,
    repo_url: null,
    image_url: null,
    video_url: null,
    featured: false,
    sort_order: max + 10,
    visible: true,
  }
}

interface ItemRowProps {
  item: PortfolioItem
  index: number
  count: number
  editing: boolean
  onEdit: () => void
  onCloseEdit: () => void
  onMove: (delta: -1 | 1) => void
}

const ItemRow: React.FC<ItemRowProps> = ({ item, index, count, editing, onEdit, onCloseEdit, onMove }) => {
  const upsert = useUpsertItem()
  const del = useDeleteItem()
  const toggle = (patch: Partial<PortfolioItem>) => upsert.mutate({ ...item, ...patch })

  return (
    <li className="px-3 py-2">
      <div className="flex items-center gap-1.5">
        <div className={`min-w-0 flex-1 ${item.visible ? '' : 'opacity-50'}`}>
          <p className="truncate text-sm font-medium text-fg">{item.title || <em className="text-fg-faint">Untitled</em>}</p>
          {(item.subtitle || item.period) && (
            <p className="truncate text-xs text-fg-faint">{[item.subtitle, item.period].filter(Boolean).join(' · ')}</p>
          )}
        </div>
        <SaveStatus mutation={upsert} className="hidden max-w-[12rem] truncate sm:inline" />
        <ToolButton
          label={item.visible ? 'Visible — click to hide' : 'Hidden — click to show'}
          active={item.visible}
          onClick={() => toggle({ visible: !item.visible })}
          disabled={upsert.isPending}
        >
          {item.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </ToolButton>
        {item.kind === 'project' && (
          <ToolButton
            label={item.featured ? 'Featured — click to unfeature' : 'Not featured — click to feature'}
            active={item.featured}
            onClick={() => toggle({ featured: !item.featured })}
            disabled={upsert.isPending}
          >
            <Star className={`h-4 w-4 ${item.featured ? 'fill-current' : ''}`} />
          </ToolButton>
        )}
        <ToolButton label="Move up" disabled={index === 0} onClick={() => onMove(-1)}>
          <ArrowUp className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Move down" disabled={index === count - 1} onClick={() => onMove(1)}>
          <ArrowDown className="h-4 w-4" />
        </ToolButton>
        <ToolButton label={`Edit ${item.title}`} active={editing} onClick={editing ? onCloseEdit : onEdit}>
          <Pencil className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label={`Delete ${item.title}`}
          tone="danger"
          disabled={del.isPending}
          onClick={() => {
            if (window.confirm(`Delete "${item.title}"? This can't be undone.`)) del.mutate(item.id)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </ToolButton>
      </div>
      {(upsert.isError || del.isError) && (
        <p role="alert" className="mt-1 text-xs text-rose-300">
          {errorText(upsert.error ?? del.error)}
        </p>
      )}
      {editing && (
        <div className="mt-2">
          <ItemForm item={item} isNew={false} onDone={onCloseEdit} />
        </div>
      )}
    </li>
  )
}

export const ItemsPanel: React.FC = () => {
  const { items, isLoading } = useItems()
  const reorder = useReorderItems()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState<PortfolioItem | null>(null)

  return (
    <div className="space-y-4">
      {KINDS.map(({ kind, label, singular }) => {
        const group = items.filter((i) => i.kind === kind).sort((a, b) => a.sort_order - b.sort_order)
        const move = (index: number, delta: -1 | 1) => {
          const ids = group.map((i) => i.id)
          const target = index + delta
          if (target < 0 || target >= ids.length) return
          ;[ids[index], ids[target]] = [ids[target]!, ids[index]!]
          reorder.mutate(ids)
        }
        const addingHere = draft?.kind === kind

        return (
          <section key={kind} className="card p-5">
            <PanelHeader
              title={label}
              description={`${group.length} ${group.length === 1 ? 'item' : 'items'} · ${group.filter((i) => i.visible).length} visible`}
              action={
                <button
                  type="button"
                  className="btn-ghost px-3 py-2 text-xs"
                  onClick={() => {
                    setEditingId(null)
                    setDraft(newItem(kind, group))
                  }}
                  disabled={addingHere}
                >
                  <Plus className="h-4 w-4" /> Add {singular}
                </button>
              }
            />

            {addingHere && draft && (
              <div className="mb-3">
                <ItemForm key={draft.id} item={draft} isNew onDone={() => setDraft(null)} />
              </div>
            )}

            {group.length > 0 ? (
              <ul className="divide-y divide-line rounded-xl border border-line">
                {group.map((item, i) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    index={i}
                    count={group.length}
                    editing={editingId === item.id}
                    onEdit={() => {
                      setDraft(null)
                      setEditingId(item.id)
                    }}
                    onCloseEdit={() => setEditingId(null)}
                    onMove={(delta) => move(i, delta)}
                  />
                ))}
              </ul>
            ) : (
              !addingHere && (
                <p className="rounded-xl border border-dashed border-line px-3 py-4 text-center text-xs text-fg-faint">
                  {isLoading ? 'Loading…' : `No ${label.toLowerCase()} yet. The section stays hidden until you add one.`}
                </p>
              )
            )}
          </section>
        )
      })}
      {reorder.isError && (
        <p role="alert" className="text-xs text-rose-300">
          Reorder failed: {errorText(reorder.error)}
        </p>
      )}
    </div>
  )
}
