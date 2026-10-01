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
      <div className="yust-card rounded-2xl p-6 sm:p-7 space-y-1.5">
        <div className="flex items-center gap-2 text-zinc-400">
          <Award className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-[11px] uppercase tracking-wider">Credentials</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Certificates &amp; Coursework
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400">
          Academic achievements and verified technical credentials.
        </p>
      </div>

      {/* List */}
      <div className="space-y-4">
        {certs.map((cert, idx) => (
          <div key={idx} className="yust-card rounded-2xl p-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  {cert.title}
                </h3>
                <p className="text-xs text-indigo-400 font-mono mt-0.5">
                  {cert.issuer}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 self-start sm:self-auto">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-zinc-500" />
                  {cert.date}
                </span>
                <span>&bull;</span>
                <span className="text-[11px] text-zinc-500">ID: {cert.id}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {cert.description}
            </p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {cert.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-[10px] font-mono text-zinc-300"
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
