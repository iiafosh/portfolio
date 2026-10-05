import { getPrefs } from "./prefs"

// Tiny synthesized UI sounds (Web Audio, no files). Every cue is user-caused
// and quiet; all of them respect the sound preference in the dock.

let context: AudioContext | null = null

function audio(): AudioContext | null {
  if (typeof window === "undefined" || !getPrefs().sound) return null
  try {
    context ??= new AudioContext()
    if (context.state === "suspended") void context.resume()
    return context
  } catch {
    return null
  }
}

interface ToneOptions {
  type?: OscillatorType
  from: number
  to: number
  duration: number
  gain: number
  delay?: number
}

function tone({ type = "sine", from, to, duration, gain, delay = 0 }: ToneOptions) {
  const ctx = audio()
  if (!ctx) return
  const t = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const amp = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(from, t)
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + duration)
  amp.gain.setValueAtTime(0.0001, t)
  amp.gain.exponentialRampToValueAtTime(gain, t + 0.008)
  amp.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  osc.connect(amp)
  amp.connect(ctx.destination)
  osc.start(t)
  osc.stop(t + duration + 0.02)
}

function noise(duration: number, gain: number, frequency: number, q = 1.2) {
  const ctx = audio()
  if (!ctx) return
  const t = ctx.currentTime
  const length = Math.max(1, Math.floor(ctx.sampleRate * duration))
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 2
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const filter = ctx.createBiquadFilter()
  filter.type = "bandpass"
  filter.frequency.value = frequency
  filter.Q.value = q
  const amp = ctx.createGain()
  amp.gain.value = gain
  source.connect(filter)
  filter.connect(amp)
  amp.connect(ctx.destination)
  source.start(t)
}

export const sounds = {
  /** Opening a sheet or a card. */
  open: () => tone({ from: 360, to: 130, duration: 0.05, gain: 0.16 }),
  /** Closing it again. */
  close: () => tone({ from: 130, to: 320, duration: 0.045, gain: 0.14 }),
  /** A soft click for toggles and copies. */
  tick: () => noise(0.012, 0.18, 4200, 2.4),
  /** Moving between dock destinations: two soft notes. */
  chime: () => {
    tone({ type: "triangle", from: 880, to: 870, duration: 0.09, gain: 0.05 })
    tone({ type: "triangle", from: 1320, to: 1310, duration: 0.12, gain: 0.04, delay: 0.07 })
  },
  /** Slime lands — pitch follows how hard. */
  blop: (strength: number) => {
    const s = Math.min(1, Math.max(0.15, strength))
    tone({ from: 260 + 360 * s, to: 90, duration: 0.09 + 0.08 * s, gain: 0.07 + 0.16 * s })
  },
  /** Slime hops. */
  boing: () => tone({ type: "sine", from: 220, to: 560, duration: 0.11, gain: 0.07 }),
  /** Picking the slime up. */
  squish: () => {
    noise(0.07, 0.12, 900, 0.8)
    tone({ from: 180, to: 120, duration: 0.07, gain: 0.08 })
  },
  /** Petting: a tiny rising sparkle. */
  sparkle: () => {
    tone({ type: "triangle", from: 1200, to: 1500, duration: 0.07, gain: 0.035 })
    tone({ type: "triangle", from: 1600, to: 2000, duration: 0.08, gain: 0.03, delay: 0.06 })
  },
}
