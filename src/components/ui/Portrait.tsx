import React, { useState } from 'react'
import { initials } from '@/components/hovercards/profileUtils'

interface PortraitProps {
  src: string | null
  name: string
  /** Rendered diameter in px. */
  size: number
  /** Adds the slow dashed HUD ring around the frame. */
  orbit?: boolean
  className?: string
  /** Load eagerly (above the fold). */
  eager?: boolean
}

/**
 * Circular photo in a slime gradient ring with a holographic sweep when an
 * ancestor with `.holo-group` is hovered. The source photo is a circle on a
 * dark square, so it is always masked round and slightly scaled up.
 */
export const Portrait: React.FC<PortraitProps> = ({ src, name, size, orbit = false, className = '', eager = false }) => {
  const [failed, setFailed] = useState(false)
  const ring = size + 22

  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`} style={{ width: orbit ? ring : size, height: orbit ? ring : size }}>
      {orbit && (
        <svg aria-hidden="true" viewBox="0 0 100 100" className="orbit pointer-events-none absolute inset-0 h-full w-full">
          <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(79,200,255,0.35)" strokeWidth="0.6" strokeDasharray="1.5 3.5" />
          <circle cx="50" cy="50" r="49" fill="none" stroke="rgba(134,220,255,0.9)" strokeWidth="1" strokeDasharray="14 140" strokeLinecap="round" />
        </svg>
      )}
      <span className="holo-frame block" style={{ width: size, height: size }}>
        <span className="holo-frame__inner flex h-full w-full items-center justify-center">
          {src && !failed ? (
            <img
              src={src}
              alt={name}
              width={size}
              height={size}
              className="h-full w-full object-cover"
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
              onError={() => setFailed(true)}
            />
          ) : (
            <span role="img" aria-label={name} className="font-hero text-2xl font-black text-slime-200">
              {initials(name)}
            </span>
          )}
        </span>
      </span>
    </span>
  )
}
