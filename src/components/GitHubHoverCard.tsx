import React, { useState, useRef, useEffect } from 'react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { ExternalLink, GitBranch, Star } from 'lucide-react'
import { playCyberBlip } from '@/utils/cyberAudio'

interface GitHubHoverCardProps {
  children: React.ReactNode
  isOpen?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  align?: 'left' | 'center' | 'right'
  className?: string
}

export const GitHubHoverCard: React.FC<GitHubHoverCardProps> = ({
  children,
  isOpen: controlledIsOpen,
  onMouseEnter: controlledOnMouseEnter,
  onMouseLeave: controlledOnMouseLeave,
  align = 'center',
  className = '',
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (isControlled) {
      playCyberBlip(700)
      controlledOnMouseEnter?.()
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      playCyberBlip(700)
      setInternalIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (isControlled) {
      controlledOnMouseLeave?.()
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setInternalIsOpen(false)
      }, 200)
    }
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isControlled) {
      if (isOpen) {
        controlledOnMouseLeave?.()
      } else {
        controlledOnMouseEnter?.()
      }
    } else {
      setInternalIsOpen((prev) => !prev)
    }
  }

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isControlled) {
          controlledOnMouseLeave?.()
        } else {
          setInternalIsOpen(false)
        }
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [isControlled, controlledOnMouseLeave])

  const alignClass =
    align === 'left'
      ? 'left-0'
      : align === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2'

  // Deterministic green contribution intensity pattern matching yust.dev
  const levels = [
    0, 1, 0, 2, 3, 1, 0, 4, 2, 1, 0, 3, 2, 4, 1, 0, 2, 3, 1, 4, 2, 0, 3, 1, 2,
    4, 3, 1, 0, 2, 3, 4, 1, 2, 0, 3, 1, 4, 2, 3, 0, 1, 2, 4, 3, 1, 2, 0, 3, 4,
    2, 1,
  ]

  const colorMap: Record<number, string> = {
    0: 'bg-zinc-800',
    1: 'bg-emerald-500/25',
    2: 'bg-emerald-500/45',
    3: 'bg-emerald-500/70',
    4: 'bg-emerald-400',
  }

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger element */}
      <div onClick={handleToggle} className="inline-flex items-center cursor-pointer">
        {children}
      </div>

      {/* Floating GitHub Profile Card */}
      {isOpen && (
        <div
          role="tooltip"
          className={`absolute bottom-full mb-3 z-[100] ${alignClass} w-[340px] sm:w-[364px] max-w-[calc(100vw-2rem)] text-left rounded-2xl overflow-hidden bg-[#0d1117] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150 font-sans p-4 pointer-events-auto`}
          onMouseEnter={() => {
            if (isControlled) {
              controlledOnMouseEnter?.()
            } else if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }
          }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Hit-test bridge between trigger and card */}
          <div className="absolute top-full left-0 w-full h-4 pointer-events-auto" />

          {/* Header Row: Avatar, Username, Bio */}
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src="https://avatars.githubusercontent.com/u/256016032?v=4"
                alt="iiafosh"
                className="h-[44px] w-[44px] rounded-full border border-white/10 object-cover bg-zinc-800"
                width="44"
                height="44"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0d1117]" />
            </div>

            <div className="flex min-w-0 flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-white tracking-tight">
                  iiafosh
                </span>
                <span className="text-[11px] font-mono text-zinc-400">
                  / Mostafa
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 text-[12px] text-zinc-400">
                <span className="text-zinc-300">420+ contributions</span>
                <span className="text-zinc-600">&bull;</span>
                <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>Verified Builder</span>
                </span>
              </div>
            </div>
          </div>

          {/* Mini 52-week Activity Heatmap Grid */}
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>Contribution Activity (2025–2026)</span>
              <span className="text-emerald-400 font-bold">Active</span>
            </div>

            <div className="grid grid-flow-col grid-rows-4 gap-[2px] w-full overflow-hidden p-1 rounded-lg bg-black/40 border border-white/5">
              {levels.map((lvl, idx) => (
                <span
                  key={idx}
                  className={`w-full aspect-square rounded-[1.5px] ${colorMap[lvl] || 'bg-zinc-800'}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Actions Row */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-mono text-zinc-400">
              <GitBranch className="w-3 h-3 text-cyan-400" />
              <span>Verdict.run &bull; portfolio</span>
            </div>

            <a
              href="https://github.com/iiafosh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all active:scale-95"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>Follow</span>
              <ExternalLink className="w-3 h-3 text-zinc-400" />
            </a>
          </div>

          {/* Downward pointing arrow caret */}
          <div
            className={`absolute -bottom-1.5 w-3 h-3 bg-[#0d1117] border-b border-r border-white/15 rotate-45 ${
              align === 'left'
                ? 'left-6'
                : align === 'right'
                ? 'right-6'
                : 'left-1/2 -translate-x-1/2'
            }`}
          />
        </div>
      )}
    </div>
  )
}
