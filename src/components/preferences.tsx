"use client"

import { motion, type MotionValue } from "motion/react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"
import type { ComponentType, ReactNode } from "react"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useMounted } from "@/lib/hooks"
import { setPref, usePrefs } from "@/lib/prefs"
import { sounds } from "@/lib/sound"
import { cn } from "@/lib/utils"
import { MoonIcon, PrefsIcon, SoundIcon, SunIcon } from "./icons"

type LiftComponent = ComponentType<{ mouseX: MotionValue<number>; children: ReactNode }>
type TipComponent = ComponentType<{ label: string; keys?: string[] }>

const THEMES = [
  { id: "light", label: "Light", icon: SunIcon },
  { id: "dark", label: "Dark", icon: MoonIcon },
] as const

/**
 * Switch theme with a circular reveal from the pointer (sleek-portfolio and
 * beUI's view-transition toggle). Falls back to an instant swap.
 */
export function switchTheme(next: string, setTheme: (t: string) => void, origin?: { x: number; y: number }) {
  const root = document.documentElement
  const apply = () => {
    flushSync(() => setTheme(next))
    root.classList.toggle("dark", next === "dark")
    root.style.colorScheme = next
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  if (!document.startViewTransition || reduce) {
    apply()
    return
  }
  const x = origin?.x ?? window.innerWidth / 2
  const y = origin?.y ?? window.innerHeight
  const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  root.style.setProperty("--vt-x", `${x}px`)
  root.style.setProperty("--vt-y", `${y}px`)
  root.style.setProperty("--vt-r", `${r}px`)
  root.dataset.themeSwitch = ""
  const transition = document.startViewTransition(apply)
  transition.finished.finally(() => {
    delete root.dataset.themeSwitch
  })
}

export function Preferences({
  mouseX,
  Lift,
  Tip,
}: {
  mouseX: MotionValue<number>
  Lift: LiftComponent
  Tip: TipComponent
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const prefs = usePrefs()
  const mounted = useMounted()
  const current = mounted ? resolvedTheme : undefined

  return (
    <Popover>
      <PopoverTrigger className="dock-item" aria-label="Preferences">
        <Lift mouseX={mouseX}>
          <PrefsIcon />
        </Lift>
        <Tip label="Preferences" />
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="end"
        sideOffset={14}
        className="w-[18.5rem] gap-0 rounded-xl bg-popover p-0 shadow-[0_0_0_1px_var(--border),var(--shadow-medium)] ring-0"
      >
        <div className="flex items-center justify-between px-3.5 pt-3 pb-2.5">
          <span className="mono-label">Preferences</span>
          <span className="pixel-cluster" aria-hidden="true">
            <span className="pc-a" />
            <span />
            <span className="pc-b" />
            <span className="pc-s" />
          </span>
        </div>

        <Row label="Theme">
          <div className="relative grid grid-cols-2 rounded-full p-0.5 shadow-[inset_0_0_0_1px_var(--border)]">
            {THEMES.map((t) => {
              const on = current === t.id
              const Icon = t.icon
              return (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={on}
                  onClick={(e) => {
                    if (on) return
                    sounds.tick()
                    switchTheme(t.id, setTheme, { x: e.clientX, y: e.clientY })
                  }}
                  className={cn(
                    "relative flex h-7 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs transition-colors duration-150",
                    on ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {on ? (
                    <motion.span
                      layoutId="theme-pill"
                      className="absolute inset-0 rounded-full bg-[var(--active)]"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  ) : null}
                  <Icon size={14} className="relative" />
                  <span className="relative">{t.label}</span>
                </button>
              )
            })}
          </div>
        </Row>

        <Row label="Sound">
          <button
            type="button"
            role="switch"
            aria-checked={prefs.sound}
            onClick={() => {
              setPref("sound", !prefs.sound)
              if (!prefs.sound) queueMicrotask(() => sounds.tick())
            }}
            className="flex h-7 items-center gap-2 rounded-full px-2.5 text-xs text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-150 hover:text-foreground"
          >
            <SoundIcon size={14} muted={!prefs.sound} />
            {prefs.sound ? "On" : "Off"}
          </button>
        </Row>

      </PopoverContent>
    </Popover>
  )
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="hairline-top flex items-center justify-between gap-3 px-3.5 py-2.5">
      <span className="text-sm text-foreground">{label}</span>
      {children}
    </div>
  )
}
