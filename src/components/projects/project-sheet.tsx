"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { getHackathon } from "@/content/hackathons"
import type { Project } from "@/content/types"
import { cn } from "@/lib/utils"
import { BrandIcon, brandFor } from "../brand-icon"
import { ArrowNE, ArrowRight, PlayIcon } from "../icons"
import { People, SpecPlate } from "../marks"
import { SheetBlock } from "../sheet"
import { Story } from "../story"
import { Vignette } from "./vignettes"

// The case study inside the bottom sheet, in yust.dev's drawer order:
// media, the facts, the call to action, then the story.

export function ProjectSheetBody({ project }: { project: Project }) {
  const hackathon = getHackathon(project.hackathon)
  const [primary, ...secondary] = project.links

  return (
    <div>
      <Media key={project.slug} project={project} />

      <SpecPlate
        className="mt-5"
        items={[
          { label: "When", value: project.period },
          { label: "Status", value: project.status },
          { label: "Field", value: project.categories.join(" · ") },
        ]}
      />

      {primary ? (
        <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill-primary h-11 flex-1 text-[0.9375rem]"
          >
            {primary.kind === "live" ? <PlayIcon className="size-3.5" /> : null}
            {primary.label}
            <ArrowNE className="size-4" />
          </a>
          {secondary.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill btn-pill-ghost h-11 text-[0.8125rem]"
            >
              {link.label}
              <ArrowNE className="size-3.5" />
            </a>
          ))}
        </div>
      ) : null}

      <SheetBlock title="My part">
        <p className="prose-copy">{project.role}</p>
      </SheetBlock>

      <SheetBlock title="Highlights">
        <ul className="cell-list">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </SheetBlock>

      <Story blocks={project.story} />

      <SheetBlock title="Stack">
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((tool) => {
            const brand = brandFor(tool)
            return (
              <span key={tool} className="tool-pill">
                {brand ? <BrandIcon name={brand} /> : null}
                {tool}
              </span>
            )
          })}
        </div>
      </SheetBlock>

      {project.team?.length ? (
        <SheetBlock title="Built with">
          <p className="prose-copy">
            <People people={project.team} />
          </p>
        </SheetBlock>
      ) : null}

      {hackathon ? (
        <div className="hairline-top pt-5">
          <Link
            href={`/hackathons#${hackathon.slug}`}
            className="group flex items-center justify-between gap-4 rounded-xl p-3 shadow-[inset_0_0_0_1px_var(--border)] transition-colors duration-150 hover:bg-[var(--hover)]"
          >
            <span>
              <span className="mono-label block">Built at</span>
              <span className="mt-1 block text-sm text-foreground">
                {hackathon.name} — {hackathon.result.label}
              </span>
            </span>
            <ArrowRight className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      ) : null}
    </div>
  )
}

function Media({ project }: { project: Project }) {
  const shots = [...(project.video || project.cardMedia === "vignette" || !project.cover ? [] : [project.cover]), ...(project.gallery ?? [])]
  // 0 = the trailer (or the vignette), 1.. = screenshots
  const hasLead = Boolean(project.video) || shots.length === 0 || project.cardMedia === "vignette"
  const [active, setActive] = useState(hasLead ? 0 : 1)
  const shot = active > 0 ? shots[active - 1] : null

  return (
    <div className="flex flex-col gap-2.5">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-[0_0_0_1px_var(--border)]">
        {shot ? (
          <Image key={shot.src} src={shot.src} alt={shot.alt} fill sizes="(min-width: 768px) 44rem, 100vw" className="object-contain" />
        ) : project.video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={project.video.src}
            poster={project.video.poster}
            controls
            playsInline
            preload="none"
          />
        ) : (
          <Vignette kind={project.vignette} live />
        )}
      </div>
      {shots.length > 0 && (hasLead || shots.length > 1) ? (
        <ul className="grid grid-cols-4 gap-2">
          {hasLead ? (
            <li>
              <button
                type="button"
                onClick={() => setActive(0)}
                aria-label={project.video ? "Show the trailer" : "Show the cover"}
                aria-pressed={active === 0}
                className={cn(
                  "relative grid aspect-video w-full place-items-center overflow-hidden rounded-lg bg-black text-white shadow-[0_0_0_1px_var(--border)] transition-[opacity,box-shadow] duration-150",
                  active === 0 ? "shadow-[0_0_0_2px_var(--foreground)]" : "opacity-70 hover:opacity-100",
                )}
              >
                {project.video?.poster ? (
                  <Image src={project.video.poster} alt="" fill sizes="10rem" className="object-cover opacity-70" />
                ) : null}
                <span className="relative grid size-7 place-items-center rounded-full bg-white/90 text-black">
                  <PlayIcon className="size-3" />
                </span>
              </button>
            </li>
          ) : null}
          {shots.map((item, i) => (
            <li key={item.src}>
              <button
                type="button"
                onClick={() => setActive(i + 1)}
                aria-label={`Show: ${item.alt}`}
                aria-pressed={active === i + 1}
                className={cn(
                  "relative block aspect-video w-full overflow-hidden rounded-lg shadow-[0_0_0_1px_var(--border)] transition-[opacity,box-shadow] duration-150",
                  active === i + 1 ? "shadow-[0_0_0_2px_var(--foreground)]" : "opacity-70 hover:opacity-100",
                )}
              >
                <Image src={item.src} alt="" fill sizes="10rem" className="object-cover" style={{ objectPosition: item.position ?? "50% 50%" }} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
