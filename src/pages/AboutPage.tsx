import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Mail, Check, FileText, ArrowRight, Database } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { GitHubActivity } from '@/components/GitHubActivity'
import { SelectedOutcomes } from '@/components/SelectedOutcomes'
import { BentoProjects } from '@/components/BentoProjects'
import { GearsAndSetup } from '@/components/GearsAndSetup'
import { triggerGooseHonk } from '@/utils/gooseEasterEgg'

export const AboutPage: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const email = '8251677@horus.edu.eg'

  const handleCopyEmail = (e: React.MouseEvent) => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    triggerGooseHonk(e)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <div className="space-y-12 sm:space-y-16 animate-in fade-in duration-300">
      
      {/* Hero Header */}
      <section className="space-y-6 pt-2 sm:pt-4">
        
        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Available for High-Impact Software Engineering Roles</span>
        </div>

        {/* Name Header with Pixel Font from yust.dev */}
        <div className="space-y-2">
          <p className="font-mono text-zinc-400 text-sm sm:text-base">Hi I'm 👋</p>
          <h1
            onClick={triggerGooseHonk}
            title="Click for surprise"
            className="font-['Silkscreen',monospace] text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white cursor-pointer select-none hover:text-emerald-400 transition-colors inline-block"
          >
            MOSTAFA
          </h1>
        </div>

        {/* Bio Copy */}
        <div className="space-y-3 font-mono text-sm sm:text-base text-zinc-400 leading-relaxed max-w-3xl">
          <p>
            I'm <strong className="text-white font-bold">Mostafa Kamal Shabara</strong>, an AI &amp; Software Engineering student at{' '}
            <a
              href="https://horus.edu.eg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white font-bold underline decoration-zinc-600 underline-offset-4 hover:decoration-emerald-400 transition-colors"
            >
              Horus University in Egypt
            </a>{' '}
            and a full-stack engineer building production tools that scale.
          </p>

          <p>
            Specializing in high-velocity web platforms using <span className="text-zinc-200">React, TypeScript, Vite, and TanStack</span>, autonomous agent workflows in <span className="text-zinc-200">Python 3.12</span>, and hardened relational data architectures backed by <span className="text-zinc-200">PostgreSQL and Supabase Row Level Security</span>.
          </p>
        </div>

        {/* Action Buttons from yust.dev & aryankarma */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2">
          <button
            type="button"
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-950 font-bold font-mono text-xs sm:text-sm transition-all duration-200 active:scale-95 shadow-lg"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied Email!</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 text-zinc-900" />
                <span>Copy My Email</span>
              </>
            )}
          </button>

          <a
            href="https://github.com/iiafosh"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            className="inline-flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-mono text-xs sm:text-sm transition-colors gap-2"
          >
            <GithubIcon className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/mostafa-kamal-3731453a9/"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            className="inline-flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-mono text-xs sm:text-sm transition-colors gap-2"
          >
            <LinkedInIcon className="w-4 h-4" />
            <span className="hidden sm:inline">LinkedIn</span>
          </a>

          <a
            href="https://github.com/iiafosh/portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 font-mono text-xs sm:text-sm transition-colors gap-2"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Source Code</span>
          </a>
        </div>

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
      <section className="yust-card rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-black border border-emerald-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
                Live Supabase Backend Playground
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Test Live PostgreSQL CRUD &amp; GitHub Auth
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono">
              Try our live database console with Row Level Security (RLS) and optimistic cache mutations.
            </p>
          </div>

          <Link
            to="/database"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono font-bold text-xs sm:text-sm transition-all shadow-lg hover:scale-105 self-start sm:self-auto shrink-0"
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

    </div>
  )
}
