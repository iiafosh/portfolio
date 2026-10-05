"use client"

import Image from "next/image"

import type { Project } from "@/content/types"
import { cn } from "@/lib/utils"
import { TiltCard } from "../tilt-card"
import { Vignette } from "./vignettes"

// yust.dev's bento card: media fills the tile, a tag top-left, a white
// "Click for info" pill that pops in top-right on hover, and the title
// block that rises a few pixels. The whole tile is one button.

export function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  const still = project.cardImage ?? project.cover
  const showCover = still && project.cardMedia !== "vignette"
  const hero = project.size === "hero"
  const spans = hero || project.size === "wide"

  return (
    <TiltCard max={4} className="group h-full rounded-2xl">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`Open ${project.title} — ${project.tagline}`}
        className="absolute inset-0 z-30 rounded-2xl"
      />
      <div className="relative h-full overflow-hidden rounded-2xl bg-surface-1 shadow-[0_0_0_1px_var(--border),var(--shadow-3)]">
        {showCover && still ? (
          <div className="absolute inset-0" style={{ transform: `scale(${hero ? 1 : (still.zoom ?? 1)})` }}>
            <Image
              src={still.src}
              alt={still.alt}
              fill
              sizes={spans ? "(min-width: 1280px) 80rem, 100vw" : "(min-width: 1280px) 40rem, (min-width: 640px) 50vw, 100vw"}
              priority={hero}
              className="object-cover transition-transform duration-700 ease-[var(--ease-swift)] group-hover:scale-[1.03]"
              style={{ objectPosition: still.position ?? "50% 50%" }}
            />
          </div>
        ) : (
          <Vignette kind={project.vignette} className="vg-card" />
        )}

        {/* legibility: a quiet scrim under the title */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.72),rgb(0_0_0/0.18)_45%,transparent_70%)]" />
        {showCover ? (
          <div className="pointer-events-none absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-transparent" />
        ) : null}

        <div className={cn("pointer-events-none absolute inset-0 flex flex-col justify-between p-5 text-left sm:p-7", hero && "lg:p-10")}>
          <span className="w-fit rounded-full border border-white/20 bg-black/25 px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.08em] text-white uppercase backdrop-blur-md">
            {project.status}
          </span>
          <div className="translate-y-2 transition-transform duration-500 ease-[var(--ease-swift)] group-hover:translate-y-0">
            <h2
              className={cn(
                "font-display text-2xl font-bold tracking-[-0.035em] text-white sm:text-3xl",
                hero && "sm:text-4xl lg:text-5xl",
              )}
            >
              {project.title}
            </h2>
            <p className={cn("mt-1.5 max-w-xl text-sm leading-snug text-white/80", hero && "sm:text-base lg:text-lg")}>
              {project.tagline}
            </p>
            <p className="mt-2 flex items-center gap-1 text-[11px] font-medium tracking-[0.06em] text-white/70 uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {project.period} · {project.categories.join(" · ")}
            </p>
          </div>
        </div>

        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold tracking-[0.04em] text-black uppercase shadow-[0_0_25px_rgb(255_255_255/0.35)]",
            "scale-90 opacity-0 transition-[opacity,transform] duration-200 ease-[var(--ease-swift)] group-hover:scale-100 group-hover:opacity-100",
          )}
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
            <path d="M6 2.5v6.2l-1.4-1.3a1 1 0 0 0-1.4 1.4l3 3.1c.6.6 1.4 1 2.3 1H10a3 3 0 0 0 3-3V7.6a1 1 0 0 0-2 0V7a1 1 0 0 0-2 0v-.4a1 1 0 0 0-2 0V2.5a1 1 0 0 0-2 0Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          Click for info
        </span>
      </div>
    </TiltCard>
  )
}
