import React, { useState, useEffect } from 'react'
import { AnghamiWidget } from '@/components/AnghamiWidget'

export const StatusFooter: React.FC = () => {
  const [cairoTime, setCairoTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCairoTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Africa/Cairo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <footer className="space-y-6 pt-12 border-t border-white/5 font-mono text-xs text-zinc-400">
      
      {/* Anghami Music Widget */}
      <AnghamiWidget profileUrl="https://play.anghami.com" />

      {/* yust.dev Status Indicators */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-[11px]">
        
        {/* Status items */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          {/* Location */}
          <span className="flex items-center gap-1.5 text-zinc-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-zinc-400">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>Damietta &bull; Cairo (HUE)</span>
          </span>

          <span className="text-zinc-700">&bull;</span>

          {/* Time */}
          <span className="text-zinc-300">
            {cairoTime || '02:40 PM'} (EET)
          </span>

          <span className="text-zinc-700">&bull;</span>

          {/* Weather */}
          <span className="flex items-center gap-1 text-zinc-400">
            <span>22°C</span>
            <span className="text-[10px] text-zinc-500">Clear</span>
          </span>

          <span className="text-zinc-700">&bull;</span>

          {/* System Battery */}
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Systems 100% Operational</span>
          </span>
        </div>

        {/* Git & Version Details */}
        <div className="flex items-center gap-2 text-zinc-500 text-[10px]">
          <span>v1.0.0</span>
          <span>&bull;</span>
          <a
            href="https://github.com/iiafosh/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white underline underline-offset-4 decoration-zinc-700 transition-colors"
          >
            Commit 832ddb0
          </a>
          <span>&bull;</span>
          <span>&copy; {new Date().getFullYear()} Mostafa Shabara</span>
        </div>

      </div>

    </footer>
  )
}
