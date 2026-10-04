import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { FALLBACK_ITEMS, FALLBACK_PROFILE } from '@/content/fallback'
import type { GuestbookEntry, ItemKind, PortfolioItem, Profile } from '@/content/types'

// Data access for portfolio content. Every read falls back to the local copy in
// src/content/fallback.ts so the site still renders if Supabase is down or the
// tables from supabase/portfolio.sql have not been created yet.

export const contentKeys = {
  profile: ['portfolio', 'profile'] as const,
  items: ['portfolio', 'items'] as const,
  guestbook: ['portfolio', 'guestbook'] as const,
  views: ['portfolio', 'views'] as const,
}

export type ContentSource = 'supabase' | 'fallback'

async function fetchProfile(): Promise<{ profile: Profile; source: ContentSource }> {
  if (!isSupabaseConfigured) return { profile: FALLBACK_PROFILE, source: 'fallback' }
  const { data, error } = await supabase.from('portfolio_profile').select('*').eq('id', 1).maybeSingle()
  if (error || !data) return { profile: FALLBACK_PROFILE, source: 'fallback' }
  return { profile: { ...FALLBACK_PROFILE, ...data } as Profile, source: 'supabase' }
}

async function fetchItems(): Promise<{ items: PortfolioItem[]; source: ContentSource }> {
  if (!isSupabaseConfigured) return { items: FALLBACK_ITEMS, source: 'fallback' }
  const { data, error } = await supabase.from('portfolio_items').select('*').order('sort_order', { ascending: true })
  if (error || !data || data.length === 0) return { items: FALLBACK_ITEMS, source: 'fallback' }
  return { items: data as PortfolioItem[], source: 'supabase' }
}

export function useProfile() {
  const query = useQuery({
    queryKey: contentKeys.profile,
    queryFn: fetchProfile,
    placeholderData: { profile: FALLBACK_PROFILE, source: 'fallback' },
  })
  return { ...query, profile: query.data?.profile ?? FALLBACK_PROFILE, source: query.data?.source ?? 'fallback' }
}

export function useItems() {
  const query = useQuery({
    queryKey: contentKeys.items,
    queryFn: fetchItems,
    placeholderData: { items: FALLBACK_ITEMS, source: 'fallback' },
  })
  return { ...query, items: query.data?.items ?? FALLBACK_ITEMS, source: query.data?.source ?? 'fallback' }
}

/** Visible items of one kind, in display order. */
export function useItemsOfKind(kind: ItemKind) {
  const { items, ...rest } = useItems()
  const filtered = items
    .filter((i) => i.kind === kind && i.visible)
    .sort((a, b) => a.sort_order - b.sort_order)
  return { ...rest, items: filtered }
}

// ---------- Owner editing (RLS enforces is_portfolio_owner() server-side) ----

export function useUpdateProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (patch: Partial<Profile>) => {
      const { error } = await supabase.from('portfolio_profile').update(patch).eq('id', 1)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.profile }),
  })
}

export function useUpsertItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (item: Partial<PortfolioItem> & { kind: ItemKind; title: string }) => {
      const { error } = await supabase.from('portfolio_items').upsert(item)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.items }),
  })
}

export function useDeleteItem() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('portfolio_items').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.items }),
  })
}

/** Saves a new order: ids[i] gets sort_order (i + 1) * 10. Optimistic. */
export function useReorderItems() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const results = await Promise.all(
        ids.map((id, i) => supabase.from('portfolio_items').update({ sort_order: (i + 1) * 10 }).eq('id', id)),
      )
      const failed = results.find((r) => r.error)
      if (failed?.error) throw failed.error
    },
    onMutate: async (ids) => {
      await qc.cancelQueries({ queryKey: contentKeys.items })
      const prev = qc.getQueryData<{ items: PortfolioItem[]; source: ContentSource }>(contentKeys.items)
      if (prev) {
        const order = new Map(ids.map((id, i) => [id, (i + 1) * 10]))
        qc.setQueryData(contentKeys.items, {
          ...prev,
          items: prev.items.map((it) => (order.has(it.id) ? { ...it, sort_order: order.get(it.id)! } : it)),
        })
      }
      return { prev }
    },
    onError: (_e, _ids, ctx) => {
      if (ctx?.prev) qc.setQueryData(contentKeys.items, ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: contentKeys.items }),
  })
}

// ---------- Guestbook --------------------------------------------------------

export function useGuestbook() {
  return useQuery({
    queryKey: contentKeys.guestbook,
    enabled: isSupabaseConfigured,
    queryFn: async (): Promise<GuestbookEntry[]> => {
      const { data, error } = await supabase
        .from('guestbook')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)
      if (error) throw error
      return data as GuestbookEntry[]
    },
  })
}

export function useSignGuestbook() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (message: string) => {
      const { error } = await supabase.from('guestbook').insert({ message })
      if (error) throw error
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: contentKeys.guestbook }),
  })
}

export function useDeleteGuestbookEntry() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('guestbook').delete().eq('id', id)
      if (error) throw error
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: contentKeys.guestbook })
      const prev = qc.getQueryData<GuestbookEntry[]>(contentKeys.guestbook)
      if (prev) qc.setQueryData(contentKeys.guestbook, prev.filter((e) => e.id !== id))
      return { prev }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(contentKeys.guestbook, ctx.prev)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: contentKeys.guestbook }),
  })
}

/**
 * Keeps the guestbook query live: refetches when any row is inserted or deleted
 * (Supabase Realtime, public.guestbook is in the supabase_realtime publication).
 */
export function useGuestbookRealtime(enabled = true) {
  const qc = useQueryClient()
  useEffect(() => {
    if (!enabled || !isSupabaseConfigured) return
    const refresh = () => qc.invalidateQueries({ queryKey: contentKeys.guestbook })
    const channel = supabase
      .channel(`guestbook-live-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'guestbook' }, refresh)
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'guestbook' }, refresh)
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [enabled, qc])
}

// ---------- Visit counter ----------------------------------------------------

/** Increments the visit counter once per browser session and returns the total. */
export function useViewCount() {
  return useQuery({
    queryKey: contentKeys.views,
    enabled: isSupabaseConfigured,
    staleTime: Infinity,
    queryFn: async (): Promise<number | null> => {
      let counted = false
      try {
        counted = sessionStorage.getItem('pf_viewed') === '1'
      } catch {
        // storage blocked: count anyway
      }
      if (!counted) {
        const { data, error } = await supabase.rpc('bump_views')
        if (error) return null
        try {
          sessionStorage.setItem('pf_viewed', '1')
        } catch {
          // ignore
        }
        return Number(data)
      }
      const { data, error } = await supabase.from('site_stats').select('value').eq('key', 'views').maybeSingle()
      if (error || !data) return null
      return Number(data.value)
    },
  })
}
