import React, { useState, useRef, useEffect } from 'react'
import { FileText, ExternalLink, Award, GraduationCap } from 'lucide-react'
import { playCyberBlip } from '@/utils/cyberAudio'

interface ResumeHoverCardProps {
  children: React.ReactNode
  onOpenModal: () => void
  align?: 'left' | 'center' | 'right'
  className?: string
}

export const ResumeHoverCard: React.FC<ResumeHoverCardProps> = ({
  children,
  onOpenModal,
  align = 'center',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    playCyberBlip(750)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const alignClass =
    align === 'left'
      ? 'left-0'
      : align === 'right'
      ? 'right-0'
      : 'left-1/2 -translate-x-1/2'

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

      {/* Floating CV / Resume Preview Card */}
      {isOpen && (
        <div
          role="tooltip"
          className={`absolute bottom-full mb-3 z-[100] ${alignClass} w-[310px] sm:w-[330px] max-w-[calc(100vw-2rem)] text-left rounded-2xl overflow-hidden bg-[#161922] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150 font-sans pointer-events-auto`}
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
          }}
          onMouseLeave={handleMouseLeave}
        >
          {/* Header Preview Banner */}
          <div className="relative h-[68px] bg-gradient-to-r from-zinc-800 via-zinc-900 to-black p-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[14px] font-bold text-white block leading-tight">
                  Curriculum Vitae
                </span>
                <span className="text-[11px] font-mono text-cyan-400">
                  Verified Bio &amp; Credentials
                </span>
              </div>
            </div>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 border border-white/10">
              PDF Ready
            </span>
          </div>

          {/* Details Body */}
          <div className="p-3.5 space-y-2.5 text-xs text-zinc-300">
            {/* Education */}
            <div className="flex items-start gap-2">
              <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">Horus University in Egypt (HUE)</span>
                <span className="text-[11px] text-zinc-400">B.Sc. in Computer Science &amp; AI (2023–2027)</span>
              </div>
            </div>

            {/* Achievements */}
            <div className="flex items-start gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block">3 Hackathon Podiums</span>
                <span className="text-[11px] text-zinc-400">Verdict.run (120k+ impressions) &bull; ICPC Lead</span>
              </div>
            </div>

            {/* Open Modal CTA Button */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400">Click to view full CV</span>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onOpenModal()
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-400 hover:from-cyan-300 hover:to-indigo-300 text-zinc-950 font-bold text-xs transition-all active:scale-95 shadow-sm"
              >
                <span>Open CV</span>
                <ExternalLink className="w-3 h-3 text-zinc-950" />
              </button>
            </div>
          </div>

          {/* Downward pointing arrow caret */}
          <div
            className={`absolute -bottom-1.5 w-3 h-3 bg-[#161922] border-b border-r border-white/15 rotate-45 ${
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
