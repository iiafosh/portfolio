import React, { useState } from 'react'
import { initials } from './utils'

interface AvatarProps {
  src: string | null | undefined
  name: string | null | undefined
  size?: 'sm' | 'md'
}

/** Round avatar with an initials fallback when the image is missing or fails. */
export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md' }) => {
  const [failed, setFailed] = useState(false)
  const dims = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-10 w-10 text-xs'

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${dims} shrink-0 rounded-full border border-line bg-ink-800 object-cover`}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={`${dims} inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-ink-800 font-mono font-semibold text-slime-300`}
    >
      {initials(name)}
    </span>
  )
}
