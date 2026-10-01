import React, { useEffect, useRef, useState, useCallback } from 'react'
import { triggerSlimeBloop } from '@/utils/slimeEasterEgg'
import rimuruSlimeImg from '@/assets/rimuru-slime.png'

const QUOTES = [
  "I'm not a bad slime, slurp! (Rimuru)",
  'Great Sage: All systems nominal.',
  'I wrote this in Python 3.12 🐍',
  'hire Mostafa pls! (≧◡≦)',
  'Predator skill: analyzing GitHub commits...',
  'git push --force (no regrets)',
  'null === undefined ...right?',
  'Verdict.run: 120k+ impressions!',
  "rm -rf /node_modules: it's a feature",
  'boing boing~ 💧',
  'Level 24 Full-Stack AI Engineer!',
]

type MascotState = 'idle' | 'hopping' | 'visiting_cursor' | 'dragged'

export const SlimeMascot: React.FC = () => {
  // Whether the desktop mascot is released (active)
  const [isReleased, setIsReleased] = useState(true)

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
  const [speech, setSpeech] = useState<string | null>(null)
  const [isHappy, setIsHappy] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const mascotRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<MascotState>('idle')
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const nextActionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Track cursor position without gluing the mascot to it
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY }
      lastMouseMoveTime.current = Date.now()
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Show a quote in speech bubble
  const showSpeech = useCallback((text?: string) => {
    const chosen = text || QUOTES[Math.floor(Math.random() * QUOTES.length)]
    setSpeech(chosen)
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current)
    speechTimeoutRef.current = setTimeout(() => {
      setSpeech(null)
    }, 3200)
  }, [])

  // Autonomous decision maker (like Desktop Goose in yust.dev)
  const scheduleNextAction = useCallback(() => {
    if (nextActionTimeoutRef.current) clearTimeout(nextActionTimeoutRef.current)
    if (!isReleased || stateRef.current === 'dragged') return

    // Decide what to do after an idle pause
    const idleDuration = Math.random() * 2500 + 2000

    nextActionTimeoutRef.current = setTimeout(() => {
      if (!isReleased || stateRef.current === 'dragged') return

      const roll = Math.random()
      const w = window.innerWidth
      const h = window.innerHeight

      // 30% chance to curiously wander over near cursor
      if (roll < 0.35 && Date.now() - lastMouseMoveTime.current < 8000) {
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
  }, [isReleased])

  // Listen for duck dock button click to toggle / celebrate mascot
  useEffect(() => {
    const handleReleaseToggle = () => {
      if (!isReleased) {
        setIsReleased(true)
        showSpeech("Rimuru has arrived! 💧")
        triggerSlimeBloop()
      } else {
        // Joyful jump & quote
        setIsHappy(true)
        showSpeech()
        setTimeout(() => setIsHappy(false), 800)
      }
    }

    window.addEventListener('slime-mascot-jump', handleReleaseToggle)
    return () => window.removeEventListener('slime-mascot-jump', handleReleaseToggle)
  }, [isReleased, showSpeech])

  // Mascot physics & animation loop (60fps requestAnimationFrame)
  useEffect(() => {
    if (!isReleased) return

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
          // Hop motion physics: advances in small rhythm bounces
          hopPhase += 0.14
          const hopHeight = Math.max(0, Math.sin(hopPhase)) * 18
          const hopSpeed = 3.2

          posRef.current.x += (dx / dist) * hopSpeed
          posRef.current.y += (dy / dist) * hopSpeed

          // Squash & stretch on hop
          const bounceScaleY = 1 + (Math.sin(hopPhase) * 0.22)
          const bounceScaleX = 1 - (Math.sin(hopPhase) * 0.15)
          const flip = facingRight ? -1 : 1

          if (mascotRef.current) {
            mascotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y - hopHeight}px, 0) scale(${flip * bounceScaleX}, ${bounceScaleY})`
          }
        } else {
          // Reached destination -> switch to idle
          if (stateRef.current !== 'idle') {
            const prevState = stateRef.current
            stateRef.current = 'idle'
            hopPhase = 0

            // If it just visited the cursor, say something cute
            if (prevState === 'visiting_cursor') {
              showSpeech()
            }

            scheduleNextAction()
          }

          // Gentle idle breathing
          const breatheY = 1 + Math.sin(time * 2.5) * 0.04
          const breatheX = 1 - Math.sin(time * 2.5) * 0.03
          const flip = facingRight ? -1 : 1

          if (mascotRef.current) {
            mascotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(${flip * breatheX}, ${breatheY})`
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
  }, [isReleased, facingRight, scheduleNextAction, showSpeech])

  // Mouse Dragging (pick up Rimuru and toss him anywhere!)
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
      // Elastic jelly stretch when dragged
      mascotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(1.15, 0.85)`
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    stateRef.current = 'idle'
    targetRef.current = { ...posRef.current }
    triggerSlimeBloop(e)
    showSpeech("boing! (≧◡≦)")
    scheduleNextAction()
  }

  // Click / poke directly
  const handlePoke = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerSlimeBloop(e)
    setIsHappy(true)
    showSpeech()
    setTimeout(() => setIsHappy(false), 900)
  }

  if (!isReleased) return null

  return (
    <div
      ref={mascotRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={handlePoke}
      className="fixed top-0 left-0 z-[9990] select-none cursor-grab active:cursor-grabbing will-change-transform group"
      title="Rimuru Slime Mascot (Click to poke, drag to move!)"
      style={{ touchAction: 'none' }}
    >
      {/* Speech Bubble */}
      {speech && (
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl bg-zinc-900/95 text-cyan-200 border border-cyan-400/40 shadow-[0_8px_24px_rgba(0,0,0,0.8),0_0_15px_rgba(6,182,212,0.3)] text-xs font-mono font-bold whitespace-nowrap animate-in fade-in zoom-in-90 duration-150 pointer-events-none z-10"
          style={{ transform: facingRight ? 'scaleX(-1)' : 'scaleX(1)' }}
        >
          <span className="inline-block">{speech}</span>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-900 border-b border-r border-cyan-400/40 rotate-45" />
        </div>
      )}

      {/* Rimuru Slime Sprite (exact reference from uploaded media) */}
      <div className={`relative transition-transform duration-150 ${isHappy ? 'scale-115' : ''}`}>
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

        {/* Small dismiss button on hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setIsReleased(false)
          }}
          title="Dismiss Rimuru (Click duck in dock to summon back)"
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-zinc-800 hover:bg-rose-600 text-zinc-300 hover:text-white text-[10px] leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 shadow-sm"
        >
          &times;
        </button>
      </div>
    </div>
  )
}
