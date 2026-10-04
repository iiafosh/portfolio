import type { PortfolioItem, Profile } from './types'

// Local copy of the portfolio content. The site renders this when Supabase is
// unreachable or the portfolio tables have not been created yet. Keep it in
// sync with the seed block in supabase/portfolio.sql.

export const FALLBACK_PROFILE: Profile = {
  name: 'Mostafa Kamal Shabara',
  short_name: 'Mostafa',
  handle: 'afosh',
  headline: 'AI & Software Engineering student · game & full-stack developer',
  location: 'Egypt',
  bio:
    "I'm an AI & Software Engineering student at Horus University in Egypt. I like shipping things end to end: a cross-platform fishing game in Godot with its own Blender art pipeline, and full-stack web apps on React, TanStack and Supabase.",
  email: '8251677@horus.edu.eg',
  availability: 'Open to internships & freelance',
  github_url: 'https://github.com/iiafosh',
  linkedin_url: 'https://www.linkedin.com/in/mostafa-kamal-3731453a9/',
  anghami_url: null,
  avatar_url: null,
  section_order: ['featured', 'projects', 'experience', 'education', 'skills', 'certifications', 'guestbook'],
}

const base = {
  subtitle: null,
  period: null,
  location: null,
  description: null,
  highlights: [],
  tags: [],
  url: null,
  repo_url: null,
  image_url: null,
  video_url: null,
  featured: false,
  visible: true,
} satisfies Partial<PortfolioItem>

export const FALLBACK_ITEMS: PortfolioItem[] = [
  // Projects
  {
    ...base,
    id: 'proj-fosh-and-fish',
    kind: 'project',
    title: 'fosh&fish',
    subtitle: 'Cross-platform game · Godot 4 + Blender',
    period: '2026',
    description:
      'A cozy top-down fishing game inspired by the Virtual Fisher Discord bot. Cast, catch, sell, upgrade your rod and boat, and travel through 7 biomes from the River to the Abyss.',
    highlights: [
      '20 fish, 21 rods, 17 boats, 8 baits and 7 biomes, balanced against the original bot data',
      'Ships to Web, Windows, Linux and Android from one Godot project',
      'All art rendered by a scripted Blender pipeline (Python)',
      'Headless simulation tests for mechanics and balance, plus an automated trailer pipeline with original music',
    ],
    tags: ['Godot 4', 'GDScript', 'Blender', 'Python', 'GitHub Pages'],
    url: 'https://iiafosh.github.io/fosh-and-fish/',
    repo_url: 'https://github.com/iiafosh/fosh-and-fish',
    image_url: '/media/fosh-and-fish-cover.jpg',
    video_url: 'https://github.com/iiafosh/fosh-and-fish/releases/download/v0.1-beta/fosh-and-fish-trailer-16x9.mp4',
    featured: true,
    sort_order: 10,
  },
  {
    ...base,
    id: 'proj-portfolio',
    kind: 'project',
    title: 'This portfolio',
    subtitle: 'Full-stack web app',
    period: '2026',
    description:
      'The site you are on. Content, ordering and the guestbook live in Supabase Postgres behind Row Level Security, with GitHub sign-in and an owner-only editor.',
    highlights: [
      'TanStack Router + Query with optimistic updates',
      'Postgres RLS: anyone reads, only the owner edits, signed-in visitors post to the guestbook',
      'Deployed on Vercel',
    ],
    tags: ['React', 'TypeScript', 'Vite', 'TanStack', 'Supabase', 'Tailwind'],
    url: null,
    repo_url: 'https://github.com/iiafosh/portfolio',
    sort_order: 20,
  },
  {
    ...base,
    id: 'proj-afosh-ai',
    kind: 'project',
    title: 'Afosh AI',
    subtitle: 'Gemini chat assistant · MSC HUE session',
    period: '2026',
    description:
      'A persona chatbot built for a Microsoft Student Club session at HUE: a street-smart tech mentor that explains Python, C++ and computer vision with an Egyptian twist.',
    highlights: ['Google Gemini API with a custom system persona', 'Markdown chat UI with streaming-style replies', 'Auto-deploys with GitHub Actions'],
    tags: ['React', 'TypeScript', 'Gemini API', 'GitHub Actions'],
    repo_url: 'https://github.com/iiafosh/portfolie_for_MSC-mostsfs-kmal',
    sort_order: 30,
  },

  // Education
  {
    ...base,
    id: 'edu-hue',
    kind: 'education',
    title: 'Horus University in Egypt (HUE)',
    subtitle: 'Artificial Intelligence & Software Engineering',
    period: 'Present',
    location: 'New Damietta, Egypt',
    url: 'https://horus.edu.eg',
    sort_order: 10,
  },

  // Skills
  {
    ...base,
    id: 'skill-languages',
    kind: 'skill_group',
    title: 'Languages',
    tags: ['Python', 'TypeScript', 'C++', 'GDScript', 'SQL'],
    sort_order: 10,
  },
  {
    ...base,
    id: 'skill-ai',
    kind: 'skill_group',
    title: 'AI & data',
    tags: ['Computer vision (YOLO)', 'LLM APIs (Gemini)', 'Prompt design', 'Data science'],
    sort_order: 20,
  },
  {
    ...base,
    id: 'skill-web',
    kind: 'skill_group',
    title: 'Web',
    tags: ['React', 'Vite', 'TanStack Router & Query', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vercel'],
    sort_order: 30,
  },
  {
    ...base,
    id: 'skill-games',
    kind: 'skill_group',
    title: 'Games & 3D',
    tags: ['Godot 4', 'Blender (Python scripting)', 'Game balancing', 'Multi-platform export'],
    sort_order: 40,
  },
  {
    ...base,
    id: 'skill-tools',
    kind: 'skill_group',
    title: 'Tools',
    tags: ['Git & GitHub', 'GitHub Actions', 'Windows / PowerShell', 'IT infrastructure'],
    sort_order: 50,
  },
]
