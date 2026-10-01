import React, { useEffect, useRef, useState, useCallback } from 'react'
import { triggerSlimeBloop } from '@/utils/slimeEasterEgg'

const QUOTES = [
  'bloop!',
  'LVL.24 Companion ( •̀ ω •́ )✧',
  'ready for quests!',
  'boing boing~',
  'hi Mostafa!',
  'cyber slime online 💧',
  'full-stack buddy!',
  'super jelly pulse!',
]

export const SlimeMascot: React.FC = () => {
  // Target position (where cursor is)
  const targetPos = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth - 90 : 200,
    y: typeof window !== 'undefined' ? window.innerHeight - 140 : 200,
  })

  // Current smooth interpolated position
  const currentPos = useRef<{ x: number; y: number }>({
    x: typeof window !== 'undefined' ? window.innerWidth - 90 : 200,
    y: typeof window !== 'undefined' ? window.innerHeight - 140 : 200,
  })

  const [speech, setSpeech] = useState<string | null>(null)
  const [isBlinking, setIsBlinking] = useState(false)
  const [isHappy, setIsHappy] = useState(false)
  const [isJumping, setIsJumping] = useState(false)
  const [hasMouseMoved, setHasMouseMoved] = useState(false)

  const slimeRef = useRef<HTMLDivElement>(null)
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Slime trails smoothly slightly to bottom-right of cursor (+28px x, +28px y)
      // so it never obstructs clicking links or text
      targetPos.current = {
        x: Math.min(window.innerWidth - 50, Math.max(20, e.clientX + 28)),
        y: Math.min(window.innerHeight - 50, Math.max(20, e.clientY + 24)),
      }
      if (!hasMouseMoved) setHasMouseMoved(true)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        targetPos.current = {
          x: Math.min(window.innerWidth - 50, Math.max(20, e.touches[0].clientX + 24)),
          y: Math.min(window.innerHeight - 50, Math.max(20, e.touches[0].clientY + 24)),
        }
        if (!hasMouseMoved) setHasMouseMoved(true)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [hasMouseMoved])

  // Periodic natural Kawaii blinking
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true)
      setTimeout(() => setIsBlinking(false), 160)

      const nextBlink = Math.random() * 3500 + 2500
      blinkTimeoutRef.current = setTimeout(triggerBlink, nextBlink)
    }

    blinkTimeoutRef.current = setTimeout(triggerBlink, 3000)
    return () => {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current)
    }
  }, [])

  // Listen for celebratory jumps triggered externally (e.g. from dock or terminal)
  const performJump = useCallback(() => {
    setIsJumping(true)
    setIsHappy(true)
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
    setSpeech(quote)

    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current)
    speechTimeoutRef.current = setTimeout(() => {
      setSpeech(null)
      setIsHappy(false)
    }, 2400)

    setTimeout(() => setIsJumping(false), 600)
  }, [])

  useEffect(() => {
    const handleJumpEvent = () => performJump()
    window.addEventListener('slime-mascot-jump', handleJumpEvent)
    return () => window.removeEventListener('slime-mascot-jump', handleJumpEvent)
  }, [performJump])

  // Physics animation loop using requestAnimationFrame
  useEffect(() => {
    let animId: number
    let prevX = currentPos.current.x
    let prevY = currentPos.current.y
    let time = 0

    const updatePhysics = () => {
      time += 0.05

      // Smooth spring lerp towards target
      const lerp = 0.12
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerp
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerp

      // Calculate movement velocity
      const vx = currentPos.current.x - prevX
      const vy = currentPos.current.y - prevY
      const speed = Math.hypot(vx, vy)
      prevX = currentPos.current.x
      prevY = currentPos.current.y

      if (slimeRef.current) {
        // Idle gentle breathing
        const idleBreathing = Math.sin(time) * 0.04
        
        // Dynamic squish & stretch based on movement speed
        const speedStretch = Math.min(speed * 0.02, 0.28)
        const scaleX = 1 - speedStretch + idleBreathing
        const scaleY = 1 + speedStretch - idleBreathing

        // Slight tilt in direction of motion
        const tilt = Math.max(-25, Math.min(25, vx * 1.5))

        slimeRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) rotate(${tilt}deg) scale(${scaleX}, ${scaleY})`
      }

      animId = requestAnimationFrame(updatePhysics)
    }

    animId = requestAnimationFrame(updatePhysics)
    return () => cancelAnimationFrame(animId)
  }, [])

  // Interaction when clicked / petted
  const handlePetSlime = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerSlimeBloop(e)
    performJump()
  }

  return (
    <div
      ref={slimeRef}
      onClick={handlePetSlime}
      className={`fixed top-0 left-0 z-[9999] pointer-events-auto cursor-pointer select-none -translate-x-1/2 -translate-y-1/2 will-change-transform transition-opacity duration-500 group ${
        isJumping ? 'animate-bounce' : ''
      }`}
      title="💧 Click to pet Blue Slime Mascot!"
    >
      {/* Speech Bubble */}
      {speech && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded-full bg-cyan-950/90 text-cyan-200 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-[11px] font-['Chakra_Petch',sans-serif] font-bold whitespace-nowrap animate-in fade-in zoom-in-90 duration-150 pointer-events-none">
          <span>{speech}</span>
          {/* Arrow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-950/90 border-b border-r border-cyan-400/50 rotate-45" />
        </div>
      )}

      {/* Blue Slime Mascot Character (SVG) */}
      <div className="relative w-11 h-11 sm:w-12 sm:h-12 drop-shadow-[0_0_16px_rgba(6,182,212,0.55)] transition-transform duration-150 group-hover:scale-110 active:scale-90">
        <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
          <defs>
            {/* Glowing Jello Slime Body Gradient */}
            <radialGradient id="mascot_jelly" cx="35%" cy="30%" r="70%">
              <stop stopColor="#a5f3fc" offset="0%" />
              <stop stopColor="#38bdf8" offset="35%" />
              <stop stopColor="#0284c7" offset="75%" />
              <stop stopColor="#0369a1" offset="100%" />
            </radialGradient>

            {/* Specular curved glint */}
            <linearGradient id="mascot_glint" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#ffffff" stopOpacity="0.85" offset="0%" />
              <stop stopColor="#ffffff" stopOpacity="0" offset="100%" />
            </linearGradient>

            {/* Ambient Aura */}
            <filter id="mascot_glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Main Slime Body (Teardrop jelly blob) */}
          <path
            d="M 60 14 C 66 22 98 46 99 74 C 100 98 84 110 60 110 C 36 110 20 98 21 74 C 22 46 54 22 60 14 Z"
            fill="url(#mascot_jelly)"
            filter="url(#mascot_glow)"
          />

          {/* Inner Highlights / Jelly Translucency */}
          <path
            d="M 60 20 C 64 27 92 48 93 72 C 94 92 80 104 60 104 C 40 104 26 92 27 72 C 28 48 56 27 60 20 Z"
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="1.8"
            opacity="0.45"
          />

          {/* Top-Left Gloss Reflection */}
          <path
            d="M 52 24 C 41 33 33 48 33 64 C 33 69 34 73 35 76 C 34 70 34 58 40 45 C 44 35 49 28 52 24 Z"
            fill="url(#mascot_glint)"
          />

          {/* Cute Rosy Cheeks */}
          <ellipse cx="38" cy="80" rx="5.5" ry="3" fill="#f43f5e" opacity="0.4" />
          <ellipse cx="82" cy="80" rx="5.5" ry="3" fill="#f43f5e" opacity="0.4" />

          {/* Eyes (Open vs Blinking vs Happy ^_^) */}
          {isHappy ? (
            // Happy ^_^ eyes
            <g stroke="#031b33" strokeWidth="3" strokeLinecap="round" fill="none">
              <path d="M 42 70 Q 48 63 54 70" />
              <path d="M 66 70 Q 72 63 78 70" />
            </g>
          ) : isBlinking ? (
            // Blinking closed eyes
            <g stroke="#031b33" strokeWidth="2.8" strokeLinecap="round">
              <line x1="43" y1="69" x2="53" y2="69" />
              <line x1="67" y1="69" x2="77" y2="69" />
            </g>
          ) : (
            // Glossy round kawaii eyes
            <g>
              {/* Left Eye */}
              <ellipse cx="48" cy="68" rx="4.5" ry="6.5" fill="#031b33" />
              <circle cx="46.5" cy="65.5" r="2" fill="#ffffff" />
              <circle cx="49.5" cy="70.5" r="1" fill="#ffffff" opacity="0.75" />

              {/* Right Eye */}
              <ellipse cx="72" cy="68" rx="4.5" ry="6.5" fill="#031b33" />
              <circle cx="70.5" cy="65.5" r="2" fill="#ffffff" />
              <circle cx="73.5" cy="70.5" r="1" fill="#ffffff" opacity="0.75" />
            </g>
          )}

          {/* Cute Little Smile */}
          <path
            d="M 56 77 Q 60 82 64 77"
            fill="none"
            stroke="#031b33"
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Sparkle star on top */}
          <circle cx="60" cy="14" r="2" fill="#e0f2fe" opacity="0.8" />
        </svg>
      </div>
    </div>
  )
}
