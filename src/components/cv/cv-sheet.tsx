"use client"

import { useLayoutEffect, useRef, type ReactNode } from "react"

/**
 * Keeps the A4 sheet whole on narrow screens: CSS zoom scales layout too,
 * so the page below never leaves a gap. Print resets the zoom.
 */
export function CvSheet({ children }: { children: ReactNode }) {
  const outer = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = outer.current
    const sheet = inner.current
    if (!el || !sheet) return
    const fit = () => {
      sheet.style.zoom = "1"
      const natural = sheet.scrollWidth
      const available = el.clientWidth
      const scale = Math.min(1, available / natural)
      sheet.style.zoom = String(scale)
    }
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={outer} className="w-full">
      <div ref={inner} className="cv-fit mx-auto w-fit">
        {children}
      </div>
    </div>
  )
}

export function PrintButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.print()}>
      {children}
    </button>
  )
}
