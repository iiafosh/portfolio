"use client"

import { useEffect, useState } from "react"

import { site } from "@/content/site"

// The colophon's instrument: Mostafa's local time in Egypt as a tiny spec
// plate — offset label, tabular time, and a quiet analog face (cali.so).

function parts(date: Date) {
  const time = new Intl.DateTimeFormat("en-US", {
    timeZone: site.timeZone,
    hour: "numeric",
    minute: "2-digit",
  }).format(date)
  const offset =
    new Intl.DateTimeFormat("en-US", { timeZone: site.timeZone, timeZoneName: "shortOffset" })
      .formatToParts(date)
      .find((p) => p.type === "timeZoneName")?.value ?? "GMT+2"
  const [h, m] = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })
    .format(date)
    .split(":")
    .map(Number)
  return { time, offset: offset.replace("GMT", "UTC"), h, m }
}

export function FooterClock() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    let timer = 0
    const tick = () => {
      setNow(new Date())
      // align to the next minute; pause while the tab is hidden
      timer = window.setTimeout(tick, 60_000 - (Date.now() % 60_000) + 50)
    }
    const onVisibility = () => {
      window.clearTimeout(timer)
      if (!document.hidden) tick()
    }
    tick()
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener("visibilitychange", onVisibility)
    }
  }, [])

  const p = now ? parts(now) : null
  const minuteAngle = p ? p.m * 6 : 0
  const hourAngle = p ? (p.h % 12) * 30 + p.m * 0.5 : 0

  return (
    <div className="flex items-center gap-2.5">
      <svg viewBox="0 0 22 22" className="size-[1.375rem] shrink-0 text-muted-foreground" aria-hidden="true">
        <circle cx="11" cy="11" r="10" fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="0.8" />
        {[0, 90, 180, 270].map((a) => (
          <line
            key={a}
            x1="11"
            y1="2.4"
            x2="11"
            y2="3.6"
            stroke="currentColor"
            strokeOpacity="0.5"
            strokeWidth="0.8"
            transform={`rotate(${a} 11 11)`}
          />
        ))}
        <line
          x1="11"
          y1="11"
          x2="11"
          y2="6.2"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          transform={`rotate(${hourAngle} 11 11)`}
        />
        <line
          x1="11"
          y1="11"
          x2="11"
          y2="4"
          stroke="currentColor"
          strokeWidth="0.8"
          strokeLinecap="round"
          transform={`rotate(${minuteAngle} 11 11)`}
        />
        <circle cx="11" cy="11" r="1" fill="var(--signal)" />
      </svg>
      <span className="flex flex-col gap-px leading-none">
        <span className="text-[0.625rem] tracking-[0.08em] text-muted-foreground/80 uppercase">
          {p?.offset ?? "UTC+3"} · Egypt
        </span>
        <time
          className="min-w-[8ch] text-xs text-muted-foreground tabular"
          dateTime={now?.toISOString()}
          suppressHydrationWarning
        >
          {p?.time ?? "—:—"}
        </time>
      </span>
    </div>
  )
}
