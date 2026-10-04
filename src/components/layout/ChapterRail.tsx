import React, { useEffect, useState } from 'react'
import { useRouterState } from '@tanstack/react-router'
import { useScrollSpy } from '@/lib/scrollspy'

interface Chapter {
  id: string
  label: string
}

/**
 * Slim numbered index on the left edge (>= 1280px, home page only). The
 * chapters are read from the rendered `.numbered-section` elements, so the
 * numbers always match the section numerals (a CSS counter) even when empty
 * sections are skipped or the order changes.
 */
export const ChapterRail: React.FC = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const onHome = pathname === '/'
  const [chapters, setChapters] = useState<Chapter[]>([])

  useEffect(() => {
    if (!onHome) {
      setChapters([])
      return
    }
    const read = () => {
      const found = Array.from(document.querySelectorAll<HTMLElement>('main .numbered-section[id]')).map((el) => ({
        id: el.id,
        label: el.dataset.chapter ?? el.querySelector('h2')?.textContent ?? el.id,
      }))
      setChapters((prev) =>
        prev.length === found.length && prev.every((c, i) => c.id === found[i]!.id && c.label === found[i]!.label)
          ? prev
          : found,
      )
    }
    read()
    const main = document.getElementById('main')
    const mo = new MutationObserver(read)
    if (main) mo.observe(main, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [onHome])

  const active = useScrollSpy(
    chapters.map((c) => c.id),
    onHome && chapters.length > 0,
  )

  if (!onHome || chapters.length === 0) return null

  return (
    <nav
      aria-label="Chapters"
      className="rail no-print fixed left-6 top-1/2 z-20 hidden -translate-y-1/2 min-[1280px]:block"
    >
      <ol className="flex flex-col">
        {chapters.map((c, i) => (
          <li key={c.id}>
            <a href={`#${c.id}`} className="rail-link" aria-current={active === c.id ? 'location' : undefined}>
              <span className="font-mono text-[11px] tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span className="rail-label text-xs font-medium">{c.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
