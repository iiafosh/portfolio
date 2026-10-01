export interface ShowcaseItem {
  id: string
  category: string
  badge: string
  title: string
  description: string
  linkUrl?: string
  linkText?: string
  isExternal?: boolean
}

/**
 * Showcase items drawn from the website features, projects, hacks, and music.
 * Easy to extend with exclusive items whenever the user provides them!
 */
export const WEBSITE_SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: 'proj-distributed-cache',
    category: 'PROJECT SPOTLIGHT',
    badge: '⚡ Rust & Raft',
    title: 'Distributed Cache Engine',
    description: 'Ultra-low-latency in-memory key-value store built in Rust with Raft consensus replication.',
    linkUrl: '/projects',
    linkText: 'Explore Project →',
  },
  {
    id: 'proj-ai-vision',
    category: 'AI SYSTEMS',
    badge: '👁️ YOLOv11 & TensorRT',
    title: 'Autonomous Vision Engine',
    description: 'Real-time multi-stream spatial reasoning and edge object detection running at 120 FPS.',
    linkUrl: '/projects',
    linkText: 'View Specs →',
  },
  {
    id: 'music-anghami',
    category: 'NOW STREAMING',
    badge: '🎵 Anghami Beats',
    title: 'Focus Music on Anghami',
    description: "Vibing to Mostafa's curated coding soundtrack playing live via Anghami.",
    linkUrl: 'https://play.anghami.com',
    linkText: 'Open in Anghami →',
    isExternal: true,
  },
  {
    id: 'hack-global-ai',
    category: 'HACKATHON WINNER',
    badge: '🏆 1st Place',
    title: 'Global AI Swarm Hackathon',
    description: 'Architected a multi-agent consensus network combining local RAG & deterministic verification.',
    linkUrl: '/hacks',
    linkText: 'View Trophy →',
  },
  {
    id: 'proj-quantum-terminal',
    category: 'CYBER TOOLS',
    badge: '💻 Live Terminal',
    title: 'Interactive Cyber Terminal',
    description: "Test out the interactive console on the home page! Try typing 'help', 'skills', or 'projects'.",
    linkUrl: '/',
    linkText: 'Launch Terminal →',
  },
  {
    id: 'hack-ctf-gold',
    category: 'CYBER DEFENSE',
    badge: '🥇 Gold Medal',
    title: 'Cyber Defense CTF Championship',
    description: 'Reverse engineering, binary exploitation, and kernel vulnerability defenses.',
    linkUrl: '/hacks',
    linkText: 'See CTF Hacks →',
  },
  {
    id: 'db-supabase',
    category: 'DATABASE ENGINE',
    badge: '🗄️ PostgreSQL RLS',
    title: 'Live Guestbook & Messages',
    description: 'Hardened PostgreSQL cloud database with Row Level Security and real-time Supabase sync.',
    linkUrl: '/database',
    linkText: 'Sign Guestbook →',
  },
  {
    id: 'great-sage-notice',
    category: 'GREAT SAGE NOTICE',
    badge: '✨ Raphael System',
    title: "Master Mostafa's Telemetry",
    description: 'Notice: Full-stack engineer with 1,200+ commits and high-performance concurrent architectures.',
    linkUrl: 'https://github.com/iiafosh',
    linkText: 'View GitHub @iiafosh →',
    isExternal: true,
  },
  {
    id: 'slime-tip',
    category: 'RIMURU COMPANION',
    badge: '💧 Desk Mascot',
    title: 'Interactive Companion',
    description: "You can click and smoothly drag me anywhere across your screen if I'm blocking your view!",
  },
]

/**
 * Exclusive items slot - user will provide custom items here later!
 */
export const EXCLUSIVE_SHOWCASE_ITEMS: ShowcaseItem[] = [
  // User will provide exclusive showcase items here
]

export const ALL_SHOWCASE_ITEMS: ShowcaseItem[] = [
  ...WEBSITE_SHOWCASE_ITEMS,
  ...EXCLUSIVE_SHOWCASE_ITEMS,
]
