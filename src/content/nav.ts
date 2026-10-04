// The tabs. Each collection is its own page; the dock and the footer index
// both read from here. `key` is the second half of the "G then …" chord.

export const NAV = [
  { href: "/", label: "Home", key: "H" },
  { href: "/hackathons", label: "Hackathons", key: "K" },
  { href: "/projects", label: "Projects", key: "P" },
  { href: "/achievements", label: "Achievements", key: "A" },
  { href: "/community", label: "Community", key: "C" },
] as const

export type NavItem = (typeof NAV)[number]

export function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`)
}
