import { useEffect, useState } from 'react'

/**
 * Id of the element currently crossing the upper-middle of the viewport.
 * At the very bottom of the page the last id wins (short final sections
 * never reach the detection band). Elements can mount a tick after the
 * caller, so missing ids are retried briefly.
 */
export function useScrollSpy(ids: string[], enabled = true): string | null {
  const [active, setActive] = useState<string | null>(null)
  const key = ids.join('|')

  useEffect(() => {
    if (!enabled || ids.length === 0 || typeof IntersectionObserver === 'undefined') {
      setActive(null)
      return
    }
    const last = ids[ids.length - 1]!
    const visible = new Set<string>()
    const atBottom = () => window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4

    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id)
          else visible.delete(e.target.id)
        }
        if (atBottom()) return setActive(last)
        // In the gaps between sections nothing is inside the band: keep the previous value.
        const found = ids.find((id) => visible.has(id))
        if (found) setActive(found)
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )

    const onScroll = () => {
      if (atBottom()) setActive(last)
      else if (window.scrollY < 120) setActive(null)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    let attempts = 0
    const observed = new Set<string>()
    let timer = 0
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
    timer = window.setTimeout(attach, 0)

    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled])

  return active
}
