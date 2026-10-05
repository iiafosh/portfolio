"use client"

import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useState } from "react"

import { BrandIcon, brandFor } from "../brand-icon"

// aryan karma's skill pills with a "show more", grouped like a spec sheet.
// Collapsed by default so the home page never grows with the list.

const VISIBLE = 3

export function Toolbox({ groups }: { groups: { group: string; items: string[] }[] }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const shown = open ? groups : groups.slice(0, VISIBLE)

  return (
    <div className="mt-4">
      <dl className="flex flex-col">
        <AnimatePresence initial={false}>
          {shown.map((g) => (
            <motion.div
              key={g.group}
              initial={reduce ? false : { opacity: 0, filter: "blur(3px)", y: 6 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={reduce ? undefined : { opacity: 0, filter: "blur(3px)", transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
              className="hairline-top grid gap-2 py-3 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-4"
            >
              <dt className="mono-label pt-1.5">{g.group}</dt>
              <dd className="flex flex-wrap gap-1.5">
                {g.items.map((item) => {
                  const brand = brandFor(item)
                  return (
                    <span key={item} className="tool-pill">
                      {brand ? <BrandIcon name={brand} /> : null}
                      {item}
                    </span>
                  )
                })}
              </dd>
            </motion.div>
          ))}
        </AnimatePresence>
      </dl>
      {groups.length > VISIBLE ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="hairline-top flex w-full items-center gap-2 pt-3 text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase transition-colors duration-150 hover:text-foreground"
        >
          [ {open ? "Show less" : `Show ${groups.length - VISIBLE} more`} ]
          <motion.span
            aria-hidden="true"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="text-[9px]"
          >
            ▼
          </motion.span>
        </button>
      ) : null}
    </div>
  )
}
