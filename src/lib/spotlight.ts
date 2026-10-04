import type React from 'react'

/**
 * Pointer handler for `.spotlight` cards: writes the cursor position into
 * --mx / --my so the CSS radial glow follows it. Mouse/pen only.
 */
export function trackSpotlight(e: React.PointerEvent<HTMLElement>): void {
  if (e.pointerType === 'touch') return
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`)
  el.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`)
}
