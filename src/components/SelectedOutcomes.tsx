import React from 'react'
import { Sparkles, Trophy, Bot, Code, ArrowUpRight } from 'lucide-react'

export const SelectedOutcomes: React.FC = () => {
  const outcomes = [
    {
      title: 'Verdict.run — Product Launch',
      tag: 'Competitive Programming',
      icon: Code,
      highlight: '120k+ organic impressions',
      description:
        'Built and launched a modern sandboxed competitive programming platform that generated 120k+ impressions on LinkedIn from an initial launch post.',
      link: 'https://github.com/iiafosh',
      borderColor: 'border-l-cyan-400 group-hover:border-l-cyan-300',
      badgeColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-400/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]',
      iconColor: 'text-cyan-400',
    },
    {
      title: 'Autonomous Telegram Bots & Agents',
      tag: 'AI Automation',
      icon: Bot,
      highlight: '2,500+ active users',
      description:
        'Architected high-throughput asynchronous Telegram bots and automation mini-apps handling webhook streams and real-time alerts.',
      link: 'https://github.com/iiafosh',
      borderColor: 'border-l-purple-400 group-hover:border-l-purple-300',
      badgeColor: 'text-purple-300 bg-purple-500/15 border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.25)]',
      iconColor: 'text-purple-400',
    },
    {
      title: 'ICPC HUE — Community Lead & Online Judge',
      tag: 'Community & Systems',
      icon: Sparkles,
      highlight: '650+ curated problems',
      description:
        'Co-founded the ICPC community at Horus University in Egypt and engineered a hardened online judge preparing 8 teams for national collegiate contests.',
      link: 'https://github.com/iiafosh',
      borderColor: 'border-l-emerald-400 group-hover:border-l-emerald-300',
      badgeColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      iconColor: 'text-emerald-400',
    },
    {
      title: 'Hackathons — 3 Podium Finishes',
      tag: 'Competitive Sprint',
      icon: Trophy,
      highlight: '2nd Place GDG Delta & LUXSAI Podium',
      description:
        'Earned multiple podium finishes across competitive Egyptian AI hackathons, engineering real-time verification and automated security SAST agents.',
      link: 'https://github.com/iiafosh',
      borderColor: 'border-l-amber-400 group-hover:border-l-amber-300',
      badgeColor: 'text-amber-300 bg-amber-500/15 border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      iconColor: 'text-amber-400',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h2 className="font-['Silkscreen',monospace] text-lg sm:text-xl text-white tracking-wide flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <span>SELECTED OUTCOMES</span>
        </h2>
        <span className="text-xs font-mono text-cyan-400/80">Shipped &amp; Verified</span>
      </div>

      <div className="space-y-3.5">
        {outcomes.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className={`border-l-2 pl-4 py-2.5 rounded-r-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-200 group ${item.borderColor}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-white text-sm sm:text-base hover:text-cyan-300 transition-colors inline-flex items-center gap-2"
                >
                  <Icon className={`w-4 h-4 ${item.iconColor} transition-transform group-hover:scale-110`} />
                  <span className="group-hover:translate-x-0.5 transition-transform">{item.title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                </a>

                <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border self-start sm:self-auto font-semibold ${item.badgeColor}`}>
                  {item.highlight}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 font-mono leading-relaxed mt-1">
                {item.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
