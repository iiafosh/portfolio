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
    },
    {
      title: 'Autonomous Telegram Bots & Agents',
      tag: 'AI Automation',
      icon: Bot,
      highlight: '2,500+ active users',
      description:
        'Architected high-throughput asynchronous Telegram bots and automation mini-apps handling webhook streams and real-time alerts.',
      link: 'https://github.com/iiafosh',
    },
    {
      title: 'ICPC HUE — Community Lead & Online Judge',
      tag: 'Community & Systems',
      icon: Sparkles,
      highlight: '650+ curated problems',
      description:
        'Co-founded the ICPC community at Horus University in Egypt and engineered a hardened online judge preparing 8 teams for national collegiate contests.',
      link: 'https://github.com/iiafosh',
    },
    {
      title: 'Hackathons — 3 Podium Finishes',
      tag: 'Competitive Sprint',
      icon: Trophy,
      highlight: '2nd Place GDG Delta & LUXSAI Podium',
      description:
        'Earned multiple podium finishes across competitive Egyptian AI hackathons, engineering real-time verification and automated security SAST agents.',
      link: 'https://github.com/iiafosh',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h2 className="font-['Silkscreen',monospace] text-lg sm:text-xl text-white tracking-wide flex items-center gap-2">
          <span>SELECTED OUTCOMES</span>
        </h2>
        <span className="text-xs font-mono text-zinc-500">Shipped &amp; Verified</span>
      </div>

      <div className="space-y-4">
        {outcomes.map((item, idx) => {
          const Icon = item.icon
          return (
            <div
              key={idx}
              className="border-l-2 border-zinc-800 hover:border-zinc-500 pl-4 py-1.5 transition-colors group"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-white text-sm sm:text-base hover:text-indigo-300 transition-colors inline-flex items-center gap-1.5"
                >
                  <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                  <span>{item.title}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400" />
                </a>

                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 self-start sm:self-auto">
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
