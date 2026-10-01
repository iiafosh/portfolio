import React, { useState, useRef, useEffect } from 'react'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { UserPlus, ExternalLink } from 'lucide-react'
import { playCyberBlip } from '@/utils/cyberAudio'

interface LinkedInHoverCardProps {
  children: React.ReactNode
}

export const LinkedInHoverCard: React.FC<LinkedInHoverCardProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const containerRef = useRef<HTMLSpanElement>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      playCyberBlip(800)
      setIsOpen(true)
    }, 120)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 220)
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

  return (
    <span
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger element */}
      <span
        onClick={handleToggle}
        className="cursor-pointer select-none border-b border-dashed border-cyan-400/60 hover:border-cyan-300 transition-colors inline-flex items-center gap-1"
        title="Hover or click to preview LinkedIn profile"
      >
        {children}
      </span>

      {/* Floating LinkedIn Profile Card */}
      {isOpen && (
        <div
          role="tooltip"
          className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-3 z-50 w-72 sm:w-80 rounded-2xl overflow-hidden bg-[#1b1f23] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-200 font-sans text-left"
          onMouseEnter={() => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current)
          }}
          onMouseLeave={handleMouseLeave}
        >
          {/* LinkedIn Banner Header */}
          <div className="relative h-20 bg-gradient-to-r from-[#004182] via-[#0a66c2] to-[#0077b5] overflow-hidden">
            {/* Abstract curved decorative shapes matching LinkedIn */}
            <svg
              className="absolute inset-0 w-full h-full opacity-30"
              viewBox="0 0 320 80"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C120,60 200,10 320,50 L320,0 Z"
                fill="rgba(255,255,255,0.25)"
              />
              <path
                d="M-40,80 C80,20 220,90 360,20 L360,80 Z"
                fill="rgba(255,255,255,0.15)"
              />
            </svg>

            {/* LinkedIn Logo Badge */}
            <div className="absolute top-2.5 right-3 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[11px] font-semibold text-white/90 border border-white/10">
              <LinkedInIcon className="w-3.5 h-3.5 text-white" />
              <span>LinkedIn</span>
            </div>
          </div>

          {/* Profile Details Container */}
          <div className="px-4 pb-4 pt-1 relative">
            {/* Avatar overlapping banner */}
            <div className="flex items-end justify-between -mt-10 mb-2">
              <div className="relative">
                <img
                  src="https://avatars.githubusercontent.com/u/256016032?v=4"
                  alt="Mostafa Kamal Shabara"
                  className="w-16 h-16 rounded-full border-[3px] border-[#1b1f23] object-cover shadow-lg bg-zinc-800"
                />
                <span
                  title="Active"
                  className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#1b1f23]"
                />
              </div>

              {/* Connect Button */}
              <a
                href="https://www.linkedin.com/in/mostafa-kamal-3731453a9/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#0a66c2] hover:bg-[#004182] text-white font-semibold text-xs transition-colors shadow-md hover:scale-105 active:scale-95"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Connect</span>
              </a>
            </div>

            {/* User Info */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <a
                  href="https://www.linkedin.com/in/mostafa-kamal-3731453a9/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-white text-base hover:text-sky-300 transition-colors inline-flex items-center gap-1 group/name"
                >
                  <span>Mostafa Kamal Shabara</span>
                  <ExternalLink className="w-3 h-3 text-zinc-400 group-hover/name:text-sky-300 opacity-0 group-hover/name:opacity-100 transition-opacity" />
                </a>
              </div>

              <p className="text-xs text-zinc-300 font-medium leading-snug">
                Full-Stack &amp; AI Systems Engineer
              </p>

              <p className="text-[11px] text-zinc-400">
                Damietta, Egypt &bull; Horus University in Egypt (HUE)
              </p>

              {/* Connections / Followers */}
              <div className="pt-2 text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                <span>500+ connections</span>
              </div>
            </div>
          </div>

          {/* Tiny arrow pointing down */}
          <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 -bottom-1.5 w-3 h-3 bg-[#1b1f23] border-b border-r border-white/15 rotate-45" />
        </div>
      )}
    </span>
  )
}
