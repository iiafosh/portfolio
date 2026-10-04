import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowUpRight, X } from 'lucide-react'
import rimuruSlimeImg from '@/assets/rimuru-slime.png'
import { useItems, useProfile } from '@/lib/content'
import { buildShowcaseItems, type ShowcaseItem } from './showcase'

// Rimuru, the desktop-pet mascot. It idles, hops around the viewport, visits
// the cursor now and then, can be dragged, and every minute pops a speech
// bubble that points at something real on the site.
//
// Animation runs in one requestAnimationFrame loop writing transforms straight
// to the DOM, so React never re-renders per frame.

const FIRST_BUBBLE_MS = 12_000
const BUBBLE_EVERY_MS = 60_000
const BUBBLE_EVERY_MOBILE_MS = 90_000
const BUBBLE_VISIBLE_MS = 9_000
const BUBBLE_LINGER_AFTER_HOVER_MS = 3_000

const SIZE_DESKTOP = 72
const SIZE_MOBILE = 52
const ASPECT = 181 / 246 // sprite height / width
const MIN_Y = 90 // never cover the dock
const EDGE = 8

const HOP_PERIOD = 0.62 // seconds per hop
const HOP_HEIGHT = 16
const HOP_SPEED = 150 // px per second while airborne

const BUBBLE_MAX_W = 256
const BUBBLE_GUTTER = 12

type Mode = 'idle' | 'hop' | 'drag'

interface Placement {
  above: boolean
  /** Bubble left edge, relative to the slime's left edge. */
  left: number
  /** Tail x, relative to the bubble's left edge. */
  tail: number
  width: number
}

const rand = (min: number, max: number) => min + Math.random() * (max - min)
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

export const SlimeMascot: React.FC = () => {
  const { profile } = useProfile()
  const { items } = useItems()
  const showcase = useMemo(() => buildShowcaseItems(profile, items), [profile, items])

  const isMobile = useMediaQuery('(max-width: 639px)')
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const size = isMobile ? SIZE_MOBILE : SIZE_DESKTOP

  const rootRef = useRef<HTMLDivElement>(null)
  const spriteRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)

  // Mutable simulation state, read by the rAF loop.
  const sim = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0,
    mode: 'idle' as Mode,
    hopT: 0,
    facingRight: false,
    nextActionAt: 0,
    time: 0,
    dragDX: 0,
    dragDY: 0,
    mouseX: -1,
    mouseY: -1,
    mouseAt: 0,
    placed: false,
  })
  const cfg = useRef({ size, isMobile, reducedMotion, speaking: false })
  cfg.current.size = size
  cfg.current.isMobile = isMobile
  cfg.current.reducedMotion = reducedMotion

  const [active, setActive] = useState<ShowcaseItem | null>(null)
  const [placement, setPlacement] = useState<Placement>({ above: true, left: 0, tail: 0, width: BUBBLE_MAX_W })
  cfg.current.speaking = active !== null

  // ---- geometry helpers ----------------------------------------------------

  const bounds = useCallback(() => {
    const s = cfg.current.size
    const h = s * ASPECT
    const vw = window.innerWidth
    const vh = window.innerHeight
    return {
      minX: EDGE,
      maxX: Math.max(EDGE, vw - s - EDGE),
      minY: Math.min(MIN_Y, Math.max(0, vh - h - EDGE)),
      maxY: Math.max(MIN_Y, vh - h - EDGE),
    }
  }, [])

  const cornerSpot = useCallback(() => {
    const b = bounds()
    return { x: b.maxX - 8, y: b.maxY - 8 }
  }, [bounds])

  const applyTransform = useCallback((lift = 0, sx = 1, sy = 1) => {
    const s = sim.current
    if (rootRef.current) rootRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`
    if (spriteRef.current) {
      const flip = s.facingRight ? -1 : 1
      spriteRef.current.style.transform = `translate3d(0, ${-lift}px, 0) scale(${flip * sx}, ${sy})`
    }
    if (shadowRef.current) {
      const k = 1 - Math.min(1, lift / HOP_HEIGHT) * 0.35
      shadowRef.current.style.transform = `translateX(-50%) scale(${k})`
      shadowRef.current.style.opacity = String(0.4 + 0.6 * k)
    }
  }, [])

  const computePlacement = useCallback(() => {
    const s = sim.current
    const vw = window.innerWidth
    const width = Math.min(BUBBLE_MAX_W, vw - BUBBLE_GUTTER * 2)
    const centerX = s.x + cfg.current.size / 2
    const absLeft = clamp(centerX - width / 2, BUBBLE_GUTTER, vw - width - BUBBLE_GUTTER)
    const next: Placement = {
      // Below the slime when there isn't room above it (bubble is up to ~190px tall).
      above: s.y > MIN_Y + 200,
      left: Math.round(absLeft - s.x),
      tail: Math.round(clamp(centerX - absLeft, 18, width - 18)),
      width,
    }
    setPlacement((prev) =>
      prev.above === next.above && prev.left === next.left && prev.tail === next.tail && prev.width === next.width
        ? prev
        : next,
    )
  }, [])

  const pickWanderTarget = useCallback(() => {
    const s = sim.current
    const b = bounds()
    const { isMobile: mobile, size: sz } = cfg.current
    const now = performance.now()
    if (!mobile && s.mouseX >= 0 && now - s.mouseAt < 6000 && Math.random() < 0.3) {
      // Curiosity visit: land a little way off the cursor, never on it.
      const angle = rand(0, Math.PI * 2)
      const dist = rand(90, 130)
      s.tx = clamp(s.mouseX + Math.cos(angle) * dist - sz / 2, b.minX, b.maxX)
      s.ty = clamp(s.mouseY + Math.sin(angle) * dist - sz / 2, b.minY, b.maxY)
    } else if (mobile) {
      // Phones: stay in the bottom-right area, out of the reading column.
      const vw = window.innerWidth
      const vh = window.innerHeight
      s.tx = clamp(rand(vw * 0.55, b.maxX), b.minX, b.maxX)
      s.ty = clamp(rand(vh * 0.62, b.maxY), b.minY, b.maxY)
    } else {
      s.tx = rand(b.minX, b.maxX)
      s.ty = rand(Math.max(b.minY, 140), b.maxY)
    }
    s.facingRight = s.tx > s.x
  }, [bounds])

  // ---- initial placement + resize ------------------------------------------

  useEffect(() => {
    const s = sim.current
    if (!s.placed) {
      const c = cornerSpot()
      s.x = s.tx = c.x
      s.y = s.ty = c.y
      s.placed = true
      s.nextActionAt = performance.now() + 4000
    }
    applyTransform()

    const onResize = () => {
      const b = bounds()
      s.x = clamp(s.x, b.minX, b.maxX)
      s.y = clamp(s.y, b.minY, b.maxY)
      s.tx = clamp(s.tx, b.minX, b.maxX)
      s.ty = clamp(s.ty, b.minY, b.maxY)
      applyTransform()
      if (cfg.current.speaking) computePlacement()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [applyTransform, bounds, computePlacement, cornerSpot])

  // Size changes (crossing the phone breakpoint) need a re-clamp too.
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [size])

  // Reduced motion: sit in the corner and stay put.
  useEffect(() => {
    if (!reducedMotion) return
    const s = sim.current
    const c = cornerSpot()
    s.x = s.tx = c.x
    s.y = s.ty = c.y
    s.mode = 'idle'
    applyTransform()
  }, [reducedMotion, cornerSpot, applyTransform])

  // ---- cursor tracking for curiosity visits --------------------------------

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      const s = sim.current
      s.mouseX = e.clientX
      s.mouseY = e.clientY
      s.mouseAt = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  // ---- animation loop ------------------------------------------------------

  useEffect(() => {
    if (reducedMotion) return
    let raf = 0
    let last = performance.now()

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000) // clamp after tab switches
      last = now
      const s = sim.current
      s.time += dt

      if (s.mode === 'drag') {
        // Pointer handlers own the transform while dragging.
      } else if (s.mode === 'hop') {
        s.hopT += dt / HOP_PERIOD
        if (s.hopT >= 1) {
          s.hopT -= 1
          if (Math.hypot(s.tx - s.x, s.ty - s.y) < 3) {
            s.mode = 'idle'
            s.hopT = 0
            s.nextActionAt = now + rand(2500, 6000)
          }
        }
        const t = s.hopT
        let lift = 0
        let sx = 1
        let sy = 1
        if (s.mode === 'hop') {
          if (t < 0.18) {
            // Anticipation: squash before take-off.
            const k = Math.sin((t / 0.18) * Math.PI)
            sx = 1 + 0.14 * k
            sy = 1 - 0.16 * k
          } else if (t < 0.82) {
            // Airborne: stretched at take-off/landing, round at the apex.
            const k = (t - 0.18) / 0.64
            lift = Math.sin(k * Math.PI) * HOP_HEIGHT
            const stretch = Math.abs(Math.cos(k * Math.PI))
            sx = 1 - 0.08 * stretch
            sy = 1 + 0.12 * stretch
            const dx = s.tx - s.x
            const dy = s.ty - s.y
            const dist = Math.hypot(dx, dy)
            if (dist > 0.5) {
              const step = Math.min(dist, HOP_SPEED * dt)
              s.x += (dx / dist) * step
              s.y += (dy / dist) * step
            }
          } else {
            // Landing squash.
            const k = Math.sin(((t - 0.82) / 0.18) * Math.PI)
            sx = 1 + 0.16 * k
            sy = 1 - 0.18 * k
          }
        }
        applyTransform(lift, sx, sy)
      } else {
        // Idle: gentle breathing, then decide what to do next.
        const b = Math.sin(s.time * 2.4)
        applyTransform(0, 1 - 0.025 * b, 1 + 0.035 * b)
        if (now >= s.nextActionAt) {
          if (cfg.current.speaking) {
            s.nextActionAt = now + 1500 // stay still while talking
          } else {
            pickWanderTarget()
            s.mode = 'hop'
            s.hopT = 0
          }
        }
      }
      raf = requestAnimationFrame(frame)
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [reducedMotion, applyTransform, pickWanderTarget])

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

  const armHide = useCallback(
    (ms: number) => {
      window.clearTimeout(hideTimer.current)
      hideTimer.current = window.setTimeout(() => {
        if (!hoveringRef.current) setActive(null)
      }, ms)
    },
    [],
  )

  const showNext = useCallback(() => {
    if (document.hidden) return
    if (queueRef.current.length === 0) queueRef.current = shuffle(showcaseRef.current)
    const next = queueRef.current.shift()
    if (!next) return
    const s = sim.current
    // Stop wandering so the bubble stays anchored while it's open.
    if (s.mode === 'hop') {
      s.tx = s.x
      s.ty = s.y
    }
    computePlacement()
    setActive(next)
    armHide(BUBBLE_VISIBLE_MS)
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

  // ---- dragging (mouse + touch via pointer events) -------------------------

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const s = sim.current
    s.mode = 'drag'
    s.dragDX = e.clientX - s.x
    s.dragDY = e.clientY - s.y
    e.currentTarget.setPointerCapture(e.pointerId)
    applyTransform(0, 1.12, 0.9)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = sim.current
    if (s.mode !== 'drag') return
    const b = bounds()
    const nx = clamp(e.clientX - s.dragDX, b.minX, b.maxX)
    const ny = clamp(e.clientY - s.dragDY, b.minY, b.maxY)
    if (Math.abs(nx - s.x) > 0.5) s.facingRight = nx > s.x
    s.x = nx
    s.y = ny
    // Jelly wobble while carried.
    applyTransform(0, 0.92, 1.1)
    if (cfg.current.speaking) computePlacement()
  }

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const s = sim.current
    if (s.mode !== 'drag') return
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    s.mode = 'idle'
    s.tx = s.x
    s.ty = s.y
    s.nextActionAt = performance.now() + rand(4000, 7000)
    applyTransform()
    if (cfg.current.speaking) computePlacement()
  }

  // ---- render --------------------------------------------------------------

  const spriteH = Math.round(size * ASPECT)

  return (
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
            className="pointer-events-auto absolute animate-pop-in rounded-2xl border border-slime-400/25 bg-ink-850/95 p-3.5 pr-3 shadow-card backdrop-blur-md"
            style={{
              width: placement.width,
              left: placement.left,
              ...(placement.above ? { bottom: spriteH + 14 } : { top: spriteH + 14 }),
            }}
          >
            <span
              aria-hidden="true"
              className={`absolute h-3 w-3 rotate-45 border-slime-400/25 bg-ink-850 ${
                placement.above ? '-bottom-1.5 border-b border-r' : '-top-1.5 border-l border-t'
              }`}
              style={{ left: placement.tail - 6 }}
            />
            <div className="flex items-start justify-between gap-2">
              <p className="font-pixel text-[10px] uppercase tracking-[0.16em] text-slime-300">{active.category}</p>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss message"
                className="-mr-1 -mt-1.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-fg-faint transition-colors hover:bg-white/[0.06] hover:text-fg"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <p className="-mt-1 font-display text-sm font-semibold leading-snug text-fg">{active.title}</p>
            {active.description && (
              <p className="mt-1 text-xs leading-relaxed text-fg-muted">{active.description}</p>
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
        className="pointer-events-auto relative h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
        title="Drag me"
      >
        <div
          ref={shadowRef}
          aria-hidden="true"
          className="absolute -bottom-1 left-1/2 h-2 w-3/4 rounded-full bg-black/50 blur-[3px]"
          style={{ transform: 'translateX(-50%)' }}
        />
        <div ref={spriteRef} aria-hidden="true" className="relative h-full w-full origin-bottom will-change-transform">
          <img
            src={rimuruSlimeImg}
            alt=""
            width={size}
            height={spriteH}
            draggable={false}
            className="pointer-events-none h-full w-full select-none object-contain drop-shadow-[0_6px_14px_rgba(79,200,255,0.35)]"
          />
        </div>
      </div>
    </div>
  )
}

const linkClass =
  'mt-2.5 inline-flex items-center gap-1 font-mono text-xs font-medium text-slime-300 transition-colors hover:text-slime-100'

const BubbleLink: React.FC<{ link: NonNullable<ShowcaseItem['link']>; onNavigate: () => void }> = ({
  link,
  onNavigate,
}) => {
  if (link.type === 'external') {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} className={linkClass}>
        {link.label}
        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    )
  }
  if (link.type === 'route') {
    return (
      <Link to={link.to} onClick={onNavigate} className={linkClass}>
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
    >
      {link.label} →
    </Link>
  )
}
