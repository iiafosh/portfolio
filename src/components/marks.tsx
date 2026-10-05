import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { ArrowNE } from "./icons"

// Small printed marks shared by every page: the pixel-cluster stamp, section
// tags, page headers, spec plates and links (cali.so's technical-print register).

const CLUSTERS = [
  ["", "s", "a", "b"],
  ["a", "s", "", "b"],
  ["s", "a", "b", ""],
  ["b", "", "s", "a"],
  ["a", "b", "s", ""],
  ["", "a", "b", "s"],
] as const

/** Masthead stamp: a 2×2 dither cluster with exactly one lit cell. */
export function PixelCluster({ variant = 0, className }: { variant?: number; className?: string }) {
  const cells = CLUSTERS[((variant % CLUSTERS.length) + CLUSTERS.length) % CLUSTERS.length]
  return (
    <span className={cn("pixel-cluster", className)} aria-hidden="true">
      {cells.map((cell, i) => (
        <span key={i} className={cell ? `pc-${cell}` : undefined} />
      ))}
    </span>
  )
}

export function delay(ms: number): CSSProperties {
  return { "--enter-delay": `${ms}ms` } as CSSProperties
}

export function SectionTag({
  index,
  children,
  className,
  style,
  as: Tag = "h2",
}: {
  index: number
  children: ReactNode
  className?: string
  style?: CSSProperties
  as?: "h2" | "h3" | "p"
}) {
  return (
    <Tag className={cn("section-tag", className)} style={style}>
      <span className="section-tag-index" aria-hidden="true">
        {String(index).padStart(2, "0")}
      </span>
      <span className="section-tag-hatch" aria-hidden="true" />
      <span className="section-tag-label">{children}</span>
    </Tag>
  )
}

/** Page masthead: eyebrow, the pixel title, an introduction and the stamp. */
export function PageHeader({
  eyebrow,
  title,
  count,
  children,
  stamp = 0,
}: {
  eyebrow: string
  title: string
  count?: number
  children?: ReactNode
  stamp?: number
}) {
  return (
    <header className="relative">
      <div className="flex items-center justify-between gap-4">
        <p className="page-eyebrow enter">{eyebrow}</p>
        <PixelCluster variant={stamp} className="enter shrink-0" />
      </div>
      <h1
        className="enter mt-4 font-display font-bold tracking-[-0.045em] text-[2.25rem] leading-[1.05] text-foreground sm:text-[2.75rem]"
        style={delay(40)}
      >
        {title}
        {count !== undefined ? (
          <span className="ml-2.5 align-[0.6em] text-sm font-medium tracking-normal text-muted-foreground tabular">
            ({String(count).padStart(2, "0")})
          </span>
        ) : null}
      </h1>
      {children ? (
        <div className="page-introduction enter mt-5 max-w-[34rem]" style={delay(90)}>
          {children}
        </div>
      ) : null}
    </header>
  )
}

/** Text link that leaves the site: dotted underline that inks in + NE mark. */
export function ExternalLink({
  href,
  children,
  className,
  mark = true,
}: {
  href: string
  children: ReactNode
  className?: string
  mark?: boolean
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("link-dotted", className)}>
      {children}
      {mark ? <ArrowNE className="external-mark" /> : null}
    </a>
  )
}

export function InlineLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("link-dotted", className)}>
      {children}
    </Link>
  )
}

export function SpecPlate({ items, className }: { items: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={cn("spec-plate", className)}>
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt>{item.label}</dt>
          <dd className="truncate">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function StatusLadder({
  steps,
  className,
}: {
  steps: { label: string; state: "done" | "current" | "pending" }[]
  className?: string
}) {
  return (
    <ol className={cn("status-ladder", className)} aria-hidden="true">
      {steps.map((step, i) => (
        <li key={step.label} data-state={step.state}>
          <span className="status-ladder-index">{String(i + 1).padStart(2, "0")}</span>
          <span className="shrink-0">{step.label}</span>
          <span className="status-ladder-rule" />
          <span className="status-ladder-cell" />
        </li>
      ))}
    </ol>
  )
}

export function CertStamp({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("cert-stamp", className)}>
      <span className="signal-cell" aria-hidden="true" />
      {children}
      <span aria-hidden="true">+</span>
    </span>
  )
}

/** A comma list of people, linked where they have a site. */
export function People({ people }: { people: { name: string; href?: string }[] }) {
  return (
    <>
      {people.map((person, i) => (
        <span key={person.name}>
          {person.href ? (
            <ExternalLink href={person.href} mark={false}>
              {person.name}
            </ExternalLink>
          ) : (
            <span className="text-foreground">{person.name}</span>
          )}
          {i < people.length - 2 ? ", " : i === people.length - 2 ? " & " : ""}
        </span>
      ))}
    </>
  )
}
