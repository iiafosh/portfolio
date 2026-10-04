// Motion tokens. Curves mirror the CSS custom properties in globals.css;
// springs follow beUI's canonical set (MIT, github.com/starc007/ui-components).

export const EASE_SWIFT = [0.2, 0.8, 0.2, 1] as const
export const EASE_SPRING = [0.34, 1.56, 0.64, 1] as const
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const

/** Press feedback on buttons and other tappable surfaces. */
export const SPRING_PRESS = { type: "spring", stiffness: 500, damping: 30, mass: 0.6 } as const

/** Shared-layout glides — pills and indicators moving between positions. */
export const SPRING_LAYOUT = { type: "spring", stiffness: 360, damping: 32, mass: 0.6 } as const

/** Overlay panels summoned by pointer. */
export const SPRING_PANEL = { type: "spring", stiffness: 420, damping: 40, mass: 0.5 } as const

/** Decorative cursor-follow (tilt, dock lift). */
export const SPRING_MOUSE = { stiffness: 200, damping: 15, mass: 0.3 } as const

/** Things that hang and swing (lanyards, the shelf). */
export const SPRING_SWING = { stiffness: 120, damping: 7, mass: 0.8 } as const
