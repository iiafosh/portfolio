"use client"

import { useEffect, useRef, useState } from "react"

import { site } from "@/content/site"
import { useMounted } from "@/lib/hooks"
import { usePrefs } from "@/lib/prefs"
import { SlimeEngine } from "./engine"

/**
 * Mounts the slime while it's "out of the dock" (a visitor preference).
 * The engine owns the canvas and the bubble's position; React only renders
 * the bubble's words.
 */
export function Slime() {
  const prefs = usePrefs()
  const mounted = useMounted()
  const [alive, setAlive] = useState(false)
  const [words, setWords] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const bubbleRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<SlimeEngine | null>(null)

  // out → mount; in → fly home, then unmount
  useEffect(() => {
    if (!mounted) return
    const engine = engineRef.current
    if (prefs.slime) {
      if (engine) engine.cancelRecall()
      else setAlive(true)
    } else if (engine) {
      engine.recall(() => setAlive(false))
    }
  }, [prefs.slime, mounted])

  useEffect(() => {
    if (!alive || !canvasRef.current || !bubbleRef.current) return
    const engine = new SlimeEngine({
      canvas: canvasRef.current,
      bubble: bubbleRef.current,
      name: site.pet.name,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      onSay: setWords,
    })
    engineRef.current = engine
    engine.start()
    return () => {
      engine.destroy()
      engineRef.current = null
      setWords(null)
    }
  }, [alive])

  if (!alive) return null

  return (
    <>
      <canvas ref={canvasRef} className="slime-canvas" aria-hidden="true" />
      <div ref={bubbleRef} className="slime-bubble-anchor" aria-hidden="true">
        <div className="slime-bubble" data-visible={words ? "true" : undefined}>
          {words}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {words}
      </p>
    </>
  )
}
