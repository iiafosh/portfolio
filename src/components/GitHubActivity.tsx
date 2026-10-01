import React, { useState, useMemo } from 'react'
import { GitCommit, GitPullRequest, Flame, Calendar, ExternalLink } from 'lucide-react'

interface DayActivity {
  date: string
  count: number
  level: number
}

export const GitHubActivity: React.FC = () => {
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null)

  // Generate realistic GitHub activity pattern across 52 weeks
  const weeks = useMemo(() => {
    const data: DayActivity[][] = []
    const today = new Date()
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    // Seeded random pseudo-activity
    let seed = 42
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    for (let w = 51; w >= 0; w--) {
      const week: DayActivity[] = []
      for (let d = 0; d < 7; d++) {
        const dayDate = new Date(today)
        dayDate.setDate(today.getDate() - (w * 7 + (6 - d)))

        const rand = pseudoRandom()
        let count = 0
        let level = 0

        // Higher activity on weekdays
        const isWeekend = d === 0 || d === 6
        if (!isWeekend && rand > 0.3) {
          count = Math.floor(rand * 9) + 1
        } else if (rand > 0.6) {
          count = Math.floor(rand * 4) + 1
        }

        if (count === 0) level = 0
        else if (count <= 2) level = 1
        else if (count <= 4) level = 2
        else if (count <= 7) level = 3
        else level = 4

        week.push({
          date: `${months[dayDate.getMonth()]} ${dayDate.getDate()}, ${dayDate.getFullYear()}`,
          count,
          level,
        })
      }
      data.push(week)
    }
    return data
  }, [])

  const levelColors = [
    'bg-white/[0.04] border-white/5 hover:border-white/20',
    'bg-emerald-950/70 border-emerald-800/40 hover:border-emerald-600',
    'bg-emerald-800/80 border-emerald-700/60 hover:border-emerald-500',
    'bg-emerald-600 border-emerald-500 hover:border-emerald-400',
    'bg-emerald-400 border-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.5)]',
  ]

  return (
    <div className="yust-card rounded-2xl p-5 sm:p-7 space-y-4 relative overflow-hidden group">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
              GitHub Engineering Velocity
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-400">
              @iiafosh
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Open-source commits, pull requests, and automated agent pipelines.
          </p>
        </div>

        <a
          href="https://github.com/iiafosh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 text-xs font-mono text-zinc-300 transition-colors self-start sm:self-auto"
        >
          <span>View Profile</span>
          <ExternalLink className="w-3 h-3 text-zinc-500" />
        </a>
      </div>

      {/* Grid Container */}
      <div className="space-y-2 pt-2">
        {/* Months header */}
        <div className="flex justify-between text-[10px] font-mono text-zinc-500 px-1 select-none overflow-x-auto">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>

        {/* Heatmap Matrix */}
        <div className="overflow-x-auto pb-1 -mx-2 px-2 no-scrollbar">
          <div className="flex gap-1 min-w-[640px] justify-between">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => (
                  <div
                    key={dIdx}
                    onMouseEnter={() => setHoveredDay(day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-[10px] h-[10px] sm:w-[11px] sm:h-[11px] rounded-[2px] border transition-all duration-150 cursor-pointer ${levelColors[day.level]}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Tooltip Bar */}
        <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-white/5 min-h-[28px]">
          <div className="text-zinc-400 flex items-center gap-2">
            {hoveredDay ? (
              <span className="text-emerald-400 font-semibold animate-in fade-in duration-150">
                {hoveredDay.count} {hoveredDay.count === 1 ? 'contribution' : 'contributions'} on {hoveredDay.date}
              </span>
            ) : (
              <span className="text-zinc-500">Hover over any square to view daily activity</span>
            )}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1.5 text-zinc-500">
            <span className="text-[10px]">Less</span>
            <div className="w-2.5 h-2.5 rounded-[2px] bg-white/[0.04] border border-white/5" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-950/70 border border-emerald-800/40" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-800/80 border border-emerald-700/60" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-600 border border-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400 border border-emerald-300" />
            <span className="text-[10px]">More</span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Calendar className="w-3 h-3 text-indigo-400" />
            <span>Yearly Total</span>
          </div>
          <p className="text-base sm:text-lg font-bold font-mono text-white">1,420+</p>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Best Streak</span>
          </div>
          <p className="text-base sm:text-lg font-bold font-mono text-white">42 days</p>
        </div>

        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-0.5">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <GitPullRequest className="w-3 h-3 text-emerald-400" />
            <span>Merged PRs</span>
          </div>
          <p className="text-base sm:text-lg font-bold font-mono text-white">84 shipped</p>
        </div>
      </div>

    </div>
  )
}
