import React, { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { MapPin, Mail, Check, Clock, ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'

export const AboutPage: React.FC = () => {
  const [copied, setCopied] = useState(false)
  const [cairoTime, setCairoTime] = useState('')
  const email = '8251677@horus.edu.eg'

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('en-US', {
        timeZone: 'Africa/Cairo',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      setCairoTime(timeStr)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Card */}
      <div className="yust-card rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                Available for Roles &amp; Contracts
              </span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Mostafa Shabara
            </h1>
            <p className="text-sm font-mono text-zinc-400">
              Full-Stack &amp; AI Developer &bull; Egypt 🇪🇬
            </p>
          </div>

          <div className="relative group self-start sm:self-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-[1px] bg-gradient-to-tr from-white/20 via-white/5 to-white/10 shadow-xl">
              <img
                src="https://avatars.githubusercontent.com/u/256016032?v=4"
                alt="Mostafa Shabara"
                className="w-full h-full rounded-[15px] object-cover bg-black"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-[#18181c] border border-white/10 rounded-full px-1.5 py-0.5 text-[9px] font-mono text-zinc-300 flex items-center gap-0.5">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
              HUE
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
          Computer Science &amp; Artificial Intelligence student at <strong className="text-white font-medium">Horus University in Egypt (HUE)</strong>. Building modern web platforms using <strong className="text-white font-medium">Vite</strong>, <strong className="text-white font-medium">TanStack Router &amp; Query</strong>, and cloud databases with <strong className="text-white font-medium">Supabase PostgreSQL</strong> and Row Level Security.
        </p>

        {/* Quick Social & Contact Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-white/5">
          <a
            href="https://github.com/iiafosh"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-medium transition-all"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          <a
            href="https://www.linkedin.com/in/mostafa-kamal-3731453a9/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-medium transition-all"
          >
            <LinkedInIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>LinkedIn</span>
          </a>

          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 font-mono transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>{email}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        
        {/* Education Tile */}
        <div className="yust-card rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-zinc-400">
            <GraduationCap className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Education</span>
          </div>
          <h3 className="font-semibold text-white text-sm">Horus University in Egypt</h3>
          <p className="text-zinc-400 text-xs leading-relaxed">
            B.Sc. in Computer Science &amp; Artificial Intelligence (2023 - 2027). Specializing in software engineering, database systems, and ML.
          </p>
        </div>

        {/* Live Clock & Location */}
        <div className="yust-card rounded-2xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center justify-between text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-[11px] uppercase tracking-wider">Cairo Time</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Online
            </span>
          </div>
          <div className="text-2xl font-mono font-bold text-white tracking-tight">
            {cairoTime || '02:00 AM'}
          </div>
          <p className="text-zinc-400 text-xs flex items-center gap-1">
            <MapPin className="w-3 h-3 text-zinc-500" />
            <span>Damietta, Egypt (GMT+3) &bull; Remote Available</span>
          </p>
        </div>

      </div>

      {/* Tech Stack Pills (Minimalist yust.dev / ramx.in style) */}
      <div className="yust-card rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/5 pb-2">
          <span className="font-mono text-[11px] uppercase tracking-wider">Primary Stack</span>
          <span className="font-mono text-[11px] text-zinc-500">2026 Production</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['React 19', 'TypeScript', 'Vite 6', 'TanStack Router', 'TanStack Query', 'Supabase Postgres', 'Row Level Security', 'Tailwind CSS', 'Python', 'Vercel Edge'].map((item) => (
            <span
              key={item}
              className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-zinc-300 font-mono text-[11px]"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
        <Link
          to="/projects"
          className="yust-card rounded-2xl p-4 sm:p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
        >
          <div>
            <h4 className="font-semibold text-white text-sm group-hover:text-indigo-300 transition-colors">
              Explore Projects &rarr;
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">Full-stack applications &amp; open source code</p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-1" />
        </Link>

        <Link
          to="/database"
          className="yust-card rounded-2xl p-4 sm:p-5 flex items-center justify-between group hover:bg-white/[0.02] transition-colors"
        >
          <div>
            <h4 className="font-semibold text-white text-sm group-hover:text-emerald-300 transition-colors">
              Live Supabase Playground &rarr;
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">Test real-time Postgres CRUD with GitHub OAuth</p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-all group-hover:translate-x-1" />
        </Link>
      </div>

    </div>
  )
}
