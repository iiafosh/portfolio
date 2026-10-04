import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { FileText, Menu, Shield, X } from 'lucide-react'
import rimuruSlimeImg from '@/assets/rimuru-slime.png'
import { useAuth } from '@/context/AuthContext'
import { useItems, useProfile } from '@/lib/content'
import type { SectionKey } from '@/content/types'

interface NavLink {
  id: SectionKey
  label: string
  /** Sections that light this link up in the scroll-spy. */
  match: SectionKey[]
}

/** Compact subset of home sections that exist and have content. */
function useNavLinks(): NavLink[] {
  const { profile } = useProfile()
  const { items } = useItems()
  return useMemo(() => {
    const order = new Set(profile.section_order)
    const visible = items.filter((i) => i.visible)
    const has = (kind: string) => visible.some((i) => i.kind === kind)
    const links: NavLink[] = []

    if (order.has('featured') && visible.some((i) => i.kind === 'project' && i.featured)) {
      links.push({ id: 'featured', label: 'Work', match: ['featured', 'projects'] })
    } else if (order.has('projects') && has('project')) {
      links.push({ id: 'projects', label: 'Work', match: ['projects'] })
    }
    if (order.has('experience') && has('experience')) {
      links.push({ id: 'experience', label: 'Experience', match: ['experience'] })
    }
    if (order.has('skills') && has('skill_group')) links.push({ id: 'skills', label: 'Skills', match: ['skills'] })
    if (order.has('guestbook')) links.push({ id: 'guestbook', label: 'Guestbook', match: ['guestbook'] })

    // Keep the dock in the same order the page renders.
    const pos = (id: SectionKey) => profile.section_order.indexOf(id)
    return links.sort((a, b) => pos(a.id) - pos(b.id))
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
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        // First id in page order inside the detection band. In the gaps between
        // sections nothing is inside it, so keep the previous value.
        const found = ids.find((id) => visible.has(id))
        if (found) setActive(found)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )

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
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled])

  return active
}

export const Dock: React.FC = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { isOwner } = useAuth()
  const links = useNavLinks()
  const onHome = pathname === '/'
  const { profile } = useProfile()
  // Watch the hero and every home section so sections without a dock link
  // (education, certifications) correctly clear the highlight.
  const active = useScrollSpy(['top', ...profile.section_order], onHome)

  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

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
    const isActive = onHome && active !== null && (link.match as string[]).includes(active)
    const base =
      variant === 'pill'
        ? 'inline-flex h-9 items-center rounded-full px-3 text-[13px] font-medium transition-colors'
        : 'flex h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors'
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
        aria-current={isActive ? 'location' : undefined}
        className={`${base} ${
          isActive ? 'bg-slime-400/10 text-slime-200' : 'text-fg-muted hover:bg-white/[0.05] hover:text-fg'
        }`}
      >
        {link.label}
      </Link>
    )
  }

  return (
    <header className="no-print fixed inset-x-0 top-3 z-50 flex justify-center px-3 sm:top-4 sm:px-4">
      <div ref={menuRef} className="relative w-full max-w-max">
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 rounded-full border border-line bg-ink-900/70 p-1.5 shadow-card backdrop-blur-xl"
        >
          <Link
            to="/"
            onClick={() => {
              if (onHome) window.scrollTo({ top: 0, behavior: 'smooth' })
              setMenuOpen(false)
            }}
            className="inline-flex h-9 items-center gap-2 rounded-full pl-1.5 pr-3 transition-colors hover:bg-white/[0.05]"
            aria-label="afosh, back to top"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slime-400/10 ring-1 ring-slime-400/25">
              <img src={rimuruSlimeImg} alt="" width={20} height={15} className="h-[15px] w-5 object-contain" />
            </span>
            <span className="font-display text-sm font-semibold tracking-wide text-fg">afosh</span>
          </Link>

          {links.length > 0 && (
            <>
              <span aria-hidden="true" className="mx-0.5 hidden h-5 w-px bg-line sm:block" />
              <div className="hidden items-center gap-0.5 sm:flex">{links.map((l) => sectionLink(l, 'pill'))}</div>
            </>
          )}

          <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-line" />

          <Link
            to="/resume"
            className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-fg-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
            activeProps={{ className: '!text-slime-200 bg-slime-400/10' }}
          >
            <FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Resume
          </Link>

          {isOwner && (
            <Link
              to="/admin"
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[13px] font-medium text-fg-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
              activeProps={{ className: '!text-slime-200 bg-slime-400/10' }}
              aria-label="Admin"
            >
              <Shield className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          )}

          {links.length > 0 && (
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
          )}
        </nav>

        {menuOpen && (
          <div
            id="dock-menu"
            className="absolute right-0 top-full mt-2 w-52 max-w-[calc(100vw-24px)] animate-pop-in rounded-2xl border border-line bg-ink-900/95 p-1.5 shadow-card backdrop-blur-xl sm:hidden"
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
