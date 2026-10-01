import confetti from 'canvas-confetti'

export const triggerGooseHonk = (event?: React.MouseEvent) => {
  // 1. Synthesize retro goose honk using Web Audio API
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioContextClass) {
      const ctx = new AudioContextClass()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(320, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.18)

      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start()
      osc.stop(ctx.currentTime + 0.25)
    }
  } catch {
    // Graceful fallback if Web Audio is not allowed
  }

  // 2. Fire celebratory confetti
  const x = event ? event.clientX / window.innerWidth : 0.5
  const y = event ? event.clientY / window.innerHeight : 0.5

  confetti({
    particleCount: 55,
    spread: 60,
    origin: { x, y },
    colors: ['#FFFFFF', '#A1A1AA', '#10B981', '#6366F1', '#F59E0B'],
    disableForReducedMotion: true,
  })
}
