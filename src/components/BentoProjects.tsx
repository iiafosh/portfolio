import React, { useState } from 'react'
import { ArrowUpRight, Database, Globe } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { Link } from '@tanstack/react-router'

interface Project {
  id: string
  title: string
  category: 'ai' | 'fullstack' | 'security' | 'database'
  tag: string
  desc: string
  stack: string[]
  liveLink?: string
  internalLink?: string
  githubLink: string
  gradient: string
  stats: string
  featured?: boolean
}

export const BentoProjects: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'ai' | 'fullstack' | 'security' | 'database'>('all')

  const projects: Project[] = [
    {
      id: 'platform',
      title: 'Full-Stack TanStack + Supabase Engine',
      category: 'fullstack',
      tag: 'Production Web Platform',
      desc: 'Type-safe single-page application built on Vite 6 and TanStack Router with TanStack Query optimistic mutations and Supabase PostgreSQL Row Level Security.',
      stack: ['Vite 6', 'TanStack Router', 'TanStack Query', 'Supabase Postgres', 'Tailwind CSS', 'Vercel'],
      internalLink: '/database',
      githubLink: 'https://github.com/iiafosh/portfolio',
      gradient: 'from-emerald-950/40 via-zinc-900 to-black',
      stats: 'Sub-60ms optimistic mutations',
      featured: true,
    },
    {
      id: 'agent',
      title: 'Autonomous AI Verification Agent',
      category: 'ai',
      tag: 'LLM Agent Pipeline',
      desc: 'Intelligent multi-step pipeline executing automated repository validation, test-case synthesis, and pull-request verification within 60 seconds.',
      stack: ['Python 3.12', 'FastAPI', 'LLM Agent APIs', 'Docker', 'GitHub Actions'],
      liveLink: 'https://github.com/iiafosh',
      githubLink: 'https://github.com/iiafosh',
      gradient: 'from-indigo-950/40 via-zinc-900 to-black',
      stats: '60s regression tests',
      featured: true,
    },
    {
      id: 'realtime',
      title: 'PostgreSQL Real-Time State Sync Engine',
      category: 'database',
      tag: 'Database Architecture',
      desc: 'Distributed real-time replication layer syncing low-latency state between multi-tenant web clients using Supabase WebSockets and Postgres triggers.',
      stack: ['PostgreSQL', 'Supabase Realtime', 'TypeScript', 'WebSockets'],
      liveLink: 'https://github.com/iiafosh',
      githubLink: 'https://github.com/iiafosh',
      gradient: 'from-sky-950/40 via-zinc-900 to-black',
      stats: '100% ACID consistency',
    },
    {
      id: 'sast',
      title: 'SAST AI Security Vulnerability Scanner',
      category: 'security',
      tag: 'Security & Systems',
      desc: 'Automated static application security testing agent analyzing Python and TypeScript AST trees to preemptively block injection risks before deployment.',
      stack: ['Python', 'AST Parsers', 'Security Rules', 'Git Pre-commit'],
      liveLink: 'https://github.com/iiafosh',
      githubLink: 'https://github.com/iiafosh',
      gradient: 'from-amber-950/40 via-zinc-900 to-black',
      stats: 'Zero false-positive rule sets',
    },
  ]

  const filteredProjects = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  const filterTabs = [
    { id: 'all', label: 'All Projects' },
    { id: 'fullstack', label: 'Full-Stack' },
    { id: 'ai', label: 'AI & Agents' },
    { id: 'database', label: 'PostgreSQL' },
    { id: 'security', label: 'Security' },
  ] as const

  return (
    <div className="space-y-6">
      
      {/* Header and Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-['Silkscreen',monospace] text-lg sm:text-xl text-white tracking-wide">
            PROJECTS &amp; SHIPPED CODE
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Production builds, agentic systems, and cloud infrastructure.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1 rounded-full text-xs font-mono transition-all duration-200 whitespace-nowrap ${
                filter === tab.id
                  ? 'bg-white text-zinc-950 font-bold shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className={`yust-card rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-4 group transition-all duration-300 relative overflow-hidden bg-gradient-to-br ${p.gradient}`}
          >
            {/* Ambient subtle glow on card top */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
                  {p.tag}
                </span>

                <span className="text-[11px] font-mono text-emerald-400">
                  {p.stats}
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight group-hover:text-indigo-200 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-mono mt-1.5">
                  {p.desc}
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-white/5">
              {/* Stack Pills */}
              <div className="flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-md bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-300"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Action Links */}
              <div className="flex items-center gap-3 pt-1">
                {p.internalLink ? (
                  <Link
                    to={p.internalLink}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Open Live DB Console</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <a
                    href={p.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Live Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                )}

                <span className="text-zinc-700">&bull;</span>

                <a
                  href={p.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
