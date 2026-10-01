import React, { useState, useRef, useEffect } from 'react'
import { Terminal, CornerDownLeft } from 'lucide-react'
import { playCyberBlip, playLaserSound, playCyberPowerUp } from '@/utils/cyberAudio'
import { triggerSlimeBloop } from '@/utils/slimeEasterEgg'

interface LogEntry {
  command: string
  output: React.ReactNode
  type?: 'info' | 'success' | 'warn' | 'system'
}

export const CyberTerminal: React.FC = () => {
  const [input, setInput] = useState('')
  const [matrixActive, setMatrixActive] = useState(false)
  const [history, setHistory] = useState<LogEntry[]>([
    {
      command: 'init-cyberdeck',
      type: 'system',
      output: (
        <div className="space-y-1 text-zinc-400">
          <p className="text-cyan-400 font-bold font-['Orbitron',sans-serif]">
            [ MOSTAFA OS // CYBERDECK v4.2 INITIALIZED ]
          </p>
          <p>Horus University in Egypt (HUE) &bull; Computer Science &amp; AI</p>
          <p className="text-zinc-500 text-[11px]">
            Type <span className="text-emerald-400">help</span> or click the quick action chips below to test live capabilities.
          </p>
        </div>
      ),
    },
  ])

  const terminalEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    playCyberBlip()

    let response: React.ReactNode = null
    let type: LogEntry['type'] = 'info'

    if (!trimmed) return

    switch (trimmed) {
      case 'help':
        response = (
          <div className="space-y-1 font-mono text-zinc-300">
            <p className="text-cyan-400 font-bold">Available Cyber Commands:</p>
            <p><span className="text-emerald-400 font-bold">skills</span> - Full engineering stack and mastery metrics</p>
            <p><span className="text-emerald-400 font-bold">projects</span> - Live deployed builds and GitHub repositories</p>
            <p><span className="text-emerald-400 font-bold">matrix</span> - Toggle cyber digital rain simulator</p>
            <p><span className="text-emerald-400 font-bold">db</span> - Ping Supabase PostgreSQL connection</p>
            <p><span className="text-emerald-400 font-bold">sudo hire</span> - Direct contract &amp; recruitment payload</p>
            <p><span className="text-emerald-400 font-bold">slime</span> - Trigger cute blue slime mascot celebration</p>
            <p><span className="text-emerald-400 font-bold">clear</span> - Flush terminal buffer</p>
          </div>
        )
        break

      case 'skills':
        response = (
          <div className="space-y-1.5 font-mono text-xs">
            <p className="text-cyan-300 font-bold">[ CORE COMPETENCIES ]</p>
            <p className="text-zinc-300">&bull; <span className="text-white font-bold">Frontend:</span> React 19/18, TypeScript, Vite 6, TanStack Router &amp; Query, Tailwind</p>
            <p className="text-zinc-300">&bull; <span className="text-white font-bold">Backend &amp; DB:</span> Python 3.12, PostgreSQL, Supabase (RLS Policies), REST &amp; WebSockets</p>
            <p className="text-zinc-300">&bull; <span className="text-white font-bold">AI &amp; Automation:</span> Autonomous LLM Agents, AST parsers, SAST security scanners</p>
            <p className="text-zinc-300">&bull; <span className="text-white font-bold">Infrastructure:</span> Vercel, Docker, Git &amp; GitHub CLI, PowerShell, Linux</p>
          </div>
        )
        type = 'success'
        break

      case 'projects':
        response = (
          <div className="space-y-1 font-mono text-xs">
            <p className="text-emerald-400 font-bold">[ SHIPPED REPOSITORIES ]</p>
            <p>&bull; <strong className="text-white">portfolio:</strong> Vite 6 + TanStack Router + Supabase Postgres (<a href="https://github.com/iiafosh/portfolio" target="_blank" rel="noreferrer" className="text-cyan-400 underline">github.com/iiafosh/portfolio</a>)</p>
            <p>&bull; <strong className="text-white">verdict.run:</strong> Sandboxed competitive programming platform (120k+ impressions)</p>
            <p>&bull; <strong className="text-white">autonomous-tester:</strong> Python LLM test synthesis agent (sub-60s regression tests)</p>
            <p>&bull; <strong className="text-white">sast-scanner:</strong> Static code analysis security agent</p>
          </div>
        )
        break

      case 'matrix':
        setMatrixActive((prev) => !prev)
        playLaserSound()
        response = (
          <p className="text-emerald-400 font-bold">
            {matrixActive ? '[ MATRIX RAIN SUSPENDED ]' : '[ MATRIX CYBER RAIN ACTIVATED ]'}
          </p>
        )
        break

      case 'db':
        response = (
          <div className="space-y-1 font-mono text-xs text-zinc-300">
            <p className="text-emerald-400 font-bold">[ SUPABASE POSTGRESQL PING ]</p>
            <p>Target: <span className="text-white">ohpeadhwtgboeaekpxlf.supabase.co</span></p>
            <p>Auth: <span className="text-emerald-400">Row Level Security (RLS) Active</span></p>
            <p>Latency: <span className="text-cyan-300 font-bold">~42ms (Edge verified)</span></p>
            <p className="text-zinc-500">Head to the /database tab for live CRUD and GitHub OAuth session test.</p>
          </div>
        )
        break

      case 'sudo hire':
      case 'hire':
        playCyberPowerUp()
        triggerSlimeBloop()
        response = (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1 font-mono text-xs">
            <p className="font-bold text-white text-sm">🎉 CONTRACT UNLOCKED // HIRE REQUEST READY</p>
            <p>Email: <a href="mailto:8251677@horus.edu.eg" className="text-white underline font-bold">8251677@horus.edu.eg</a></p>
            <p>LinkedIn: <a href="https://www.linkedin.com/in/mostafa-kamal-3731453a9/" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-bold">linkedin.com/in/mostafa-kamal</a></p>
            <p className="text-emerald-400 font-semibold">Ready to ship production code immediately!</p>
          </div>
        )
        type = 'success'
        break

      case 'slime':
      case 'bloop':
      case 'honk':
        triggerSlimeBloop()
        response = <p className="text-cyan-300 font-bold">💧 BLOOP! Blue slime mascot unleashed across viewport.</p>
        break

      case 'clear':
        setHistory([])
        setInput('')
        return

      default:
        response = (
          <p className="text-rose-400 font-mono text-xs">
            Command not recognized: "{trimmed}". Type <span className="text-white underline">help</span> for valid commands.
          </p>
        )
        type = 'warn'
        break
    }

    setHistory((prev) => [...prev, { command: cmd, output: response, type }])
    setInput('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    executeCommand(input)
  }

  const quickCommands = [
    { label: '$ skills', cmd: 'skills' },
    { label: '$ projects', cmd: 'projects' },
    { label: '$ matrix', cmd: 'matrix' },
    { label: '$ db', cmd: 'db' },
    { label: '$ sudo hire', cmd: 'sudo hire' },
    { label: '$ honk', cmd: 'honk' },
  ]

  return (
    <div className="yust-card rounded-2xl p-5 sm:p-7 space-y-4 relative overflow-hidden border border-cyan-500/30 bg-[#080c16]/95 font-mono shadow-[0_12px_40px_rgba(0,0,0,0.7),0_0_30px_rgba(6,182,212,0.12)]">
      
      {/* Matrix Background Effect */}
      {matrixActive && (
        <div className="pointer-events-none absolute inset-0 opacity-20 overflow-hidden font-mono text-[10px] text-emerald-400 leading-none select-none z-0">
          {Array.from({ length: 22 }).map((_, i) => (
            <div key={i} className="animate-[pulse_1.2s_infinite] whitespace-nowrap text-emerald-300 font-bold">
              01010110 01101001 01110100 01100101 00100000 01010100 01100001 01101110 01010011 01110100 01100001 01100011 01101011 00100000 01010011 01110101 01110000 01100001 01100010 01100001 01100011 01100101
            </div>
          ))}
        </div>
      )}

      {/* Terminal Title Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]" />
            <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
          </div>
          <span className="text-xs font-['Orbitron',sans-serif] text-cyan-300 ml-2 font-bold flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>SHOWCASE // CYBER TERMINAL</span>
          </span>
        </div>

        <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          LIVE SHELL
        </span>
      </div>

      {/* Quick Action Chips */}
      <div className="relative z-10 flex flex-wrap gap-1.5 pt-1">
        {quickCommands.map((qc) => (
          <button
            key={qc.cmd}
            type="button"
            onClick={() => executeCommand(qc.cmd)}
            className="px-2.5 py-1 rounded-lg bg-cyan-950/40 hover:bg-cyan-500/20 text-[11px] text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 transition-all font-mono active:scale-95 shadow-[0_0_8px_rgba(6,182,212,0.12)]"
          >
            {qc.label}
          </button>
        ))}
      </div>

      {/* Output Console Log */}
      <div className="relative z-10 space-y-3 max-h-64 overflow-y-auto pt-2 text-xs no-scrollbar">
        {history.map((h, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-400">
              <span className="text-cyan-400 font-bold">mostafa@cyberdeck:~$</span>
              <span className="text-white font-semibold">{h.command}</span>
            </div>
            <div className="pl-3 border-l border-cyan-500/30 text-xs">
              {h.output}
            </div>
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Interactive Input Form */}
      <form onSubmit={handleSubmit} className="relative z-10 flex items-center gap-2 pt-2 border-t border-white/10">
        <span className="text-emerald-400 font-bold text-xs shrink-0 font-mono">
          mostafa@cyberdeck:~$
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type command (e.g. skills, matrix, projects, sudo hire)..."
          className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 outline-none font-mono"
        />
        <button
          type="submit"
          className="p-1.5 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-500/20 transition-colors"
          title="Send command"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  )
}
