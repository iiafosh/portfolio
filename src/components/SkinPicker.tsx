import React, { useRef } from 'react'
import { SKINS, useSkin, type SkinId } from '@/lib/skin'
import { SlimeDrop } from '@/components/ui/SlimeDrop'

interface SkinPickerProps {
  /** 'compact' for the header row, 'large' for the footer bento. */
  variant?: 'compact' | 'large'
  className?: string
}

/**
 * Slime skin picker: a radio group of slime drops. Arrow keys move the
 * selection (and focus), Home / End jump to the ends. Every picker on the
 * page stays in sync through the 'skinchange' event.
 */
export const SkinPicker: React.FC<SkinPickerProps> = ({ variant = 'compact', className = '' }) => {
  const [skin, setSkin] = useSkin()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const large = variant === 'large'

  const select = (index: number) => {
    const next = SKINS[(index + SKINS.length) % SKINS.length]!
    setSkin(next.id)
    refs.current[SKINS.indexOf(next)]?.focus()
  }

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: SKINS.length - 1,
    }
    if (e.key in moves) {
      e.preventDefault()
      select(moves[e.key]!)
    }
  }

  const option = (id: SkinId, index: number) => {
    const s = SKINS[index]!
    const checked = skin === id
    return (
      <button
        key={id}
        ref={(el) => {
          refs.current[index] = el
        }}
        type="button"
        role="radio"
        aria-checked={checked}
        aria-label={`${s.label} skin`}
        title={large ? undefined : s.label}
        tabIndex={checked ? 0 : -1}
        onClick={() => setSkin(id)}
        onKeyDown={(e) => onKeyDown(e, index)}
        className={
          large
            ? `group flex min-h-[4.25rem] min-w-11 flex-col items-center justify-center gap-1 rounded-xl border px-1 py-2 transition-colors ${
                checked ? 'border-accent/50 bg-accent/[0.08]' : 'border-transparent hover:border-line-strong hover:bg-text/[0.04]'
              }`
            : `group relative flex h-11 w-11 items-center justify-center rounded-lg transition-colors ${
                checked ? '' : 'hover:bg-text/[0.05]'
              }`
        }
      >
        <SlimeDrop
          hi={s.hi}
          mid={s.mid}
          deep={s.deep}
          line={s.line}
          eyes={large}
          className={`transition-transform duration-200 ease-out group-hover:scale-x-110 group-hover:scale-y-90 ${
            large ? 'h-9 w-9 origin-bottom' : 'h-5 w-5 origin-bottom'
          } ${checked && !large ? 'drop-shadow-[0_0_6px_var(--slime-glow)]' : ''}`}
        />
        {large ? (
          <span className={`text-[11px] font-medium ${checked ? 'text-text' : 'text-muted'}`}>{s.label}</span>
        ) : (
          checked && <span aria-hidden="true" className="absolute bottom-1.5 h-[2px] w-3 rounded-full bg-accent" />
        )}
      </button>
    )
  }

  return (
    <div
      role="radiogroup"
      aria-label="Slime skin (site colours)"
      className={large ? `grid grid-cols-5 gap-1 ${className}` : `flex items-center ${className}`}
    >
      {!large && (
        <span aria-hidden="true" className="mr-1 font-mono text-[11px] text-faint">
          skin
        </span>
      )}
      {SKINS.map((s, i) => option(s.id, i))}
    </div>
  )
}
