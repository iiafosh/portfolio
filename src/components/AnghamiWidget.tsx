import React, { useState } from 'react'
import { ExternalLink, Volume2, VolumeX } from 'lucide-react'
import { AnghamiIcon } from '@/components/icons/AnghamiIcon'

interface AnghamiWidgetProps {
  profileUrl?: string
}

export const AnghamiWidget: React.FC<AnghamiWidgetProps> = ({
  profileUrl = 'https://play.anghami.com',
}) => {
  const [isPlaying, setIsPlaying] = useState(true)

  const toggleSound = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/30 via-[#0d0b1a]/85 to-[#07080e] border border-purple-500/25 hover:border-purple-400/50 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.5),0_0_20px_rgba(168,85,247,0.12)] group">
      <div className="flex items-center gap-3">
        {/* Animated equalizer / Anghami sound icon */}
        <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105">
          <AnghamiIcon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(224,255,0,0.4)]" />
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full bg-fuchsia-400 ${isPlaying ? 'animate-ping' : ''}`} />
              Now Playing
            </span>
            <span className="text-zinc-600 text-[10px]">&bull;</span>
            <span className="text-[11px] font-mono text-fuchsia-300/90 font-medium">Anghami</span>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-xs font-mono text-white font-semibold flex items-center gap-1.5">
              <span>Mostafa's Code Flow</span>
              <span className="text-zinc-500 font-normal">&bull; Deep Focus &amp; Beats</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        {/* Equalizer bars */}
        <div className="flex items-end gap-0.5 h-3 px-2">
          <span className={`w-0.5 bg-gradient-to-t from-fuchsia-500 to-cyan-400 rounded-full transition-all ${isPlaying ? 'animate-[bounce_0.7s_ease-in-out_infinite] h-3' : 'h-1.5'}`} />
          <span className={`w-0.5 bg-gradient-to-t from-fuchsia-500 to-cyan-400 rounded-full transition-all ${isPlaying ? 'animate-[bounce_0.5s_ease-in-out_infinite_0.15s] h-3' : 'h-2.5'}`} />
          <span className={`w-0.5 bg-gradient-to-t from-fuchsia-500 to-cyan-400 rounded-full transition-all ${isPlaying ? 'animate-[bounce_0.9s_ease-in-out_infinite_0.3s] h-3' : 'h-1'}`} />
          <span className={`w-0.5 bg-gradient-to-t from-fuchsia-500 to-cyan-400 rounded-full transition-all ${isPlaying ? 'animate-[bounce_0.6s_ease-in-out_infinite_0.1s] h-3' : 'h-2'}`} />
        </div>

        {/* Toggle ambient audio animation */}
        <button
          onClick={toggleSound}
          title={isPlaying ? 'Pause equalizer' : 'Resume equalizer'}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 hover:text-white border border-white/5 transition-colors"
        >
          {isPlaying ? <Volume2 className="w-3.5 h-3.5 text-fuchsia-400" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
        </button>

        {/* Open profile / app link */}
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 hover:from-purple-500/30 hover:to-fuchsia-500/30 text-xs font-mono text-purple-200 border border-purple-500/30 hover:border-purple-400/60 transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)] active:scale-95 hover:scale-105"
        >
          <span>Anghami</span>
          <ExternalLink className="w-3 h-3 text-fuchsia-300" />
        </a>
      </div>
    </div>
  )
}
