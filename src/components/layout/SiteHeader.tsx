import React, { useEffect, useMemo, useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { FileText, Menu, X } from 'lucide-react'
import { useItems, useProfile } from '@/lib/content'
import { SkinPicker } from '@/components/SkinPicker'
import { SlimeDrop } from '@/components/ui/SlimeDrop'
import { scrollBehavior } from '@/lib/motion'
import type { SectionKey } from '@/content/types'

export interface NavLink {
  /** Element id to scroll to: a home section or the footer's #contact. */
  id: string
  label: string
}

/** Home sections that exist and have content, in page order, plus Contact. */
export function useNavLinks(): NavLink[] {
  const { profile } = useProfile()
  const { items } = useItems()
  return useMemo(() => {
    const order = profile.section_order
    const visible = items.filter((i) => i.visible)
    const has = (kind: string) => visible.some((i) => i.kind === kind)
    const links: (NavLink & { key: SectionKey })[] = []

    if (order.includes('featured') && visible.some((i) => i.kind === 'project' && i.featured)) {
      links.push({ key: 'featured', id: 'featured', label: 'Work' })
    } else if (order.includes('projects') && has('project')) {
      links.push({ key: 'projects', id: 'projects', label: 'Work' })
    }
    if (order.includes('achievements') && has('achievement')) {
      links.push({ key: 'achievements', id: 'achievements', label: 'Wins' })
    }
    if (order.includes('experience') && (has('experience') || has('education'))) {
      links.push({ key: 'experience', id: 'experience', label: 'Experience' })
    }
    if (order.includes('skills') && has('skill_group')) {
      links.push({ key: 'skills', id: 'skills', label: 'Skills' })
    }

    const sorted: NavLink[] = links.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key))
    sorted.push({ id: 'contact', label: 'Contact' })
    return sorted
  }, [profile.section_order, items])
}

/**
 * In-flow site header (scrolls away with the page): logo left; text links,
 * skin picker and Resume right. Below lg the links and the picker move into
 * a menu panel that opens in the page flow.
 */
export const SiteHeader: React.FC = () => {
  const { profile } = useProfile()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const onHome = pathname === '/'
  const links = useNavLinks()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const sectionLink = (link: NavLink, variant: 'bar' | 'menu') => (
    <Link
      key={link.id}
      to="/"
      hash={link.id}
      hashScrollIntoView={{ behavior: scrollBehavior(), block: 'start' }}
      onClick={() => {
        // Hash navigation handles the normal case; this covers re-clicking the current hash.
        if (onHome) document.getElementById(link.id)?.scrollIntoView({ block: 'start' })
        setOpen(false)
      }}
      className={
        variant === 'bar'
          ? 'inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm text-muted transition-colors hover:text-text'
          : 'flex min-h-11 items-center rounded-xl px-3 text-[15px] text-text transition-colors hover:bg-text/[0.05]'
      }
    >
      {link.label}
    </Link>
  )

  return (
    <header className="no-print relative z-20 mx-auto w-full max-w-content px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
      <div className="flex min-h-12 items-center justify-between gap-3">
        <Link
          to="/"
          onClick={() => {
            if (onHome) window.scrollTo({ top: 0 })
          }}
          className="group -ml-1.5 inline-flex min-h-11 items-center gap-2 rounded-lg px-1.5"
          aria-label={`${profile.handle}, home`}
        >
          <SlimeDrop className="h-6 w-6 origin-bottom transition-transform duration-200 group-hover:scale-x-110 group-hover:scale-y-90" />
          <span className="font-display text-lg font-semibold tracking-wide text-text">{profile.handle}</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <nav aria-label="Primary" className="hidden items-center lg:flex">
            {links.map((l) => sectionLink(l, 'bar'))}
          </nav>
          <span aria-hidden="true" className="mx-1.5 hidden h-5 w-px bg-line-strong lg:block" />
          <SkinPicker className="mr-1 hidden lg:flex" />
          <Link
            to="/resume"
            className="btn-ghost px-3.5"
            activeProps={{ className: 'border-accent/50 text-accent' }}
          >
            <FileText className="h-4 w-4" aria-hidden="true" />
            Resume
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="icon-btn lg:hidden"
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="site-menu" className="card mt-3 p-2 lg:hidden">
          <nav aria-label="Sections" className="grid gap-0.5 sm:grid-cols-2">
            {links.map((l) => sectionLink(l, 'menu'))}
          </nav>
          <div className="mt-2 border-t border-line px-1 pt-3">
            <p className="label mb-2 px-2">Slime skin</p>
            <SkinPicker variant="large" />
          </div>
        </div>
      )}
    </header>
  )
}
