import React from 'react'
import { Terminal, Cpu, Database, Wrench } from 'lucide-react'

export const GearsAndSetup: React.FC = () => {
  const gears = [
    {
      category: 'Core Stack',
      icon: Cpu,
      items: [
        { name: 'TypeScript & React', desc: 'Type-safe frontend architecture with TanStack' },
        { name: 'Python 3.12', desc: 'Agentic workflows, AST parsing, and AI integrations' },
        { name: 'Supabase & PostgreSQL', desc: 'Cloud relational database with Row Level Security' },
      ],
    },
    {
      category: 'Dev Environment',
      icon: Terminal,
      items: [
        { name: 'Cursor & VS Code', desc: 'Geist Mono font, custom keybindings & AI pairing' },
        { name: 'PowerShell & Starship', desc: 'Cross-platform shell with customized git status prompt' },
        { name: 'GitHub CLI (gh)', desc: 'Direct terminal repo creation, PR validation & OAuth' },
      ],
    },
    {
      category: 'Cloud & Infrastructure',
      icon: Database,
      items: [
        { name: 'Vercel', desc: 'Instant edge builds with automated branch previews' },
        { name: 'Docker', desc: 'Reproducible microservice containers for agent sandboxes' },
        { name: 'Git & GitHub Actions', desc: 'Strict CI verification pipelines and regression tests' },
      ],
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h2 className="font-['Silkscreen',monospace] text-lg sm:text-xl text-white tracking-wide flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <span>GEARS &amp; DAILY DRIVERS</span>
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Tools, devices, and software used to ship production code.
          </p>
        </div>
        <Wrench className="w-4 h-4 text-cyan-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {gears.map((group, idx) => {
          const Icon = group.icon
          const colorStyles = [
            { icon: 'text-cyan-400', border: 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.12)]' },
            { icon: 'text-purple-400', border: 'hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]' },
            { icon: 'text-emerald-400', border: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]' },
          ][idx % 3]

          return (
            <div
              key={idx}
              className={`yust-card rounded-2xl p-5 space-y-3 border border-white/10 transition-all duration-200 bg-gradient-to-b from-[#0f1422]/70 via-[#0a0d16]/90 to-[#07080e] ${colorStyles.border}`}
            >
              <div className="flex items-center gap-2 text-white font-mono text-xs font-bold border-b border-white/10 pb-2">
                <Icon className={`w-4 h-4 ${colorStyles.icon}`} />
                <span>{group.category}</span>
              </div>

              <div className="space-y-3">
                {group.items.map((it, iIdx) => (
                  <div key={iIdx} className="space-y-0.5">
                    <p className="text-xs font-bold text-white tracking-tight hover:text-cyan-300 transition-colors">
                      {it.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                      {it.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
