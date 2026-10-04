// Shared constants, types and DOM lookup for the slime sprite. Kept out of the
// .tsx files so the engine can import them without pulling in React.

export type EyeMode = 'open' | 'happy' | 'sleepy' | 'surprised' | 'dizzy'
export type MouthMode = 'smile' | 'cat' | 'open' | 'flat'

export const EYE_MODES: readonly EyeMode[] = ['open', 'happy', 'sleepy', 'surprised', 'dizzy']
export const MOUTH_MODES: readonly MouthMode[] = ['smile', 'cat', 'open', 'flat']

/** Sprite height / width (the SVG viewBox is 100 x 80). */
export const SPRITE_ASPECT = 0.8

/** Face anchor points, in viewBox units. */
export const EYE_Y = 47
export const EYE_LX = 37
export const EYE_RX = 63

/** Animatable parts inside the SVG. */
export interface FaceRig {
  /** Whole face; translated to make the slime look around. */
  face: SVGGElement
  eyes: Record<EyeMode, SVGGElement>
  /** Open eyes, scaled vertically to blink. */
  eyeL: SVGGElement
  eyeR: SVGGElement
  /** Spiral eyes, rotated while dizzy. */
  dizzyL: SVGGElement
  dizzyR: SVGGElement
  mouths: Record<MouthMode, SVGElement>
  mouthOpen: SVGEllipseElement
  blush: SVGGElement
}

/** Every element the engine writes to. */
export interface Rig {
  /** Positioned container (translate only). */
  root: HTMLElement
  /** Sprite wrapper: lift, squash & stretch, rotation. */
  body: HTMLElement
  shadow: HTMLElement
  glow: HTMLElement
  /** The "!" shown before the slime talks. */
  bang: HTMLElement
  face: FaceRig
  /** Fixed-position particle pools, in viewport coordinates. */
  drops: HTMLElement[]
  zs: HTMLElement[]
  orb: HTMLElement
}

export function getFaceRig(svg: SVGSVGElement): FaceRig {
  const q = <T extends Element>(part: string): T => {
    const el = svg.querySelector<T>(`[data-part="${part}"]`)
    if (!el) throw new Error(`SlimeSprite: missing part "${part}"`)
    return el
  }
  return {
    face: q<SVGGElement>('face'),
    eyes: {
      open: q<SVGGElement>('eyes-open'),
      happy: q<SVGGElement>('eyes-happy'),
      sleepy: q<SVGGElement>('eyes-sleepy'),
      surprised: q<SVGGElement>('eyes-surprised'),
      dizzy: q<SVGGElement>('eyes-dizzy'),
    },
    eyeL: q<SVGGElement>('eye-l'),
    eyeR: q<SVGGElement>('eye-r'),
    dizzyL: q<SVGGElement>('dizzy-l'),
    dizzyR: q<SVGGElement>('dizzy-r'),
    mouths: {
      smile: q<SVGElement>('mouth-smile'),
      cat: q<SVGElement>('mouth-cat'),
      open: q<SVGElement>('mouth-open'),
      flat: q<SVGElement>('mouth-flat'),
    },
    mouthOpen: q<SVGEllipseElement>('mouth-open'),
    blush: q<SVGGElement>('blush'),
  }
}
