"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { useRef, useState, type KeyboardEvent } from "react"

import { communities } from "@/content/community"
import { getHackathon } from "@/content/hackathons"
import { getProject } from "@/content/projects"
import type { Achievement } from "@/content/types"
import { replaceSearchParam, useSearchParam } from "@/lib/hooks"
import { sounds } from "@/lib/sound"
import { cn } from "@/lib/utils"
import { ArrowRight } from "../icons"
import { CertStamp, People } from "../marks"
import { NumberTicker } from "../number-ticker"
import { PixelObject } from "../pixel-art"
import { ProofLinks } from "../story"

// The trophy shelf: cali.so's room shelf (one plank, full width, objects
// standing on it, one annotation below) holding yust.dev-style pixel
// trophies. Picking an object lifts it and prints its plate underneath.
// More awards only make the shelf scroll sideways — the page never grows.

const PIXEL = 6

export function TrophyShelf({ items }: { items: Achievement[] }) {
  // /achievements?a=slug picks one; a click overrides it
  const fromUrl = useSearchParam("a")
  const [picked, setPicked] = useState<string | null>(null)
  const refs = useRef(new Map<string, HTMLButtonElement>())
  const reduce = useReducedMotion()
  const selected = picked ?? (items.some((a) => a.slug === fromUrl) ? fromUrl : items[0]?.slug)
  const current = items.find((a) => a.slug === selected) ?? items[0]

  const select = (slug: string, viaKeyboard = false) => {
    if (slug === selected) return
    if (!viaKeyboard) sounds.tick()
    setPicked(slug)
    replaceSearchParam("a", slug)
  }

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = items.findIndex((a) => a.slug === selected)
    const next =
      e.key === "ArrowRight" ? Math.min(items.length - 1, i + 1) : e.key === "ArrowLeft" ? Math.max(0, i - 1) : -1
    if (next < 0 || next === i) return
    e.preventDefault()
    select(items[next].slug, true)
    refs.current.get(items[next].slug)?.focus()
  }

  if (!current) return null

  return (
    <div className="mt-12">
      <div className="shelf-room enter" style={{ "--enter-delay": "120ms" } as React.CSSProperties}>
        <div
          role="tablist"
          aria-label="Awards on the shelf"
          onKeyDown={onKey}
          className="no-scrollbar relative z-10 flex items-end justify-center gap-8 overflow-x-auto px-6 pt-10 sm:gap-14"
        >
          {items.map((a) => {
            const active = a.slug === current.slug
            return (
              <button
                key={a.slug}
                ref={(el) => {
                  if (el) refs.current.set(a.slug, el)
                  else refs.current.delete(a.slug)
                }}
                type="button"
                role="tab"
                id={`shelf-${a.slug}`}
                aria-selected={active}
                aria-controls="shelf-plate"
                tabIndex={active ? 0 : -1}
                onClick={() => select(a.slug)}
                className="shelf-object group relative flex shrink-0 flex-col items-center outline-offset-8"
                data-active={active || undefined}
              >
                <span className="shelf-glint" aria-hidden="true" />
                <motion.span
                  className="relative block origin-bottom"
                  animate={
                    reduce
                      ? undefined
                      : { y: active ? -10 : 0, scale: active ? 1.08 : 1, rotate: active ? 0 : a.object === "trophy" ? 0 : -2 }
                  }
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                >
                  <PixelObject
                    object={a.object}
                    metal={a.metal}
                    className={cn("shelf-sprite block", a.object !== "trophy" && "shelf-hang")}
                    width={(a.object === "medal" ? 11 : 13) * PIXEL}
                    height={(a.object === "trophy" ? 13 : 14) * PIXEL}
                  />
                </motion.span>
                <span className="shelf-contact" aria-hidden="true" />
                <span className="sr-only">
                  {a.title} — {a.event}
                </span>
              </button>
            )
          })}
        </div>

        <div className="shelf-plank mx-2 sm:mx-0" aria-hidden="true" />

        {/* brass plates on the plank's front face, one per object */}
        <div className="no-scrollbar -mt-[13px] flex justify-center gap-8 overflow-hidden px-6 sm:gap-14" aria-hidden="true">
          {items.map((a) => (
            <span
              key={a.slug}
              className={cn("shelf-plaque", a.slug === current.slug && "shelf-plaque-on")}
              style={{ width: (a.object === "medal" ? 11 : 13) * PIXEL }}
            >
              {a.engraving}
            </span>
          ))}
        </div>
      </div>

      <div id="shelf-plate" role="tabpanel" aria-labelledby={`shelf-${current.slug}`} className="relative mt-10 min-h-[26rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.slug}
            initial={reduce ? false : { opacity: 0, filter: "blur(4px)", y: 6 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            exit={reduce ? undefined : { opacity: 0, filter: "blur(4px)", transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Plate achievement={current} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function Plate({ achievement: a }: { achievement: Achievement }) {
  const hackathon = getHackathon(a.related?.hackathon)
  const project = getProject(a.related?.project)
  const community = communities.find((c) => c.slug === a.related?.community)

  return (
    <article>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <div>
          <p className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            {a.event} · {a.dateLabel}
          </p>
          <h2 className="mt-3 font-display font-bold tracking-[-0.045em] text-[2rem] leading-none text-foreground sm:text-[2.5rem]">{a.title}</h2>
        </div>
        <CertStamp className="mt-1">{a.issuer.split(" ·")[0]}</CertStamp>
      </div>

      <p className="prose-copy mt-4 max-w-[36rem]">{a.description}</p>

      <dl
        className="mt-6 grid grid-cols-2 gap-px border-y border-border bg-border sm:grid-cols-[repeat(var(--stat-cols),minmax(0,1fr))]"
        style={{ "--stat-cols": Math.min(4, a.stats.length) } as React.CSSProperties}
      >
        {a.stats.map((s, i) => (
          <div key={s.label} className="flex flex-col gap-1 bg-background py-4 pr-3 pl-3 first:pl-0 sm:pl-4 sm:first:pl-0">
            <dt className="mono-label order-2">{s.label}</dt>
            <dd className="order-1 text-2xl font-bold tracking-[-0.03em] text-foreground tabular sm:text-[1.75rem]">
              {s.prefix}
              <NumberTicker value={s.value} delay={0.05 * i} />
              {s.suffix}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
        {a.team?.length ? (
          <p>
            Team: <People people={a.team} />
          </p>
        ) : null}
      </div>

      {hackathon || project || community ? (
        <div className="mt-6 flex flex-wrap gap-2.5">
          {hackathon ? (
            <Link href={`/hackathons#${hackathon.slug}`} className="btn-pill btn-pill-ghost group h-8 px-3.5 text-[0.8125rem]">
              {hackathon.name}
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ) : null}
          {project ? (
            <Link href={`/projects?p=${project.slug}`} className="btn-pill btn-pill-ghost group h-8 px-3.5 text-[0.8125rem]">
              {project.title}
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ) : null}
          {community ? (
            <Link href="/community" className="btn-pill btn-pill-ghost group h-8 px-3.5 text-[0.8125rem]">
              {community.name}
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ) : null}
        </div>
      ) : null}

      <ProofLinks links={a.proofs} className="mt-6 flex flex-wrap gap-x-5 gap-y-2" />
    </article>
  )
}
