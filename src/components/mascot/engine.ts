import { EYE_LX, EYE_MODES, EYE_RX, EYE_Y, MOUTH_MODES, SPRITE_ASPECT, type EyeMode, type MouthMode, type Rig } from './rig'

// The slime's brain. One requestAnimationFrame loop runs a small behaviour
// state machine (idle → pick something fun → idle ...), layers a few
// reactive effects on top (jelly spring, scroll bumps, hover, blinking, eye
// tracking) and writes transforms / SVG attributes straight to the DOM. React
// never re-renders per frame.

/** The floating dock lives in the top 80px; the slime never goes there. */
export const TOP_SAFE = 24
const EDGE = 8
const SLEEP_AFTER_MS = 25_000
const MOUSE_FRESH_MS = 4_000
const GRAVITY = 2400
/** Droplets in the skin-change sparkle burst (the pool has 6). */
const DROP_SPARKLES = 6

type Kind =
  | 'idle'
  | 'wander'
  | 'bigjump'
  | 'zoomies'
  | 'chase'
  | 'peek'
  | 'lookaround'
  | 'dance'
  | 'spin'
  | 'eat'
  | 'sleep'
  | 'wake'
  | 'announce'
  | 'pet'
  | 'drag'
  | 'flung'
  | 'dizzy'
  | 'newskin'

/** Behaviours picked at random after an idle pause, with relative weights. */
const WEIGHTS: ReadonlyArray<readonly [Kind, number]> = [
  ['wander', 30],
  ['lookaround', 10],
  ['chase', 8],
  ['dance', 8],
  ['bigjump', 8],
  ['zoomies', 6],
  ['peek', 6],
  ['spin', 6],
  ['eat', 6],
]

/** States a fast page scroll may bounce. */
const BUMPABLE = new Set<Kind>(['idle', 'wander', 'lookaround', 'pet', 'chase', 'dance', 'eat'])
/** States that hovering turns into "being petted". */
const PETTABLE = new Set<Kind>(['idle', 'wander', 'chase', 'lookaround', 'dance'])
/** States a speech bubble may interrupt right away (others finish first). */
const ANNOUNCE_NOW = new Set<Kind>(['idle', 'wander', 'chase', 'lookaround', 'dance', 'pet', 'sleep'])
/** States whose face wins over the hover face. */
const OWN_FACE = new Set<Kind>(['drag', 'flung', 'dizzy', 'sleep', 'wake', 'announce', 'zoomies', 'newskin'])
/**
 * States a skin change may interrupt right away. The rest (dragged, flung,
 * dizzy, half off-screen peeking, mid-announce) finish first.
 */
const SKIN_NOW = new Set<Kind>([
  'idle',
  'wander',
  'lookaround',
  'chase',
  'dance',
  'pet',
  'sleep',
  'wake',
  'eat',
  'spin',
  'bigjump',
  'zoomies',
  'newskin',
])
/** States resize can leave alone. */
const RESIZE_SAFE = new Set<Kind>(['idle', 'sleep', 'pet', 'drag', 'lookaround', 'dance'])

/** Dance: 4.5 swings at 1.7 Hz so it ends centred. */
const DANCE_HZ = 1.7
const DANCE_T = 4.5 / DANCE_HZ

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeOut = (t: number) => 1 - (1 - t) * (1 - t)
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
const easeOutBack = (t: number) => {
  const c = 1.6
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
}
const sign = () => (Math.random() < 0.5 ? -1 : 1)

interface Pose {
  /** Visual lift above the ground, px. */
  lift: number
  sx: number
  sy: number
  /** Degrees, around the sprite centre. */
  rot: number
  /** Visual x offset, px. */
  dx: number
  /** -1..1 gaze; null = automatic (cursor or idle glances). */
  lookX: number | null
  lookY: number | null
  eyes: EyeMode
  mouth: MouthMode
  /** 0..1, only for the open mouth. */
  mouthOpen: number
  blush: number
  glow: number
  /** 0..1 opacity of the "!" mark. */
  bang: number
  /** Spiral-eye rotation, degrees. */
  spiral: number
}

const resetPose = (p: Pose): Pose => {
  p.lift = 0
  p.sx = 1
  p.sy = 1
  p.rot = 0
  p.dx = 0
  p.lookX = null
  p.lookY = null
  p.eyes = 'open'
  p.mouth = 'smile'
  p.mouthOpen = 0
  p.blush = 0
  p.glow = 0
  p.bang = 0
  p.spiral = 0
  return p
}

interface Particle {
  el: HTMLElement
  on: boolean
  x: number
  y: number
  vx: number
  vy: number
  age: number
  life: number
  size: number
}

interface Bounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export interface EngineConfig {
  size: number
  mobile: boolean
  reduced: boolean
}

export class SlimeEngine {
  /** Top-left of the slime box, viewport px. */
  x = 0
  y = 0

  private rig: Rig
  private cfg: EngineConfig
  private onMove: () => void
  private vw = 0
  private vh = 0

  private b = {
    kind: 'idle' as Kind,
    /** Seconds since the behaviour started / since the phase started. */
    t: 0,
    pt: 0,
    phase: 0,
    dur: 2,
    dir: 1,
    n: 0,
    v: 0,
    x0: 0,
    y0: 0,
    tx: 0,
    ty: 0,
    flag: false,
    emit: 0,
  }
  private pose: Pose = resetPose({} as Pose)
  private lastPicked: Kind = 'idle'

  private wanted = false
  private running = false
  private raf = 0
  private timer = 0
  private last = 0
  private time = 0

  private hopT = 0
  private prevHopT = 0
  // Jelly spring (positive = wide & short).
  private j = 0
  private jv = 0
  // Scroll bump (extra lift).
  private bumpY = 0
  private bumpV = 0
  private bumpReadyAt = 0
  // Gaze.
  private lookX = 0
  private lookY = 0
  private glanceX = 0
  private glanceY = 0
  private glanceAt = 0
  private scrollLookY = 0
  private scrollLookUntil = 0
  // Blinking.
  private blinkAt = 0
  private blinkStart = -1
  private blinkTwice = false
  // Input.
  private mouseX = -1
  private mouseY = -1
  private mouseAt = -Infinity
  private lastActivity = 0
  private hovered = false
  private speaking = false
  private pendingAnnounce: (() => void) | null = null
  private pendingSkin = false
  private skin: string | undefined
  private announceCb: (() => void) | null = null
  private lastScrollY = 0
  private lastScrollT = 0
  // Drag + fling.
  private dragOX = 0
  private dragOY = 0
  private dragStartT = 0
  private dragMoved = 0
  private dragRot = 0
  private samples: { x: number; y: number; t: number }[] = []
  private vx = 0
  private vy = 0
  private spinRot = 0
  // Effects.
  private drops: Particle[]
  private zs: Particle[]
  private orb = { state: 'off' as 'off' | 'in' | 'idle' | 'eat' | 'fade', t: 0, x: 0, y: 0, s: 1 }
  // Last values written to the DOM, to skip redundant writes.
  private w = {
    root: '',
    body: '',
    shadow: '',
    shadowOp: '',
    glow: '',
    bang: '',
    eyes: '' as EyeMode | '',
    open: -1,
    face: '',
    spiral: -1,
    mouth: '' as MouthMode | '',
    mouthOpen: -1,
    blush: -1,
  }

  constructor(rig: Rig, cfg: EngineConfig, onMove: () => void) {
    this.rig = rig
    this.cfg = { ...cfg }
    this.onMove = onMove
    const mk = (el: HTMLElement): Particle => ({ el, on: false, x: 0, y: 0, vx: 0, vy: 0, age: 0, life: 1, size: 4 })
    this.drops = rig.drops.map(mk)
    this.zs = rig.zs.map(mk)

    const now = performance.now()
    this.measure()
    this.lastActivity = now
    this.blinkAt = now + rand(1500, 4000)
    this.lastScrollY = window.scrollY
    this.lastScrollT = now
    this.skin = document.documentElement.dataset.skin
    const c = this.corner()
    this.x = c.x
    this.y = c.y
    this.toIdle(3, 5)

    window.addEventListener('pointermove', this.onPointerMoveWin, { passive: true })
    window.addEventListener('pointerdown', this.onActivity, { passive: true })
    window.addEventListener('keydown', this.onActivity, { passive: true })
    window.addEventListener('wheel', this.onActivity, { passive: true })
    window.addEventListener('touchstart', this.onActivity, { passive: true })
    window.addEventListener('scroll', this.onScroll, { passive: true })
    window.addEventListener('resize', this.onResize)
    document.addEventListener('visibilitychange', this.onVisibility)
    window.addEventListener('skinchange', this.onSkinChange)
  }

  // ---- public API ------------------------------------------------------------

  run() {
    this.wanted = true
    if (!document.hidden) this.resume()
  }

  destroy() {
    this.wanted = false
    this.halt()
    window.removeEventListener('pointermove', this.onPointerMoveWin)
    window.removeEventListener('pointerdown', this.onActivity)
    window.removeEventListener('keydown', this.onActivity)
    window.removeEventListener('wheel', this.onActivity)
    window.removeEventListener('touchstart', this.onActivity)
    window.removeEventListener('scroll', this.onScroll)
    window.removeEventListener('resize', this.onResize)
    document.removeEventListener('visibilitychange', this.onVisibility)
    window.removeEventListener('skinchange', this.onSkinChange)
  }

  setConfig(next: EngineConfig) {
    const prev = this.cfg
    this.cfg = { ...next }
    if (prev.reduced !== next.reduced) {
      this.clearEffects()
      this.j = this.jv = this.bumpY = this.bumpV = 0
      if (next.reduced) {
        const c = this.corner()
        this.x = c.x
        this.y = c.y
      }
      this.toIdle(1, 3)
    }
    if (prev.size !== next.size || prev.mobile !== next.mobile) this.resize()
    this.kick()
  }

  setSpeaking(on: boolean) {
    this.speaking = on
  }

  /** Hop + "!" first, then run `cb` (which shows the speech bubble). */
  announce(cb: () => void) {
    if (this.cfg.reduced || this.b.kind === 'drag') {
      cb()
      if (this.cfg.reduced && this.b.kind !== 'drag') {
        this.enter('announce') // reduced: just flashes the "!"
        this.kick()
      }
      return
    }
    this.pendingAnnounce = cb
    if (ANNOUNCE_NOW.has(this.b.kind)) this.enter('announce')
    this.kick()
  }

  /** "New skin!": a happy hop with sparkles in the new color. Wakes it up. */
  skinChange() {
    this.lastActivity = performance.now()
    const k = this.b.kind
    if (k === 'drag' || (!this.cfg.reduced && !SKIN_NOW.has(k))) this.pendingSkin = true
    else this.enter('newskin')
    this.kick()
  }

  hover(on: boolean) {
    if (this.hovered === on) return
    this.hovered = on
    if (on) {
      this.activity()
      if (!this.cfg.reduced) {
        this.jiggle(0.12)
        if (PETTABLE.has(this.b.kind)) this.enter('pet')
      }
    } else if (this.b.kind === 'pet') {
      this.b.dur = this.b.t + 0.5
    }
    this.kick()
  }

  pointerDown(cx: number, cy: number) {
    this.activity()
    if (this.b.kind === 'drag') return
    const now = performance.now()
    this.enter('drag')
    this.dragOX = cx - this.x
    this.dragOY = cy - this.y
    this.dragStartT = now
    this.dragMoved = 0
    this.dragRot = 0
    this.samples = [{ x: cx, y: cy, t: now }]
    if (!this.cfg.reduced) this.jiggle(-0.12)
    this.kick()
  }

  pointerMove(cx: number, cy: number) {
    if (this.b.kind !== 'drag') return
    const now = performance.now()
    const last = this.samples[this.samples.length - 1]
    if (last) this.dragMoved += Math.hypot(cx - last.x, cy - last.y)
    this.samples.push({ x: cx, y: cy, t: now })
    while (this.samples.length > 10 || (this.samples.length > 2 && now - this.samples[0].t > 150)) this.samples.shift()
    const bd = this.bounds()
    this.x = clamp(cx - this.dragOX, bd.minX, bd.maxX)
    this.y = clamp(cy - this.dragOY, bd.minY, bd.maxY)
    this.kick()
  }

  pointerUp(cancelled = false) {
    if (this.b.kind !== 'drag') return
    const now = performance.now()
    const tap = this.dragMoved < 6 && now - this.dragStartT < 350
    if (this.cfg.reduced) {
      this.toIdle(0, 0)
    } else if (tap) {
      this.enter('pet')
      this.b.dur = 0.9
      this.jiggle(0.14)
    } else {
      const v = this.velocity(now)
      const speed = Math.hypot(v.vx, v.vy)
      if (!cancelled && speed > 380) {
        const k = Math.min(1, 2600 / speed)
        this.vx = v.vx * k
        this.vy = v.vy * k
        this.spinRot = this.dragRot
        this.enter('flung')
      } else {
        this.jiggle(0.12)
        this.toIdle(2.5, 5)
      }
    }
    this.kick()
  }

  // ---- window listeners ------------------------------------------------------

  private onPointerMoveWin = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') {
      this.mouseX = e.clientX
      this.mouseY = e.clientY
      this.mouseAt = performance.now()
    }
    this.activity()
  }

  private onActivity = () => this.activity()

  private onScroll = () => {
    const now = performance.now()
    const sy = window.scrollY
    const dtMs = now - this.lastScrollT
    const v = ((sy - this.lastScrollY) / Math.max(dtMs, 8)) * 1000
    this.lastScrollY = sy
    this.lastScrollT = now
    this.activity()
    if (this.cfg.reduced || dtMs > 250 || Math.abs(v) < 2000) return
    this.scrollLookY = Math.sign(v) * 0.9
    this.scrollLookUntil = now + 700
    if (BUMPABLE.has(this.b.kind) && this.bumpY === 0 && this.bumpV === 0 && now >= this.bumpReadyAt) {
      this.bumpV = this.cfg.size * 4.5
      this.bumpReadyAt = now + 450
      this.jiggle(-0.06)
    }
  }

  private onResize = () => this.resize()

  private onSkinChange = (e: Event) => {
    const detail = (e as CustomEvent<unknown>).detail
    const skin = typeof detail === 'string' ? detail : document.documentElement.dataset.skin
    if (skin !== undefined && skin === this.skin) return // re-applied, not changed
    this.skin = skin
    this.skinChange()
  }

  private onVisibility = () => {
    if (document.hidden) this.halt()
    else if (this.wanted) this.resume()
  }

  // ---- loop ------------------------------------------------------------------

  private resume() {
    if (this.running) return
    this.running = true
    this.last = performance.now()
    this.activity()
    this.kick()
  }

  private halt() {
    this.running = false
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
    if (this.timer) window.clearTimeout(this.timer)
    this.timer = 0
  }

  private kick() {
    if (!this.running || this.raf) return
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = 0
    }
    this.raf = requestAnimationFrame(this.frame)
  }

  /** Reduced motion idles on timers between blinks instead of running at 60fps. */
  private schedule(now: number) {
    if (!this.running) return
    if (!this.cfg.reduced || this.b.kind !== 'idle' || this.blinkStart >= 0) {
      this.raf = requestAnimationFrame(this.frame)
      return
    }
    this.timer = window.setTimeout(
      () => {
        this.timer = 0
        this.kick()
      },
      Math.max(16, this.blinkAt - now),
    )
  }

  private frame = (now: number) => {
    this.raf = 0
    if (!this.running) return
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000)) // clamp after stalls
    this.last = now
    this.time += dt
    const p = resetPose(this.pose)
    this.b.t += dt
    this.b.pt += dt

    if (this.cfg.reduced) this.updateReduced(p)
    else {
      this.update(dt, now, p)
      this.overlays(dt, now, p)
    }
    if (this.hovered && !OWN_FACE.has(this.b.kind)) {
      p.eyes = 'happy'
      p.mouth = 'cat'
      p.blush = Math.max(p.blush, 0.55)
    }
    this.render(p, now)
    if (!this.cfg.reduced) this.updateEffects(dt)
    this.schedule(now)
  }

  // ---- geometry --------------------------------------------------------------

  private measure() {
    this.vw = document.documentElement.clientWidth || window.innerWidth
    this.vh = window.innerHeight
  }

  private get S() {
    return this.cfg.size
  }

  private get H() {
    return this.cfg.size * SPRITE_ASPECT
  }

  private bounds(): Bounds {
    const maxX = Math.max(EDGE, this.vw - this.S - EDGE)
    const maxY = Math.max(TOP_SAFE + 8, this.vh - this.H - EDGE)
    return { minX: EDGE, maxX, minY: Math.min(TOP_SAFE + 16, maxY), maxY }
  }

  /** Where wandering targets may land. Phones: bottom-right corner only. */
  private home(): Bounds {
    const bd = this.bounds()
    if (!this.cfg.mobile) return { ...bd, minY: clamp(140, bd.minY, bd.maxY) }
    return {
      minX: clamp(this.vw * 0.55, bd.minX, bd.maxX),
      maxX: bd.maxX,
      minY: clamp(this.vh * 0.62, bd.minY, bd.maxY),
      maxY: bd.maxY,
    }
  }

  private inHome() {
    const hb = this.home()
    return this.x >= hb.minX - 2 && this.y >= hb.minY - 2
  }

  private corner() {
    const bd = this.bounds()
    return { x: Math.max(bd.minX, bd.maxX - 8), y: Math.max(bd.minY, bd.maxY - 8) }
  }

  private resize() {
    this.measure()
    if (!RESIZE_SAFE.has(this.b.kind)) this.toIdle(1, 3)
    const bd = this.bounds()
    this.x = clamp(this.x, bd.minX, bd.maxX)
    this.y = clamp(this.y, bd.minY, bd.maxY)
    this.onMove()
    this.kick()
  }

  // ---- state machine ---------------------------------------------------------

  private activity() {
    this.lastActivity = performance.now()
    if (this.b.kind === 'sleep') {
      this.enter('wake')
      this.kick()
    }
  }

  private toIdle(min: number, max: number) {
    this.enter('idle')
    this.b.dur = this.cfg.reduced ? Infinity : rand(min, max)
  }

  private next() {
    this.b.phase++
    this.b.pt = 0
  }

  private enter(kind: Kind) {
    const b = this.b
    const prev = b.kind
    if (prev === 'eat' && this.orb.state !== 'off') {
      this.orb.state = 'fade'
      this.orb.t = 0
    }
    if (prev === 'sleep') for (const z of this.zs) if (z.on) z.life = Math.min(z.life, z.age + 0.3)
    if (prev === 'announce' && this.announceCb) {
      // Interrupted before talking: show the bubble anyway.
      const cb = this.announceCb
      this.announceCb = null
      cb()
    }

    b.kind = kind
    b.t = 0
    b.pt = 0
    b.phase = 0
    b.dur = 0
    b.dir = 1
    b.n = 0
    b.v = 0
    b.x0 = this.x
    b.y0 = this.y
    b.tx = this.x
    b.ty = this.y
    b.flag = false
    b.emit = 0
    this.hopT = 0

    const S = this.S
    switch (kind) {
      case 'wander': {
        const hb = this.home()
        b.tx = rand(hb.minX, hb.maxX)
        b.ty = rand(hb.minY, hb.maxY)
        break
      }
      case 'bigjump': {
        const hb = this.home()
        b.tx = clamp(this.x + rand(-1, 1) * S * 1.4, hb.minX, hb.maxX)
        break
      }
      case 'zoomies':
        b.dir = this.x + S / 2 > this.vw / 2 ? -1 : 1
        break
      case 'chase':
        b.dur = rand(3.5, 5.5)
        break
      case 'peek': {
        const near = this.x + S / 2 > this.vw / 2 ? 1 : -1
        b.dir = this.cfg.mobile ? 1 : Math.random() < 0.7 ? near : -near
        const hb = this.home()
        b.ty = clamp(this.y, hb.minY, hb.maxY)
        break
      }
      case 'lookaround':
        b.dir = sign()
        break
      case 'spin': {
        const hb = this.home()
        b.dir = sign()
        const dist = S * 1.7
        if (this.x + b.dir * dist < hb.minX || this.x + b.dir * dist > hb.maxX) b.dir = -b.dir
        b.tx = clamp(this.x + b.dir * dist, hb.minX, hb.maxX)
        break
      }
      case 'eat': {
        const hb = this.home()
        let side = sign()
        const d = S * rand(1.6, 2.6)
        if (this.x + side * d < hb.minX || this.x + side * d > hb.maxX) side = -side
        const ox = clamp(this.x + S / 2 + side * d, hb.minX + S / 2, hb.maxX + S / 2)
        b.dir = ox >= this.x + S / 2 ? 1 : -1
        b.tx = clamp(ox - S / 2 - b.dir * S * 0.55, hb.minX, hb.maxX)
        b.ty = this.y
        const o = this.orb
        o.state = 'in'
        o.t = 0
        o.x = ox
        o.y = this.y + this.H * 0.55
        o.s = 1
        this.jiggle(0.08)
        break
      }
      case 'wake':
        this.jiggle(-0.14)
        break
      case 'announce':
        this.announceCb = this.pendingAnnounce
        this.pendingAnnounce = null
        break
      case 'pet':
        b.dur = 0.6
        break
      case 'newskin':
        this.pendingSkin = false
        this.jiggle(-0.1)
        break
      case 'dizzy': {
        b.v = (((this.spinRot % 360) + 540) % 360) - 180
        this.spinRot = 0
        break
      }
      default:
        break
    }
  }

  private pickNext(now: number) {
    if (this.pendingAnnounce) return this.enter('announce')
    if (this.pendingSkin) return this.enter('newskin')
    if (this.hovered) return this.enter('pet')
    if (now - this.lastActivity > SLEEP_AFTER_MS) return this.enter('sleep')
    if (this.speaking) {
      // Stay put while a bubble is open; only fidget in place.
      const r = Math.random()
      if (r < 0.18) this.enter('lookaround')
      else if (r < 0.28) this.enter('dance')
      else this.toIdle(1.5, 3.5)
      return
    }
    if (this.cfg.mobile && !this.inHome()) return this.enter('wander')

    const mouseFresh = !this.cfg.mobile && now - this.mouseAt < 2500
    const options = WEIGHTS.filter(([k]) => {
      if (k !== 'wander' && k === this.lastPicked) return false
      if (k === 'zoomies') return !this.cfg.mobile && this.vw >= 640
      if (k === 'chase') return mouseFresh
      return true
    })
    let total = 0
    for (const [, w] of options) total += w
    let r = Math.random() * total
    let kind: Kind = 'wander'
    for (const [k, w] of options) {
      r -= w
      if (r <= 0) {
        kind = k
        break
      }
    }
    this.lastPicked = kind
    this.enter(kind)
  }

  /** Squash-and-stretch hop toward a target. Returns true once it has landed there. */
  private hop(dt: number, p: Pose, tx: number, ty: number, period: number, height: number, speed: number): boolean {
    this.hopT += dt / period
    if (this.hopT >= 1) {
      this.hopT -= 1
      if (Math.hypot(tx - this.x, ty - this.y) < 2) {
        this.hopT = 0
        return true
      }
    }
    const t = this.hopT
    const dx = tx - this.x
    const dy = ty - this.y
    const dist = Math.hypot(dx, dy)
    if (dist > 2) {
      p.lookX = clamp(dx / 40, -1, 1) * 0.8
      p.lookY = clamp(dy / 60, -1, 1) * 0.5
    }
    if (t < 0.18) {
      // Anticipation: squash before take-off.
      const k = Math.sin((t / 0.18) * Math.PI)
      p.sx *= 1 + 0.14 * k
      p.sy *= 1 - 0.16 * k
    } else if (t < 0.82) {
      // Airborne: stretched at take-off/landing, round at the apex.
      const k = (t - 0.18) / 0.64
      p.lift = Math.sin(k * Math.PI) * height
      const stretch = Math.abs(Math.cos(k * Math.PI))
      p.sx *= 1 - 0.08 * stretch
      p.sy *= 1 + 0.12 * stretch
      p.rot = clamp(dx / 30, -1, 1) * 5 * Math.sin(k * Math.PI)
      if (dist > 0.5) {
        const step = Math.min(dist, speed * dt)
        this.x += (dx / dist) * step
        this.y += (dy / dist) * step
      }
    } else {
      // Landing squash.
      const k = Math.sin(((t - 0.82) / 0.18) * Math.PI)
      p.sx *= 1 + 0.16 * k
      p.sy *= 1 - 0.18 * k
    }
    return false
  }

  private breathe(p: Pose, depth = 1) {
    const br = Math.sin(this.time * 2.4)
    p.sx *= 1 - 0.025 * br * depth
    p.sy *= 1 + 0.035 * br * depth
  }

  private update(dt: number, now: number, p: Pose) {
    const b = this.b
    const S = this.S
    const H = this.H

    switch (b.kind) {
      case 'idle': {
        this.breathe(p)
        if (this.pendingAnnounce) this.enter('announce')
        else if (this.pendingSkin) this.enter('newskin')
        else if (b.t >= b.dur) this.pickNext(now)
        break
      }

      case 'wander': {
        if (this.hop(dt, p, b.tx, b.ty, 0.62, S * 0.24, S * 2.6) || b.t > 14) this.toIdle(2, 5.5)
        break
      }

      case 'bigjump': {
        const big = b.n === 0
        const air = big ? 0.72 : 0.5
        if (b.phase === 0) {
          const k = easeOut(Math.min(1, b.pt / 0.3))
          p.sx *= 1 + 0.22 * k
          p.sy *= 1 - 0.26 * k
          p.lookY = -0.7
          if (b.pt >= 0.3) {
            b.x0 = this.x
            this.next()
          }
        } else if (b.phase === 1) {
          const q = Math.min(1, b.pt / air)
          p.lift = Math.sin(q * Math.PI) * S * (big ? 1.05 : 0.55)
          const st = Math.abs(Math.cos(q * Math.PI))
          p.sx *= 1 - 0.14 * st
          p.sy *= 1 + 0.2 * st
          this.x = lerp(b.x0, b.tx, easeInOut(q))
          p.rot = Math.sign(b.tx - b.x0) * 8 * Math.sin(q * Math.PI)
          p.eyes = q > 0.2 && q < 0.8 ? 'happy' : 'open'
          p.mouth = 'cat'
          if (q >= 1) {
            this.x = b.tx
            this.splat(big ? 5 : 3)
            this.jiggle(big ? 0.2 : 0.12)
            this.next()
          }
        } else {
          const q = Math.min(1, b.pt / 0.36)
          const k = (1 - q) * (1 - q)
          p.sx *= 1 + 0.26 * k
          p.sy *= 1 - 0.28 * k
          p.eyes = 'happy'
          p.mouth = 'cat'
          if (q >= 1) {
            if (big && Math.random() < 0.55) {
              // Double hop: a smaller second bounce.
              const hb = this.home()
              b.n = 1
              b.tx = clamp(this.x + sign() * S * 0.7, hb.minX, hb.maxX)
              b.phase = 0
              b.pt = 0.12
            } else this.toIdle(2, 4.5)
          }
        }
        break
      }

      case 'zoomies': {
        const bd = this.bounds()
        const vmax = clamp(this.vw * 0.9, 480, 950)
        const ACC = 2400
        const DEC = 2600
        if (b.phase === 0) {
          // Drop to the floor first.
          if (this.y >= bd.maxY - 2 || this.hop(dt, p, b.tx, bd.maxY, 0.36, S * 0.18, S * 9)) {
            this.y = Math.max(this.y, bd.maxY - 2)
            this.next()
          }
        } else if (b.phase === 1) {
          // Crouch, eyes on the far wall.
          const k = easeOut(Math.min(1, b.pt / 0.35))
          p.sx *= 1 + 0.14 * k
          p.sy *= 1 - 0.16 * k
          p.rot = -b.dir * 5 * k
          p.lookX = b.dir
          p.lookY = 0.2
          p.mouth = 'cat'
          if (b.pt >= 0.35) {
            b.v = 0
            this.next()
          }
        } else if (b.phase === 2) {
          // Run!
          b.v = Math.min(vmax, b.v + ACC * dt)
          this.x = clamp(this.x + b.dir * b.v * dt, bd.minX, bd.maxX)
          p.rot = lerp(-b.dir * 5, b.dir * 12, Math.min(1, b.pt / 0.15))
          p.sx *= 1.1
          p.sy *= 0.9
          p.lift = Math.abs(Math.sin(b.pt * 26)) * S * 0.1
          p.lookX = b.dir
          p.eyes = 'happy'
          p.mouth = 'cat'
          b.emit -= dt
          if (b.emit <= 0) {
            b.emit = 0.06
            this.dust(this.x + S / 2 - b.dir * S * 0.42, this.y + H * 0.95, -b.dir * S * 1.5)
          }
          const edge = b.dir > 0 ? bd.maxX : bd.minX
          if (b.dir * (edge - this.x) <= (b.v * b.v) / (2 * DEC) + 1) this.next()
        } else if (b.phase === 3) {
          // Skid.
          b.v = Math.max(0, b.v - DEC * dt)
          this.x = clamp(this.x + b.dir * b.v * dt, bd.minX, bd.maxX)
          p.rot = lerp(b.dir * 12, -b.dir * 14, easeOut(Math.min(1, b.pt / 0.12)))
          p.sx *= 1.16
          p.sy *= 0.86
          p.eyes = 'surprised'
          p.mouth = 'open'
          p.mouthOpen = 0.4
          p.lookX = b.dir
          b.emit -= dt
          if (b.emit <= 0) {
            b.emit = 0.035
            this.dust(this.x + S / 2 + b.dir * S * 0.38, this.y + H * 0.95, b.dir * S * 2.2)
          }
          if (b.v <= 0) {
            this.jiggle(0.14)
            this.next()
          }
        } else {
          // Wobble back upright.
          const q = Math.min(1, b.pt / 0.75)
          p.rot = -b.dir * 14 * (1 - q) * Math.cos(q * Math.PI * 3)
          p.eyes = 'happy'
          p.mouth = 'cat'
          p.blush = 0.3
          if (q >= 1) {
            if (b.n === 0 && Math.random() < 0.35 && this.vw >= 800) {
              b.n = 1
              b.dir = -b.dir
              b.phase = 1
              b.pt = 0
            } else this.toIdle(2, 4.5)
          }
        }
        if (b.t > 14) this.toIdle(1, 3)
        break
      }

      case 'chase': {
        if (b.phase === 0) {
          const bd = this.bounds()
          const side = this.mouseX > this.x + S / 2 ? -1 : 1
          const tx = clamp(this.mouseX - S / 2 + side * S * 0.95, bd.minX, bd.maxX)
          const ty = clamp(this.mouseY - H * 0.6, bd.minY, bd.maxY)
          this.prevHopT = this.hopT
          this.hop(dt, p, tx, ty, 0.42, S * 0.2, S * 6.5)
          p.lookX = null // eyes stay on the cursor
          p.lookY = null
          p.mouth = 'cat'
          if (b.t >= b.dur || now - this.mouseAt > 2500) b.flag = true
          if (b.flag && this.hopT < this.prevHopT) this.next() // finish the hop, then get bored
        } else {
          p.eyes = 'sleepy'
          p.mouth = 'flat'
          p.sx *= 1.03
          p.sy *= 0.95 * (1 + 0.06 * Math.sin(Math.min(1, b.pt / 0.6) * Math.PI))
          p.lookX = this.mouseX > this.x + S / 2 ? -0.9 : 0.9
          p.lookY = 0.5
          if (b.pt >= 1.6) this.toIdle(2.5, 5)
        }
        break
      }

      case 'peek': {
        const bd = this.bounds()
        const edge = b.dir > 0 ? bd.maxX : bd.minX
        const hidden = b.dir > 0 ? this.vw - S * 0.42 : -S * 0.58
        if (b.phase === 0) {
          if (this.hop(dt, p, edge, b.ty, 0.56, S * 0.22, S * 4.5)) {
            b.x0 = this.x
            this.next()
          } else if (b.t > 12) this.toIdle(1, 3)
        } else if (b.phase === 1) {
          // Sneak half off-screen.
          const q = Math.min(1, b.pt / 0.7)
          this.x = lerp(b.x0, hidden, easeInOut(q))
          const k = Math.sin(q * Math.PI)
          p.rot = b.dir * 7 * k
          p.sx *= 1 + 0.04 * k
          p.sy *= 1 - 0.04 * k
          p.lookX = -b.dir * 0.5
          if (q >= 1) {
            b.dur = rand(2.2, 3.8)
            this.next()
          }
        } else if (b.phase === 2) {
          // Peek: lean in now and then, eyes on the page.
          const lean = Math.pow(Math.max(0, Math.sin(b.pt * 2.1 - 0.6)), 2)
          this.x = hidden - b.dir * lean * S * 0.16
          p.rot = -b.dir * 9 * lean
          p.lookX = -b.dir
          p.lookY = 0.15
          this.breathe(p, 0.6)
          if (b.pt >= b.dur) {
            b.x0 = this.x
            this.next()
          }
        } else {
          // Pop back out.
          const q = Math.min(1, b.pt / 0.5)
          const target = clamp(edge - b.dir * S * 0.8, bd.minX, bd.maxX)
          this.x = lerp(b.x0, target, easeOutBack(q))
          p.lift = Math.sin(q * Math.PI) * S * 0.45
          p.eyes = q < 0.5 ? 'surprised' : 'happy'
          p.mouth = q < 0.5 ? 'open' : 'cat'
          p.mouthOpen = 0.3
          if (q >= 1) {
            this.x = target
            this.jiggle(0.12)
            this.toIdle(2, 4.5)
          }
        }
        break
      }

      case 'lookaround': {
        const t = b.t
        let lx = 0
        let ly = 0
        if (t < 0.8) lx = -b.dir
        else if (t < 1.6) lx = b.dir
        else if (t < 2.2) ly = -0.9
        p.lookX = lx
        p.lookY = ly
        p.rot = this.lookX * 5
        this.breathe(p)
        if (t >= 2.9) this.toIdle(1.5, 4)
        break
      }

      case 'dance': {
        const w = b.t * Math.PI * 2 * DANCE_HZ
        const s = Math.sin(w)
        p.rot = s * 11
        p.lift = Math.abs(s) * S * 0.12
        p.dx = s * S * 0.06
        const s2 = Math.sin(w * 2) * 0.05
        p.sx *= 1 + s2
        p.sy *= 1 - s2
        p.eyes = 'happy'
        p.mouth = 'cat'
        p.blush = 0.45
        p.lookX = s * 0.5
        p.lookY = 0
        if (b.t >= DANCE_T) this.toIdle(2, 4.5)
        break
      }

      case 'spin': {
        if (b.phase === 0) {
          const k = Math.sin(Math.min(1, b.pt / 0.22) * Math.PI)
          p.sx *= 1 + 0.12 * k
          p.sy *= 1 - 0.14 * k
          p.eyes = 'happy'
          if (b.pt >= 0.22) this.next()
        } else if (b.phase === 1) {
          const q = Math.min(1, b.pt / 0.8)
          const e = easeInOut(q)
          p.rot = b.dir * 360 * e
          this.x = lerp(b.x0, b.tx, e)
          p.lift = Math.sin(q * Math.PI) * S * 0.32
          p.eyes = 'happy'
          p.mouth = 'cat'
          if (q >= 1) {
            this.x = b.tx
            this.jiggle(0.12)
            this.next()
          }
        } else {
          const q = Math.min(1, b.pt / 0.8)
          p.rot = Math.sin(b.pt * 14) * 7 * (1 - q)
          p.eyes = b.pt < 0.55 ? 'dizzy' : 'happy'
          p.spiral = b.pt * 600
          p.mouth = 'cat'
          if (q >= 1) this.toIdle(2, 4.5)
        }
        break
      }

      case 'eat': {
        const o = this.orb
        if (b.phase === 0) {
          // Notice the orb.
          p.eyes = 'surprised'
          p.mouth = 'open'
          p.mouthOpen = 0.1
          p.lookX = b.dir
          p.lookY = 0.2
          p.sy *= 1.04
          if (b.pt >= 0.7) this.next()
        } else if (b.phase === 1) {
          if (this.hop(dt, p, b.tx, b.ty, 0.52, S * 0.2, S * 3.2)) {
            o.state = 'eat'
            o.t = 0
            b.x0 = o.x
            b.y0 = o.y
            this.next()
          }
          p.lookX = b.dir
          p.lookY = 0.2
          p.mouth = 'cat'
          if (b.t > 8) this.toIdle(1, 3)
        } else if (b.phase === 2) {
          // Chomp: the orb slides into the mouth.
          const q = Math.min(1, b.pt / 0.32)
          const e = easeInOut(q)
          p.mouth = 'open'
          p.mouthOpen = Math.min(1, q * 2)
          p.lookX = b.dir
          p.sx *= 1 + 0.06 * q
          o.x = lerp(b.x0, this.x + S / 2 + b.dir * S * 0.06, e)
          o.y = lerp(b.y0, this.y + H * 0.72, e)
          o.s = 1 - 0.85 * q
          if (q >= 1) {
            o.state = 'off'
            this.rig.orb.style.opacity = '0'
            this.jiggle(0.16)
            this.next()
          }
        } else {
          // Chew, glow, happy.
          const q = Math.min(1, b.pt / 1.4)
          if (b.pt < 0.9) {
            p.mouth = 'open'
            p.mouthOpen = Math.abs(Math.sin(b.pt * 11)) * 0.5
          } else p.mouth = 'cat'
          p.eyes = 'happy'
          p.blush = 0.6
          p.glow = Math.sin(q * Math.PI)
          const w = Math.sin(b.pt * 11) * 0.04 * (1 - q)
          p.sx *= 1 + w
          p.sy *= 1 - w
          if (q >= 1) this.toIdle(2, 4.5)
        }
        break
      }

      case 'sleep': {
        if (b.phase === 0) {
          // Yawn.
          const q = Math.min(1, b.pt / 1.8)
          const k = Math.sin(q * Math.PI)
          p.eyes = 'sleepy'
          p.mouth = 'open'
          p.mouthOpen = Math.pow(k, 0.7)
          p.sy *= 1 + 0.1 * k
          p.sx *= 1 - 0.05 * k
          p.lookY = -0.4 * k
          p.lookX = 0
          if (q >= 1) this.next()
        } else {
          // Doze.
          const settle = easeOut(Math.min(1, b.pt / 0.7))
          const br = Math.sin(b.pt * ((2 * Math.PI) / 3.4))
          p.sy *= 1 - 0.08 * settle + 0.03 * br
          p.sx *= 1 + 0.05 * settle - 0.02 * br
          p.rot = 5 * settle
          p.eyes = 'sleepy'
          p.lookX = 0
          p.lookY = 0.3
          b.emit -= dt
          if (b.emit <= 0 && b.pt > 0.6) {
            b.emit = 1.3
            this.spawnZ()
          }
        }
        break
      }

      case 'wake': {
        if (b.phase === 0) {
          const q = Math.min(1, b.pt / 0.55)
          p.eyes = 'surprised'
          p.mouth = 'open'
          p.mouthOpen = 0.35
          p.lift = Math.sin(q * Math.PI) * S * 0.4
          if (q >= 1) {
            this.jiggle(0.12)
            this.next()
          }
        } else {
          p.eyes = 'happy'
          p.mouth = 'cat'
          p.blush = 0.45
          if (b.pt >= 0.9) this.toIdle(1.5, 3.5)
        }
        break
      }

      case 'announce': {
        if (b.phase === 0) {
          // "!" + a little hop...
          const q = Math.min(1, b.pt / 0.55)
          p.bang = Math.min(1, q * 4)
          p.eyes = 'surprised'
          p.mouth = 'open'
          p.mouthOpen = 0.2
          if (q < 0.25) {
            const k = Math.sin((q / 0.25) * Math.PI)
            p.sx *= 1 + 0.1 * k
            p.sy *= 1 - 0.12 * k
          } else p.lift = Math.sin(((q - 0.25) / 0.75) * Math.PI) * S * 0.4
          if (q >= 1) {
            this.jiggle(0.1)
            const cb = this.announceCb
            this.announceCb = null
            cb?.()
            this.next()
          }
        } else {
          // ...then talk.
          p.bang = Math.max(0, 1 - b.pt / 0.35)
          p.eyes = 'happy'
          if (b.pt < 1.2) {
            p.mouth = 'open'
            p.mouthOpen = Math.abs(Math.sin(b.pt * 13)) * 0.55
          } else p.mouth = 'cat'
          this.breathe(p)
          if (b.pt >= 1.6) this.toIdle(2.5, 5)
        }
        break
      }

      case 'newskin': {
        // "New skin!": squash, a happy hop with a sparkle burst, then a wiggle.
        p.eyes = 'happy'
        p.mouth = 'cat'
        p.blush = 0.5
        if (b.phase === 0) {
          const k = Math.sin(Math.min(1, b.pt / 0.16) * Math.PI)
          p.sx *= 1 + 0.14 * k
          p.sy *= 1 - 0.16 * k
          if (b.pt >= 0.16) {
            this.sparkle(DROP_SPARKLES)
            this.next()
          }
        } else if (b.phase === 1) {
          const q = Math.min(1, b.pt / 0.46)
          p.lift = Math.sin(q * Math.PI) * S * 0.5
          const st = Math.abs(Math.cos(q * Math.PI))
          p.sx *= 1 - 0.1 * st
          p.sy *= 1 + 0.15 * st
          p.glow = Math.sin(q * Math.PI) * 0.8
          if (q >= 1) {
            this.jiggle(0.16)
            this.next()
          }
        } else {
          const q = Math.min(1, b.pt / 0.45)
          p.rot = Math.sin(b.pt * 16) * 6 * (1 - q)
          p.glow = 0.3 * (1 - q)
          if (q >= 1) this.toIdle(2, 4.5)
        }
        break
      }

      case 'pet': {
        const w = Math.sin(b.t * 15) * 0.035
        p.sx *= 1 + w
        p.sy *= 1 - w
        p.eyes = 'happy'
        p.mouth = 'cat'
        p.blush = 0.6
        if (!this.hovered && b.t >= b.dur) this.toIdle(1.2, 3)
        break
      }

      case 'drag': {
        // Dangling: swings against the direction of travel.
        const v = this.velocity(now)
        this.dragRot += (clamp(-v.vx * 0.018, -24, 24) - this.dragRot) * (1 - Math.exp(-10 * dt))
        p.rot = this.dragRot
        p.sx *= 0.93
        p.sy *= 1.09
        const fast = Math.abs(v.vx) + Math.abs(v.vy) > 900
        const startled = b.t < 0.3 || fast
        p.eyes = startled ? 'surprised' : 'happy'
        p.mouth = startled ? 'open' : 'cat'
        p.mouthOpen = 0.35
        break
      }

      case 'flung': {
        const bd = this.bounds()
        this.vy += GRAVITY * dt
        this.x += this.vx * dt
        this.y += this.vy * dt
        if (this.x < bd.minX) {
          this.x = bd.minX
          if (this.vx < 0) {
            this.jiggle(-Math.min(0.3, -this.vx / 3500))
            this.vx = -this.vx * 0.6
          }
        } else if (this.x > bd.maxX) {
          this.x = bd.maxX
          if (this.vx > 0) {
            this.jiggle(-Math.min(0.3, this.vx / 3500))
            this.vx = -this.vx * 0.6
          }
        }
        if (this.y < bd.minY) {
          this.y = bd.minY
          if (this.vy < 0) this.vy = -this.vy * 0.5
        }
        let onFloor = false
        if (this.y >= bd.maxY) {
          this.y = bd.maxY
          if (this.vy > 160) {
            this.jiggle(Math.min(0.32, this.vy / 3200))
            if (this.vy > S * 18) this.splat(3)
            this.vy = -this.vy * 0.45
          } else {
            this.vy = 0
            onFloor = true
          }
        }
        if (onFloor) this.vx *= Math.exp(-3.2 * dt)
        this.spinRot += ((this.vx * dt) / (Math.PI * S)) * 360 // roll
        p.rot = this.spinRot
        p.eyes = 'surprised'
        p.mouth = 'open'
        p.mouthOpen = 0.6
        if ((onFloor && Math.abs(this.vx) < 30) || b.t > 6) this.enter('dizzy')
        break
      }

      case 'dizzy': {
        if (b.phase === 0) {
          const q = Math.min(1, b.pt / 1.8)
          const settle = 1 - easeOut(Math.min(1, b.pt / 0.35))
          p.rot = b.v * settle + Math.sin(b.pt * 9) * 10 * (1 - q)
          const w = Math.sin(b.pt * 9 + 1) * 0.05 * (1 - q)
          p.sx *= 1 + w
          p.sy *= 1 - w
          p.eyes = 'dizzy'
          p.spiral = b.pt * 540
          p.mouth = 'flat'
          if (q >= 1) this.next()
        } else {
          p.eyes = 'happy'
          p.mouth = 'cat'
          p.blush = 0.4
          if (b.pt >= 0.8) this.toIdle(1.5, 3)
        }
        break
      }
    }
  }

  private updateReduced(p: Pose) {
    const b = this.b
    if (b.kind === 'idle' && this.pendingSkin) this.enter('newskin')
    if (b.kind === 'drag') {
      p.eyes = 'happy'
      p.mouth = 'cat'
    } else if (b.kind === 'newskin') {
      // Reduced motion: no hop, just a beaming face while the colors fade.
      p.eyes = 'happy'
      p.mouth = 'cat'
      p.blush = 0.5
      if (b.t >= 1.1) this.toIdle(0, 0)
    } else if (b.kind === 'announce') {
      p.bang = b.pt < 1 ? 1 : Math.max(0, 1 - (b.pt - 1) / 0.3)
      if (b.pt > 1.3) this.toIdle(0, 0)
    } else if (b.kind !== 'idle') {
      this.toIdle(0, 0)
    }
  }

  /** Effects layered on top of whatever the behaviour did. */
  private overlays(dt: number, now: number, p: Pose) {
    // Jelly spring.
    const acc = -320 * this.j - 11 * this.jv
    this.jv += acc * dt
    this.j = clamp(this.j + this.jv * dt, -0.35, 0.35)
    p.sx *= 1 + this.j
    p.sy *= 1 - this.j

    // Scroll bump.
    if (this.bumpY > 0 || this.bumpV > 0) {
      this.bumpV -= 1600 * dt
      this.bumpY += this.bumpV * dt
      if (this.bumpY <= 0) {
        this.bumpY = 0
        this.bumpV = 0
        this.jiggle(0.08)
      }
    }
    p.lift += this.bumpY

    // Gaze: behaviour override > scroll direction > cursor > random glances.
    let tx = p.lookX
    let ty = p.lookY
    if (tx === null || ty === null) {
      let ax: number
      let ay: number
      if (!this.cfg.mobile && now - this.mouseAt < MOUSE_FRESH_MS) {
        ax = clamp((this.mouseX - (this.x + this.S / 2)) / 220, -1, 1)
        ay = clamp((this.mouseY - (this.y + this.H / 2)) / 220, -1, 1)
      } else {
        if (now >= this.glanceAt) {
          const centre = Math.random() < 0.4
          this.glanceX = centre ? 0 : rand(-0.8, 0.8)
          this.glanceY = centre ? 0 : rand(-0.3, 0.4)
          this.glanceAt = now + rand(1500, 3500)
        }
        ax = this.glanceX
        ay = this.glanceY
      }
      tx ??= ax
      ty ??= ay
    }
    if (now < this.scrollLookUntil) ty = this.scrollLookY
    const k = 1 - Math.exp(-12 * dt)
    this.lookX += (tx - this.lookX) * k
    this.lookY += (ty - this.lookY) * k
  }

  private jiggle(amount: number) {
    this.jv += amount * 16
  }

  private velocity(now: number) {
    const s = this.samples.filter((q) => now - q.t <= 100)
    if (s.length < 2) return { vx: 0, vy: 0 }
    const a = s[0]
    const z = s[s.length - 1]
    const dt = Math.max(16, z.t - a.t) / 1000
    return { vx: (z.x - a.x) / dt, vy: (z.y - a.y) / dt }
  }

  // ---- particles -------------------------------------------------------------

  private take(pool: Particle[]): Particle {
    let pick = pool[0]
    for (const q of pool) {
      if (!q.on) return q
      if (q.age / q.life > pick.age / pick.life) pick = q
    }
    return pick
  }

  private spawnDrop(x: number, y: number, vx: number, vy: number, life: number, size: number) {
    const d = this.take(this.drops)
    if (!d) return
    d.on = true
    d.x = x
    d.y = y
    d.vx = vx
    d.vy = vy
    d.age = 0
    d.life = life
    if (d.size !== size) {
      d.size = size
      d.el.style.width = `${size}px`
      d.el.style.height = `${size}px`
    }
  }

  /** Landing splat: a few droplets fly out from the base. */
  private splat(n: number) {
    const S = this.S
    const cx = this.x + S / 2
    const gy = this.y + this.H * 0.92
    for (let i = 0; i < n; i++) {
      this.spawnDrop(
        cx + rand(-S * 0.25, S * 0.25),
        gy,
        rand(-1, 1) * S * 3,
        -rand(S * 2.2, S * 4.4),
        rand(0.45, 0.7),
        Math.round(rand(3, 5)),
      )
    }
  }

  /** Skin-change sparkle: droplets fountain up and out from the top of the body. */
  private sparkle(n: number) {
    const S = this.S
    const cx = this.x + S / 2
    const top = this.y + this.H * 0.25
    for (let i = 0; i < n; i++) {
      const a = ((i + 0.5) / n - 0.5) * 2 // -1..1, spread left to right
      this.spawnDrop(
        cx + a * S * 0.35,
        top + rand(-2, 2),
        a * S * 3 + rand(-15, 15),
        -rand(S * 3.4, S * 5),
        rand(0.55, 0.8),
        Math.round(rand(3, 5)),
      )
    }
  }

  private dust(x: number, y: number, vx: number) {
    this.spawnDrop(x, y, vx + rand(-20, 20), -rand(this.S * 0.6, this.S * 1.4), rand(0.25, 0.4), Math.round(rand(2, 4)))
  }

  private spawnZ() {
    const z = this.take(this.zs)
    if (!z) return
    z.on = true
    z.x = this.x + this.S * 0.78
    z.y = this.y + this.H * 0.05
    z.vx = this.S * 0.35
    z.vy = -this.S * 0.6
    z.age = 0
    z.life = 2.4
  }

  private clearEffects() {
    for (const q of [...this.drops, ...this.zs]) {
      q.on = false
      q.el.style.opacity = '0'
    }
    this.orb.state = 'off'
    this.rig.orb.style.opacity = '0'
  }

  private updateEffects(dt: number) {
    for (const d of this.drops) {
      if (!d.on) continue
      d.age += dt
      if (d.age >= d.life) {
        d.on = false
        d.el.style.opacity = '0'
        continue
      }
      d.vy += 900 * dt
      d.x += d.vx * dt
      d.y += d.vy * dt
      const q = d.age / d.life
      d.el.style.opacity = (1 - q * q).toFixed(2)
      d.el.style.transform = `translate3d(${(d.x - d.size / 2).toFixed(1)}px, ${(d.y - d.size / 2).toFixed(1)}px, 0)`
    }

    for (const z of this.zs) {
      if (!z.on) continue
      z.age += dt
      if (z.age >= z.life) {
        z.on = false
        z.el.style.opacity = '0'
        continue
      }
      const q = z.age / z.life
      z.x += z.vx * dt + Math.sin(z.age * 3) * this.S * 0.25 * dt
      z.y += z.vy * dt
      z.el.style.opacity = Math.sin(q * Math.PI).toFixed(2)
      z.el.style.transform = `translate3d(${z.x.toFixed(1)}px, ${z.y.toFixed(1)}px, 0) scale(${(0.7 + 0.6 * q).toFixed(2)})`
    }

    const o = this.orb
    if (o.state !== 'off') {
      o.t += dt
      let op = 1
      let sc = 1
      let bob = Math.sin(this.time * 4) * 2
      if (o.state === 'in') {
        const q = Math.min(1, o.t / 0.4)
        op = q
        sc = Math.max(0.01, easeOutBack(q))
        if (q >= 1) o.state = 'idle'
      } else if (o.state === 'eat') {
        sc = o.s
        bob = 0
      } else if (o.state === 'fade') {
        const q = Math.min(1, o.t / 0.4)
        op = 1 - q
        sc = 1 - 0.5 * q
        if (q >= 1) o.state = 'off'
      }
      const pulse = 1 + 0.12 * Math.sin(this.time * 7)
      this.rig.orb.style.opacity = o.state === 'off' ? '0' : op.toFixed(2)
      this.rig.orb.style.transform = `translate3d(${(o.x - 5).toFixed(1)}px, ${(o.y - 5 + bob).toFixed(1)}px, 0) scale(${(sc * pulse).toFixed(3)})`
    }
  }

  // ---- rendering -------------------------------------------------------------

  private render(p: Pose, now: number) {
    const r = this.rig
    const w = this.w
    const S = this.S
    const H = this.H

    const root = `translate3d(${this.x.toFixed(1)}px, ${this.y.toFixed(1)}px, 0)`
    if (root !== w.root) {
      r.root.style.transform = root
      w.root = root
      this.onMove()
    }

    // Never lift into the dock area.
    const lift = clamp(p.lift, 0, Math.max(0, this.y - TOP_SAFE))
    const body =
      `translate3d(${p.dx.toFixed(2)}px, ${(-lift).toFixed(2)}px, 0) ` +
      `translateY(${(-H / 2).toFixed(2)}px) rotate(${p.rot.toFixed(2)}deg) translateY(${(H / 2).toFixed(2)}px) ` +
      `scale(${p.sx.toFixed(3)}, ${p.sy.toFixed(3)})`
    if (body !== w.body) {
      r.body.style.transform = body
      w.body = body
    }

    const sk = 1 - Math.min(1, lift / (S * 0.9)) * 0.55
    const shadow = `translateX(-50%) translateX(${p.dx.toFixed(1)}px) scale(${(sk * p.sx).toFixed(3)}, ${sk.toFixed(3)})`
    if (shadow !== w.shadow) {
      r.shadow.style.transform = shadow
      w.shadow = shadow
    }
    const shadowOp = (0.35 + 0.65 * sk).toFixed(2)
    if (shadowOp !== w.shadowOp) {
      r.shadow.style.opacity = shadowOp
      w.shadowOp = shadowOp
    }

    const glow = p.glow.toFixed(2)
    if (glow !== w.glow) {
      r.glow.style.opacity = glow
      w.glow = glow
    }

    const bangOp = clamp(p.bang, 0, 1)
    const bang =
      bangOp > 0
        ? `${bangOp.toFixed(2)}|translate(-50%, ${(-lift - S * 0.08).toFixed(1)}px) scale(${(0.6 + 0.4 * Math.min(1, bangOp * 1.5)).toFixed(2)})`
        : '0'
    if (bang !== w.bang) {
      const [op, tf] = bang.split('|')
      r.bang.style.opacity = op
      if (tf) r.bang.style.transform = tf
      w.bang = bang
    }

    this.renderFace(p, now)
  }

  private renderFace(p: Pose, now: number) {
    const f = this.rig.face
    const w = this.w
    const reduced = this.cfg.reduced

    if (p.eyes !== w.eyes) {
      for (const m of EYE_MODES) f.eyes[m].style.display = m === p.eyes ? '' : 'none'
      w.eyes = p.eyes
    }

    // Blinking (open eyes only; otherwise just postpone).
    let open = 1
    if (this.blinkStart < 0 && now >= this.blinkAt) {
      if (p.eyes === 'open') this.blinkStart = now
      else this.blinkAt = now + 1500
    }
    if (this.blinkStart >= 0) {
      const dur = reduced ? 260 : 150
      const q = (now - this.blinkStart) / dur
      if (q >= 1) {
        this.blinkStart = -1
        if (!reduced && !this.blinkTwice && Math.random() < 0.2) {
          this.blinkTwice = true
          this.blinkAt = now + 130
        } else {
          this.blinkTwice = false
          this.blinkAt = now + (reduced ? rand(4500, 8000) : rand(2200, 5500))
        }
      } else open = Math.max(0.08, 1 - Math.sin(q * Math.PI))
    }
    const o = Math.round(open * 50) / 50
    if (o !== w.open) {
      const m = `matrix(1 0 0 ${o} 0 ${(EYE_Y * (1 - o)).toFixed(2)})`
      f.eyeL.setAttribute('transform', m)
      f.eyeR.setAttribute('transform', m)
      w.open = o
    }

    const lx = reduced ? 0 : this.lookX
    const ly = reduced ? 0 : this.lookY
    const face = `translate(${(lx * 6).toFixed(1)} ${(ly * 3.5).toFixed(1)})`
    if (face !== w.face) {
      f.face.setAttribute('transform', face)
      w.face = face
    }

    if (p.eyes === 'dizzy') {
      const a = Math.round(p.spiral) % 360
      if (a !== w.spiral) {
        f.dizzyL.setAttribute('transform', `translate(${EYE_LX} ${EYE_Y}) rotate(${a})`)
        f.dizzyR.setAttribute('transform', `translate(${EYE_RX} ${EYE_Y}) rotate(${a})`)
        w.spiral = a
      }
    }

    if (p.mouth !== w.mouth) {
      for (const m of MOUTH_MODES) f.mouths[m].style.display = m === p.mouth ? '' : 'none'
      w.mouth = p.mouth
    }
    if (p.mouth === 'open') {
      const m = Math.round(p.mouthOpen * 20) / 20
      if (m !== w.mouthOpen) {
        f.mouthOpen.setAttribute('ry', (1.4 + 3 * m).toFixed(2))
        f.mouthOpen.setAttribute('rx', (2.4 + 1.4 * m).toFixed(2))
        w.mouthOpen = m
      }
    }

    const blush = Math.round(p.blush * 20) / 20
    if (blush !== w.blush) {
      f.blush.setAttribute('opacity', String(blush))
      w.blush = blush
    }
  }
}
