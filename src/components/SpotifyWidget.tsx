import React, { useState } from 'react'
import { Play, Pause } from 'lucide-react'

export const SpotifyWidget: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/25 via-[#0a1418]/80 to-[#07080e] border border-emerald-500/20 hover:border-emerald-400/40 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(16,185,129,0.08)]">
      <div className="flex items-center gap-3">
        {/* Animated equalizer icon */}
        <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
          <div className="flex items-end gap-0.5 h-3.5">
            <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? 'animate-[bounce_0.8s_ease-in-out_infinite]' : 'h-2'}`} />
            <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? 'animate-[bounce_0.6s_ease-in-out_infinite_0.2s]' : 'h-3'}`} />
            <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? 'animate-[bounce_1s_ease-in-out_infinite_0.4s]' : 'h-1.5'}`} />
            <span className={`w-0.5 bg-emerald-400 rounded-full ${isPlaying ? 'animate-[bounce_0.7s_ease-in-out_infinite_0.1s]' : 'h-2.5'}`} />
          </div>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Focus Playlist
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
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-xs font-mono text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/50 transition-all self-start sm:self-auto shadow-[0_0_10px_rgba(16,185,129,0.15)] active:scale-95"
      >
        {isPlaying ? (
          <>
            <Pause className="w-3 h-3 text-emerald-400" />
            <span>Mute Track</span>
          </>
        ) : (
          <>
            <Play className="w-3 h-3 text-emerald-400" />
            <span>Listen Along</span>
          </>
        )}
      </button>
    </div>
  )
}
