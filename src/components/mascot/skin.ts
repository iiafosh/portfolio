// Slime colors, read from the active site skin. The site sets
// `document.documentElement.dataset.skin` and defines --slime-* on the root;
// every fallback below is the original Rimuru blue, so the slime still looks
// right if those variables are missing.

const v = (name: string, fallback: string) => `var(--slime-${name}, ${fallback})`

/** Lightest highlight. */
export const SLIME_HI = v('hi', '#f4fcff')
/** Body color. */
export const SLIME_MID = v('mid', '#8ad6fb')
/** Shade / inner core. */
export const SLIME_DEEP = v('deep', '#3a8fd8')
/** Soft rgba glow. */
export const SLIME_GLOW = v('glow', 'rgba(79, 200, 255, 0.35)')
/** Dark outline and eye color. */
export const SLIME_LINE = v('line', '#0b2a4a')

/** `pct`% of `a` mixed into `b`. */
export const mix = (a: string, pct: number, b: string) => `color-mix(in srgb, ${a} ${pct}%, ${b})`
/** `c` at `pct`% opacity. */
export const alpha = (c: string, pct: number) => mix(c, pct, 'transparent')

/** Light tint for particles and accents (between highlight and body). */
export const SLIME_TINT = mix(SLIME_HI, 45, SLIME_MID)

/** Skin swaps fade instead of snapping. */
export const COLOR_FADE = '0.5s ease'
