import React from 'react'

/** Small green pulsing dot for "current" / "ongoing" states. */
export const LiveDot: React.FC<{ className?: string }> = ({ className = '' }) => (
  <span className={`relative inline-flex h-2 w-2 shrink-0 ${className}`} aria-hidden="true">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
  </span>
)
