import { sounds } from "@/lib/sound"
import { pickLine, type LineKind } from "./lines"

/*
 * ══════════════════════════════════════════════════════════════════════
 *  The slime — a soft body on a canvas, outside React.
 *
 *  A ring of points integrated with Verlet, held together by shape
 *  matching (best-fit rotation of a rest dome), edge springs and a little
 *  pressure. Gravity squashes it into a Rimuru-like dome on whatever it
 *  sits on: the bottom of the window or the top of the dock.
 *
 *  Grab it (points near the cursor follow hardest, so it dangles), fling
 *  it, boop it, pet it, leave it alone until it naps. All motion is
 *  pointer-driven or idle wandering; under reduced motion it never moves
 *  on its own.
 * ══════════════════════════════════════════════════════════════════════
 */

interface Point {
  x: number
  y: number
  px: number
  py: number
}

interface Vec {
  x: number
  y: number
}

type Face = "idle" | "happy" | "squint" | "surprised" | "flying" | "dizzy" | "sleeping"

interface Particle {
  kind: "drop" | "heart" | "z" | "spark"
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  size: number
  spin: number
}

interface Colors {
  hi: string
  mid: string
  deep: string
  line: string
  dark: boolean
}

export interface SlimeEngineOptions {
  canvas: HTMLCanvasElement
  bubble: HTMLElement
  name: string
  reducedMotion: boolean
  onSay: (text: string | null) => void
}

const N = 26
const DT = 1 / 120
const MAX_STEPS = 5
const GRAVITY = 2300
const BOUNCE_FLOOR = 0.32
const BOUNCE_WALL = 0.45
const FRICTION = 0.9
const MAX_THROW = 3200
const SLEEP_AFTER = 40_000
const TIP_EVERY = 55_000

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const easeOutBack = (t: number) => {
  const c1 = 1.70158
  const c3 = c1 + 1
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2
}

export class SlimeEngine {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private bubble: HTMLElement
  private name: string
  private reduced: boolean
  private onSay: (text: string | null) => void

  private W = 0
  private H = 0
  private dpr = 1

  // body
  private pts: Point[] = []
  private rest: Vec[] = []
  private restArea = 0
  private a = 36 // half width of the rest dome
  private bTop = 32
  private bBot = 18
  private scale = 1
  private squashX = 1
  private squashY = 1
  private squashTargetX = 1
  private squashTargetY = 1
  private squashUntil = 0
  private theta = 0
  private cx = 0
  private cy = 0
  private grounded = false
  private groundedSince = 0

  // world
  private platforms: DOMRect[] = []
  private platformScan = 0
  private sheetOpen = false

  // input
  private pointer = { x: -9999, y: -9999, seen: false }
  private history: { x: number; y: number; t: number }[] = []
  private grab: null | {
    id: number
    offsets: Vec[]
    weights: number[]
    sx: number
    sy: number
    t: number
    moved: boolean
  } = null
  private hover = false
  private consumeClickUntil = 0
  private petDistance = 0
  private petStart = 0
  private lastPet = 0

  // mind
  private face: Face = "idle"
  private faceUntil = 0
  private blinkAt = 0
  private blinkUntil = 0
  private nextThink = 0
  private lastInteraction = 0
  private asleep = false
  private lastZ = 0
  private anticipation: null | { at: number; vx: number; vy: number } = null
  private hardHits: number[] = []
  private impactCooldown = 0
  private spinAccum = 0
  private lastTheta = 0
  private gaze: Vec = { x: 0, y: 0 }
  private lookAt: null | { x: number; y: number; until: number } = null

  // talk
  private said: string | null = null
  private sayUntil = 0
  private nextTip = 0
  private greeted = false
  private bubbleW = 0
  private bubbleH = 0

  // effects
  private particles: Particle[] = []
  private colors: Colors = { hi: "#e8f8ff", mid: "#8fd3f4", deep: "#4a9fd6", line: "#1e3a5f", dark: true }

  // lifecycle
  private raf = 0
  private last = 0
  private acc = 0
  private running = false
  private spawnStart = 0
  private recallState: null | { t0: number; done: () => void } = null
  private observer: MutationObserver | null = null

  constructor(options: SlimeEngineOptions) {
    this.canvas = options.canvas
    const ctx = this.canvas.getContext("2d", { alpha: true })
    if (!ctx) throw new Error("slime: no 2d context")
    this.ctx = ctx
    this.bubble = options.bubble
    this.name = options.name
    this.reduced = options.reducedMotion
    this.onSay = options.onSay
  }

  // ── lifecycle ────────────────────────────────────────────────────────

  start() {
    this.resize()
    this.refreshColors()
    this.scanPlatforms(true)
    this.buildBody()
    this.spawn()

    window.addEventListener("resize", this.resize)
    window.addEventListener("pointerdown", this.onPointerDown, { capture: true })
    window.addEventListener("pointermove", this.onPointerMove, { capture: true, passive: true })
    window.addEventListener("pointerup", this.onPointerUp, { capture: true })
    window.addEventListener("pointercancel", this.onPointerUp, { capture: true })
    window.addEventListener("click", this.onClick, { capture: true })
    window.addEventListener("touchstart", this.onTouchStart, { capture: true, passive: false })
    window.addEventListener("dblclick", this.onDoubleClick, { capture: true })
    window.addEventListener("slime:say", this.onSayRequest)
    document.addEventListener("visibilitychange", this.onVisibility)

    this.observer = new MutationObserver(this.onRootChange)
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-skin", "data-sheet-open"],
    })

    this.running = true
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.frame)

    if (process.env.NODE_ENV !== "production") {
      ;(window as unknown as { __slime?: SlimeEngine }).__slime = this
    }
  }

  destroy() {
    this.running = false
    cancelAnimationFrame(this.raf)
    window.removeEventListener("resize", this.resize)
    window.removeEventListener("pointerdown", this.onPointerDown, { capture: true })
    window.removeEventListener("pointermove", this.onPointerMove, { capture: true })
    window.removeEventListener("pointerup", this.onPointerUp, { capture: true })
    window.removeEventListener("pointercancel", this.onPointerUp, { capture: true })
    window.removeEventListener("click", this.onClick, { capture: true })
    window.removeEventListener("touchstart", this.onTouchStart, { capture: true })
    window.removeEventListener("dblclick", this.onDoubleClick, { capture: true })
    window.removeEventListener("slime:say", this.onSayRequest)
    document.removeEventListener("visibilitychange", this.onVisibility)
    this.observer?.disconnect()
    this.setCursor(null)
  }

  /** Fly back into the dock, then call `done`. */
  recall(done: () => void) {
    if (this.recallState) return
    this.grab = null
    this.setCursor(null)
    this.recallState = { t0: performance.now(), done }
    this.say("bye", 1400)
  }

  /** Change of heart mid-recall: pop back out. */
  cancelRecall() {
    if (!this.recallState) return
    this.recallState = null
    this.scale = Math.max(this.scale, 0.4)
    this.spawnStart = performance.now()
  }

  // ── setup ────────────────────────────────────────────────────────────

  private resize = () => {
    this.dpr = Math.min(2, window.devicePixelRatio || 1)
    this.W = window.innerWidth
    this.H = window.innerHeight
    this.canvas.width = Math.round(this.W * this.dpr)
    this.canvas.height = Math.round(this.H * this.dpr)
    this.canvas.style.width = `${this.W}px`
    this.canvas.style.height = `${this.H}px`
    const small = this.W < 640
    const a = small ? 28 : 36
    if (a !== this.a && this.pts.length) {
      this.a = a
      this.bTop = a * 0.88
      this.bBot = a * 0.5
      this.buildRest()
    } else {
      this.a = a
      this.bTop = a * 0.88
      this.bBot = a * 0.5
    }
    this.scanPlatforms(true)
  }

  private buildRest() {
    const rest: Vec[] = []
    for (let i = 0; i < N; i++) {
      const t = (i / N) * Math.PI * 2 - Math.PI / 2
      const c = Math.cos(t)
      const s = Math.sin(t) // y-down: s < 0 is the top
      let x = this.a * c
      const y = s < 0 ? this.bTop * s : this.bBot * s
      if (s > 0) x *= 1 + 0.16 * s // a soft skirt at the bottom
      rest.push({ x, y })
    }
    let mx = 0
    let my = 0
    for (const r of rest) {
      mx += r.x
      my += r.y
    }
    mx /= N
    my /= N
    for (const r of rest) {
      r.x -= mx
      r.y -= my
    }
    this.rest = rest
    this.restArea = Math.abs(polygonArea(rest))
  }

  private buildBody() {
    this.buildRest()
    this.pts = this.rest.map((r) => ({ x: r.x, y: r.y, px: r.x, py: r.y }))
  }

  private home(): Vec {
    const el = document.querySelector<HTMLElement>("[data-slime-home]")
    const r = el?.getBoundingClientRect()
    if (r && r.width > 0 && !this.sheetOpen) return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    return { x: this.W / 2, y: this.H + 40 }
  }

  private spawn() {
    const h = this.home()
    this.scale = 0.35
    // pop out of the top of the dock, not from inside it
    const dock = this.platforms.find((r) => h.x > r.left && h.x < r.right && h.y > r.top && h.y < r.bottom)
    if (dock) h.y = dock.top - this.bBot * this.scale - 2
    const vx = rand(-160, 160) * (h.x > this.W / 2 ? 1.2 : 0.8) - (h.x > this.W * 0.7 ? 120 : 0)
    const vy = -rand(820, 980)
    this.spawnStart = performance.now()
    for (let i = 0; i < N; i++) {
      const r = this.rest[i]
      const p = this.pts[i]
      p.x = h.x + r.x * this.scale
      p.y = h.y + r.y * this.scale
      p.px = p.x - vx * DT
      p.py = p.y - vy * DT
    }
    this.face = "flying"
    this.faceUntil = performance.now() + 600
    this.lastInteraction = performance.now()
    this.burst(h.x, h.y, "spark", 8)
  }

  private refreshColors() {
    const css = getComputedStyle(document.documentElement)
    const read = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback
    this.colors = {
      hi: read("--slime-hi", "#e8f8ff"),
      mid: read("--slime-mid", "#8fd3f4"),
      deep: read("--slime-deep", "#4a9fd6"),
      line: read("--slime-line", "#1e3a5f"),
      dark: document.documentElement.classList.contains("dark"),
    }
  }

  private onRootChange = (records: MutationRecord[]) => {
    const root = document.documentElement
    this.sheetOpen = root.hasAttribute("data-sheet-open")
    if (this.sheetOpen && this.grab) {
      this.grab = null
      this.setCursor(null)
    }
    if (records.some((r) => r.attributeName === "class")) {
      this.refreshColors()
    }
    this.scanPlatforms(true)
  }

  /** Pages can nudge the slime: dispatch `slime:say` with `{ detail: "lost" }`. */
  private onSayRequest = (e: Event) => {
    const kind = (e as CustomEvent<string>).detail as LineKind
    if (!kind || this.recallState) return
    this.wake()
    this.setFace("surprised", 900)
    this.say(kind, 3600)
    this.hopInPlace(0.9)
  }

  private onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf)
    } else if (this.running) {
      this.last = performance.now()
      this.raf = requestAnimationFrame(this.frame)
    }
  }

  private scanPlatforms(force = false) {
    const now = performance.now()
    if (!force && now - this.platformScan < 250) return
    this.platformScan = now
    const rects: DOMRect[] = []
    if (!this.sheetOpen) {
      document.querySelectorAll<HTMLElement>("[data-slime-platform]").forEach((el) => {
        const r = el.getBoundingClientRect()
        if (r.width <= 0 || r.height <= 0 || r.top >= this.H || r.bottom <= 0) return
        const bottom = this.H - r.bottom < 48 ? this.H + 1 : r.bottom
        rects.push(new DOMRect(r.left, r.top, r.width, bottom - r.top))
      })
    }
    this.platforms = rects
  }

  // ── the loop ─────────────────────────────────────────────────────────

  private frame = (now: number) => {
    if (!this.running) return
    let elapsed = (now - this.last) / 1000
    this.last = now
    if (elapsed > 0.1) elapsed = 0.1 // tab switches, slow frames
    this.acc += elapsed

    this.scanPlatforms()
    this.updateSquash(now)

    if (this.spawnStart) {
      const k = clamp((now - this.spawnStart) / 420, 0, 1)
      this.scale = 0.35 + 0.65 * easeOutBack(k)
      if (k >= 1) {
        this.scale = 1
        this.spawnStart = 0
      }
    }

    if (this.anticipation && now >= this.anticipation.at) {
      this.impulse(this.anticipation.vx, this.anticipation.vy)
      this.anticipation = null
      this.squash(0.94, 1.07, 160)
    }

    let steps = 0
    let impact = 0
    while (this.acc >= DT && steps < MAX_STEPS) {
      impact = Math.max(impact, this.step())
      this.acc -= DT
      steps++
    }
    if (steps === MAX_STEPS) this.acc = 0

    if (this.recallState) {
      if (this.updateRecall(now)) return
    } else {
      this.react(now, impact)
      this.think(now)
    }

    this.updateParticles(elapsed)
    this.draw(now)
    this.placeBubble(now)
    this.raf = requestAnimationFrame(this.frame)
  }

  /** One fixed physics step. Returns the hardest impact speed (px/s). */
  private step(): number {
    const grabbed = this.grab !== null
    const g = this.recallState ? 0 : GRAVITY
    const damping = grabbed ? 0.982 : 0.997

    for (const p of this.pts) {
      const vx = (p.x - p.px) * damping
      const vy = (p.y - p.py) * damping
      p.px = p.x
      p.py = p.y
      p.x += vx
      p.y += vy + g * DT * DT
    }

    if (this.grab && this.pointer.seen) {
      const { offsets, weights } = this.grab
      for (let i = 0; i < N; i++) {
        const p = this.pts[i]
        const tx = this.pointer.x + offsets[i].x
        const ty = this.pointer.y + offsets[i].y
        const k = weights[i] * 0.34
        p.x += (tx - p.x) * k
        p.y += (ty - p.y) * k
      }
    }

    for (let it = 0; it < 2; it++) {
      this.shapeMatch()
      this.edges()
    }
    this.pressure()
    return this.collide()
  }

  private shapeMatch() {
    const pts = this.pts
    let cx = 0
    let cy = 0
    for (const p of pts) {
      cx += p.x
      cy += p.y
    }
    cx /= N
    cy /= N
    const sx = this.squashX * this.scale
    const sy = this.squashY * this.scale
    let A = 0
    let B = 0
    for (let i = 0; i < N; i++) {
      const qx = pts[i].x - cx
      const qy = pts[i].y - cy
      const rx = this.rest[i].x * sx
      const ry = this.rest[i].y * sy
      A += qx * rx + qy * ry
      B += qy * rx - qx * ry
    }
    let th = Math.atan2(B, A)
    // a weeble: lean back upright when nobody is holding it
    const upright = this.grab ? 0 : this.grounded ? 0.04 : 0.006
    th -= th * upright
    const c = Math.cos(th)
    const s = Math.sin(th)
    const k = this.grab ? 0.2 : 0.16
    for (let i = 0; i < N; i++) {
      const rx = this.rest[i].x * sx
      const ry = this.rest[i].y * sy
      const gx = cx + rx * c - ry * s
      const gy = cy + rx * s + ry * c
      pts[i].x += (gx - pts[i].x) * k
      pts[i].y += (gy - pts[i].y) * k
    }
    this.theta = th
    this.cx = cx
    this.cy = cy
  }

  private edges() {
    const sx = this.squashX * this.scale
    const sy = this.squashY * this.scale
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      const a = this.pts[i]
      const b = this.pts[j]
      const rx = (this.rest[j].x - this.rest[i].x) * sx
      const ry = (this.rest[j].y - this.rest[i].y) * sy
      const L = Math.hypot(rx, ry)
      const dx = b.x - a.x
      const dy = b.y - a.y
      const d = Math.hypot(dx, dy) || 0.0001
      const diff = ((d - L) / d) * 0.5 * 0.35
      a.x += dx * diff
      a.y += dy * diff
      b.x -= dx * diff
      b.y -= dy * diff
    }
  }

  private pressure() {
    const pts = this.pts
    const area = polygonArea(pts)
    const target = this.restArea * this.squashX * this.squashY * this.scale * this.scale
    let perimeter = 0
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N
      perimeter += Math.hypot(pts[j].x - pts[i].x, pts[j].y - pts[i].y)
    }
    const push = ((target - area) / (perimeter || 1)) * 0.5
    if (Math.abs(push) < 0.001) return
    for (let i = 0; i < N; i++) {
      const prev = pts[(i - 1 + N) % N]
      const next = pts[(i + 1) % N]
      let nx = next.y - prev.y
      let ny = -(next.x - prev.x)
      const len = Math.hypot(nx, ny) || 1
      nx /= len
      ny /= len
      pts[i].x += nx * push
      pts[i].y += ny * push
    }
  }

  private collide(): number {
    let impact = 0
    let touching = 0
    const floor = this.H
    const right = this.W
    for (const p of this.pts) {
      // floor
      if (p.y > floor) {
        const vy = p.y - p.py
        const vx = p.x - p.px
        p.y = floor
        if (vy > 0) {
          impact = Math.max(impact, vy / DT)
          p.py = p.y + vy * BOUNCE_FLOOR
        }
        p.px = p.x - vx * FRICTION
        touching++
      }
      // ceiling
      if (p.y < 0) {
        const vy = p.y - p.py
        p.y = 0
        if (vy < 0) {
          impact = Math.max(impact, -vy / DT)
          p.py = p.y + vy * BOUNCE_WALL
        }
      }
      // walls
      if (p.x < 0) {
        const vx = p.x - p.px
        p.x = 0
        if (vx < 0) {
          impact = Math.max(impact, -vx / DT)
          p.px = p.x + vx * BOUNCE_WALL
        }
      } else if (p.x > right) {
        const vx = p.x - p.px
        p.x = right
        if (vx > 0) {
          impact = Math.max(impact, vx / DT)
          p.px = p.x + vx * BOUNCE_WALL
        }
      }
      // platforms (the dock): solid boxes. A point is pushed back out of the
      // side it came from; boxes that hug the bottom act as pillars to the
      // floor, so nothing gets wedged in the gap underneath.
      if (this.recallState) continue
      for (const r of this.platforms) {
        if (p.x <= r.left || p.x >= r.right || p.y <= r.top || p.y >= r.bottom) continue
        const dTop = p.y - r.top
        const dBottom = r.bottom - p.y
        const dLeft = p.x - r.left
        const dRight = r.right - p.x
        const vx = p.x - p.px
        const vy = p.y - p.py
        let m: number
        if (p.py <= r.top + 0.5) m = dTop
        else if (p.px <= r.left) m = dLeft
        else if (p.px >= r.right) m = dRight
        else if (p.py >= r.bottom && r.bottom < floor) m = dBottom
        else m = Math.min(dTop, dLeft, dRight, r.bottom < floor ? dBottom : Infinity)
        if (m === dTop) {
          p.y = r.top
          if (vy > 0) {
            impact = Math.max(impact, vy / DT)
            p.py = p.y + vy * BOUNCE_FLOOR
          }
          p.px = p.x - vx * FRICTION
          touching++
        } else if (m === dBottom) {
          p.y = r.bottom
          if (vy < 0) p.py = p.y + vy * BOUNCE_WALL
        } else if (m === dLeft) {
          p.x = r.left
          if (vx > 0) p.px = p.x + vx * BOUNCE_WALL
        } else {
          p.x = r.right
          if (vx < 0) p.px = p.x + vx * BOUNCE_WALL
        }
      }
    }
    const was = this.grounded
    this.grounded = touching >= 2
    if (this.grounded && !was) this.groundedSince = performance.now()
    return impact
  }

  private impulse(vx: number, vy: number) {
    for (const p of this.pts) {
      p.px = p.x - vx * DT
      p.py = p.y - vy * DT
    }
  }

  // ── reactions & behaviour ───────────────────────────────────────────

  private react(now: number, impact: number) {
    // spin tracking while airborne → dizzy
    let dTheta = this.theta - this.lastTheta
    if (dTheta > Math.PI) dTheta -= Math.PI * 2
    if (dTheta < -Math.PI) dTheta += Math.PI * 2
    this.lastTheta = this.theta
    if (!this.grounded) this.spinAccum += dTheta
    else this.spinAccum *= 0.9

    if (impact > 650 && now > this.impactCooldown && !this.grab) {
      this.impactCooldown = now + 140
      const strength = clamp((impact - 500) / 2600, 0, 1)
      sounds.blop(strength)
      this.squash(1 + 0.22 * strength, 1 - 0.28 * strength, 180)
      const contact = this.lowestContact()
      if (strength > 0.18) this.burst(contact.x, contact.y, "drop", Math.round(4 + strength * 10), strength)
      this.hardHits = this.hardHits.filter((t) => now - t < 6000)
      if (impact > 1500) this.hardHits.push(now)

      if (impact > 2300 || Math.abs(this.spinAccum) > Math.PI * 2.2) {
        this.setFace("dizzy", 2400)
        this.say("dizzy", 2200)
        this.spinAccum = 0
      } else if (this.hardHits.length >= 3) {
        this.hardHits = []
        this.setFace("happy", 1600)
        this.say("again", 2200)
      } else {
        this.setFace("squint", 360)
        if (impact > 1400 && Math.random() < 0.35) this.say("bonk", 1400)
      }
      this.lastInteraction = now
    }

    if (!this.grounded && !this.grab && this.face !== "dizzy" && now > this.faceUntil) {
      this.setFace("flying", 120)
    }
  }

  private think(now: number) {
    if (this.grab || this.sheetOpen) return
    if (!this.greeted && this.grounded && now - this.groundedSince > 500 && !this.spawnStart) {
      this.greeted = true
      this.say("hello", 4200)
      this.nextTip = now + TIP_EVERY
      this.nextThink = now + 5200
    }

    const idleFor = now - this.lastInteraction
    if (!this.asleep && this.grounded && idleFor > SLEEP_AFTER && this.face !== "dizzy") {
      this.asleep = true
      this.say("sleep", 2000)
    }
    if (this.asleep) {
      if (now - this.lastZ > 1700) {
        this.lastZ = now
        this.particles.push({
          kind: "z",
          x: this.cx + this.a * 0.45,
          y: this.cy - this.bTop * 0.7,
          vx: rand(6, 16),
          vy: -rand(18, 26),
          life: 2.4,
          max: 2.4,
          size: rand(10, 14),
          spin: 0,
        })
      }
      return
    }

    if (this.greeted && now > this.nextTip && !this.said && this.grounded) {
      this.nextTip = now + TIP_EVERY * rand(0.8, 1.3)
      this.say("tips", 5200)
      this.hopInPlace(0.6)
      return
    }

    if (this.reduced || !this.grounded || now < this.nextThink || this.anticipation) return
    this.nextThink = now + rand(2600, 6400)
    const roll = Math.random()
    if (roll < 0.42) {
      // wander toward a spot, mostly away from the edges
      const target = rand(this.W * 0.12, this.W * 0.88)
      const dir = Math.sign(target - this.cx) || 1
      this.hop(dir * rand(120, 260), -rand(430, 600))
    } else if (roll < 0.62) {
      this.hopInPlace(1)
    } else if (roll < 0.82) {
      this.lookAt = {
        x: this.cx + rand(-400, 400),
        y: this.cy - rand(40, 300),
        until: now + rand(900, 1800),
      }
    }
  }

  private hop(vx: number, vy: number) {
    this.squash(1.14, 0.8, 150)
    this.anticipation = { at: performance.now() + 150, vx, vy }
  }

  private hopInPlace(power: number) {
    this.hop(rand(-40, 40), -rand(320, 420) * power)
  }

  private squash(x: number, y: number, ms: number) {
    this.squashTargetX = x
    this.squashTargetY = y
    this.squashUntil = performance.now() + ms
  }

  private updateSquash(now: number) {
    if (now > this.squashUntil) {
      if (this.asleep) {
        const b = Math.sin(now / 900)
        this.squashTargetX = 1 + 0.02 * b
        this.squashTargetY = 1 - 0.035 * b
      } else {
        const b = Math.sin(now / 520)
        this.squashTargetX = 1 - 0.012 * b
        this.squashTargetY = 1 + 0.02 * b
      }
    }
    this.squashX += (this.squashTargetX - this.squashX) * 0.25
    this.squashY += (this.squashTargetY - this.squashY) * 0.25
  }

  private setFace(face: Face, ms: number) {
    this.face = face
    this.faceUntil = performance.now() + ms
  }

  private say(kind: LineKind, ms: number) {
    const text = pickLine(kind, this.name, this.said)
    this.said = text
    this.sayUntil = performance.now() + ms
    this.bubbleW = 0
    this.onSay(text)
  }

  private wake() {
    this.lastInteraction = performance.now()
    if (!this.asleep) return
    this.asleep = false
    this.setFace("surprised", 600)
    this.say("wake", 1800)
    this.hopInPlace(0.5)
  }

  private lowestContact(): Vec {
    let best = this.pts[0]
    for (const p of this.pts) if (p.y > best.y) best = p
    return { x: this.cx, y: best.y }
  }

  // ── recall ──────────────────────────────────────────────────────────

  private updateRecall(now: number): boolean {
    const state = this.recallState
    if (!state) return false
    const k = clamp((now - state.t0) / 560, 0, 1)
    const h = this.home()
    this.scale = Math.max(0.12, 1 - 0.88 * k * k)
    const pull = 0.06 + 0.22 * k
    const dx = (h.x - this.cx) * pull
    const dy = (h.y - this.cy) * pull
    for (const p of this.pts) {
      p.x += dx
      p.y += dy
      p.px += dx * 0.9
      p.py += dy * 0.9
    }
    this.setFace("happy", 200)
    this.updateParticles(1 / 60)
    this.draw(now, 1 - k * 0.6)
    this.placeBubble(now)
    if (k >= 1) {
      this.running = false
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.onSay(null)
      sounds.close()
      const done = state.done
      this.recallState = null
      done()
      return true
    }
    this.raf = requestAnimationFrame(this.frame)
    return true
  }

  // ── input ───────────────────────────────────────────────────────────

  private hit(x: number, y: number) {
    if (this.recallState || this.sheetOpen || this.scale < 0.5) return false
    let inside = false
    for (let i = 0, j = N - 1; i < N; j = i++) {
      const a = this.pts[i]
      const b = this.pts[j]
      if (a.y > y !== b.y > y && x < ((b.x - a.x) * (y - a.y)) / (b.y - a.y) + a.x) inside = !inside
    }
    if (inside) return true
    // a little forgiveness around the rim
    for (const p of this.pts) if (Math.hypot(p.x - x, p.y - y) < 7) return true
    return false
  }

  private setCursor(kind: "grab" | "grabbing" | null) {
    const root = document.documentElement
    if (kind) root.dataset.slimeCursor = kind
    else delete root.dataset.slimeCursor
  }

  private onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return
    if (this.grab || !this.hit(e.clientX, e.clientY)) return
    e.preventDefault()
    e.stopPropagation()
    this.consumeClickUntil = performance.now() + 60_000
    this.pointer = { x: e.clientX, y: e.clientY, seen: true }
    this.history = [{ x: e.clientX, y: e.clientY, t: performance.now() }]

    const sigma = this.a * this.scale * 0.6
    const offsets: Vec[] = []
    const weights: number[] = []
    for (const p of this.pts) {
      const dx = p.x - e.clientX
      const dy = p.y - e.clientY
      offsets.push({ x: dx, y: dy })
      weights.push(Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma)))
    }
    // normalise so the strongest handle always holds firmly
    const max = Math.max(...weights)
    for (let i = 0; i < N; i++) weights[i] = clamp(weights[i] / max, 0.04, 1)

    this.grab = {
      id: e.pointerId,
      offsets,
      weights,
      sx: e.clientX,
      sy: e.clientY,
      t: performance.now(),
      moved: false,
    }
    this.wake()
    this.setFace("surprised", 400)
    this.setCursor("grabbing")
    sounds.squish()
  }

  private onPointerMove = (e: PointerEvent) => {
    const now = performance.now()
    const dx = e.clientX - this.pointer.x
    const dy = e.clientY - this.pointer.y
    this.pointer = { x: e.clientX, y: e.clientY, seen: true }
    this.history.push({ x: e.clientX, y: e.clientY, t: now })
    if (this.history.length > 8) this.history.shift()

    if (this.grab) {
      if (Math.hypot(e.clientX - this.grab.sx, e.clientY - this.grab.sy) > 6 && !this.grab.moved) {
        this.grab.moved = true
        if (Math.random() < 0.4) this.say("grab", 1500)
      }
      this.lastInteraction = now
      return
    }

    if (e.pointerType !== "mouse") return
    const over = this.hit(e.clientX, e.clientY)
    if (over !== this.hover) {
      this.hover = over
      this.setCursor(over ? "grab" : null)
      if (over) {
        this.wake()
        this.petDistance = 0
        this.petStart = now
      }
    }
    if (over) {
      this.lastInteraction = now
      if (now - this.petStart > 2200) {
        this.petStart = now
        this.petDistance = 0
      }
      this.petDistance += Math.hypot(dx, dy)
      if (this.petDistance > 260) {
        this.petDistance = 0
        this.petStart = now
        this.pet()
      }
    }
  }

  private onPointerUp = (e: PointerEvent) => {
    const grab = this.grab
    if (!grab || e.pointerId !== grab.id) return
    this.grab = null
    const now = performance.now()
    // swallow only the click this very gesture produces
    this.consumeClickUntil = now + 400
    if (!grab.moved && now - grab.t < 300) {
      this.boop()
    } else {
      this.fling(this.pointerVelocity())
    }
    this.setCursor(this.hit(e.clientX, e.clientY) && e.pointerType === "mouse" ? "grab" : null)
  }

  private onClick = (e: MouseEvent) => {
    if (performance.now() > this.consumeClickUntil) return
    this.consumeClickUntil = 0
    e.preventDefault()
    e.stopPropagation()
  }

  private onDoubleClick = (e: MouseEvent) => {
    if (!this.hit(e.clientX, e.clientY)) return
    e.preventDefault()
    e.stopPropagation()
    this.hop(rand(-60, 60), -rand(900, 1050))
    sounds.boing()
  }

  private onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    if (t && this.hit(t.clientX, t.clientY)) e.preventDefault()
  }

  private pointerVelocity(): Vec {
    const h = this.history
    if (h.length < 2) return { x: 0, y: 0 }
    const last = h[h.length - 1]
    let first = h[0]
    for (let i = h.length - 2; i >= 0; i--) {
      first = h[i]
      if (last.t - h[i].t > 70) break
    }
    const dt = Math.max(16, last.t - first.t) / 1000
    if (performance.now() - last.t > 120) return { x: 0, y: 0 } // held still before letting go
    let vx = (last.x - first.x) / dt
    let vy = (last.y - first.y) / dt
    const speed = Math.hypot(vx, vy)
    if (speed > MAX_THROW) {
      vx *= MAX_THROW / speed
      vy *= MAX_THROW / speed
    }
    return { x: vx, y: vy }
  }

  private fling(v: Vec) {
    for (const p of this.pts) {
      const cvx = (p.x - p.px) / DT
      const cvy = (p.y - p.py) / DT
      const nvx = cvx * 0.35 + v.x * 0.65
      const nvy = cvy * 0.35 + v.y * 0.65
      p.px = p.x - nvx * DT
      p.py = p.y - nvy * DT
    }
    const speed = Math.hypot(v.x, v.y)
    if (speed > 900) {
      this.setFace("flying", 500)
      if (Math.random() < 0.55) this.say("throw", 1400)
    }
  }

  private boop() {
    this.squash(1.18, 0.78, 140)
    this.setFace("happy", 900)
    this.hopInPlace(0.8)
    sounds.boing()
    if (Math.random() < 0.6) this.say("boop", 1500)
  }

  private pet() {
    const now = performance.now()
    this.setFace("happy", 1400)
    this.squash(1.06, 0.92, 220)
    this.burst(this.cx + rand(-10, 10), this.cy - this.bTop * this.scale * 0.6, "heart", 2)
    if (now - this.lastPet > 900) sounds.sparkle()
    if (now - this.lastPet > 7000) this.say("pet", 1600)
    this.lastPet = now
  }

  // ── particles ───────────────────────────────────────────────────────

  private burst(x: number, y: number, kind: Particle["kind"], count: number, strength = 0.5) {
    for (let i = 0; i < count; i++) {
      const angle = kind === "drop" ? rand(-Math.PI * 0.95, -Math.PI * 0.05) : rand(0, Math.PI * 2)
      const speed =
        kind === "drop" ? rand(140, 320) * (0.6 + strength) : kind === "heart" ? rand(20, 50) : rand(80, 220)
      this.particles.push({
        kind,
        x: x + rand(-6, 6),
        y,
        vx: Math.cos(angle) * speed,
        vy: kind === "heart" ? -rand(50, 80) : Math.sin(angle) * speed,
        life: kind === "heart" ? 1.4 : kind === "drop" ? 0.9 : 0.6,
        max: kind === "heart" ? 1.4 : kind === "drop" ? 0.9 : 0.6,
        size: kind === "drop" ? rand(2, 4.5) : kind === "heart" ? rand(7, 10) : rand(3, 5),
        spin: rand(-3, 3),
      })
    }
    if (this.particles.length > 80) this.particles.splice(0, this.particles.length - 80)
  }

  private updateParticles(dt: number) {
    for (const p of this.particles) {
      p.life -= dt
      if (p.kind === "drop") {
        p.vy += GRAVITY * 0.8 * dt
        if (p.y > this.H - 2) {
          p.y = this.H - 2
          p.vy *= -0.2
          p.vx *= 0.5
        }
      } else if (p.kind === "heart") {
        p.vx = Math.sin((p.max - p.life) * 6 + p.spin) * 18
      } else if (p.kind === "spark") {
        p.vx *= 0.9
        p.vy *= 0.9
      }
      p.x += p.vx * dt
      p.y += p.vy * dt
    }
    this.particles = this.particles.filter((p) => p.life > 0)
  }

  // ── drawing ─────────────────────────────────────────────────────────

  private draw(now: number, alpha = 1) {
    const ctx = this.ctx
    const { hi, mid, deep, line, dark } = this.colors
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0)
    ctx.globalAlpha = alpha

    const pts = this.pts
    let minY = Infinity
    let maxY = -Infinity
    let minX = Infinity
    let maxX = -Infinity
    for (const p of pts) {
      if (p.y < minY) minY = p.y
      if (p.y > maxY) maxY = p.y
      if (p.x < minX) minX = p.x
      if (p.x > maxX) maxX = p.x
    }

    // contact shadow on whatever is below
    const ground = this.groundBelow(this.cx, maxY)
    const lift = ground - maxY
    if (lift < 320 && !this.recallState) {
      const k = 1 - clamp(lift / 320, 0, 1)
      ctx.beginPath()
      ctx.ellipse(this.cx, ground - 1.5, ((maxX - minX) / 2) * (0.55 + 0.45 * k), 3 + 3 * k, 0, 0, Math.PI * 2)
      ctx.fillStyle = dark ? `rgba(0,0,0,${0.42 * k})` : `rgba(40,30,20,${0.2 * k})`
      ctx.fill()
    }

    // glow
    ctx.save()
    ctx.shadowColor = dark ? mid : "transparent"
    ctx.shadowBlur = dark ? 22 * this.scale : 0

    // body
    this.trace(pts)
    const grad = ctx.createLinearGradient(this.cx - this.a * 0.5, minY, this.cx + this.a * 0.3, maxY)
    grad.addColorStop(0, hi)
    grad.addColorStop(0.42, mid)
    grad.addColorStop(1, deep)
    ctx.globalAlpha = alpha * 0.95
    ctx.fillStyle = grad
    ctx.fill()
    ctx.restore()

    // inner core: the darker jelly heart Rimuru has
    ctx.save()
    ctx.globalAlpha = alpha * 0.22
    ctx.translate(this.cx, this.cy + this.bTop * 0.22 * this.scale)
    ctx.scale(0.62, 0.55)
    ctx.translate(-this.cx, -(this.cy + this.bTop * 0.22 * this.scale))
    this.trace(pts)
    ctx.fillStyle = deep
    ctx.fill()
    ctx.restore()

    // rim
    ctx.globalAlpha = alpha
    this.trace(pts)
    ctx.lineWidth = 1.4
    ctx.strokeStyle = withAlpha(line, dark ? 0.5 : 0.3)
    ctx.stroke()

    // local frame for highlight + face
    ctx.save()
    ctx.translate(this.cx, this.cy)
    ctx.rotate(this.theta)
    const s = this.scale
    const sx = this.squashX * s
    const sy = this.squashY * s

    // specular highlights
    ctx.beginPath()
    ctx.ellipse(-this.a * 0.36 * sx, -this.bTop * 0.48 * sy, this.a * 0.22 * s, this.bTop * 0.11 * s, -0.55, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255,255,255,0.78)"
    ctx.fill()
    ctx.beginPath()
    ctx.arc(-this.a * 0.08 * sx, -this.bTop * 0.66 * sy, 2.4 * s, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255,255,255,0.7)"
    ctx.fill()

    this.drawFace(now, sx, sy, s)
    ctx.restore()

    this.drawParticles(alpha)
    ctx.globalAlpha = 1
  }

  /** Smooth closed curve through the ring (midpoint quadratic splines). */
  private trace(pts: Point[]) {
    const ctx = this.ctx
    ctx.beginPath()
    const last = pts[N - 1]
    ctx.moveTo((last.x + pts[0].x) / 2, (last.y + pts[0].y) / 2)
    for (let i = 0; i < N; i++) {
      const p = pts[i]
      const q = pts[(i + 1) % N]
      ctx.quadraticCurveTo(p.x, p.y, (p.x + q.x) / 2, (p.y + q.y) / 2)
    }
    ctx.closePath()
  }

  private groundBelow(x: number, y: number) {
    let ground = this.H
    for (const r of this.platforms) {
      if (x > r.left && x < r.right && r.top >= y - 4 && r.top < ground) ground = r.top
    }
    return ground
  }

  private drawFace(now: number, sx: number, sy: number, s: number) {
    const ctx = this.ctx
    const { line } = this.colors
    let face: Face = this.asleep ? "sleeping" : this.face
    if (!this.asleep && now > this.faceUntil) face = this.hover ? "happy" : "idle"
    if (this.grab) face = this.grab.moved ? "flying" : "surprised"

    // gaze: toward the cursor, a look-around target, or the direction of travel
    let tx = 0
    let ty = 0
    const look = this.lookAt && now < this.lookAt.until ? this.lookAt : null
    if (look) {
      tx = look.x - this.cx
      ty = look.y - this.cy
    } else if (this.pointer.seen && !this.asleep) {
      tx = this.pointer.x - this.cx
      ty = this.pointer.y - this.cy
    }
    const d = Math.hypot(tx, ty) || 1
    const reach = Math.min(3.2, d * 0.02) * s
    // into the body's frame
    const c = Math.cos(-this.theta)
    const sn = Math.sin(-this.theta)
    const gx = ((tx * c - ty * sn) / d) * reach
    const gy = ((tx * sn + ty * c) / d) * reach
    this.gaze.x += (gx - this.gaze.x) * 0.2
    this.gaze.y += (gy - this.gaze.y) * 0.2

    const eyeY = this.bTop * 0.04 * sy + this.gaze.y
    const eyeX = this.a * 0.3 * sx
    const ox = this.gaze.x
    const rx = this.a * 0.075 * s
    const ry = this.a * 0.1 * s

    if (!this.blinkAt) this.blinkAt = now + rand(2000, 4500)
    if (now > this.blinkAt) {
      this.blinkUntil = now + 130
      this.blinkAt = now + rand(2200, 5200)
    }
    const blinking = now < this.blinkUntil

    ctx.fillStyle = line
    ctx.strokeStyle = line
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.lineWidth = 2.1 * s

    const eye = (x: number) => {
      switch (face) {
        case "happy": {
          ctx.beginPath()
          ctx.moveTo(x - rx * 1.1, eyeY + ry * 0.35)
          ctx.quadraticCurveTo(x, eyeY - ry * 0.9, x + rx * 1.1, eyeY + ry * 0.35)
          ctx.stroke()
          break
        }
        case "squint": {
          const dir = x < ox ? 1 : -1
          ctx.beginPath()
          ctx.moveTo(x - rx * dir, eyeY - ry * 0.7)
          ctx.lineTo(x + rx * dir, eyeY)
          ctx.lineTo(x - rx * dir, eyeY + ry * 0.7)
          ctx.stroke()
          break
        }
        case "sleeping": {
          ctx.beginPath()
          ctx.moveTo(x - rx * 1.1, eyeY)
          ctx.quadraticCurveTo(x, eyeY + ry * 0.55, x + rx * 1.1, eyeY)
          ctx.stroke()
          break
        }
        case "dizzy": {
          ctx.beginPath()
          const turns = 2.2
          const spin = now / 140
          for (let t = 0; t <= 1; t += 0.04) {
            const ang = spin + t * Math.PI * 2 * turns
            const r = rx * 1.1 * t
            const px = x + Math.cos(ang) * r
            const py = eyeY + Math.sin(ang) * r
            if (t === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.lineWidth = 1.6 * s
          ctx.stroke()
          ctx.lineWidth = 2.1 * s
          break
        }
        default: {
          const big = face === "surprised" || face === "flying" ? 1.25 : 1
          ctx.beginPath()
          ctx.ellipse(x, eyeY, rx * big, blinking ? ry * 0.12 : ry * big, 0, 0, Math.PI * 2)
          ctx.fill()
          if (!blinking) {
            ctx.beginPath()
            ctx.arc(x - rx * 0.35, eyeY - ry * 0.4, rx * 0.38, 0, Math.PI * 2)
            ctx.fillStyle = "rgba(255,255,255,0.9)"
            ctx.fill()
            ctx.fillStyle = line
          }
        }
      }
    }
    eye(-eyeX + ox)
    eye(eyeX + ox)

    // blush when happy
    if (face === "happy") {
      ctx.fillStyle = "rgba(255,120,150,0.35)"
      for (const side of [-1, 1]) {
        ctx.beginPath()
        ctx.ellipse(side * this.a * 0.5 * sx + ox, eyeY + ry * 1.3, rx * 1.3, ry * 0.5, 0, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.fillStyle = line
    }

    // mouth
    const my = eyeY + ry * 1.55
    const mx = ox * 0.6
    ctx.lineWidth = 1.6 * s
    ctx.beginPath()
    switch (face) {
      case "happy":
        ctx.moveTo(mx - rx * 1.1, my - 1)
        ctx.quadraticCurveTo(mx, my + ry * 1.1, mx + rx * 1.1, my - 1)
        ctx.closePath()
        ctx.fill()
        break
      case "surprised":
      case "flying":
        ctx.ellipse(mx, my + 1, rx * 0.55, ry * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()
        break
      case "dizzy":
      case "squint":
        ctx.moveTo(mx - rx * 1.1, my)
        ctx.quadraticCurveTo(mx - rx * 0.55, my - 2.5 * s, mx, my)
        ctx.quadraticCurveTo(mx + rx * 0.55, my + 2.5 * s, mx + rx * 1.1, my)
        ctx.stroke()
        break
      case "sleeping":
        ctx.ellipse(mx, my + 1, rx * 0.35, ry * 0.3 + Math.sin(now / 900) * 0.6, 0, 0, Math.PI * 2)
        ctx.fill()
        break
      default:
        // a little cat mouth
        ctx.moveTo(mx - rx * 1.1, my)
        ctx.quadraticCurveTo(mx - rx * 0.55, my + ry * 0.7, mx, my)
        ctx.quadraticCurveTo(mx + rx * 0.55, my + ry * 0.7, mx + rx * 1.1, my)
        ctx.stroke()
    }
  }

  private drawParticles(alpha: number) {
    const ctx = this.ctx
    const { mid, hi, line } = this.colors
    for (const p of this.particles) {
      const k = clamp(p.life / p.max, 0, 1)
      ctx.globalAlpha = alpha * (p.kind === "z" ? Math.min(1, k * 1.6) * 0.8 : k)
      if (p.kind === "drop") {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = mid
        ctx.fill()
      } else if (p.kind === "heart") {
        heart(ctx, p.x, p.y, p.size * (0.7 + 0.3 * k))
        ctx.fillStyle = "#ff7aa8"
        ctx.fill()
      } else if (p.kind === "z") {
        ctx.font = `600 ${p.size}px ui-monospace, SFMono-Regular, Menlo, monospace`
        ctx.fillStyle = line
        ctx.fillText("z", p.x, p.y)
      } else {
        star(ctx, p.x, p.y, p.size)
        ctx.fillStyle = hi
        ctx.fill()
      }
    }
    ctx.globalAlpha = alpha
  }

  // ── speech bubble (a DOM element the engine positions) ──────────────

  private placeBubble(now: number) {
    if (this.said && now > this.sayUntil) {
      this.said = null
      this.onSay(null)
    }
    if (!this.said) return
    // measured every frame: React swaps the words a tick after say()
    this.bubbleW = this.bubble.offsetWidth
    this.bubbleH = this.bubble.offsetHeight
    let top = Infinity
    for (const p of this.pts) if (p.y < top) top = p.y
    const half = this.bubbleW / 2
    const x = clamp(this.cx, half + 10, this.W - half - 10)
    const below = top - this.bubbleH - 16 < 8
    const y = below ? this.cy + this.bTop * this.scale + 14 : top - 12
    this.bubble.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, ${below ? "0" : "-100%"})`
    this.bubble.dataset.side = below ? "bottom" : "top"
    this.bubble.style.setProperty("--tail-x", `${clamp(this.cx - x + half, 14, this.bubbleW - 14)}px`)
  }
}

// ── geometry helpers ──────────────────────────────────────────────────

function polygonArea(pts: { x: number; y: number }[]) {
  let area = 0
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    area += a.x * b.y - b.x * a.y
  }
  return area / 2
}

function withAlpha(color: string, alpha: number) {
  if (color.startsWith("#") && (color.length === 7 || color.length === 4)) {
    const hex = color.length === 4 ? color.replace(/#(.)(.)(.)/, "#$1$1$2$2$3$3") : color
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r},${g},${b},${alpha})`
  }
  return color
}

function heart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size / 2
  ctx.beginPath()
  ctx.moveTo(x, y + s * 0.9)
  ctx.bezierCurveTo(x - s * 1.6, y - s * 0.2, x - s * 0.7, y - s * 1.4, x, y - s * 0.5)
  ctx.bezierCurveTo(x + s * 0.7, y - s * 1.4, x + s * 1.6, y - s * 0.2, x, y + s * 0.9)
  ctx.closePath()
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const ang = (i / 8) * Math.PI * 2
    const rad = i % 2 === 0 ? r : r * 0.35
    const px = x + Math.cos(ang) * rad
    const py = y + Math.sin(ang) * rad
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}
