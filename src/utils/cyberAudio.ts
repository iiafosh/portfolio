// Web Audio API synthesized retro gaming and cyber sound effects (zero audio assets required)

const getAudioContext = (): AudioContext | null => {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    return AudioContextClass ? new AudioContextClass() : null
  } catch {
    return null
  }
}

export const playCyberBlip = (freq = 800) => {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.08, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.08)
  } catch {}
}

export const playCyberPowerUp = () => {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(220, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.25)

    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.25)
  } catch {}
}

export const playLaserSound = () => {
  try {
    const ctx = getAudioContext()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(900, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15)

    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)

    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.15)
  } catch {}
}
