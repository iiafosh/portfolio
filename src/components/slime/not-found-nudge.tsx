"use client"

import { useEffect } from "react"

/** On the 404 page the slime owns up. */
export function NotFoundNudge() {
  useEffect(() => {
    const t = window.setTimeout(() => window.dispatchEvent(new CustomEvent("slime:say", { detail: "lost" })), 900)
    return () => window.clearTimeout(t)
  }, [])
  return null
}
