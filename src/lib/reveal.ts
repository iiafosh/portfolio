import { useEffect } from 'react'
import type React from 'react'

/**
 * Scroll reveal for every `.reveal` element on the page.
 *
 * Content is visible by default: the hidden start state in index.css only
 * applies once this hook adds `reveal-on` to <html>, which it skips when the
 * visitor prefers reduced motion or IntersectionObserver is missing. A
 * MutationObserver picks up elements added later (route changes, HMR).
 */
export function useScrollReveal(): void {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const root = document.documentElement
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          // A data attribute, not a class: React rewrites className on re-render.
          ;(entry.target as HTMLElement).dataset.revealed = ''
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )

    const scan = () => {
      document.querySelectorAll<HTMLElement>('.reveal:not([data-revealed]):not([data-reveal-watched])').forEach((el) => {
        el.dataset.revealWatched = ''
        io.observe(el)
      })
    }

    scan()
    root.classList.add('reveal-on')

    const mo = new MutationObserver(() => scan())
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      mo.disconnect()
      io.disconnect()
      root.classList.remove('reveal-on')
      document.querySelectorAll<HTMLElement>('[data-reveal-watched]').forEach((el) => {
        delete el.dataset.revealWatched
        delete el.dataset.revealed
      })
    }
  }, [])
}

/** Inline style for staggered children: `style={revealDelay(i)}`. */
export function revealDelay(index: number, step = 70): React.CSSProperties {
  return { ['--reveal-delay' as string]: `${Math.min(index, 6) * step}ms` }
}
