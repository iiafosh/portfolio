// The content model. Every page renders from these arrays — add an item to a
// file in src/content and it shows up in its own tab, never on a longer home page.

export type LinkKind = "live" | "repo" | "download" | "post" | "news" | "video" | "site"

export interface ContentLink {
  label: string
  href: string
  kind?: LinkKind
}

export interface Person {
  name: string
  href?: string
}

export interface MediaImage {
  src: string
  alt: string
  /** CSS object-position for crops, e.g. "50% 20%". */
  position?: string
  /** Extra zoom to crop busy edges (1 = none). */
  zoom?: number
  width?: number
  height?: number
}

export type ProjectCategory = "Games" | "Hardware" | "AI" | "Apps" | "Web"

/** Bespoke animated covers for projects without screenshots. */
export type VignetteKind = "watch" | "fish" | "respark" | "numlab" | "robo" | "chat" | "portfolio"

export interface StoryBlock {
  title: string
  /** One paragraph per string. */
  body?: string[]
  /** Bulleted facts. */
  list?: string[]
  /** A pull-quote set with the hatch bar. */
  quote?: string
}

export interface Project {
  slug: string
  title: string
  /** One line under the title on cards. */
  tagline: string
  /** Two sentences, used in the sheet header and for metadata. */
  summary: string
  /** ISO year-month for sorting. */
  date: string
  period: string
  categories: ProjectCategory[]
  status: string
  /** Bento size in the grid. */
  size?: "wide" | "normal"
  featured?: boolean
  cover?: MediaImage
  /** What the card shows: the cover photo (default when there is one) or the live vignette. */
  cardMedia?: "cover" | "vignette"
  /** A different still for the card than the sheet's cover. */
  cardImage?: MediaImage
  gallery?: MediaImage[]
  video?: { src: string; poster?: string }
  vignette: VignetteKind
  role: string
  team?: Person[]
  stack: string[]
  highlights: string[]
  links: ContentLink[]
  /** Slug of the hackathon this was built for. */
  hackathon?: string
  story: StoryBlock[]
}

export type ResultKind = "place" | "qualified" | "finalist"

export interface JourneyStep {
  label: string
  state: "done" | "current" | "pending"
}

export interface Hackathon {
  slug: string
  name: string
  date: string
  dateLabel: string
  host: string
  location: string
  result: { kind: ResultKind; place?: 1 | 2 | 3; label: string; stamp: string }
  title: string
  summary: string
  /** Slug of the project built there. */
  project?: string
  role: string
  team: Person[]
  journey: JourneyStep[]
  facts: { label: string; value: string }[]
  story: StoryBlock[]
  proofs: ContentLink[]
}

export type ShelfObject = "medal" | "trophy" | "ribbon"

export interface Achievement {
  slug: string
  /** Big line on the plate, e.g. "#1 at Horus". */
  title: string
  event: string
  issuer: string
  date: string
  dateLabel: string
  object: ShelfObject
  metal: "gold" | "silver" | "bronze"
  /** Short engraving on the object itself. */
  engraving: string
  description: string
  stats: { label: string; value: number; prefix?: string; suffix?: string }[]
  team?: Person[]
  related?: { hackathon?: string; project?: string; community?: string }
  proofs: ContentLink[]
}

export interface Community {
  slug: string
  name: string
  /** Text printed on the badge. */
  badge: string
  kind: string
  role: string
  since: string
  sinceLabel: string
  where: string
  description: string
  highlights: string[]
  stats?: { label: string; value: string }[]
  people?: { label: string; list: Person[] }
  tags: string[]
  links: ContentLink[]
  /** Lanyard strap color. */
  strap: string
}

export interface Milestone {
  date: string
  label: string
  title: string
  org?: string
  href?: string
}

export interface Skill {
  name: string
  icon: string
  href?: string
}
