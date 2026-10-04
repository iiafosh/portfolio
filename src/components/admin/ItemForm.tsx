import React, { useState } from 'react'
import type { ItemKind, PortfolioItem } from '@/content/types'
import { useUpsertItem } from '@/lib/content'
import { Field, SaveStatus, inputClass } from './ui'

interface ItemFormProps {
  /** Existing item to edit, or a fresh draft for a new one. */
  item: PortfolioItem
  isNew: boolean
  onDone: () => void
}

interface FormState {
  title: string
  subtitle: string
  period: string
  location: string
  description: string
  highlights: string
  tags: string
  url: string
  repo_url: string
  image_url: string
  video_url: string
  featured: boolean
  visible: boolean
  sort_order: string
}

const KIND_HINTS: Record<ItemKind, { subtitle: string; tags: string }> = {
  project: { subtitle: 'Project type, e.g. "Full-stack web app"', tags: 'Tech stack' },
  experience: { subtitle: 'Company / organisation', tags: 'Skills used' },
  education: { subtitle: 'Degree / programme', tags: 'Tags' },
  certification: { subtitle: 'Issuer', tags: 'Tags' },
  achievement: { subtitle: 'Event / organiser', tags: 'Tags' },
  skill_group: { subtitle: 'Optional', tags: 'Skills in this group' },
}

function toForm(item: PortfolioItem): FormState {
  return {
    title: item.title,
    subtitle: item.subtitle ?? '',
    period: item.period ?? '',
    location: item.location ?? '',
    description: item.description ?? '',
    highlights: (item.highlights ?? []).join('\n'),
    tags: (item.tags ?? []).join(', '),
    url: item.url ?? '',
    repo_url: item.repo_url ?? '',
    image_url: item.image_url ?? '',
    video_url: item.video_url ?? '',
    featured: item.featured,
    visible: item.visible,
    sort_order: String(item.sort_order),
  }
}

const orNull = (s: string) => (s.trim() ? s.trim() : null)

export const ItemForm: React.FC<ItemFormProps> = ({ item, isNew, onDone }) => {
  const [form, setForm] = useState<FormState>(() => toForm(item))
  const upsert = useUpsertItem()
  const hints = KIND_HINTS[item.kind]

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const sort = Number.parseInt(form.sort_order, 10)
    const payload: PortfolioItem = {
      id: item.id,
      kind: item.kind,
      title: form.title.trim(),
      subtitle: orNull(form.subtitle),
      period: orNull(form.period),
      location: orNull(form.location),
      description: orNull(form.description),
      highlights: form.highlights
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      tags: form.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      url: orNull(form.url),
      repo_url: orNull(form.repo_url),
      image_url: orNull(form.image_url),
      video_url: orNull(form.video_url),
      featured: form.featured,
      visible: form.visible,
      sort_order: Number.isFinite(sort) ? sort : item.sort_order,
    }
    upsert.mutate(payload, { onSuccess: onDone })
  }

  const text = (key: keyof FormState, label: string, opts: { hint?: string; required?: boolean; wide?: boolean; type?: string } = {}) => (
    <Field label={label} hint={opts.hint} className={opts.wide ? 'sm:col-span-2' : undefined}>
      {(id) => (
        <input
          id={id}
          type={opts.type ?? 'text'}
          required={opts.required}
          value={form[key] as string}
          onChange={(e) => set(key, e.target.value as never)}
          className={inputClass}
        />
      )}
    </Field>
  )

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slime-400/20 bg-ink-950/50 p-4 animate-pop-in">
      <div className="grid gap-3 sm:grid-cols-2">
        {text('title', 'Title', { required: true })}
        {text('subtitle', 'Subtitle', { hint: hints.subtitle })}
        {text('period', 'Period', { hint: 'e.g. "2024 — Present"' })}
        {text('location', 'Location')}
        <Field label="Description" className="sm:col-span-2">
          {(id) => (
            <textarea
              id={id}
              rows={3}
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              className={`${inputClass} resize-y`}
            />
          )}
        </Field>
        <Field label="Highlights" hint="One per line." className="sm:col-span-2">
          {(id) => (
            <textarea
              id={id}
              rows={4}
              value={form.highlights}
              onChange={(e) => set('highlights', e.target.value)}
              className={`${inputClass} resize-y`}
            />
          )}
        </Field>
        {text('tags', hints.tags, { hint: 'Comma separated.', wide: true })}
        {text('url', 'Live / website URL')}
        {text('repo_url', 'Repository URL')}
        {text('image_url', 'Image URL', { hint: 'e.g. /media/cover.jpg' })}
        {text('video_url', 'Video URL')}
        {text('sort_order', 'Sort order', { type: 'number', hint: 'Lower comes first.' })}
        <div className="flex items-end gap-5 pb-2">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
            <input
              type="checkbox"
              checked={form.visible}
              onChange={(e) => set('visible', e.target.checked)}
              className="h-4 w-4 accent-[#4fc8ff]"
            />
            Visible
          </label>
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-fg-muted">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => set('featured', e.target.checked)}
              className="h-4 w-4 accent-[#4fc8ff]"
            />
            Featured
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary" disabled={upsert.isPending || !form.title.trim()}>
          {isNew ? 'Add item' : 'Save changes'}
        </button>
        <button type="button" className="btn-ghost" onClick={onDone}>
          Cancel
        </button>
        <SaveStatus mutation={upsert} />
      </div>
    </form>
  )
}
