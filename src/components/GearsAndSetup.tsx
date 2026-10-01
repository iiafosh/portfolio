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
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <div>
          <h2 className="font-['Silkscreen',monospace] text-lg sm:text-xl text-white tracking-wide flex items-center gap-2">
            <span>GEARS &amp; DAILY DRIVERS</span>
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Tools, devices, and software used to ship production code.
          </p>
        </div>
        <Wrench className="w-4 h-4 text-zinc-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {gears.map((group, idx) => {
          const Icon = group.icon
          return (
            <div key={idx} className="yust-card rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-zinc-300 font-mono text-xs font-semibold border-b border-white/5 pb-2">
                <Icon className="w-3.5 h-3.5 text-indigo-400" />
                <span>{group.category}</span>
              </div>

              <div className="space-y-2.5">
                {group.items.map((it, iIdx) => (
                  <div key={iIdx} className="space-y-0.5">
                    <p className="text-xs font-bold text-white tracking-tight">
                      {it.name}
                    </p>
                    <p className="text-[11px] text-zinc-400 font-mono leading-tight">
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
