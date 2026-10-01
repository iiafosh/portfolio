import React from 'react'
import { X, Printer, Mail, MapPin, GraduationCap, ExternalLink, ShieldCheck, Trophy } from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'

interface LinkedInResumeModalProps {
  isOpen: boolean
  onClose: () => void
}

export const LinkedInResumeModal: React.FC<LinkedInResumeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[92vh] bg-[#0f0f12] border border-cyan-500/20 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_20px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gaming Window Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/10 bg-[#141418]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="ml-2 text-xs font-['Orbitron',sans-serif] text-cyan-300 font-bold">
              VERIFIED_PROFILE // MOSTAFA_KAMAL_SHABARA
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-zinc-300 leading-relaxed">
          
          {/* Profile Header */}
          <div className="border-b border-white/10 pb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <h2 className="font-['Orbitron',sans-serif] text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Mostafa Kamal Shabara
              </h2>
              <p className="text-cyan-400 font-['Chakra_Petch',sans-serif] text-sm sm:text-base font-semibold">
                Full-Stack Software Engineer &amp; AI Systems Developer
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  Egypt &bull; Open to Remote Worldwide
                </span>
                <span>&bull;</span>
                <a
                  href="mailto:8251677@horus.edu.eg"
                  className="flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  8251677@horus.edu.eg
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <a
                href="https://www.linkedin.com/in/mostafa-kamal-3731453a9/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-semibold transition-colors"
              >
                <LinkedInIcon className="w-4 h-4" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                href="https://github.com/iiafosh"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition-colors"
              >
                <GithubIcon className="w-4 h-4" />
                <span>GitHub @iiafosh</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Education */}
          <div className="space-y-3">
            <h3 className="font-['Orbitron',sans-serif] text-xs uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>Higher Education</span>
            </h3>
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-white text-sm sm:text-base">
                  Horus University in Egypt (HUE)
                </span>
                <span className="text-xs text-zinc-500 font-mono">2023 &ndash; 2027</span>
              </div>
              <p className="text-indigo-400 font-semibold text-xs sm:text-sm">
                Bachelor of Science in Computer Science &amp; Artificial Intelligence
              </p>
              <p className="text-zinc-400 text-xs leading-relaxed pt-1">
                Specialized in Relational Database Management Systems, Data Structures &amp; Algorithms, Autonomous AI Agents, Machine Learning, and Software Engineering Methodologies.
              </p>
            </div>
          </div>

          {/* Key Engineering Accomplishments */}
          <div className="space-y-3">
            <h3 className="font-['Orbitron',sans-serif] text-xs uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
              <Trophy className="w-4 h-4" />
              <span>National Hackathon Podiums &amp; Launches</span>
            </h3>
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Verdict.run Launch Platform</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    120k+ Impressions
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Engineered and launched an online judge competitive programming engine, generating viral reach and national community adoption.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">GDG Delta &amp; LUXSAI AI Hackathons</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Podium Finishes (2nd &amp; 3rd)
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Architected real-time verification and static security AST pipelines under high-pressure competitive sprint settings.
                </p>
              </div>
            </div>
          </div>

          {/* Stack Breakdown */}
          <div className="space-y-3">
            <h3 className="font-['Orbitron',sans-serif] text-xs uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Production Stack</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-white font-bold text-xs block">Frontend</span>
                <p className="text-[11px] text-zinc-400">React 19/18, TypeScript, Vite 6, TanStack Router &amp; Query, Tailwind CSS</p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-white font-bold text-xs block">Backend &amp; DB</span>
                <p className="text-[11px] text-zinc-400">Python 3.12, PostgreSQL, Supabase (RLS &amp; Auth), REST APIs, SQL Optimization</p>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-white font-bold text-xs block">DevOps &amp; AI</span>
                <p className="text-[11px] text-zinc-400">Vercel, Git &amp; GitHub CLI, Docker, LLM Agent APIs, AST Parsers, Linux</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-white/10 bg-[#141418] flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            Available immediately for full-time &amp; contract roles
          </span>
          <a
            href="mailto:8251677@horus.edu.eg"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-['Orbitron',sans-serif] font-bold text-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Mostafa</span>
          </a>
        </div>

      </div>
    </div>
  )
}
