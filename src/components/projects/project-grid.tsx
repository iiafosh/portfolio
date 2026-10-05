"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"

import { getProject, PROJECT_CATEGORIES } from "@/content/projects"
import { site } from "@/content/site"
import type { Project, ProjectCategory } from "@/content/types"
import { replaceSearchParam, useSearchParam } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import { GitHubIcon } from "../icons"
import { Sheet } from "../sheet"
import { ProjectCard } from "./project-card"
import { ProjectSheetBody } from "./project-sheet"

type Category = "All" | ProjectCategory

/** The bento with its category pills (yust.dev). The sheet follows ?p=slug. */
export function ProjectGrid({ items }: { items: Project[] }) {
  const fromUrl = useSearchParam("p")
  const [category, setCategory] = useState<Category>("All")
  const current = getProject(fromUrl)

  const setOpen = (slug: string | null) => replaceSearchParam("p", slug)

  return (
    <>
      <ProjectGridView items={items} category={category} onCategory={setCategory} onOpen={setOpen} />
      <Sheet
        open={current !== undefined}
        onOpenChange={(open) => {
          if (!open) setOpen(null)
        }}
        eyebrow={current ? `${current.period} · ${current.categories.join(" · ")}` : ""}
        title={current?.title ?? ""}
        description={current?.summary}
      >
        {current ? <ProjectSheetBody project={current} /> : null}
      </Sheet>
    </>
  )
}

export function ProjectGridView({
  items,
  category,
  onCategory,
  onOpen,
}: {
  items: Project[]
  category: Category
  onCategory: (c: Category) => void
  onOpen: (slug: string) => void
}) {
  const reduce = useReducedMotion()
  const visible = category === "All" ? items : items.filter((p) => p.categories.includes(category))
  const counts = Object.fromEntries(
    PROJECT_CATEGORIES.map((c) => [c, c === "All" ? items.length : items.filter((p) => p.categories.includes(c)).length]),
  ) as Record<Category, number>

  return (
    <>
      <div className="enter mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="Filter projects"
          className="no-scrollbar -mx-6 flex items-center gap-1.5 overflow-x-auto px-6 py-1 sm:mx-0 sm:flex-wrap sm:px-0"
        >
          {PROJECT_CATEGORIES.filter((c) => counts[c] > 0).map((c) => {
            const active = c === category
            return (
              <button
                key={c}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onCategory(c)}
                className={cn(
                  "relative shrink-0 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors duration-200",
                  active
                    ? "text-background"
                    : "text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] hover:text-foreground",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="project-filter"
                    className="absolute inset-0 rounded-full bg-foreground shadow-[0_0_20px_color-mix(in_oklab,var(--foreground)_20%,transparent)]"
                    transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative">
                  {c}
                  <span className={cn("ml-1.5 tabular", active ? "opacity-60" : "opacity-50")}>{counts[c]}</span>
                </span>
              </button>
            )
          })}
        </div>
        <a
          href={site.socials.github.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-pill btn-pill-ghost hidden h-8 shrink-0 px-3.5 text-[0.8125rem] sm:inline-flex"
        >
          <GitHubIcon className="size-3.5" />
          View GitHub
        </a>
      </div>

      <motion.ul
        layout={!reduce}
        className="mt-6 grid grid-flow-row-dense auto-rows-[20rem] grid-cols-1 gap-4 sm:auto-rows-[22rem] sm:grid-cols-2 sm:gap-5 lg:auto-rows-[24rem]"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((project, i) => (
            <motion.li
              key={project.slug}
              layout={!reduce}
              initial={reduce ? false : { opacity: 0, scale: 0.96, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.96, filter: "blur(4px)", transition: { duration: 0.18 } }}
              transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1], delay: reduce ? 0 : Math.min(i, 6) * 0.04 }}
              className={cn(
                project.size === "hero" && "sm:col-span-2 lg:row-span-2",
                project.size === "wide" && category === "All" && "sm:col-span-2",
              )}
            >
              <ProjectCard project={project} onOpen={() => onOpen(project.slug)} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  )
}
