import confetti from 'canvas-confetti'

/**
 * Synthesize a bubbly, cute 8-bit / retro slime "bloop!" sound
 * and trigger cyan / electric blue slime bubble sparkles.
 */
export const triggerSlimeBloop = (event?: React.MouseEvent | MouseEvent) => {
  // 1. Synthesize cute jelly slime "bloop" audio with Web Audio API
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

    if (AudioContextClass) {
      const ctx = new AudioContextClass()
      const now = ctx.currentTime

      // Primary bubbly pitch-bend oscillator
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      // Rapid upward pitch sweep gives the quintessential cute slime "bloop!"
      osc.frequency.setValueAtTime(320, now)
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08)
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.18)

      gain.gain.setValueAtTime(0.01, now)
      gain.gain.linearRampToValueAtTime(0.25, now + 0.03)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.22)

      // Secondary soft water-droplet pop resonance
      const popOsc = ctx.createOscillator()
      const popGain = ctx.createGain()

      popOsc.type = 'triangle'
      popOsc.frequency.setValueAtTime(640, now)
      popOsc.frequency.exponentialRampToValueAtTime(980, now + 0.05)

      popGain.gain.setValueAtTime(0.12, now)
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)

      popOsc.connect(popGain)
      popGain.connect(ctx.destination)

      popOsc.start(now)
      popOsc.stop(now + 0.1)
    }
  } catch {
    // Graceful fallback if Web Audio is blocked by browser autoplay policy
  }

  // 2. Dispatch custom event so the floating Slime Mascot reacts with a celebratory jump
  try {
    window.dispatchEvent(new CustomEvent('slime-mascot-jump'))
  } catch {
    // ignore
  }

  // 3. Fire celebratory slime bubbles & sparkles
  const x = event && 'clientX' in event ? event.clientX / window.innerWidth : 0.5
  const y = event && 'clientY' in event ? event.clientY / window.innerHeight : 0.5

  confetti({
    particleCount: 45,
    spread: 55,
    origin: { x, y },
    colors: ['#06B6D4', '#38BDF8', '#60A5FA', '#A5F3FC', '#FFFFFF'],
    shapes: ['circle'],
    scalar: 0.9,
    disableForReducedMotion: true,
  })
}

// Backwards-compatible alias for any residual imports
export const triggerGooseHonk = triggerSlimeBloop
