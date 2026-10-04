"use client"

import { animate, useInView, useReducedMotion } from "motion/react"
import { useEffect, useRef } from "react"

import { EASE_OUT } from "@/lib/ease"

/**
 * Counts up to `value` the first time it scrolls into view (beUI's
 * animated-number idea). Writes straight to the DOM — no re-render per frame —
 * and the real value is in the markup for no-JS and screen readers.
 */
export function NumberTicker({
  value,
  decimals,
  duration = 1.1,
  delay = 0,
  className,
}: {
  value: number
  decimals?: number
  duration?: number
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduce = useReducedMotion()
  const places = decimals ?? (Number.isInteger(value) ? 0 : 1)
  const format = (n: number) => n.toFixed(places)

  useEffect(() => {
    const el = ref.current
    if (!el || !inView || reduce) return
    const controls = animate(0, value, {
      duration,
      delay,
      ease: EASE_OUT,
      onUpdate: (latest) => {
        el.textContent = format(latest)
      },
    })
    return () => controls.stop()
    // format depends only on `places`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value, duration, delay, places])

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  )
}
