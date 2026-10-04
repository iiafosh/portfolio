"use client"

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import Image from "next/image"
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"

import { site } from "@/content/site"
import type { Community } from "@/content/types"
import { replaceSearchParam, useSearchParam } from "@/lib/hooks"
import { SPRING_SWING } from "@/lib/ease"
import { sounds } from "@/lib/sound"
import { cn } from "@/lib/utils"
import { Barcode } from "../barcode"
import { People, SpecPlate } from "../marks"
import { ProofLinks } from "../story"

// Clubs as conference badges on lanyards. Grab one and it swings from its
// strap (a spring pendulum — the same physics family as the slime); tap it
// to read the club's card below. More clubs = more badges on the rail.

export function BadgeBoard({ items }: { items: Community[] }) {
  const fromUrl = useSearchParam("c")
  const [picked, setPicked] = useState<string | null>(null)
  const refs = useRef(new Map<string, HTMLButtonElement>())
  const reduce = useReducedMotion()
  const selected = picked ?? (items.some((c) => c.slug === fromUrl) ? fromUrl : items[0]?.slug)
  const current = items.find((c) => c.slug === selected) ?? items[0]

  const select = (slug: string) => {
    if (slug === selected) return
    setPicked(slug)
    replaceSearchParam("c", slug)
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.findIndex((c) => c.slug === selected)
    const next =
      e.key === "ArrowRight" ? Math.min(items.length - 1, i + 1) : e.key === "ArrowLeft" ? Math.max(0, i - 1) : -1
    if (next < 0 || next === i) return
    e.preventDefault()
    select(items[next].slug)
    refs.current.get(items[next].slug)?.focus()
  }

  if (!current) return null

  return (
    <div className="mt-10">
      <div className="badge-board enter" style={{ "--enter-delay": "120ms" } as React.CSSProperties}>
        <div className="badge-rail" aria-hidden="true">
          <span />
          <span />
        </div>
        <div
          role="tablist"
          aria-label="Clubs and communities"
          onKeyDown={onKey}
          className="no-scrollbar flex justify-center gap-6 overflow-x-auto px-6 pb-10 sm:gap-12"
        >
          {items.map((c, i) => (
            <Lanyard
              key={c.slug}
              community={c}
              index={i}
              active={c.slug === current.slug}
              reduce={!!reduce}
              onSelect={() => select(c.slug)}
              buttonRef={(el) => {
                if (el) refs.current.set(c.slug, el)
                else refs.current.delete(c.slug)
              }}
            />
          ))}
        </div>
      </div>

      <div id="badge-card" role="tabpanel" aria-labelledby={`badge-${current.slug}`} className="relative mt-8 min-h-[24rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.slug}
            initial={reduce ? false : { opacity: 0, filter: "blur(4px)", y: 6 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={reduce ? undefined : { opacity: 0, filter: "blur(4px)", transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Details community={current} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Lanyard({
  community: c,
  index,
  active,
  reduce,
  onSelect,
  buttonRef,
}: {
  community: Community
  index: number
  active: boolean
  reduce: boolean
  onSelect: () => void
  buttonRef: (el: HTMLButtonElement | null) => void
}) {
  const pivotRef = useRef<HTMLDivElement>(null)
  const target = useMotionValue(reduce ? 0 : index % 2 ? -14 : 14)
  const rotate = useSpring(target, SPRING_SWING)
  const shadowX = useTransform(rotate, (r) => r * -0.6)
  const drag = useRef<{ id: number; moved: boolean; x: number; y: number } | null>(null)
  const dragged = useRef(false)

  // settle in from a little swing on arrival
  useEffect(() => {
    if (reduce) return
    const t = window.setTimeout(() => target.set(0), 80 + index * 90)
    return () => window.clearTimeout(t)
  }, [reduce, target, index])

  const angleTo = (x: number, y: number) => {
    const pivot = pivotRef.current?.getBoundingClientRect()
    if (!pivot) return 0
    const px = pivot.left + pivot.width / 2
    const py = pivot.top
    const deg = (Math.atan2(x - px, y - py) * 180) / Math.PI
    return Math.max(-38, Math.min(38, -deg))
  }

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    if (reduce || (e.pointerType === "mouse" && e.button !== 0)) return
    drag.current = { id: e.pointerId, moved: false, x: e.clientX, y: e.clientY }
  }

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    if (!d.moved && Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) {
      d.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    if (d.moved) target.set(angleTo(e.clientX, e.clientY))
  }

  const onPointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    drag.current = null
    if (!d || d.id !== e.pointerId) return
    if (d.moved) {
      dragged.current = true
      target.set(0) // let go: the spring swings it home
    }
  }

  return (
    <div className="lanyard-slot" style={{ "--strap": c.strap } as React.CSSProperties}>
      <div ref={pivotRef} className="lanyard-pivot" aria-hidden="true" />
      <motion.div className="lanyard" style={{ rotate }}>
        <span className="lanyard-strap" aria-hidden="true" />
        <span className="lanyard-clip" aria-hidden="true" />
        <button
          ref={buttonRef}
          id={`badge-${c.slug}`}
          type="button"
          role="tab"
          aria-selected={active}
          aria-controls="badge-card"
          tabIndex={active ? 0 : -1}
          data-active={active || undefined}
          className="badge-card"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={() => {
            // a drag is not a pick
            if (dragged.current) {
              dragged.current = false
              return
            }
            if (!active) sounds.tick()
            onSelect()
            if (!reduce) target.set(target.get() + (Math.random() > 0.5 ? 7 : -7))
            window.setTimeout(() => target.set(0), 120)
          }}
          onMouseEnter={() => {
            if (!reduce) target.set(target.get() + 3)
            window.setTimeout(() => target.set(0), 140)
          }}
        >
          <span className="badge-slot" aria-hidden="true" />
          <span className="badge-band">
            <span className="font-display text-[15px] leading-none font-bold tracking-[0.08em] uppercase">{c.badge}</span>
          </span>
          <span className="badge-kind">{c.kind}</span>
          <span className="badge-photo">
            <Image src={site.avatar} alt="" width={128} height={128} />
          </span>
          <span className="badge-name">{site.name}</span>
          <span className="badge-role">{c.role}</span>
          <span className="badge-since">{c.sinceLabel}</span>
          <Barcode code={`${c.slug.toUpperCase()}-${c.since.replace("-", "")}`} className="badge-barcode" />
        </button>
      </motion.div>
      <motion.span className="lanyard-shadow" style={{ x: shadowX }} aria-hidden="true" />
    </div>
  )
}

function Details({ community: c }: { community: Community }) {
  return (
    <article>
      <p className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {c.kind} · {c.where}
      </p>
      <h2 className="mt-3 font-display font-bold tracking-[-0.045em] text-[2rem] leading-none text-foreground sm:text-[2.5rem]">{c.name}</h2>
      <p className="mt-3 text-[0.9375rem] text-foreground">
        {c.role} <span className="text-muted-foreground">· {c.sinceLabel}</span>
      </p>
      <p className="prose-copy mt-4 max-w-[36rem]">{c.description}</p>

      {c.stats?.length ? <SpecPlate className="mt-6" items={c.stats} /> : null}

      <ul className="cell-list mt-6">
        {c.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>

      {c.people ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {c.people.label}: <People people={c.people.list} />
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap gap-1.5">
        {c.tags.map((t) => (
          <span key={t} className={cn("tool-pill")}>
            {t}
          </span>
        ))}
      </div>

      <ProofLinks links={c.links} className="mt-6 flex flex-wrap gap-x-5 gap-y-2" />
    </article>
  )
}
