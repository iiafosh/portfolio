import React from 'react'
import { Award, Calendar } from 'lucide-react'

export const CertsPage: React.FC = () => {
  const certs = [
    {
      title: 'Full-Stack Web Development & Modern Architecture',
      issuer: 'Advanced Engineering Series',
      date: '2025',
      id: 'FS-984210',
      description: 'Comprehensive specialization covering React 18/19, TypeScript, client routing, and cloud database integration.',
      tags: ['React', 'TypeScript', 'Vite', 'PostgreSQL'],
    },
    {
      title: 'Database Management Systems & SQL Mastery',
      issuer: 'Horus University in Egypt (HUE)',
      date: '2024',
      id: 'CS-DBMS-2024',
      description: 'Advanced coursework in relational algebra, indexing, transaction ACID guarantees, and Row Level Security.',
      tags: ['PostgreSQL', 'SQL Optimization', 'Relational Models'],
    },
    {
      title: 'Applied Machine Learning & Algorithms',
      issuer: 'AI Studies Specialization',
      date: '2024',
      id: 'ML-772183',
      description: 'Machine learning fundamentals, regression, neural network models, and Python algorithmic data structures.',
      tags: ['Python', 'Machine Learning', 'Algorithms'],
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="border-b border-white/10 pb-4 space-y-1">
        <div className="flex items-center gap-2 text-zinc-400">
          <Award className="w-4 h-4 text-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-bold">Academic &amp; Industry Credentials</span>
        </div>
        <h1 className="font-['Silkscreen',monospace] text-2xl sm:text-3xl font-bold tracking-wide bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.35)]">
          CERTIFICATES &amp; STUDIES
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-mono">
          Academic achievements and verified technical credentials.
        </p>
      </div>

      {/* List */}
      <div className="space-y-4">
        {certs.map((cert, idx) => (
          <div
            key={idx}
            className="yust-card rounded-2xl p-6 space-y-3 border border-white/10 hover:border-cyan-500/40 hover:shadow-[0_0_25px_rgba(6,182,212,0.15)] bg-gradient-to-br from-[#0e1422]/70 via-[#0a0d16]/90 to-[#07080e] transition-all duration-200"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight hover:text-cyan-300 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-xs text-cyan-400/80 font-mono mt-0.5">
                  {cert.issuer}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 self-start sm:self-auto">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-400/70" />
                  {cert.date}
                </span>
                <span>&bull;</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                  ID: {cert.id}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-mono">
              {cert.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {cert.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-md bg-white/[0.04] border border-white/10 text-[10px] font-mono text-zinc-300 hover:border-cyan-500/30 hover:text-cyan-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
