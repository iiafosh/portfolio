import { ITEMS, PROFILE } from '@/content/data'
import type { ItemKind } from '@/content/types'

// Static content accessors. The site has no backend: everything comes from
// src/content/data.ts and ships with the bundle.

export function useProfile() {
  return { profile: PROFILE }
}

export function useItems() {
  return { items: ITEMS }
}

/** Visible items of one kind, in display order. */
export function useItemsOfKind(kind: ItemKind) {
  const items = ITEMS.filter((i) => i.kind === kind && i.visible).sort((a, b) => a.sort_order - b.sort_order)
  return { items }
}
