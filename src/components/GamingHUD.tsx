import React, { useState } from 'react'
import { Shield, Zap, Terminal, Trophy, Swords, Sparkles, Cpu } from 'lucide-react'
import { playCyberBlip, playCyberPowerUp } from '@/utils/cyberAudio'

export const GamingHUD: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'perks' | 'achievements'>('stats')
  const [xpBoost, setXpBoost] = useState(14850)
  const [buffActive, setBuffActive] = useState(false)

  const handleBuff = () => {
    playCyberPowerUp()
    setXpBoost((prev) => prev + 500)
    setBuffActive(true)
    setTimeout(() => setBuffActive(false), 3000)
  }

  const attributes = [
    { label: 'Frontend Engine (React 19 / TanStack / Vite)', value: 98, color: 'from-cyan-500 to-blue-500', glow: 'shadow-[0_0_12px_rgba(6,182,212,0.4)]' },
    { label: 'Database & RLS (PostgreSQL / Supabase)', value: 96, color: 'from-emerald-500 to-teal-400', glow: 'shadow-[0_0_12px_rgba(16,185,129,0.4)]' },
    { label: 'AI Agents & Automation (Python 3.12 / LLMs)', value: 94, color: 'from-indigo-500 to-purple-500', glow: 'shadow-[0_0_12px_rgba(99,102,241,0.4)]' },
    { label: 'Competitive Problem Solving (ICPC HUE)', value: 95, color: 'from-amber-500 to-orange-400', glow: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]' },
    { label: 'System Security & AST Parsing', value: 91, color: 'from-rose-500 to-red-400', glow: 'shadow-[0_0_12px_rgba(244,63,94,0.4)]' },
  ]

  const achievements = [
    { title: 'Podium Dominator', desc: 'Finished top-3 in 3 Egyptian collegiate & national hackathons', icon: Trophy, tier: 'GOLD' },
    { title: 'Viral Architect', desc: 'Verdict.run generated 120,000+ organic impressions on launch', icon: Sparkles, tier: 'LEGENDARY' },
    { title: 'PostgreSQL Defender', desc: 'Engineered zero-leak Row Level Security database policies', icon: Shield, tier: 'PLATINUM' },
    { title: 'Autonomous Sentry', desc: 'Built multi-agent AST static security scanner catching zero-days', icon: Swords, tier: 'DIAMOND' },
  ]

  return (
    <div className="yust-card rounded-2xl p-5 sm:p-7 space-y-6 relative overflow-hidden border border-white/10 bg-gradient-to-b from-[#141418] via-[#0f0f12] to-[#09090b]">
      
      {/* Top Gaming HUD Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 via-emerald-500/20 to-purple-500/20 border border-cyan-400/30 flex items-center justify-center font-['Orbitron',sans-serif] font-bold text-white text-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              M
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Orbitron',sans-serif] text-sm sm:text-base font-extrabold text-white tracking-wider">
                MOSTAFA_SHABARA
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-['Chakra_Petch',sans-serif] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                LVL 24
              </span>
            </div>
            <p className="text-xs font-mono text-zinc-400 mt-0.5">
              Horus University in Egypt &bull; CS &amp; Artificial Intelligence
            </p>
          </div>
        </div>

        {/* Stats Meters */}
        <div className="flex items-center gap-3 self-start sm:self-auto font-['Chakra_Petch',sans-serif]">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="text-cyan-400 font-bold">HP 100%</span>
              <span>OVERCLOCK</span>
            </div>
            <div className="w-24 sm:w-28 h-2 rounded bg-black/60 border border-white/10 overflow-hidden">
              <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-emerald-400 animate-pulse" />
            </div>
          </div>

          <button
            onClick={handleBuff}
            title="Click to boost player XP"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-xs text-white transition-all active:scale-95 group"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-400 ${buffActive ? 'animate-bounce' : ''}`} />
            <span className="font-mono text-[11px]">{xpBoost.toLocaleString()} XP</span>
          </button>
        </div>

      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        {(['stats', 'perks', 'achievements'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              playCyberBlip(tab === 'stats' ? 600 : tab === 'perks' ? 750 : 900)
              setActiveTab(tab)
            }}
            className={`px-3 py-1 rounded-lg text-xs font-['Orbitron',sans-serif] font-bold uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'stats' && (
        <div className="space-y-3.5 animate-in fade-in duration-200">
          {attributes.map((attr, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-['Chakra_Petch',sans-serif]">
                <span className="text-zinc-300 font-medium">{attr.label}</span>
                <span className="text-white font-bold font-mono">{attr.value}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-black/60 border border-white/5 overflow-hidden p-[1px]">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${attr.color} ${attr.glow} transition-all duration-500`}
                  style={{ width: `${attr.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'perks' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-cyan-400 font-['Orbitron',sans-serif] text-xs font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>Hyper-Fast Ship Rate</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Builds SPAs and full-stack cloud backends from zero to production in hours.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-['Orbitron',sans-serif] text-xs font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>RLS Tenancy Isolation</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Enforces PostgreSQL security at the DB level, making data breaches impossible.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-purple-400 font-['Orbitron',sans-serif] text-xs font-bold">
              <Cpu className="w-3.5 h-3.5" />
              <span>Autonomous Agent Pipelines</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Custom Python LLM orchestrators that run verification and regression test suites.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-['Orbitron',sans-serif] text-xs font-bold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Sub-60ms UI Mutations</span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              TanStack Query optimistic cache invalidation guarantees zero spinner delays.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
          {achievements.map((ach, idx) => {
            const Icon = ach.icon
            return (
              <div key={idx} className="p-3.5 rounded-xl bg-black/40 border border-white/5 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0 text-amber-400">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-['Orbitron',sans-serif] font-bold text-xs text-white">
                      {ach.title}
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {ach.tier}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">
                    {ach.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
