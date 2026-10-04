import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { FileText, Menu, X } from 'lucide-react'
import rimuruSlimeImg from '@/assets/rimuru-slime.png'
import { useItems, useProfile } from '@/lib/content'
import type { SectionKey } from '@/content/types'

interface NavLink {
  /** Element id to scroll to: a home section or the footer's #contact. */
  id: string
  label: string
  /** Ids that light this link up in the scroll-spy. */
  match: string[]
}

/** Compact subset of home sections that exist and have content, plus Contact. */
function useNavLinks(): NavLink[] {
  const { profile } = useProfile()
  const { items } = useItems()
  return useMemo(() => {
    const order = new Set(profile.section_order)
    const visible = items.filter((i) => i.visible)
    const has = (kind: string) => visible.some((i) => i.kind === kind)
    const links: (NavLink & { key: SectionKey })[] = []

    if (order.has('featured') && visible.some((i) => i.kind === 'project' && i.featured)) {
      links.push({ key: 'featured', id: 'featured', label: 'Work', match: ['featured', 'projects'] })
    } else if (order.has('projects') && has('project')) {
      links.push({ key: 'projects', id: 'projects', label: 'Work', match: ['projects'] })
    }
    if (order.has('achievements') && has('achievement')) {
      links.push({ key: 'achievements', id: 'achievements', label: 'Wins', match: ['achievements'] })
    }
    if (order.has('experience') && has('experience')) {
      links.push({ key: 'experience', id: 'experience', label: 'Experience', match: ['experience'] })
    }
    if (order.has('skills') && has('skill_group')) {
      links.push({ key: 'skills', id: 'skills', label: 'Skills', match: ['skills'] })
    }

    // Keep the dock in the same order the page renders, then Contact last.
    const pos = (k: SectionKey) => profile.section_order.indexOf(k)
    const sorted: NavLink[] = links.sort((a, b) => pos(a.key) - pos(b.key))
    sorted.push({ id: 'contact', label: 'Contact', match: ['contact'] })
    return sorted
  }, [profile.section_order, items])
}

/** Id of the section currently crossing the upper-middle of the viewport. */
function useScrollSpy(ids: string[], enabled: boolean): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') {
      setActive(null)
      return
    }
    const visible = new Set<string>()
    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4 && ids.includes('contact')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        if (atBottom()) return setActive('contact')
        // First id in page order inside the detection band. In the gaps between
        // sections nothing is inside it, so keep the previous value.
        const found = ids.find((id) => visible.has(id))
        if (found) setActive(found)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )

    // The footer CTA never reaches the detection band, so light Contact up at the very bottom.
    const onScroll = () => {
      if (atBottom()) setActive('contact')
      else
        setActive((prev) => {
          if (prev !== 'contact') return prev
          return ids.find((id) => visible.has(id)) ?? prev
        })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Sections can mount a tick after the shell; retry briefly until all exist.
    let attempts = 0
    const observed = new Set<string>()
    const attach = () => {
      for (const id of ids) {
        if (observed.has(id)) continue
        const el = document.getElementById(id)
        if (el) {
          observer.observe(el)
          observed.add(id)
        }
      }
      if (observed.size < ids.length && attempts++ < 10) timer = window.setTimeout(attach, 300)
    }
    let timer = window.setTimeout(attach, 0)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled])

  return active
}

export const Dock: React.FC = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const links = useNavLinks()
  const onHome = pathname === '/'
  const { profile } = useProfile()
  // Watch the hero and every home section so sections without a dock link
  // correctly clear the highlight.
  const active = useScrollSpy(['top', ...profile.section_order, 'contact'], onHome)
  const activeLink = onHome && active ? links.find((l) => l.match.includes(active)) ?? null : null

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Sliding pill under the active link.
  const pillsRef = useRef<HTMLDivElement>(null)
  // When nothing is active the pill fades out in place, so it slides from
  // where it was last rather than sweeping in from the left edge.
  const [indicator, setIndicator] = useState<{ x: number; w: number; on: boolean } | null>(null)
  useLayoutEffect(() => {
    const measure = () => {
      const row = pillsRef.current
      const el = activeLink ? row?.querySelector<HTMLElement>(`[data-nav-id="${activeLink.id}"]`) : null
      setIndicator((prev) =>
        el ? { x: el.offsetLeft, w: el.offsetWidth, on: true } : prev ? { ...prev, on: false } : null,
      )
    }
    measure()
    window.addEventListener('resize', measure)
    // Web fonts change link widths once they load.
    document.fonts?.ready.then(measure).catch(() => {})
    return () => window.removeEventListener('resize', measure)
  }, [activeLink])

  // Close the phone menu on route change, outside click and Escape.
  useEffect(() => setMenuOpen(false), [pathname])
  useEffect(() => {
    if (!menuOpen) return
    const onDown = (e: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const scrollTo = (id: string) => {
    // Hash navigation handles the normal case; this covers re-clicking the current hash.
    if (onHome) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const sectionLink = (link: NavLink, variant: 'pill' | 'menu') => {
    const isActive = activeLink?.id === link.id
    const base =
      variant === 'pill'
        ? 'relative z-10 inline-flex h-9 items-center rounded-full px-3 text-[13px] font-medium transition-colors duration-200'
        : 'flex h-11 items-center justify-between rounded-xl px-3 text-sm font-medium transition-colors'
    const state =
      variant === 'pill'
        ? isActive
          ? 'text-slime-100'
          : 'text-fg-muted hover:text-fg'
        : isActive
          ? 'bg-slime-400/10 text-slime-100'
          : 'text-fg-muted hover:bg-white/[0.05] hover:text-fg'
    return (
      <Link
        key={link.id}
        to="/"
        hash={link.id}
        hashScrollIntoView={{ behavior: 'smooth', block: 'start' }}
        onClick={() => {
          scrollTo(link.id)
          setMenuOpen(false)
        }}
        data-nav-id={variant === 'pill' ? link.id : undefined}
        aria-current={isActive ? 'location' : undefined}
        className={`${base} ${state}`}
      >
        {link.label}
        {variant === 'menu' && isActive && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-slime-400" />}
      </Link>
    )
  }

  return (
    <header className="no-print fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4 sm:px-4">
      <div ref={menuRef} className="relative w-full max-w-max">
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 rounded-full border border-white/[0.08] bg-ink-900/65 p-1.5 shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_18px_40px_-16px_rgba(0,0,0,0.9)] ring-1 ring-black/40 backdrop-blur-xl backdrop-saturate-150"
        >
          <Link
            to="/"
            onClick={() => {
              if (onHome) window.scrollTo({ top: 0, behavior: 'smooth' })
              setMenuOpen(false)
            }}
            className="group inline-flex h-9 items-center gap-2 rounded-full pl-1.5 pr-3 transition-colors hover:bg-white/[0.05]"
            aria-label={`${profile.handle}, back to top`}
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slime-400/10 ring-1 ring-slime-400/30 transition-transform duration-300 group-hover:-translate-y-0.5">
              <img src={rimuruSlimeImg} alt="" width={20} height={15} className="h-[15px] w-5 object-contain" />
            </span>
            <span className="font-display text-sm font-semibold tracking-wide text-fg">{profile.handle}</span>
          </Link>

          <span aria-hidden="true" className="mx-0.5 hidden h-5 w-px bg-line-strong sm:block" />
          <div ref={pillsRef} className="relative hidden items-center gap-0.5 sm:flex">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 h-9 rounded-full bg-slime-400/[0.12] ring-1 ring-inset ring-slime-400/30 transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                width: indicator?.w ?? 0,
                transform: `translateX(${indicator?.x ?? 0}px)`,
                opacity: indicator?.on ? 1 : 0,
              }}
            />
            {links.map((l) => sectionLink(l, 'pill'))}
          </div>

          <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-line-strong" />

          <Link
            to="/resume"
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-fg-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
            activeProps={{ className: '!text-slime-100 bg-slime-400/[0.12] ring-1 ring-inset ring-slime-400/30' }}
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Resume
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="dock-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-white/[0.05] hover:text-fg sm:hidden"
          >
            {menuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </nav>

        {menuOpen && (
          <div
            id="dock-menu"
            className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-24px)] origin-top-right animate-pop-in rounded-2xl border border-white/[0.08] bg-ink-900/95 p-1.5 shadow-card backdrop-blur-xl sm:hidden"
          >
            <nav aria-label="Sections" className="flex flex-col">
              {links.map((l) => sectionLink(l, 'menu'))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
