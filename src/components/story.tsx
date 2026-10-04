import type { ContentLink, StoryBlock } from "@/content/types"
import { ArrowNE } from "./icons"
import { SheetBlock } from "./sheet"

/** A case study as titled blocks: paragraphs, cell bullets, hatch quotes. */
export function Story({ blocks }: { blocks: StoryBlock[] }) {
  return (
    <>
      {blocks.map((block) => (
        <SheetBlock key={block.title} title={block.title}>
          <div className="flex flex-col gap-3">
            {block.body?.map((p) => (
              <p key={p.slice(0, 32)} className="prose-copy">
                {p}
              </p>
            ))}
            {block.list ? (
              <ul className="cell-list">
                {block.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {block.quote ? <blockquote className="quote-hatch italic">&ldquo;{block.quote}&rdquo;</blockquote> : null}
          </div>
        </SheetBlock>
      ))}
    </>
  )
}

const KIND_LABEL: Record<NonNullable<ContentLink["kind"]>, string> = {
  live: "Live",
  repo: "Code",
  download: "Download",
  post: "Post",
  news: "Press",
  video: "Video",
  site: "Site",
}

/** yust.dev's proof links: small mono rows with an external mark. */
export function ProofLinks({ links, className }: { links: ContentLink[]; className?: string }) {
  if (!links.length) return null
  return (
    <ul className={className ?? "flex flex-wrap gap-x-5 gap-y-2"}>
      {links.map((link) => (
        <li key={link.href + link.label}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
          >
            {link.kind ? (
              <span className="rounded-[3px] px-1 py-px text-[9px] tracking-[0.1em] uppercase shadow-[inset_0_0_0_1px_var(--border)]">
                {KIND_LABEL[link.kind]}
              </span>
            ) : null}
            <span className="underline decoration-border decoration-dotted underline-offset-4 group-hover:decoration-current">
              {link.label}
            </span>
            <ArrowNE className="external-mark size-3" />
          </a>
        </li>
      ))}
    </ul>
  )
}
