import React, { useEffect, useRef, useState, useCallback } from 'react'
import rimuruSlimeImg from '@/assets/rimuru-slime.png'

type MascotState = 'idle' | 'hopping' | 'visiting_cursor' | 'dragged'

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

  const mascotRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<MascotState>('idle')
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
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

  // Autonomous decision maker (autonomous roaming like desktop mascot)
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

          // Squash & stretch on hop
          const bounceScaleY = 1 + Math.sin(hopPhase) * 0.22
          const bounceScaleX = 1 - Math.sin(hopPhase) * 0.15
          const flip = facingRight ? -1 : 1

          if (mascotRef.current) {
            mascotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y - hopHeight}px, 0) scale(${flip * bounceScaleX}, ${bounceScaleY})`
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
      // Elastic jelly stretch when dragged
      mascotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(1.15, 0.85)`
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
      {/* Rimuru Slime Sprite (exact reference from uploaded media) */}
      <div className="relative">
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
