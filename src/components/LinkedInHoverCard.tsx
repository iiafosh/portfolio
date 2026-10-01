import React, { useState, useRef, useEffect } from 'react'
import { playCyberBlip } from '@/utils/cyberAudio'

interface LinkedInHoverCardProps {
  children: React.ReactNode
  isOpen?: boolean
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  align?: 'left' | 'center' | 'right'
  className?: string
}

export const LinkedInHoverCard: React.FC<LinkedInHoverCardProps> = ({
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
      playCyberBlip(750)
      controlledOnMouseEnter?.()
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      playCyberBlip(750)
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

  // Alignment classes for popover position
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

      {/* Floating LinkedIn Profile Card */}
      {isOpen && (
        <div
          role="tooltip"
          className={`absolute bottom-full mb-3 z-[100] ${alignClass} w-[320px] max-w-[calc(100vw-2rem)] text-left rounded-2xl overflow-hidden bg-[#1b1f23] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-150 font-sans pointer-events-auto`}
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

          {/* LinkedIn Blue Abstract Banner Header (exact yust.dev style) */}
          <div
            className="relative h-[64px] w-full bg-gradient-to-br from-[#0a66c2] to-[#0a66c280]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 120% 200%, #0000000a 0%, #0000000a 50%, #c5c5c50a 50%, #c5c5c50a 100%), radial-gradient(circle at 130% -10%, #4040400a 0%, #4040400a 50%, #ffffff0a 50%, #ffffff0a 100%), linear-gradient(to right, #0a66c2, #0a66c280)',
            }}
          />

          {/* Profile Card Body */}
          <div className="relative px-[14px] pb-[14px]">
            {/* Avatar overlapping banner */}
            <div className="absolute left-[14px] top-0 -translate-y-1/2 rounded-full bg-zinc-900 p-[2px] shadow-md">
              <img
                src="https://avatars.githubusercontent.com/u/256016032?v=4"
                alt="Mostafa Kamal Shabara"
                className="h-[56px] w-[56px] rounded-full object-cover bg-zinc-800"
                width="56"
                height="56"
              />
            </div>

            {/* Content Details */}
            <div className="flex flex-col gap-[3px] pt-[34px]">
              {/* Name */}
              <div className="text-[16px] leading-[24px] text-zinc-100 font-bold">
                Mostafa Kamal Shabara
              </div>

              {/* Headline */}
              <p className="text-[13px] leading-[18px] text-zinc-300 font-medium">
                Full-Stack &amp; AI Systems Engineer
              </p>

              {/* Location */}
              <p className="text-[12px] leading-[16px] text-zinc-500">
                Damietta, Egypt
              </p>

              {/* Stats & Connect Button Row */}
              <div className="mt-[6px] flex items-end justify-between gap-[12px]">
                <p className="mt-[2px] whitespace-nowrap text-[12px] font-medium text-[#71b7fb]">
                  2,005 followers &bull; 500+ connections
                </p>

                {/* Direct LinkedIn Connect Button */}
                <a
                  href="https://www.linkedin.com/in/mostafa-kamal-3731453a9/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-fit shrink-0 rounded-full bg-[#0a66c2] px-[14px] py-[4px] text-[13px] font-semibold leading-[20px] text-white transition-[filter] hover:brightness-125 shadow-sm active:scale-95"
                >
                  Connect
                </a>
              </div>
            </div>
          </div>

          {/* Downward pointing arrow caret */}
          <div
            className={`absolute -bottom-1.5 w-3 h-3 bg-[#1b1f23] border-b border-r border-white/10 rotate-45 ${
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
