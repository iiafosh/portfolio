// Shared content model. Mirrors the tables in supabase/portfolio.sql.

export type SectionKey =
  | 'featured'
  | 'achievements'
  | 'projects'
  | 'experience'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'guestbook'

export const ALL_SECTIONS: SectionKey[] = [
  'featured',
  'achievements',
  'projects',
  'experience',
  'education',
  'skills',
  'certifications',
  'guestbook',
]

export const SECTION_LABELS: Record<SectionKey, string> = {
  featured: 'Featured',
  achievements: 'Achievements',
  projects: 'Projects',
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  guestbook: 'Guestbook',
}

export interface Profile {
  name: string
  short_name: string
  handle: string
  headline: string
  location: string
  bio: string
  email: string
  availability: string | null
  github_url: string
  linkedin_url: string
  anghami_url: string | null
  avatar_url: string | null
  /** Order the home page sections render in. Sections not listed are hidden. */
  section_order: SectionKey[]
}

export type ItemKind =
  | 'project'
  | 'experience'
  | 'education'
  | 'certification'
  | 'achievement'
  | 'skill_group'

export interface PortfolioItem {
  id: string
  kind: ItemKind
  title: string
  /** Company, school, issuer, or project type. */
  subtitle: string | null
  /** Free-text date range, e.g. "2024 — Present". */
  period: string | null
  location: string | null
  description: string | null
  highlights: string[]
  /** Tech stack for projects, skill names for skill groups. */
  tags: string[]
  url: string | null
  repo_url: string | null
  image_url: string | null
  video_url: string | null
  featured: boolean
  sort_order: number
  visible: boolean
}

export interface GuestbookEntry {
  id: string
  user_id: string
  github_username: string | null
  display_name: string | null
  avatar_url: string | null
  message: string
  created_at: string
}
