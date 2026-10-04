import React, { useId } from 'react'

interface SlimeDropProps {
  /** Colours: hex values, or CSS vars like 'var(--slime-mid)' to follow the active skin. */
  hi?: string
  mid?: string
  deep?: string
  line?: string
  /** Draw the two little eyes. */
  eyes?: boolean
  className?: string
}

/**
 * A tiny Rimuru-style slime drop. Used as the logo mark and in the skin
 * picker swatches. Decorative: always aria-hidden.
 */
export const SlimeDrop: React.FC<SlimeDropProps> = ({
  hi = 'var(--slime-hi)',
  mid = 'var(--slime-mid)',
  deep = 'var(--slime-deep)',
  line = 'var(--slime-line)',
  eyes = false,
  className = 'h-5 w-5',
}) => {
  const gid = `drop-${useId().replace(/:/g, '')}`
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <radialGradient id={gid} cx="38%" cy="34%" r="75%">
          <stop offset="0" style={{ stopColor: hi }} />
          <stop offset="0.45" style={{ stopColor: mid }} />
          <stop offset="1" style={{ stopColor: deep }} />
        </radialGradient>
      </defs>
      <path
        d="M12 2.6c-1.4 2.9-5.2 5.6-7.3 9.1C2.4 15.6 4.6 21 12 21s9.6-5.4 7.3-9.3C17.2 8.2 13.4 5.5 12 2.6Z"
        fill={`url(#${gid})`}
      />
      <ellipse cx="8.6" cy="11.4" rx="1.5" ry="0.9" transform="rotate(-35 8.6 11.4)" style={{ fill: hi }} opacity="0.85" />
      {eyes && (
        <>
          <ellipse cx="9.6" cy="15" rx="0.95" ry="1.35" style={{ fill: line }} />
          <ellipse cx="14.4" cy="15" rx="0.95" ry="1.35" style={{ fill: line }} />
        </>
      )}
    </svg>
  )
}
