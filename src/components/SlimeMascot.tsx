import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { X, Sparkles, ExternalLink } from 'lucide-react'
import rimuruSlimeImg from '@/assets/rimuru-slime.png'
import { ALL_SHOWCASE_ITEMS, ShowcaseItem } from '@/data/slimeShowcaseItems'

type MascotState = 'idle' | 'hopping' | 'visiting_cursor' | 'dragged'

const SHOWCASE_INTERVAL_MS = 60 * 1000 // Shows every 60 seconds
const INITIAL_SHOWCASE_DELAY_MS = 10 * 1000 // 10s initial delay on page load
const SHOWCASE_DURATION_MS = 10 * 1000 // Stays visible for 10 seconds

export const SlimeMascot: React.FC = () => {
  // Position state on screen
  const posRef = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? Math.max(100, window.innerWidth - 180) : 300,
    y: typeof window !== 'undefined' ? Math.max(150, window.innerHeight - 200) : 300,
  })

  // Target roaming destination
  const targetRef = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? Math.max(100, window.innerWidth - 180) : 300,
    y: typeof window !== 'undefined' ? Math.max(150, window.innerHeight - 200) : 300,
  })

  // Cursor position tracking for curiosity visits
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 300, y: 300 })
  const lastMouseMoveTime = useRef<number>(Date.now())

  // Visual state
  const [facingRight, setFacingRight] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // 60-Second Showcase state
  const [activeShowcase, setActiveShowcase] = useState<ShowcaseItem | null>(null)
  const [bubbleVisible, setBubbleVisible] = useState(false)
  const [isNearTop, setIsNearTop] = useState(false)
  const [isNearRight, setIsNearRight] = useState(false)
  const [isNearLeft, setIsNearLeft] = useState(false)

  const mascotRef = useRef<HTMLDivElement>(null)
  const spriteRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<MascotState>('idle')
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const nextActionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Showcase timers & interaction refs
  const showcaseTimerRef = useRef<NodeJS.Timeout | null>(null)
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isHoveringBubbleRef = useRef(false)
  const lastShowcaseIndexRef = useRef<number>(-1)

  // Track cursor position without gluing the mascot to it
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      lastMouseMoveTime.current = Date.now()
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Showcase trigger function: picks a random feature from the site
  const triggerShowcase = useCallback(() => {
    if (ALL_SHOWCASE_ITEMS.length === 0) return

    let nextIndex = Math.floor(Math.random() * ALL_SHOWCASE_ITEMS.length)
    if (ALL_SHOWCASE_ITEMS.length > 1 && nextIndex === lastShowcaseIndexRef.current) {
      nextIndex = (nextIndex + 1) % ALL_SHOWCASE_ITEMS.length
    }
    lastShowcaseIndexRef.current = nextIndex

    const chosen = ALL_SHOWCASE_ITEMS[nextIndex]
    setActiveShowcase(chosen)

    // Compute boundary constraints
    const y = posRef.current.y
    const x = posRef.current.x
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200

    setIsNearTop(y < 190)
    setIsNearRight(x > w - 280)
    setIsNearLeft(x < 140)

    setBubbleVisible(true)

    // Auto-hide after SHOWCASE_DURATION_MS unless user is hovering
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (!isHoveringBubbleRef.current) {
        setBubbleVisible(false)
        setTimeout(() => setActiveShowcase(null), 350)
      }
    }, SHOWCASE_DURATION_MS)
  }, [])

  // Dismiss showcase manually
  const handleDismissBubble = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setBubbleVisible(false)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    setTimeout(() => setActiveShowcase(null), 300)
  }, [])

  // Hover handlers for the bubble card
  const handleBubbleMouseEnter = () => {
    isHoveringBubbleRef.current = true
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
  }

  const handleBubbleMouseLeave = () => {
    isHoveringBubbleRef.current = false
    // Delay hide by 2.5s after leaving
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      setBubbleVisible(false)
      setTimeout(() => setActiveShowcase(null), 350)
    }, 2500)
  }

  // Periodic 60-second showcase timer loop
  useEffect(() => {
    // Initial early showcase after 10s so user can experience it quickly
    const initialTimer = setTimeout(() => {
      triggerShowcase()
    }, INITIAL_SHOWCASE_DELAY_MS)

    // Then recurring every 60 seconds
    const intervalTimer = setInterval(() => {
      triggerShowcase()
    }, SHOWCASE_INTERVAL_MS)

    showcaseTimerRef.current = intervalTimer

    return () => {
      clearTimeout(initialTimer)
      clearInterval(intervalTimer)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [triggerShowcase])

  // Autonomous decision maker (roaming like desktop mascot)
  const scheduleNextAction = useCallback(() => {
    if (nextActionTimeoutRef.current) clearTimeout(nextActionTimeoutRef.current)
    if (stateRef.current === 'dragged') return

    // Decide what to do after an idle pause
    const idleDuration = Math.random() * 3000 + 2000

    nextActionTimeoutRef.current = setTimeout(() => {
      if (stateRef.current === 'dragged') return

      const roll = Math.random()
      const w = window.innerWidth
      const h = window.innerHeight

      // 30% chance to curiously wander over near cursor
      if (roll < 0.3 && Date.now() - lastMouseMoveTime.current < 8000) {
        stateRef.current = 'visiting_cursor'
        // Target a position ~80px away from the cursor
        const angle = Math.random() * Math.PI * 2
        const dist = 75 + Math.random() * 40
        targetRef.current = {
          x: Math.max(50, Math.min(w - 120, mousePosRef.current.x + Math.cos(angle) * dist)),
          y: Math.max(80, Math.min(h - 100, mousePosRef.current.y + Math.sin(angle) * dist)),
        }
      } else {
        // Wandering to a random location on screen
        stateRef.current = 'hopping'
        targetRef.current = {
          x: Math.max(60, Math.min(w - 130, Math.random() * (w - 180) + 90)),
          y: Math.max(90, Math.min(h - 110, Math.random() * (h - 220) + 110)),
        }
      }

      setFacingRight(targetRef.current.x > posRef.current.x)
    }, idleDuration)
  }, [])

  // Mascot physics & animation loop (60fps requestAnimationFrame)
  useEffect(() => {
    let animId: number
    let hopPhase = 0
    let time = 0

    const updateLoop = () => {
      time += 0.04

      if (stateRef.current !== 'dragged') {
        const dx = targetRef.current.x - posRef.current.x
        const dy = targetRef.current.y - posRef.current.y
        const dist = Math.hypot(dx, dy)

        if (dist > 8 && (stateRef.current === 'hopping' || stateRef.current === 'visiting_cursor')) {
          // Hop motion physics: advances in rhythmic gentle bounces
          hopPhase += 0.14
          const hopHeight = Math.max(0, Math.sin(hopPhase)) * 18
          const hopSpeed = 3.2

          posRef.current.x += (dx / dist) * hopSpeed
          posRef.current.y += (dy / dist) * hopSpeed

          // Squash & stretch on hop applied to sprite only
          const bounceScaleY = 1 + Math.sin(hopPhase) * 0.22
          const bounceScaleX = 1 - Math.sin(hopPhase) * 0.15
          const flip = facingRight ? -1 : 1

          if (mascotRef.current) {
            mascotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y - hopHeight}px, 0)`
          }
          if (spriteRef.current) {
            spriteRef.current.style.transform = `scale(${flip * bounceScaleX}, ${bounceScaleY})`
          }
        } else {
          // Reached destination -> switch to idle
          if (stateRef.current !== 'idle') {
            stateRef.current = 'idle'
            hopPhase = 0
            scheduleNextAction()
          }

          // Gentle idle breathing
          const breatheY = 1 + Math.sin(time * 2.5) * 0.04
          const breatheX = 1 - Math.sin(time * 2.5) * 0.03
          const flip = facingRight ? -1 : 1

          if (mascotRef.current) {
            mascotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`
          }
          if (spriteRef.current) {
            spriteRef.current.style.transform = `scale(${flip * breatheX}, ${breatheY})`
          }
        }
      }

      animId = requestAnimationFrame(updateLoop)
    }

    animId = requestAnimationFrame(updateLoop)
    scheduleNextAction()

    return () => {
      cancelAnimationFrame(animId)
      if (nextActionTimeoutRef.current) clearTimeout(nextActionTimeoutRef.current)
    }
  }, [facingRight, scheduleNextAction])

  // Mouse Dragging (pick up Rimuru and place him anywhere)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    setIsDragging(true)
    stateRef.current = 'dragged'
    dragOffsetRef.current = {
      x: e.clientX - posRef.current.x,
      y: e.clientY - posRef.current.y,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    posRef.current.x = Math.max(30, Math.min(window.innerWidth - 90, e.clientX - dragOffsetRef.current.x))
    posRef.current.y = Math.max(60, Math.min(window.innerHeight - 80, e.clientY - dragOffsetRef.current.y))

    if (mascotRef.current) {
      mascotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`
    }
    if (spriteRef.current) {
      // Elastic jelly stretch when dragged
      spriteRef.current.style.transform = `scale(1.15, 0.85)`
    }
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
    stateRef.current = 'idle'
    targetRef.current = { ...posRef.current }
    scheduleNextAction()
  }

  return (
    <div
      ref={mascotRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="fixed top-0 left-0 z-[9990] select-none cursor-grab active:cursor-grabbing will-change-transform"
      style={{ touchAction: 'none' }}
    >
      {/* 60-Second Showcase Speech Bubble Card */}
      {activeShowcase && (
        <div
          onMouseEnter={handleBubbleMouseEnter}
          onMouseLeave={handleBubbleMouseLeave}
          onPointerDown={(e) => e.stopPropagation()} // Don't drag slime when clicking inside bubble
          className={`absolute z-[9995] w-64 p-3.5 rounded-2xl bg-[#090d16]/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_12px_36px_rgba(0,0,0,0.8),0_0_24px_rgba(6,182,212,0.25)] text-left transition-all duration-300 pointer-events-auto select-text cursor-default ${
            isNearTop ? 'top-full mt-3' : 'bottom-full mb-3'
          } ${
            isNearRight ? 'right-0' : isNearLeft ? 'left-0' : 'left-1/2 -translate-x-1/2'
          } ${
            bubbleVisible
              ? 'opacity-100 scale-100 translate-y-0'
              : 'opacity-0 scale-90 pointer-events-none'
          }`}
        >
          {/* Tail Pointer */}
          <div
            className={`absolute w-3 h-3 bg-[#090d16] border-cyan-500/40 transform rotate-45 ${
              isNearTop ? '-top-1.5 border-t border-l' : '-bottom-1.5 border-b border-r'
            } ${
              isNearRight ? 'right-8' : isNearLeft ? 'left-8' : 'left-1/2 -translate-x-1/2'
            }`}
          />

          {/* Header Badge & Close Button */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse shrink-0" />
              <span className="text-[10px] font-mono text-cyan-300 tracking-wider font-semibold uppercase">
                {activeShowcase.category}
              </span>
            </div>
            <button
              type="button"
              onClick={handleDismissBubble}
              title="Dismiss"
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Pill Tag */}
          <div className="mb-1">
            <span className="inline-block text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-200 border border-cyan-500/30">
              {activeShowcase.badge}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-['Chakra_Petch',sans-serif] font-bold text-xs text-white tracking-wide mb-1 leading-snug">
            {activeShowcase.title}
          </h4>

          {/* Description */}
          <p className="font-mono text-[11px] text-zinc-300 leading-relaxed mb-2.5">
            {activeShowcase.description}
          </p>

          {/* Direct Navigation / Action Link */}
          {activeShowcase.linkUrl && (
            <div className="pt-0.5 border-t border-white/5">
              {activeShowcase.isExternal ? (
                <a
                  href={activeShowcase.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleDismissBubble()}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-cyan-300 hover:text-cyan-100 hover:underline decoration-cyan-400 underline-offset-2 transition-colors pt-1"
                >
                  <span>{activeShowcase.linkText || 'Visit Link →'}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <Link
                  to={activeShowcase.linkUrl}
                  onClick={() => handleDismissBubble()}
                  className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-cyan-300 hover:text-cyan-100 hover:underline decoration-cyan-400 underline-offset-2 transition-colors pt-1"
                >
                  <span>{activeShowcase.linkText || 'Explore →'}</span>
                </Link>
              )}
            </div>
          )}
        </div>
      )}

      {/* Rimuru Slime Sprite (with its own flip & squash transform) */}
      <div ref={spriteRef} className="relative will-change-transform">
        <img
          src={rimuruSlimeImg}
          alt="Rimuru Slime Mascot"
          className="w-[68px] sm:w-[76px] h-auto object-contain drop-shadow-[0_8px_18px_rgba(6,182,212,0.45)] pointer-events-none select-none transition-transform"
          draggable={false}
          width="76"
          height="56"
        />

        {/* Subtle ground shadow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 rounded-full bg-cyan-950/50 blur-[2px] -z-10" />
      </div>
    </div>
  )
}
