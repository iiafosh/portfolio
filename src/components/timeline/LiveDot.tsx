import React from 'react'

/** Small green dot with a soft halo for "current" / "ongoing" states. */
export const LiveDot: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span
    className={`inline-flex h-2 w-2 shrink-0 rounded-full bg-ok shadow-[0_0_0_3px_rgb(var(--ok)/0.18)] ${className}`}
    aria-hidden="true"
  />
)
