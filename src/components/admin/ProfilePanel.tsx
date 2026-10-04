import React, { useEffect, useState } from 'react'
import type { Profile } from '@/content/types'
import { useProfile, useUpdateProfile } from '@/lib/content'
import { Field, PanelHeader, SaveStatus, inputClass } from './ui'

type EditableKey = Exclude<keyof Profile, 'section_order'>

const FIELDS: { key: EditableKey; label: string; required?: boolean; type?: string; wide?: boolean; hint?: string }[] = [
  { key: 'name', label: 'Full name', required: true },
  { key: 'short_name', label: 'Short name', required: true },
  { key: 'handle', label: 'Handle', required: true },
  { key: 'location', label: 'Location', required: true },
  { key: 'headline', label: 'Headline', required: true, wide: true },
  { key: 'email', label: 'Email', required: true, type: 'email' },
  { key: 'availability', label: 'Availability' },
  { key: 'github_url', label: 'GitHub URL', required: true, type: 'url' },
  { key: 'linkedin_url', label: 'LinkedIn URL', required: true, type: 'url' },
  { key: 'anghami_url', label: 'Anghami URL', type: 'url' },
  { key: 'avatar_url', label: 'Avatar URL', hint: 'Absolute URL or a path under /public.' },
]

type FormState = Record<EditableKey, string>

function toForm(p: Profile): FormState {
  const out = {} as FormState
  for (const { key } of FIELDS) out[key] = p[key] ?? ''
  out.bio = p.bio ?? ''
  return out
}

export const ProfilePanel: React.FC = () => {
  const { profile } = useProfile()
  const update = useUpdateProfile()
  const initial = toForm(profile)
  const initialKey = JSON.stringify(initial)
  const [form, setForm] = useState<FormState>(initial)

  useEffect(() => {
    setForm(JSON.parse(initialKey) as FormState)
  }, [initialKey])

  const dirty = JSON.stringify(form) !== initialKey
  const set = (key: EditableKey, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const patch: Partial<Profile> = {}
    const nullable: EditableKey[] = ['availability', 'anghami_url', 'avatar_url']
    for (const key of Object.keys(form) as EditableKey[]) {
      const v = form[key].trim()
      ;(patch as Record<string, string | null>)[key] = nullable.includes(key) && !v ? null : v
    }
    update.mutate(patch)
  }

  return (
    <form className="card p-5" onSubmit={onSubmit}>
      <PanelHeader title="Profile" description="Name, headline, bio and links shown in the hero and footer." />

      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map(({ key, label, required, type, wide, hint }) => (
          <Field key={key} label={label} hint={hint} className={wide ? 'sm:col-span-2' : undefined}>
            {(id) => (
              <input
                id={id}
                type={type ?? 'text'}
                required={required}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                className={inputClass}
              />
            )}
          </Field>
        ))}
        <Field label="Bio" className="sm:col-span-2">
          {(id) => (
            <textarea
              id={id}
              required
              rows={5}
              value={form.bio}
              onChange={(e) => set('bio', e.target.value)}
              className={`${inputClass} resize-y leading-relaxed`}
            />
          )}
        </Field>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button type="submit" className="btn-primary" disabled={!dirty || update.isPending}>
          Save profile
        </button>
        {dirty && (
          <button type="button" className="btn-ghost" onClick={() => setForm(initial)}>
            Discard
          </button>
        )}
        <SaveStatus mutation={update} />
      </div>
    </form>
  )
}
