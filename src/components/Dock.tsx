import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { MetallicHouse } from '@/components/icons/metallic/MetallicHouse'
import { MetallicFolder } from '@/components/icons/metallic/MetallicFolder'
import { MetallicTrophy } from '@/components/icons/metallic/MetallicTrophy'
import { MetallicDatabase } from '@/components/icons/metallic/MetallicDatabase'
import { MetallicSlime } from '@/components/icons/metallic/MetallicSlime'
import { GithubIcon } from '@/components/icons/GithubIcon'
import { triggerSlimeBloop } from '@/utils/slimeEasterEgg'
import { LogOut } from 'lucide-react'

export const Dock: React.FC = () => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { user, signInWithGithub, signOut } = useAuth()

  const navLinks = [
    { to: '/', label: 'Home', icon: MetallicHouse },
    { to: '/projects', label: 'Projects', icon: MetallicFolder },
    { to: '/hacks', label: 'Hacks', icon: MetallicTrophy },
    { to: '/database', label: 'Database', icon: MetallicDatabase },
  ]

  return (
    <nav className="fixed bottom-4 sm:bottom-auto sm:top-6 left-1/2 -translate-x-1/2 z-50 w-max max-w-[calc(100vw-1rem)]">
      <div className="yust-dock flex items-center gap-1 sm:gap-1.5 rounded-full p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.06)] backdrop-blur-2xl">
        
        {/* Navigation Tabs */}
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = currentPath === link.to

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-mono font-medium transition-all duration-200 group ${
                isActive
                  ? 'yust-dock-active'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="transition-transform duration-200 group-hover:scale-110">
                <Icon className="w-4 h-4" />
              </span>
              <span className="text-[11px] sm:text-xs tracking-wide">{link.label}</span>
            </Link>
          )
        })}

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

        {/* Slime Mascot Companion Button */}
        <button
          onClick={triggerSlimeBloop}
          type="button"
          aria-label="Pet Blue Slime Mascot Companion"
          title="💧 Slime Mascot Companion (Click to play)"
          className="group flex items-center justify-center rounded-full p-1.5 sm:p-2 text-zinc-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-200 active:scale-95"
        >
          <span className="group-hover:scale-125 group-hover:-translate-y-0.5 transition-transform duration-200 inline-block">
            <MetallicSlime className="w-5 h-5 drop-shadow-[0_0_8px_rgba(6,182,212,0.45)]" />
          </span>
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-0.5" />

        {/* GitHub Auth Section */}
        {user ? (
          <div className="flex items-center gap-2 pl-1 pr-1.5">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              @{user.user_metadata?.user_name || 'iiafosh'}
            </span>
            <button
              onClick={signOut}
              title="Sign Out"
              className="p-1.5 rounded-full text-zinc-400 hover:text-rose-400 hover:bg-white/5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGithub}
            title="Authenticate with GitHub"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all hover:scale-105"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-mono">Auth</span>
          </button>
        )}

      </div>
    </nav>
  )
}
