import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, X } from 'lucide-react'
import { useItems, useProfile } from '@/lib/content'
import { buildShowcaseItems, type ShowcaseItem } from './showcase'
import { SlimeSprite } from './SlimeSprite'
import { SlimeEngine, TOP_SAFE } from './engine'
import { SPRITE_ASPECT, getFaceRig } from './rig'
import { COLOR_FADE, SLIME_GLOW, SLIME_HI, SLIME_MID, SLIME_TINT, alpha, mix } from './skin'

// Rimuru, the desktop-pet mascot. A little SVG slime with a behaviour state
// machine (see engine.ts): it hops around, does zoomies, chases the cursor,
// peeks from the screen edge, naps when you go quiet, and can be picked up and
// flung. Every minute it hops, shouts "!" and pops a speech bubble that points
// at something real on the site.

const FIRST_BUBBLE_MS = 12_000
const BUBBLE_EVERY_MS = 60_000
const BUBBLE_EVERY_MOBILE_MS = 90_000
const BUBBLE_VISIBLE_MS = 9_000
const BUBBLE_LINGER_AFTER_HOVER_MS = 3_000

const SIZE_DESKTOP = 44
const SIZE_MOBILE = 36

const BUBBLE_MAX_W = 256
const BUBBLE_GUTTER = 12
const BUBBLE_GAP = 10
/** Room the bubble needs above the slime (it is up to ~190px tall). */
const BUBBLE_ROOM = 210

const DROP_COUNT = 6
const Z_COUNT = 3

interface Placement {
  above: boolean
  /** Bubble left edge, relative to the slime's left edge. */
  left: number
  /** Tail x, relative to the bubble's left edge. */
  tail: number
  width: number
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' && typeof window.matchMedia === 'function' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    onChange()
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Every slime-colored bit reads the skin's --slime-* variables (skin.ts).
const ORB_STYLE: React.CSSProperties = {
  opacity: 0,
  background: `radial-gradient(circle, #ffffff 0%, ${SLIME_TINT} 38%, ${alpha(SLIME_MID, 65)} 68%, ${alpha(SLIME_MID, 0)} 100%)`,
  boxShadow: `0 0 10px 3px ${alpha(SLIME_MID, 55)}`,
}
const Z_STYLE: React.CSSProperties = { opacity: 0, color: SLIME_TINT }
const DROP_STYLE: React.CSSProperties = {
  opacity: 0,
  width: 4,
  height: 4,
  background: SLIME_TINT,
  boxShadow: `0 0 6px ${alpha(SLIME_MID, 80)}`,
}
const GLOW_STYLE: React.CSSProperties = {
  opacity: 0,
  backgroundColor: alpha(SLIME_MID, 50),
  transition: `background-color ${COLOR_FADE}`,
}
const BANG_STYLE: React.CSSProperties = {
  opacity: 0,
  color: SLIME_TINT,
  textShadow: `0 0 8px ${alpha(SLIME_MID, 90)}`,
}
const SPRITE_STYLE: React.CSSProperties = {
  filter: `drop-shadow(0 3px 8px ${SLIME_GLOW})`,
  transition: `filter ${COLOR_FADE}`,
}
const BODY_STYLE: React.CSSProperties = { transformOrigin: '50% 100%' }
const SHADOW_STYLE: React.CSSProperties = { transform: 'translateX(-50%)' }

// Speech bubble: neutral dark surface (Catppuccin-like site palette) with a
// skin-colored accent border and eyebrow.
const BUBBLE_BORDER = alpha(SLIME_MID, 35)
const BUBBLE_ACCENT = mix(SLIME_MID, 55, SLIME_HI)
const BUBBLE_STYLE: React.CSSProperties = {
  borderColor: BUBBLE_BORDER,
  transition: `border-color ${COLOR_FADE}`,
}
const TAIL_STYLE: React.CSSProperties = { borderColor: BUBBLE_BORDER, transition: `border-color ${COLOR_FADE}` }
const ACCENT_STYLE: React.CSSProperties = { color: BUBBLE_ACCENT, transition: `color ${COLOR_FADE}` }

export const SlimeMascot: React.FC = () => {
  const { profile } = useProfile()
  const { items } = useItems()
  const showcase = useMemo(() => buildShowcaseItems(profile, items), [profile, items])

  const isMobile = useMediaQuery('(max-width: 639px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const size = isMobile ? SIZE_MOBILE : SIZE_DESKTOP
  const spriteH = Math.round(size * SPRITE_ASPECT)

  const rootRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const bangRef = useRef<HTMLSpanElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const fxRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<SlimeEngine | null>(null)

  const cfg = useRef({ size, isMobile, reducedMotion })
  cfg.current = { size, isMobile, reducedMotion }

  const [active, setActive] = useState<ShowcaseItem | null>(null)
  const [placement, setPlacement] = useState<Placement>({ above: true, left: 0, tail: 0, width: BUBBLE_MAX_W })
  const speakingRef = useRef(false)
  speakingRef.current = active !== null

  // ---- bubble placement ----------------------------------------------------

  const computePlacement = useCallback(() => {
    const eng = engineRef.current
    if (!eng) return
    const vw = document.documentElement.clientWidth || window.innerWidth
    const width = Math.min(BUBBLE_MAX_W, vw - BUBBLE_GUTTER * 2)
    const centerX = eng.x + cfg.current.size / 2
    const absLeft = clamp(centerX - width / 2, BUBBLE_GUTTER, vw - width - BUBBLE_GUTTER)
    const next: Placement = {
      // Flip below the slime when there isn't room above it.
      above: eng.y > TOP_SAFE + BUBBLE_ROOM,
      left: Math.round(absLeft - eng.x),
      tail: Math.round(clamp(centerX - absLeft, 16, width - 16)),
      width,
    }
    setPlacement((prev) =>
      prev.above === next.above && prev.left === next.left && prev.tail === next.tail && prev.width === next.width
        ? prev
        : next,
    )
  }, [])

  // The engine reports movement every frame; re-place the bubble at most every
  // ~90ms (with a trailing update) and only while it is open.
  const placeTimer = useRef(0)
  const onMove = useCallback(() => {
    if (!speakingRef.current || placeTimer.current) return
    placeTimer.current = window.setTimeout(() => {
      placeTimer.current = 0
      computePlacement()
    }, 90)
  }, [computePlacement])
  const onMoveRef = useRef(onMove)
  onMoveRef.current = onMove

  // ---- engine lifecycle ----------------------------------------------------

  useEffect(() => {
    const root = rootRef.current
    const body = bodyRef.current
    const shadow = shadowRef.current
    const glow = glowRef.current
    const bang = bangRef.current
    const svg = svgRef.current
    const fx = fxRef.current
    if (!root || !body || !shadow || !glow || !bang || !svg || !fx) return
    const orb = fx.querySelector<HTMLElement>('[data-fx="orb"]')
    if (!orb) return

    const engine = new SlimeEngine(
      {
        root,
        body,
        shadow,
        glow,
        bang,
        face: getFaceRig(svg),
        drops: Array.from(fx.querySelectorAll<HTMLElement>('[data-fx="drop"]')),
        zs: Array.from(fx.querySelectorAll<HTMLElement>('[data-fx="z"]')),
        orb,
      },
      { size: cfg.current.size, mobile: cfg.current.isMobile, reduced: cfg.current.reducedMotion },
      () => onMoveRef.current(),
    )
    engineRef.current = engine
    engine.run()
    return () => {
      engine.destroy()
      engineRef.current = null
      window.clearTimeout(placeTimer.current)
      placeTimer.current = 0
    }
  }, [])

  useEffect(() => {
    engineRef.current?.setConfig({ size, mobile: isMobile, reduced: reducedMotion })
    if (speakingRef.current) computePlacement()
  }, [size, isMobile, reducedMotion, computePlacement])

  useEffect(() => {
    engineRef.current?.setSpeaking(active !== null)
  }, [active])

  // ---- speech bubble scheduling --------------------------------------------

  const queueRef = useRef<ShowcaseItem[]>([])
  const showcaseRef = useRef(showcase)
  useEffect(() => {
    showcaseRef.current = showcase
    queueRef.current = []
  }, [showcase])

  const hideTimer = useRef<number | undefined>(undefined)
  const hoveringRef = useRef(false)

  const dismiss = useCallback(() => {
    window.clearTimeout(hideTimer.current)
    hoveringRef.current = false
    setActive(null)
  }, [])

  const armHide = useCallback((ms: number) => {
    window.clearTimeout(hideTimer.current)
    hideTimer.current = window.setTimeout(() => {
      if (!hoveringRef.current) setActive(null)
    }, ms)
  }, [])

  const showNext = useCallback(() => {
    if (document.hidden) return
    if (queueRef.current.length === 0) queueRef.current = shuffle(showcaseRef.current)
    const next = queueRef.current.shift()
    if (!next) return
    const reveal = () => {
      computePlacement()
      setActive(next)
      armHide(BUBBLE_VISIBLE_MS)
    }
    // The slime hops and shouts "!" first, then the bubble appears.
    const engine = engineRef.current
    if (engine) engine.announce(reveal)
    else reveal()
  }, [armHide, computePlacement])

  useEffect(() => {
    let timer: number
    const loop = () => {
      showNext()
      timer = window.setTimeout(loop, cfg.current.isMobile ? BUBBLE_EVERY_MOBILE_MS : BUBBLE_EVERY_MS)
    }
    timer = window.setTimeout(loop, FIRST_BUBBLE_MS)
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(hideTimer.current)
    }
  }, [showNext])

  const onBubbleEnter = () => {
    hoveringRef.current = true
    window.clearTimeout(hideTimer.current)
  }
  const onBubbleLeave = () => {
    hoveringRef.current = false
    armHide(BUBBLE_LINGER_AFTER_HOVER_MS)
  }

  // ---- pointer: hover, drag and fling (mouse + touch) ----------------------

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    engineRef.current?.pointerDown(e.clientX, e.clientY)
  }
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    engineRef.current?.pointerMove(e.clientX, e.clientY)
  }
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    engineRef.current?.pointerUp(e.type === 'pointercancel')
  }
  const onPointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') engineRef.current?.hover(true)
  }
  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse') engineRef.current?.hover(false)
  }

  // ---- render --------------------------------------------------------------

  return (
    <>
      {/* Particles (droplets, z's, the snack orb) in viewport coordinates. */}
      <div ref={fxRef} aria-hidden="true" className="no-print pointer-events-none fixed left-0 top-0 z-40 h-0 w-0">
        {Array.from({ length: DROP_COUNT }, (_, i) => (
          <span
            key={`d${i}`}
            data-fx="drop"
            className="absolute left-0 top-0 rounded-full will-change-transform"
            style={DROP_STYLE}
          />
        ))}
        {Array.from({ length: Z_COUNT }, (_, i) => (
          <span
            key={`z${i}`}
            data-fx="z"
            className="absolute left-0 top-0 font-pixel text-[10px] leading-none will-change-transform"
            style={Z_STYLE}
          >
            z
          </span>
        ))}
        <span data-fx="orb" className="absolute left-0 top-0 h-2.5 w-2.5 rounded-full will-change-transform" style={ORB_STYLE} />
      </div>

      <div
        ref={rootRef}
        className="no-print pointer-events-none fixed left-0 top-0 z-40 will-change-transform"
        style={{ width: size, height: spriteH }}
      >
        <div role="status" aria-live="polite" aria-atomic="true">
          {active && (
            <div
              onMouseEnter={onBubbleEnter}
              onMouseLeave={onBubbleLeave}
              onFocus={onBubbleEnter}
              onBlur={onBubbleLeave}
              className="pointer-events-auto absolute animate-pop-in rounded-2xl border bg-[#1e1e2e]/95 p-3.5 pr-3 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_18px_48px_-24px_rgba(0,0,0,0.8)] backdrop-blur-md"
              style={{
                ...BUBBLE_STYLE,
                width: placement.width,
                left: placement.left,
                ...(placement.above ? { bottom: spriteH + BUBBLE_GAP } : { top: spriteH + BUBBLE_GAP }),
              }}
            >
              <span
                aria-hidden="true"
                className={`absolute h-3 w-3 rotate-45 bg-[#1e1e2e] ${
                  placement.above ? '-bottom-1.5 border-b border-r' : '-top-1.5 border-l border-t'
                }`}
                style={{ ...TAIL_STYLE, left: placement.tail - 6 }}
              />
              <div className="flex items-start justify-between gap-2">
                <p className="font-pixel text-[10px] uppercase tracking-[0.16em]" style={ACCENT_STYLE}>
                  {active.category}
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  aria-label="Dismiss message"
                  className="-mr-1 -mt-1.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-faint transition-colors hover:bg-white/[0.06] hover:text-text"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              <p className="-mt-1 font-display text-sm font-semibold leading-snug text-[#cdd6f4]">{active.title}</p>
              {active.description && (
                <p className="mt-1 text-xs leading-relaxed text-[#a6adc8]">{active.description}</p>
              )}
              {active.link && <BubbleLink link={active.link} onNavigate={dismiss} />}
            </div>
          )}
        </div>

        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          aria-hidden="true"
          className="pointer-events-auto relative h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
        >
          <div
            ref={shadowRef}
            className="pointer-events-none absolute -bottom-0.5 left-1/2 h-1.5 w-3/4 rounded-full bg-black/50 blur-[2px]"
            style={SHADOW_STYLE}
          />
          <div ref={bodyRef} className="pointer-events-none relative h-full w-full will-change-transform" style={BODY_STYLE}>
            <div
              ref={glowRef}
              className="absolute inset-[-20%] rounded-full blur-md"
              style={GLOW_STYLE}
            />
            <SlimeSprite ref={svgRef} className="relative h-full w-full overflow-visible" style={SPRITE_STYLE} />
          </div>
          <span
            ref={bangRef}
            className="pointer-events-none absolute bottom-full left-1/2 font-hero text-base font-black leading-none"
            style={BANG_STYLE}
          >
            !
          </span>
        </div>
      </div>
    </>
  )
}

// Skin accent, brightening toward the skin's highlight on hover / focus.
const linkClass =
  'mt-2.5 inline-flex items-center gap-1 font-mono text-xs font-medium text-[color:var(--bubble-link)] transition-colors hover:text-[color:var(--bubble-link-hover)]'
const LINK_STYLE = {
  '--bubble-link': BUBBLE_ACCENT,
  '--bubble-link-hover': mix(SLIME_HI, 75, '#ffffff'),
} as React.CSSProperties

const BubbleLink: React.FC<{ link: NonNullable<ShowcaseItem['link']>; onNavigate: () => void }> = ({
  link,
  onNavigate,
}) => {
  if (link.type === 'external') {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onNavigate}
        className={linkClass}
        style={LINK_STYLE}
      >
        {link.label}
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    )
  }
  if (link.type === 'route') {
    return (
      <Link to={link.to} onClick={onNavigate} className={linkClass} style={LINK_STYLE}>
        {link.label} →
      </Link>
    )
  }
  return (
    <Link
      to="/"
      hash={link.id}
      hashScrollIntoView={{ behavior: 'smooth', block: 'start' }}
      onClick={() => {
        onNavigate()
        // Same-hash clicks don't navigate, so scroll explicitly as well.
        if (window.location.pathname === '/') {
          document.getElementById(link.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }}
      className={linkClass}
      style={LINK_STYLE}
    >
      {link.label} →
    </Link>
  )
}
