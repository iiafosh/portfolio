import React, { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp, Music, Settings, X, Check, Disc } from 'lucide-react'
import { AnghamiIcon } from '@/components/icons/AnghamiIcon'

interface PlayerTarget {
  type: 'song' | 'playlist' | 'album' | 'artist'
  id: string
  label?: string
}

const DEFAULT_TARGET: PlayerTarget = {
  type: 'song',
  id: '82145914',
  label: 'Featured Coding Stream (Wegz - El Ghasala)',
}

const DEFAULT_PROFILE_URL = 'https://play.anghami.com'

export const AnghamiWidget: React.FC<{ profileUrl?: string }> = ({
  profileUrl: initialProfileUrl = DEFAULT_PROFILE_URL,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [customInput, setCustomInput] = useState('')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Current player target & profile link
  const [target, setTarget] = useState<PlayerTarget>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('anghami_player_target')
        if (saved) return JSON.parse(saved)
      } catch {
        // fallback to default
      }
    }
    return DEFAULT_TARGET
  })

  const [profileUrl, setProfileUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('anghami_profile_url')
        if (saved) return saved
      } catch {
        // fallback to default
      }
    }
    return initialProfileUrl
  })

  // Parse any pasted Anghami URL (song, playlist, album, artist, or profile)
  const handleSaveCustomLink = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = customInput.trim()
    if (!trimmed) return

    let updatedTarget: PlayerTarget | null = null
    let updatedProfile = profileUrl

    // Match song
    const songMatch = trimmed.match(/\/song\/([0-9]+)/i)
    // Match playlist
    const playlistMatch = trimmed.match(/\/playlist\/([0-9a-zA-Z_-]+)/i)
    // Match album
    const albumMatch = trimmed.match(/\/album\/([0-9]+)/i)
    // Match artist
    const artistMatch = trimmed.match(/\/artist\/([0-9]+)/i)
    // Match profile/user
    const profileMatch = trimmed.match(/\/(profile|user)\/([0-9a-zA-Z_.-]+)/i)

    if (songMatch) {
      updatedTarget = { type: 'song', id: songMatch[1], label: `Anghami Track #${songMatch[1]}` }
    } else if (playlistMatch) {
      updatedTarget = { type: 'playlist', id: playlistMatch[1], label: `Anghami Playlist #${playlistMatch[1]}` }
    } else if (albumMatch) {
      updatedTarget = { type: 'album', id: albumMatch[1], label: `Anghami Album #${albumMatch[1]}` }
    } else if (artistMatch) {
      updatedTarget = { type: 'artist', id: artistMatch[1], label: `Anghami Artist #${artistMatch[1]}` }
    } else if (/^[0-9]+$/.test(trimmed)) {
      // Just raw numeric ID -> assume song ID
      updatedTarget = { type: 'song', id: trimmed, label: `Anghami Track #${trimmed}` }
    }

    if (profileMatch || trimmed.includes('anghami.com/profile') || trimmed.includes('anghami.com/user')) {
      updatedProfile = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    } else if (trimmed.startsWith('http')) {
      updatedProfile = trimmed
    }

    if (updatedTarget) {
      setTarget(updatedTarget)
      localStorage.setItem('anghami_player_target', JSON.stringify(updatedTarget))
      setIsExpanded(true)
    }

    setProfileUrl(updatedProfile)
    localStorage.setItem('anghami_profile_url', updatedProfile)

    setSavedSuccess(true)
    setTimeout(() => {
      setSavedSuccess(false)
      setIsModalOpen(false)
    }, 1500)
  }

  const embedSrc = `https://widget.anghami.com/${target.type}/${target.id}?theme=fulldark&layout=wide&lang=en`

  return (
    <div className="space-y-3">
      {/* Top Bar Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-[#0d0b1a]/90 to-[#07080e] border border-purple-500/30 hover:border-purple-400/50 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_20px_rgba(168,85,247,0.15)] group">
        
        {/* Left Branding & Live Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-transform group-hover:scale-105">
            <AnghamiIcon className="w-5 h-5 drop-shadow-[0_0_8px_rgba(224,255,0,0.4)]" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-['Silkscreen',monospace] uppercase tracking-wider text-purple-300 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                Anghami Live Stream
              </span>
              <span className="text-zinc-600 text-[10px]">&bull;</span>
              <span className="text-[11px] font-mono text-fuchsia-300/90 font-medium">Official Embed</span>
            </div>

            <p className="text-xs font-mono text-white font-semibold flex items-center gap-1.5">
              <span>{target.label || "Mostafa's Live Music"}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          
          {/* Toggle Live Player Embed */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-purple-200 border border-purple-500/20 hover:border-purple-400/40 transition-all active:scale-95"
          >
            <Disc className={`w-3.5 h-3.5 text-fuchsia-400 ${isExpanded ? 'animate-spin' : ''}`} />
            <span>{isExpanded ? 'Hide Player' : 'Live Player'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Connect / Change Link Button */}
          <button
            type="button"
            onClick={() => {
              setCustomInput(profileUrl)
              setIsModalOpen(true)
            }}
            title="Connect your personal Anghami account, playlist, or song"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-purple-300 border border-white/5 hover:border-purple-500/30 transition-all active:scale-95"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

          {/* Open in Anghami App / Web */}
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in Anghami Web Player"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 hover:from-purple-500/30 hover:to-fuchsia-500/30 text-xs font-mono text-purple-200 border border-purple-500/30 hover:border-purple-400/60 transition-all shadow-[0_0_12px_rgba(168,85,247,0.2)] active:scale-95 hover:scale-105"
          >
            <span>Open Anghami</span>
            <ExternalLink className="w-3 h-3 text-fuchsia-300" />
          </a>
        </div>
      </div>

      {/* Real Live Official Anghami Embed Player iframe */}
      {isExpanded && (
        <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 bg-[#07080e] shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_25px_rgba(168,85,247,0.15)] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center justify-between px-3.5 py-1.5 bg-purple-950/40 border-b border-purple-500/20 text-[10px] font-mono text-purple-300">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-ping" />
              Direct Audio Streaming from Anghami Servers (Press Play below)
            </span>
            <span className="text-zinc-500">embed.anghami.com</span>
          </div>

          <iframe
            src={embedSrc}
            width="100%"
            height="150"
            frameBorder="0"
            scrolling="no"
            title="Live Anghami Music Player"
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write *"
            className="w-full bg-[#07080e]"
          />
        </div>
      )}

      {/* Connect Personal Anghami Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md p-5 rounded-2xl bg-[#0d0b1a] border border-purple-500/40 shadow-[0_16px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(168,85,247,0.3)] space-y-4">
            
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <AnghamiIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-['Chakra_Petch',sans-serif] font-bold text-sm text-white">
                    Link Your Personal Anghami
                  </h3>
                  <p className="text-[11px] font-mono text-zinc-400">
                    Connect your profile, playlist, or track
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomLink} className="space-y-3 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-purple-400" />
                  <span>Anghami URL or Track/Playlist ID</span>
                </label>
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="e.g. https://play.anghami.com/playlist/... or song ID"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-1 focus:ring-purple-400 text-white placeholder-zinc-500 text-xs"
                  autoFocus
                />
                <p className="text-[10px] text-zinc-500">
                  Paste any Anghami link (Song, Playlist, Album, or Profile). It will instantly connect and update your live player!
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-bold text-xs transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Connected!</span>
                    </>
                  ) : (
                    <span>Save &amp; Link</span>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  )
}
