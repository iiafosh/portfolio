import React, { useState } from 'react'
import { Play, Pause } from 'lucide-react'

export const SpotifyWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-3">
        {/* Animated equalizer icon */}
        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
          <div className="flex items-end gap-0.5 h-3.5">
            <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? 'animate-[bounce_0.8s_ease-in-out_infinite]' : 'h-2'}`} />
            <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? 'animate-[bounce_0.6s_ease-in-out_infinite_0.2s]' : 'h-3'}`} />
            <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? 'animate-[bounce_1s_ease-in-out_infinite_0.4s]' : 'h-1.5'}`} />
            <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? 'animate-[bounce_0.7s_ease-in-out_infinite_0.1s]' : 'h-2.5'}`} />
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Coding Playlist
            </span>
            <span className="text-zinc-600 text-[10px]">&bull;</span>
            <span className="text-[11px] font-mono text-zinc-400">Spotify</span>
          </div>

          <p className="text-xs font-mono text-white font-semibold">
            Gal Sun - UPLIFT <span className="text-zinc-400 font-normal">&bull; Sabaat Batin, Rackstar</span>
          </p>
        </div>
      </div>

      <button
        onClick={togglePlayback}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/5 transition-all self-start sm:self-auto"
      >
        {isPlaying ? (
          <>
            <Pause className="w-3 h-3 text-emerald-400" />
            <span>Mute</span>
          </>
        ) : (
          <>
            <Play className="w-3 h-3 text-emerald-400" />
            <span>Audio Preview</span>
          </>
        )}
      </button>
    </div>
  )
}
