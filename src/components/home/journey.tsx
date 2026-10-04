import Link from "next/link"

import type { Milestone } from "@/content/types"
import { ArrowRight } from "../icons"
import { delay } from "../marks"

// Josh Tilton's mono career rows, set on cali.so hairlines with selective
// focus: hovering a row softens the others.

export function Journey({ items, start = 0 }: { items: Milestone[]; start?: number }) {
  return (
    <ol className="focus-list mt-4 flex flex-col">
      {items.map((m, i) => {
        const inner = (
          <>
            <span className="journey-date">{m.label}</span>
            <span className="journey-title truncate">
              {m.title}
              {m.href ? <ArrowRight className="journey-arrow" /> : null}
            </span>
            {m.org ? <span className="journey-org">{m.org}</span> : <span />}
          </>
        )
        return (
          <li key={`${m.date}-${m.title}`} className="enter-swing" style={delay(start + i * 45)}>
            {m.href ? (
              <Link href={m.href} className="journey-row hairline-top">
                {inner}
              </Link>
            ) : (
              <div className="journey-row hairline-top">{inner}</div>
            )}
          </li>
        )
      })}
    </ol>
  )
}
