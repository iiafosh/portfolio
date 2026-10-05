import type { SVGProps } from "react"

// Duotone 18×18 interface icons — 1.5px strokes in currentColor with 30% fills,
// the same grammar as cali.so's dock (drawn fresh for this site).

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function Duo({ size = 18, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 18 18"
      aria-hidden="true"
      {...props}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  )
}

const FILL = { fill: "currentColor", fillOpacity: 0.3, stroke: "none" } as const

export function TrophyIcon(props: IconProps) {
  return (
    <Duo {...props}>
      <path d="M5.25 2.75h7.5v4.5a3.75 3.75 0 0 1-7.5 0v-4.5Z" {...FILL} />
      <path d="M5.25 2.75h7.5v4.5a3.75 3.75 0 0 1-7.5 0v-4.5Z" />
      <path d="M5.25 4.25h-1.5a1 1 0 0 0-1 1v.25a2.75 2.75 0 0 0 2.75 2.75" />
      <path d="M12.75 4.25h1.5a1 1 0 0 1 1 1v.25a2.75 2.75 0 0 1-2.75 2.75" />
      <path d="M9 11v2.25" />
      <path d="M6.25 15.25h5.5" />
      <path d="M7 13.25h4l.5 2h-5l.5-2Z" {...FILL} />
    </Duo>
  )
}

export function ProjectsIcon(props: IconProps) {
  return (
    <Duo {...props}>
      <rect x="2.25" y="2.25" width="6" height="7.5" rx="1.5" {...FILL} />
      <rect x="2.25" y="2.25" width="6" height="7.5" rx="1.5" />
      <rect x="9.75" y="2.25" width="6" height="4.5" rx="1.5" />
      <rect x="9.75" y="8.25" width="6" height="7.5" rx="1.5" />
      <rect x="2.25" y="11.25" width="6" height="4.5" rx="1.5" />
    </Duo>
  )
}

export function MedalIcon(props: IconProps) {
  return (
    <Duo {...props}>
      <path d="M5.25 2.25 7.9 7.4" />
      <path d="M12.75 2.25 10.1 7.4" />
      <circle cx="9" cy="11.25" r="4.25" {...FILL} />
      <circle cx="9" cy="11.25" r="4.25" />
      <path d="m9 9.4.6 1.2 1.3.2-.95.9.22 1.3L9 12.35l-1.17.65.22-1.3-.95-.9 1.3-.2.6-1.2Z" strokeWidth="1" />
    </Duo>
  )
}

export function BadgeIcon(props: IconProps) {
  return (
    <Duo {...props}>
      <path d="M6.25 1.75 9 5.25l2.75-3.5" />
      <rect x="3.75" y="5.25" width="10.5" height="10.5" rx="2" {...FILL} />
      <rect x="3.75" y="5.25" width="10.5" height="10.5" rx="2" />
      <circle cx="9" cy="9.25" r="1.5" />
      <path d="M6.75 13.25c.4-1.1 1.2-1.75 2.25-1.75s1.85.65 2.25 1.75" />
    </Duo>
  )
}

export function SlimeIcon(props: IconProps) {
  return (
    <Duo {...props}>
      <path
        d="M2.75 13.25c0-4.35 2.8-8.5 6.25-8.5s6.25 4.15 6.25 8.5c0 .83-.67 1.5-1.5 1.5h-9.5c-.83 0-1.5-.67-1.5-1.5Z"
        {...FILL}
      />
      <path d="M2.75 13.25c0-4.35 2.8-8.5 6.25-8.5s6.25 4.15 6.25 8.5c0 .83-.67 1.5-1.5 1.5h-9.5c-.83 0-1.5-.67-1.5-1.5Z" />
      <circle cx="7" cy="10.5" r=".9" fill="currentColor" stroke="none" />
      <circle cx="11" cy="10.5" r=".9" fill="currentColor" stroke="none" />
      <path d="M6 7.6c.35-.6.85-1.05 1.4-1.3" />
    </Duo>
  )
}

export function PrefsIcon(props: IconProps) {
  return (
    <Duo {...props}>
      <path d="M2.75 5.25h3.5" />
      <path d="M10.25 5.25h5" />
      <path d="M2.75 12.75h7" />
      <path d="M13.75 12.75h1.5" />
      <circle cx="8.25" cy="5.25" r="2" {...FILL} />
      <circle cx="8.25" cy="5.25" r="2" />
      <circle cx="11.75" cy="12.75" r="2" {...FILL} />
      <circle cx="11.75" cy="12.75" r="2" />
    </Duo>
  )
}

export function MailIcon(props: IconProps) {
  return (
    <Duo {...props}>
      <rect x="2" y="3.75" width="14" height="10.5" rx="2" {...FILL} />
      <rect x="2" y="3.75" width="14" height="10.5" rx="2" />
      <path d="m2.75 5 6.25 4.75L15.25 5" />
    </Duo>
  )
}

export function SunIcon(props: IconProps) {
  return (
    <Duo {...props}>
      <circle cx="9" cy="9" r="3.25" {...FILL} />
      <circle cx="9" cy="9" r="3.25" />
      <path d="M9 1.75v1M9 15.25v1M16.25 9h-1M2.75 9h-1M14.13 3.87l-.71.71M4.58 13.42l-.71.71M14.13 14.13l-.71-.71M4.58 4.58l-.71-.71" />
    </Duo>
  )
}

export function MoonIcon(props: IconProps) {
  return (
    <Duo {...props}>
      <path d="M15.25 10.9A6.75 6.75 0 0 1 7.1 2.75a6.75 6.75 0 1 0 8.15 8.15Z" {...FILL} />
      <path d="M15.25 10.9A6.75 6.75 0 0 1 7.1 2.75a6.75 6.75 0 1 0 8.15 8.15Z" />
    </Duo>
  )
}

export function SoundIcon({ muted, ...props }: IconProps & { muted?: boolean }) {
  return (
    <Duo {...props}>
      <path d="M2.75 7.25v3.5c0 .55.45 1 1 1h1.5l3.5 3v-11.5l-3.5 3h-1.5c-.55 0-1 .45-1 1Z" {...FILL} />
      <path d="M2.75 7.25v3.5c0 .55.45 1 1 1h1.5l3.5 3v-11.5l-3.5 3h-1.5c-.55 0-1 .45-1 1Z" />
      {muted ? (
        <path d="m12 7 4 4M16 7l-4 4" />
      ) : (
        <>
          <path d="M11.75 6.75a3.25 3.25 0 0 1 0 4.5" />
          <path d="M13.9 4.6a6.25 6.25 0 0 1 0 8.8" />
        </>
      )}
    </Duo>
  )
}

export function ArrowNE(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M5 11 11 5M6 5h5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <path d="M5 3.5v9a.6.6 0 0 0 .92.5l7-4.5a.6.6 0 0 0 0-1l-7-4.5A.6.6 0 0 0 5 3.5Z" fill="currentColor" />
    </svg>
  )
}

export function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M8 14.5s4.5-4.15 4.5-7.75a4.5 4.5 0 1 0-9 0C3.5 10.35 8 14.5 8 14.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.75" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function CvIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6.5 2.75h7.25L19.25 8.25v11.5a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19.75V4.25a1.5 1.5 0 0 1 1.5-1.5Z"
        fill="currentColor"
        fillOpacity=".18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M13.5 2.9v4.35c0 .55.45 1 1 1h4.6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="10" cy="11" r="1.6" fill="currentColor" />
      <path d="M7.9 15.1c.4-1.05 1.15-1.6 2.1-1.6s1.7.55 2.1 1.6M8 18h8.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
