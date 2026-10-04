import React, { useState } from 'react'

interface AvatarProps {
  src: string | null
  name: string
  fallback: string
  className?: string
}

/** Round avatar that falls back to initials when the image is missing or fails. */
export const Avatar: React.FC<AvatarProps> = ({ src, name, fallback, className = 'h-12 w-12 border border-line' }) => {
  const [failed, setFailed] = useState(false)
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface font-display font-bold text-accent ${className}`}
    >
      {src && !failed ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full scale-[1.08] object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-label={name} role="img">
          {fallback}
        </span>
      )}
    </span>
  )
}
