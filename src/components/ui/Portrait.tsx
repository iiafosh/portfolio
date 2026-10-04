import React, { useState } from 'react'
import { initials } from '@/components/hovercards/profileUtils'

interface PortraitProps {
  src: string | null
  name: string
  /** Rendered diameter in px. */
  size: number
  className?: string
  /** Load eagerly (above the fold). */
  eager?: boolean
}

/**
 * Circular photo in a slime gradient ring with a holographic sweep when an
 * ancestor with `.holo-group` is hovered. The source photo is a circle on a
 * dark square, so it is always masked round and slightly scaled up.
 */
export const Portrait: React.FC<PortraitProps> = ({ src, name, size, className = '', eager = false }) => {
  const [failed, setFailed] = useState(false)

  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center ${className}`} style={{ width: size, height: size }}>
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
            <span role="img" aria-label={name} className="font-hero text-2xl font-black text-accent">
              {initials(name)}
            </span>
          )}
        </span>
      </span>
    </span>
  )
}
