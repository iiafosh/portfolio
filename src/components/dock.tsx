"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, type ComponentType, type ReactNode } from "react"

import { NAV, isActivePath as isActive } from "@/content/nav"
import { site } from "@/content/site"
import { useHoverCapable } from "@/lib/hooks"
import { getPrefs, setPref, usePrefs } from "@/lib/prefs"
import { sounds } from "@/lib/sound"
import { BadgeIcon, MedalIcon, ProjectsIcon, SlimeIcon, TrophyIcon } from "./icons"
import { Preferences } from "./preferences"

// The bottom pill dock (cali.so) with aryan karma's proximity lift, toned
// down: icons rise and grow a little toward the cursor, the hit areas never
// move. The active dot glides between destinations; keyboard chords
// (G then a letter) jump instantly.

const ICONS: Record<string, ComponentType | undefined> = {
  "/hackathons": TrophyIcon,
  "/projects": ProjectsIcon,
  "/achievements": MedalIcon,
  "/community": BadgeIcon,
}

let keyboardNavigation = false

function useGoChords() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let armed = 0
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return
      const key = e.key.toUpperCase()
      if (key === "G" && !e.repeat) {
        armed = window.setTimeout(() => (armed = 0), 1200)
        return
      }
      if (!armed) return
      window.clearTimeout(armed)
      armed = 0
      if (key === "S") {
        setPref("slime", !getPrefs().slime)
        return
      }
      const item = NAV.find((n) => n.key === key)
      if (item && !isActive(pathname, item.href)) {
        keyboardNavigation = true
        router.push(item.href)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [router, pathname])
}

function DockTip({ label, keys }: { label: string; keys?: string[] }) {
  return (
    <span className="dock-tip" aria-hidden="true">
      <span>{label}</span>
      {keys ? (
        <span className="dock-tip-keys">
          {keys.map((k) => (
            <kbd key={k}>{k}</kbd>
          ))}
        </span>
      ) : null}
    </span>
  )
}

/** The icon wrapper that leans toward the cursor. */
function Lift({ mouseX, children }: { mouseX: MotionValue<number>; children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null)
  const distance = useTransform(mouseX, (x) => {
    const el = ref.current
    if (!el || !Number.isFinite(x)) return 999
    const rect = el.getBoundingClientRect()
    return x - (rect.left + rect.width / 2)
  })
  const scale = useSpring(useTransform(distance, [-110, 0, 110], [1, 1.2, 1], { clamp: true }), {
    stiffness: 320,
    damping: 22,
    mass: 0.35,
  })
  const y = useSpring(useTransform(distance, [-110, 0, 110], [0, -3, 0], { clamp: true }), {
    stiffness: 320,
    damping: 22,
    mass: 0.35,
  })
  return (
    <motion.span ref={ref} className="dock-item-inner" style={{ scale, y }}>
      {children}
    </motion.span>
  )
}

function Dot() {
  const reduce = useReducedMotion()
  return (
    <motion.span
      layoutId="dock-dot"
      className="dock-indicator"
      transition={
        reduce || keyboardNavigation
          ? { duration: 0 }
          : { type: "spring", stiffness: 420, damping: 34, mass: 0.6 }
      }
      onLayoutAnimationComplete={() => (keyboardNavigation = false)}
    />
  )
}

export function Dock() {
  const pathname = usePathname()
  const prefs = usePrefs()
  const canHover = useHoverCapable()
  const reduce = useReducedMotion()
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY)
  const lift = canHover && !reduce

  useGoChords()

  return (
    <nav
      className="dock"
      aria-label="Main"
      data-slime-platform=""
      onMouseMove={lift ? (e) => mouseX.set(e.clientX) : undefined}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
    >
      <span className="dock-glass" aria-hidden="true" style={GLASS} />

      {NAV.map((item, i) => {
        const active = isActive(pathname, item.href)
        const Icon = ICONS[item.href]
        return (
          <Fragment key={item.href} withRule={i === 1}>
            <Link
              href={item.href}
              className="dock-item"
              data-active={active || undefined}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              onClick={(e) => {
                keyboardNavigation = e.detail === 0
                if (!active) sounds.chime()
              }}
            >
              <Lift mouseX={mouseX}>
                {Icon ? (
                  <Icon />
                ) : (
                  <span className="dock-avatar">
                    <Image src={site.avatar} alt="" width={56} height={56} priority />
                  </span>
                )}
              </Lift>
              {active ? <Dot /> : null}
              <DockTip label={item.label} />
            </Link>
          </Fragment>
        )
      })}

      <span className="dock-rule" aria-hidden="true" />

      <button
        type="button"
        className="dock-item"
        data-slime-home=""
        data-on={prefs.slime || undefined}
        aria-pressed={prefs.slime}
        aria-label={prefs.slime ? `Put ${site.pet.name} back in the dock` : `Let ${site.pet.name} out`}
        onClick={() => {
          sounds.tick()
          setPref("slime", !prefs.slime)
        }}
      >
        <Lift mouseX={mouseX}>
          <SlimeIcon />
        </Lift>
        <DockTip label={prefs.slime ? `Recall ${site.pet.name}` : `Release ${site.pet.name}`} />
      </button>

      <Preferences mouseX={mouseX} Lift={Lift} Tip={DockTip} />
    </nav>
  )
}

function Fragment({ children, withRule }: { children: ReactNode; withRule?: boolean }) {
  return (
    <>
      {withRule ? <span className="dock-rule" aria-hidden="true" /> : null}
      {children}
    </>
  )
}

// backdrop-filter stays inline: some CSS minifiers drop the raw property
const GLASS = {
  backdropFilter: "blur(12px) saturate(1.25)",
  WebkitBackdropFilter: "blur(12px) saturate(1.25)",
} as const
