import { useEffect, useState } from 'react'

// "Slime skins": the site's colour themes. The colours themselves live in
// src/index.css (html[data-skin="..."]); this file only knows the names, the
// swatches for the picker, and how to switch / persist the choice.
// index.html applies the stored skin before first paint (keep STORAGE_KEY and
// the skin ids in sync with the inline script there).

export type SkinId = 'rimuru' | 'sakura' | 'lime' | 'ember' | 'void'

export interface Skin {
  id: SkinId
  label: string
  /** Slime body colours for drawing the swatch (mirrors --slime-* in index.css). */
  hi: string
  mid: string
  deep: string
  line: string
}

export const SKINS: Skin[] = [
  { id: 'rimuru', label: 'Rimuru', hi: '#e8f8ff', mid: '#8fd3f4', deep: '#4a9fd6', line: '#1e3a5f' },
  { id: 'sakura', label: 'Sakura', hi: '#fff0fa', mid: '#f5b8de', deep: '#d77fb5', line: '#5a2147' },
  { id: 'lime', label: 'Lime', hi: '#f0fde9', mid: '#a6e3a1', deep: '#5fb36a', line: '#1f4a2a' },
  { id: 'ember', label: 'Ember', hi: '#fff1e6', mid: '#fbb88c', deep: '#e07a45', line: '#5c2a12' },
  { id: 'void', label: 'Void', hi: '#f5edff', mid: '#c4a2f5', deep: '#8a5fd6', line: '#33205c' },
]

export const DEFAULT_SKIN: SkinId = 'rimuru'
export const STORAGE_KEY = 'afosh-skin'
export const SKIN_EVENT = 'skinchange'

const isSkin = (value: unknown): value is SkinId => SKINS.some((s) => s.id === value)

export function getSkin(): SkinId {
  if (typeof document === 'undefined') return DEFAULT_SKIN
  const current = document.documentElement.dataset.skin
  return isSkin(current) ? current : DEFAULT_SKIN
}

/** Applies a skin, remembers it and tells listeners (window 'skinchange', detail = id). */
export function setSkin(id: SkinId): void {
  document.documentElement.dataset.skin = id
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // Private mode or blocked storage: the skin still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent<SkinId>(SKIN_EVENT, { detail: id }))
}

/** Current skin, kept in sync across every picker on the page. */
export function useSkin(): [SkinId, (id: SkinId) => void] {
  const [skin, setLocal] = useState<SkinId>(getSkin)
  useEffect(() => {
    const onChange = (e: Event) => {
      const id = (e as CustomEvent<unknown>).detail
      if (isSkin(id)) setLocal(id)
    }
    window.addEventListener(SKIN_EVENT, onChange)
    return () => window.removeEventListener(SKIN_EVENT, onChange)
  }, [])
  return [skin, setSkin]
}
