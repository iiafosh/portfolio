import React from 'react'
import { FolderGit2, ArrowUpRight } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'

export const ProjectsPage: React.FC = () => {
  const projects = [
    {
      title: 'Full-Stack Vite + TanStack Platform',
      tag: 'Web Platform',
      status: 'Live & Production',
      desc: 'Production Single Page Application with TanStack Router for type-safe routing and TanStack Query for optimistic mutations, backed by Supabase PostgreSQL and Row Level Security.',
      stack: ['Vite 6', 'TanStack Router', 'TanStack Query', 'Supabase Postgres', 'Tailwind', 'Vercel'],
      demoLink: '/database',
      sourceLink: 'https://github.com/iiafosh',
      isInternalDemo: true,
    },
    {
      title: 'Autonomous Developer Automation Agent',
      tag: 'AI Tooling',
      status: 'Active',
      desc: 'Intelligent multi-step automation pipeline automating repository maintenance, dependency verification, and continuous integration workflows.',
      stack: ['Python 3.12', 'FastAPI', 'LLM Agent APIs', 'GitHub CLI', 'Docker'],
      demoLink: 'https://github.com/iiafosh',
      sourceLink: 'https://github.com/iiafosh',
      isInternalDemo: false,
    },
    {
      title: 'PostgreSQL Real-Time State Sync Engine',
      tag: 'Database Architecture',
      status: 'Shipped',
      desc: 'Real-time state synchronization engine connecting distributed web clients via Supabase Realtime channels and PostgreSQL triggers with atomic tenant isolation.',
      stack: ['PostgreSQL', 'Supabase Realtime', 'TypeScript', 'WebSockets'],
      demoLink: 'https://github.com/iiafosh',
      sourceLink: 'https://github.com/iiafosh',
      isInternalDemo: false,
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="yust-card rounded-2xl p-6 sm:p-7 space-y-1.5">
        <div className="flex items-center gap-2 text-zinc-400">
          <FolderGit2 className="w-4 h-4 text-amber-400" />
          <span className="font-mono text-[11px] uppercase tracking-wider">Showcase</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Featured Projects
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          A selection of full-stack web platforms, developer tools, and database systems.
        </p>
      </div>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((proj, idx) => (
          <div
            key={idx}
            className="yust-card rounded-2xl p-6 space-y-4 transition-all duration-200 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {proj.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono text-zinc-400 bg-white/5 border border-white/10">
                  {proj.tag}
                </span>
              </div>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{proj.status}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {proj.desc}
            </p>

            {/* Stack Badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {proj.stack.map((item) => (
                <span
                  key={item}
                  className="px-2.5 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[11px] font-mono text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/5 text-xs">
              <a
                href={proj.demoLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white text-zinc-950 font-semibold hover:bg-zinc-200 transition-colors"
              >
                <span>{proj.isInternalDemo ? 'Launch Playground' : 'Live Demo'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href={proj.sourceLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
