import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Mail, Check, FileText, ArrowRight, Database, Terminal, UserCheck } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { GamingHUD } from '@/components/GamingHUD'
import { CyberTerminal } from '@/components/CyberTerminal'
import { GitHubActivity } from '@/components/GitHubActivity'
import { SelectedOutcomes } from '@/components/SelectedOutcomes'
import { BentoProjects } from '@/components/BentoProjects'
import { GearsAndSetup } from '@/components/GearsAndSetup'
import { LinkedInResumeModal } from '@/components/LinkedInResumeModal'
import { LinkedInHoverCard } from '@/components/LinkedInHoverCard'
import { triggerGooseHonk } from '@/utils/gooseEasterEgg'
import { playCyberBlip, playCyberPowerUp } from '@/utils/cyberAudio'

export const AboutPage: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const [isResumeOpen, setIsResumeOpen] = useState(false)
  const email = '8251677@horus.edu.eg'

  const handleCopyEmail = (e: React.MouseEvent) => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    playCyberPowerUp()
    triggerGooseHonk(e)
    setTimeout(() => setCopied(false), 2200)
  }

  const handleOpenResume = () => {
    playCyberBlip(750)
    setIsResumeOpen(true)
  }

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-300">
      
      {/* Gaming Hero Header */}
      <section className="space-y-6 pt-2 sm:pt-4">
        
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-xs font-['Chakra_Petch',sans-serif] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="tracking-wider">SYSTEM ONLINE // FULL-STACK &amp; AI SYSTEMS ENGINEER</span>
        </div>

        {/* Gaming Name Header (Orbitron) with chromatic holographic glow */}
        <div className="space-y-2">
          <p className="font-['Chakra_Petch',sans-serif] text-cyan-400/80 text-sm sm:text-base tracking-wider uppercase font-semibold flex items-center gap-2">
            <span className="w-4 h-[1px] bg-cyan-400 inline-block" />
            <span>HELLO, WORLD. I AM</span>
          </p>
          <div className="flex flex-wrap items-baseline gap-4">
            <h1
              onClick={triggerGooseHonk}
              title="Click to unleash cyber pulse"
              className="font-['Orbitron',sans-serif] text-5xl sm:text-7xl md:text-8xl font-black tracking-tight cursor-pointer select-none transition-all duration-300 inline-block bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(6,182,212,0.45)] hover:brightness-125"
            >
              MOSTAFA
            </h1>
            <span className="font-['Silkscreen',monospace] text-xs sm:text-sm text-cyan-300 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-950/60 to-indigo-950/60 border border-cyan-400/40 shadow-[0_0_15px_rgba(6,182,212,0.3)] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              LVL.24
            </span>
          </div>
        </div>

        {/* Bio Copy with LinkedIn Hover Card */}
        <div className="space-y-3 font-mono text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
          <p>
            I'm{' '}
            <LinkedInHoverCard>
              <strong className="text-white font-bold font-['Chakra_Petch',sans-serif] text-base sm:text-lg hover:text-cyan-300 transition-colors">
                Mostafa Kamal Shabara
              </strong>
            </LinkedInHoverCard>
            , an AI &amp; Software Engineering student at{' '}
            <a
              href="https://horus.edu.eg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-300 font-bold underline decoration-cyan-500/50 underline-offset-4 hover:decoration-cyan-300 hover:text-cyan-200 transition-colors"
            >
              Horus University in Egypt (HUE)
            </a>{' '}
            building high-performance web platforms and autonomous systems.
          </p>

          <p className="text-zinc-400 text-xs sm:text-sm">
            Architecting production web apps using <span className="text-cyan-300 font-semibold">React 19, Vite, and TanStack</span>, automated LLM verification agents in <span className="text-purple-300 font-semibold">Python 3.12</span>, and hardened cloud relational databases backed by <span className="text-emerald-300 font-semibold">PostgreSQL &amp; Supabase Row Level Security</span>.
          </p>
        </div>

        {/* Action Buttons Row matching yust.dev */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
          
          {/* Copy Email Button (clean high-contrast pill) */}
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold font-sans text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-[0_4px_16px_rgba(255,255,255,0.15)] hover:scale-[1.02]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied email!</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 text-zinc-900" />
                <span>Copy my email</span>
              </>
            )}
          </button>

          {/* GitHub Icon Button */}
          <a
            href="https://github.com/iiafosh"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile (@iiafosh)"
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-all active:scale-95"
          >
            <GithubIcon className="w-5 h-5" />
          </a>

          {/* LinkedIn Icon Button */}
          <a
            href="https://www.linkedin.com/in/mostafa-kamal-3731453a9/"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-sky-500/15 text-zinc-400 hover:text-sky-400 border border-white/10 hover:border-sky-500/30 transition-all active:scale-95 shadow-sm"
          >
            <LinkedInIcon className="w-5 h-5" />
          </a>

          {/* Resume Modal Trigger Icon Button */}
          <button
            type="button"
            onClick={handleOpenResume}
            title="View Verified CV & Biography"
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-cyan-300 border border-white/10 hover:border-cyan-400/40 transition-all active:scale-95"
          >
            <UserCheck className="w-5 h-5" />
          </button>

          {/* Source Code Repo */}
          <a
            href="https://github.com/iiafosh/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            title="View Portfolio Repository on GitHub"
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-zinc-300 border border-white/10 transition-colors active:scale-95"
          >
            <FileText className="w-4 h-4" />
          </a>

        </div>

      </section>

      {/* Gaming Character HUD & Attributes */}
      <section>
        <GamingHUD />
      </section>

      {/* "SHOW WHAT CAN YOU DO" - Interactive Cyber Terminal */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h2 className="font-['Orbitron',sans-serif] text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>INTERACTIVE CYBER COMMAND TERMINAL</span>
          </h2>
          <span className="text-xs font-mono text-emerald-400">Live Shell</span>
        </div>
        <CyberTerminal />
      </section>

      {/* GitHub Velocity Graph (aryankarma) */}
      <section>
        <GitHubActivity />
      </section>

      {/* Selected Outcomes (yust.dev) */}
      <section>
        <SelectedOutcomes />
      </section>

      {/* Bento Grid Projects (yust.dev & aryankarma) */}
      <section id="projects">
        <BentoProjects />
      </section>

      {/* Interactive Supabase Postgres Callout Banner */}
      <section className="yust-card rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/50 via-[#0a1215] to-[#07080e] border border-emerald-500/30 hover:border-emerald-400/50 space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.12)] transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase font-['Orbitron',sans-serif] tracking-wider text-emerald-300 font-bold">
                Live Supabase Backend Engine
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold font-['Chakra_Petch',sans-serif] text-white tracking-tight">
              Test Live PostgreSQL CRUD &amp; GitHub OAuth
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Try our live database console with Row Level Security (RLS) policies and optimistic cache mutations.
            </p>
          </div>

          <Link
            to="/database"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-zinc-950 font-['Orbitron',sans-serif] font-bold text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:scale-105 self-start sm:self-auto shrink-0"
          >
            <span>Launch DB Playground</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Gears & Tools (ramx.in) */}
      <section id="gears">
        <GearsAndSetup />
      </section>

      {/* Resume & LinkedIn Modal */}
      <LinkedInResumeModal
        isOpen={isResumeOpen}
        onClose={() => setIsResumeOpen(false)}
      />

    </div>
  )
}
