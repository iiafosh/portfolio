import { forwardRef, memo, useId, type CSSProperties } from 'react'
import { EYE_LX, EYE_RX, EYE_Y } from './rig'
import { COLOR_FADE, SLIME_DEEP, SLIME_HI, SLIME_LINE, SLIME_MID, mix } from './skin'

// Rimuru drawn as inline SVG so the face can be animated: a translucent
// dome with a darker inner core, glossy highlights and a set of swappable
// eyes / mouths. Every slime color comes from the site skin's --slime-* CSS
// variables (see skin.ts) and fades when the skin changes. The engine toggles
// and transforms the parts marked with data-part; nothing here re-renders
// while it animates.

const BODY =
  'M50 6 C64 6 74 15 82 26 C91 38 97 50 97 61 C97 72 85 77 50 77 C15 77 3 72 3 61 C3 50 9 38 18 26 C26 15 36 6 50 6 Z'
const CORE = 'M24 74 C14 68 18 54 32 50 C44 47 52 36 66 37 C82 38 89 53 85 66 C81 75 40 78 24 74 Z'
const SPIRAL = 'M0 0 A1.3 1.3 0 0 1 2.6 0 A2.6 2.6 0 0 1 -2.6 0 A3.9 3.9 0 0 1 5.2 0'

const stop = (color: string): CSSProperties => ({ stopColor: color, transition: `stop-color ${COLOR_FADE}` })
const FADE = `fill ${COLOR_FADE}, stroke ${COLOR_FADE}`
const fill = (color: string): CSSProperties => ({ fill: color, transition: FADE })
const stroke = (color: string): CSSProperties => ({ stroke: color, transition: FADE })

const INK_FILL = fill(SLIME_LINE)
const INK_STROKE = stroke(SLIME_LINE)
const hidden = { display: 'none' } as const
const INK_STROKE_HIDDEN = { ...INK_STROKE, ...hidden }
const INK_FILL_HIDDEN = { ...INK_FILL, ...hidden }

const lineEye = (cx: number, d: (cx: number) => string) => (
  <path d={d(cx)} fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={INK_STROKE} />
)
const happyD = (cx: number) => `M${cx - 5} ${EYE_Y + 2} Q${cx} ${EYE_Y - 4.5} ${cx + 5} ${EYE_Y + 2}`
const sleepyD = (cx: number) => `M${cx - 5} ${EYE_Y + 0.5} Q${cx} ${EYE_Y + 3} ${cx + 5} ${EYE_Y + 0.5}`

// Memoised: the engine mutates attributes directly, so React should never
// touch this subtree again after mount.
export const SlimeSprite = memo(
  forwardRef<SVGSVGElement, { className?: string; style?: CSSProperties }>(function SlimeSprite(
    { className, style },
    ref,
  ) {
    const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
    const id = (name: string) => `slime-${uid}-${name}`
    const url = (name: string) => `url(#${id(name)})`

    return (
      <svg
        ref={ref}
        viewBox="0 0 100 80"
        className={className}
        style={style}
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id={id('body')} cx="0.4" cy="0.32" r="0.78">
            <stop offset="0" style={stop(SLIME_HI)} />
            <stop offset="0.38" style={stop(mix(SLIME_HI, 55, SLIME_MID))} />
            <stop offset="0.78" style={stop(SLIME_MID)} />
            <stop offset="1" style={stop(mix(SLIME_MID, 45, SLIME_DEEP))} />
          </radialGradient>
          <linearGradient id={id('core')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopOpacity="0.2" style={stop(SLIME_MID)} />
            <stop offset="1" stopOpacity="0.55" style={stop(SLIME_DEEP)} />
          </linearGradient>
          <linearGradient id={id('gloss')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
          <clipPath id={id('clip')}>
            <path d={BODY} />
          </clipPath>
        </defs>

        {/* Body */}
        <path d={BODY} fill={url('body')} fillOpacity={0.94} />
        <g clipPath={url('clip')}>
          <path d={CORE} fill={url('core')} />
          <ellipse cx="50" cy="81" rx="46" ry="9" opacity="0.22" style={fill(SLIME_DEEP)} />
          <ellipse cx="50" cy="73" rx="28" ry="2.6" fill="#ffffff" opacity="0.16" />
        </g>
        <path d={BODY} fill="none" strokeOpacity={0.5} strokeWidth={1.4} style={stroke(SLIME_DEEP)} />

        {/* Highlights */}
        <path
          d="M11 54 C11 36 25 17 43 11"
          fill="none"
          stroke="#ffffff"
          strokeOpacity={0.5}
          strokeWidth={2}
          strokeLinecap="round"
        />
        <ellipse cx="31" cy="22" rx="12" ry="6" transform="rotate(-32 31 22)" fill={url('gloss')} />
        <circle cx="46.5" cy="12.5" r="2.4" fill="#ffffff" fillOpacity={0.85} />
        <path
          d="M88 45 C91 50 92 56 91 62"
          fill="none"
          stroke="#ffffff"
          strokeOpacity={0.45}
          strokeWidth={1.8}
          strokeLinecap="round"
        />

        {/* Face */}
        <g data-part="face">
          <g data-part="blush" opacity="0">
            <ellipse cx="26" cy="55" rx="5.5" ry="2.6" fill="#ff9ccb" />
            <ellipse cx="74" cy="55" rx="5.5" ry="2.6" fill="#ff9ccb" />
          </g>

          <g data-part="eyes-open">
            {[EYE_LX, EYE_RX].map((cx) => (
              <g key={cx} data-part={cx === EYE_LX ? 'eye-l' : 'eye-r'}>
                <ellipse cx={cx} cy={EYE_Y} rx="3.7" ry="5.1" style={INK_FILL} />
                <circle cx={cx - 1.2} cy={EYE_Y - 1.9} r="1.4" fill="#ffffff" />
                <circle cx={cx + 1.3} cy={EYE_Y + 2} r="0.6" fill="#ffffff" fillOpacity={0.8} />
              </g>
            ))}
          </g>
          <g data-part="eyes-happy" style={hidden}>
            {lineEye(EYE_LX, happyD)}
            {lineEye(EYE_RX, happyD)}
          </g>
          <g data-part="eyes-sleepy" style={hidden}>
            {lineEye(EYE_LX, sleepyD)}
            {lineEye(EYE_RX, sleepyD)}
          </g>
          <g data-part="eyes-surprised" style={hidden}>
            {[EYE_LX, EYE_RX].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy={EYE_Y} r="4.4" fill="#ffffff" strokeWidth="2" style={INK_STROKE} />
                <circle cx={cx} cy={EYE_Y} r="1.6" style={INK_FILL} />
              </g>
            ))}
          </g>
          <g data-part="eyes-dizzy" style={hidden}>
            {[EYE_LX, EYE_RX].map((cx) => (
              <g key={cx} data-part={cx === EYE_LX ? 'dizzy-l' : 'dizzy-r'} transform={`translate(${cx} ${EYE_Y})`}>
                <path d={SPIRAL} fill="none" strokeWidth="1.6" strokeLinecap="round" style={INK_STROKE} />
              </g>
            ))}
          </g>

          <path
            data-part="mouth-smile"
            d="M46.5 56 Q50 59 53.5 56"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={INK_STROKE}
          />
          <path
            data-part="mouth-cat"
            d="M45 56 Q47.5 59.2 50 56.4 Q52.5 59.2 55 56"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={INK_STROKE_HIDDEN}
          />
          <path
            data-part="mouth-flat"
            d="M47 57.2 L53 57.2"
            fill="none"
            strokeWidth="1.8"
            strokeLinecap="round"
            style={INK_STROKE_HIDDEN}
          />
          <ellipse data-part="mouth-open" cx="50" cy="57.6" rx="2.6" ry="1.6" style={INK_FILL_HIDDEN} />
        </g>
      </svg>
    )
  }),
)
