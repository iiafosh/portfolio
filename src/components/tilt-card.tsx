"use client"

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { useRef, type ReactNode } from "react"

import { SPRING_MOUSE } from "@/lib/ease"
import { useHoverCapable } from "@/lib/hooks"
import { cn } from "@/lib/utils"

// 3D tilt with a cursor-tracked glare — after beUI's tilt-card (MIT).
// Decorative, so it is off on touch and under reduced motion.

export function TiltCard({
  children,
  max = 6,
  glare = true,
  className,
}: {
  children: ReactNode
  max?: number
  glare?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const canHover = useHoverCapable()
  const enabled = !reduce && canHover

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const srx = useSpring(rx, SPRING_MOUSE)
  const sry = useSpring(ry, SPRING_MOUSE)

  const transform = useMotionTemplate`perspective(1000px) rotateX(${srx}deg) rotateY(${sry}deg)`
  const glareBg = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgb(255 255 255 / 0.5), transparent 55%)`

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current
        if (!el || !enabled) return
        const rect = el.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width
        const py = (e.clientY - rect.top) / rect.height
        ry.set((px - 0.5) * max)
        rx.set((0.5 - py) * max)
        gx.set(px * 100)
        gy.set(py * 100)
      }}
      onMouseLeave={() => {
        rx.set(0)
        ry.set(0)
      }}
      style={enabled ? { transform } : undefined}
      className={cn("relative will-change-transform", className)}
    >
      {children}
      {glare && enabled ? (
        <motion.div
          aria-hidden="true"
          style={{ background: glareBg }}
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 mix-blend-soft-light transition-opacity duration-300 group-hover:opacity-60"
        />
      ) : null}
    </motion.div>
  )
}
