"use client"

import Link from "next/link"
import { useState } from "react"

import { getProject } from "@/content/projects"
import type { Hackathon } from "@/content/types"
import { replaceSearchParam, useSearchParam } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import { ArrowRight } from "../icons"
import { CertStamp, People, SpecPlate, StatusLadder, delay } from "../marks"
import { PixelRosette, PixelTrophy, type Metal } from "../pixel-art"
import { Sheet, SheetBlock } from "../sheet"
import { ProofLinks, Story } from "../story"

// yust.dev's hacks page on aryan karma's timeline rail: a pixel rank,
// the event line in tracked mono, the build, its journey ladder and proofs.
// The long story lives in a bottom sheet so the list stays short.

const PLACE_METAL: Record<number, Metal> = { 1: "gold", 2: "silver", 3: "bronze" }
const HOVER_TINT: Record<Metal, string> = {
  gold: "group-hover/rank:text-[var(--gold)]",
  silver: "group-hover/rank:text-[var(--silver)]",
  bronze: "group-hover/rank:text-[var(--bronze)]",
}

export function HackathonList({ items }: { items: Hackathon[] }) {
  // /hackathons?story=slug opens a story directly
  const fromUrl = useSearchParam("story")
  const [open, setOpenState] = useState<string | null | undefined>(undefined)
  const shown = open === undefined ? fromUrl : open
  const current = items.find((h) => h.slug === shown) ?? null
  const setOpen = (slug: string | null) => {
    setOpenState(slug)
    replaceSearchParam("story", slug)
  }

  return (
    <>
      <ol className="relative mt-12">
        {items.map((h, i) => (
          <Entry key={h.slug} hackathon={h} index={i} last={i === items.length - 1} onStory={() => setOpen(h.slug)} />
        ))}
      </ol>

      <Sheet
        open={current !== null}
        onOpenChange={(next) => {
          if (!next) setOpen(null)
        }}
        eyebrow={current ? `${current.name} · ${current.dateLabel}` : ""}
        title={current?.title ?? ""}
        description={current?.summary}
      >
        {current ? <HackathonStory hackathon={current} /> : null}
      </Sheet>
    </>
  )
}

function RankIcon({ hackathon, className }: { hackathon: Hackathon; className?: string }) {
  const { result } = hackathon
  if (result.kind === "place" && result.place) {
    return <PixelTrophy metal={PLACE_METAL[result.place]} className={className} />
  }
  return <PixelRosette metal="silver" className={className} />
}

function Entry({
  hackathon: h,
  index,
  last,
  onStory,
}: {
  hackathon: Hackathon
  index: number
  last: boolean
  onStory: () => void
}) {
  const metal = h.result.kind === "place" && h.result.place ? PLACE_METAL[h.result.place] : "silver"
  const project = getProject(h.project)

  return (
    <li
      id={h.slug}
      className="enter-rise relative scroll-mt-24 pb-14 pl-12 sm:pl-16"
      style={delay(120 + index * 80)}
    >
      {/* the rail */}
      {!last ? (
        <span
          aria-hidden="true"
          className="absolute top-12 bottom-0 left-[17px] w-px bg-[linear-gradient(to_bottom,var(--border),transparent)] sm:left-[21px]"
        />
      ) : null}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 grid size-9 place-items-center rounded-full bg-background shadow-[0_0_0_1px_var(--border),var(--shadow-3)] sm:size-11"
      >
        <RankIcon hackathon={h} className="h-5 w-5 sm:h-6 sm:w-6" />
      </span>

      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
        <h2
          className={cn(
            "group/rank font-display font-bold tracking-[-0.045em] text-[1.75rem] leading-none text-foreground transition-colors duration-300 sm:text-[2.125rem]",
          )}
        >
          <span className={cn("transition-colors duration-300", HOVER_TINT[metal])}>{h.result.label}</span>
        </h2>
        <CertStamp className="mt-0.5">{h.result.stamp}</CertStamp>
      </div>

      <p className="mt-3 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
        {h.name} · {h.dateLabel} · {h.host !== h.name ? h.host : h.location}
      </p>
      <h3 className="mt-3 text-[1.0625rem] font-semibold tracking-tight text-foreground">{h.title}</h3>
      <p className="prose-copy mt-2">{h.summary}</p>

      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] sm:gap-8">
        <div>
          <p className="mono-label mb-2.5">Journey</p>
          <StatusLadder steps={h.journey} />
        </div>
        <SpecPlate items={h.facts} className="self-start sm:grid-cols-2 min-[28rem]:grid-cols-2" />
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        With <People people={h.team} />
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={onStory} className="btn-pill btn-pill-primary h-8 px-3.5 text-[0.8125rem]">
          Read the story
        </button>
        {project ? (
          <Link
            href={`/projects?p=${project.slug}`}
            className="btn-pill btn-pill-ghost group h-8 px-3.5 text-[0.8125rem]"
          >
            {project.title}
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        ) : null}
      </div>

      <ProofLinks links={h.proofs} className="mt-5 flex flex-wrap gap-x-5 gap-y-2" />
    </li>
  )
}

function HackathonStory({ hackathon: h }: { hackathon: Hackathon }) {
  const project = getProject(h.project)
  return (
    <div>
      <div className="flex items-center gap-4 pb-5">
        <RankIcon hackathon={h} className="h-10 w-10 shrink-0" />
        <div className="min-w-0">
          <p className="font-display font-bold tracking-[-0.045em] text-xl leading-none text-foreground">{h.result.label}</p>
          <p className="mt-1.5 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            {h.host} · {h.location}
          </p>
        </div>
      </div>
      <SpecPlate items={h.facts} />
      <Story blocks={h.story} />
      <SheetBlock title="Team">
        <p className="prose-copy">
          <People people={h.team} /> — and me, on {h.role.toLowerCase()}.
        </p>
      </SheetBlock>
      <SheetBlock title="Proof">
        <ProofLinks links={h.proofs} className="flex flex-col gap-2.5" />
      </SheetBlock>
      {project ? (
        <div className="hairline-top pt-5">
          <Link href={`/projects?p=${project.slug}`} className="btn-pill btn-pill-primary w-full">
            Open {project.title}
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : null}
    </div>
  )
}
