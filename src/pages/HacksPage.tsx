import React from 'react'
import { Trophy, MapPin, Calendar, Award } from 'lucide-react'

export const HacksPage: React.FC = () => {
  const hacks = [
    {
      title: 'HUE Collegiate Hackathon',
      position: '2nd Place Podium',
      color: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
      location: 'Horus University in Egypt',
      date: '2025',
      project: 'Automated AI Verification Pipeline',
      description:
        'Engineered an autonomous verification agent that validates code pull requests and generates reproducible regression test cases in under 60 seconds.',
      tags: ['Python', 'FastAPI', 'LLM Agent APIs', 'Git'],
    },
    {
      title: 'GDG Delta Egypt Hackathon',
      position: '2nd Place Podium',
      color: 'text-amber-300 border-amber-500/30 bg-amber-500/10',
      location: 'Delta Region, Egypt',
      date: '2024',
      project: 'SAST Automated Vulnerability Defense',
      description:
        'Engineered an automated AST parsing and rule validation pipeline catching security regressions pre-commit.',
      tags: ['Python', 'AST', 'Security', 'FastAPI'],
    },
    {
      title: 'LUXSAI National AI Summit',
      position: '3rd Place Podium',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      location: 'Cairo, Egypt',
      date: '2024',
      project: 'Real-Time Edge Collaboration Platform',
      description:
        'Built a real-time web application synchronizing collaborative documents across low-bandwidth network clients with conflict-free data types.',
      tags: ['React', 'TypeScript', 'WebSockets', 'PostgreSQL'],
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4 space-y-1">
        <div className="flex items-center gap-2 text-zinc-400">
          <Trophy className="w-4 h-4 text-amber-400 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
          <span className="font-mono text-xs uppercase tracking-wider text-amber-400 font-bold">Podium Finishes &amp; Sprints</span>
        </div>
        <h1 className="font-['Silkscreen',monospace] text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-amber-300 via-yellow-200 to-orange-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(245,158,11,0.35)]">
          HACKATHONS &amp; COMPETITIONS
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-mono">
          Podium finishes, collegiate hackathons, and high-pressure sprint builds.
        </p>
      </div>

      {/* List */}
      <div className="space-y-4">
        {hacks.map((hack, idx) => (
          <div
            key={idx}
            className="yust-card rounded-2xl p-6 sm:p-7 space-y-4 transition-all duration-200 border border-white/10 hover:border-amber-500/40 hover:shadow-[0_0_25px_rgba(245,158,11,0.15)] bg-gradient-to-br from-[#161208]/70 via-[#0e0f17]/90 to-[#07080e]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight hover:text-amber-300 transition-colors">
                  {hack.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400/70" />
                    {hack.location}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400/70" />
                    {hack.date}
                  </span>
                </div>
              </div>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border self-start sm:self-auto shadow-[0_0_12px_rgba(245,158,11,0.2)] ${hack.color}`}>
                <Award className="w-3.5 h-3.5" />
                <span>{hack.position}</span>
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-cyan-300 font-mono">
                Project: {hack.project}
              </span>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-mono">
                {hack.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {hack.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-zinc-300 hover:border-amber-500/30 hover:text-amber-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
