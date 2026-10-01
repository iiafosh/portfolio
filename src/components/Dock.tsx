import React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import {
  User,
  FolderGit2,
  Trophy,
  Award,
  Database,
  LogOut
} from 'lucide-react'
import { GithubIcon } from '@/components/icons/GithubIcon'

export const Dock: React.FC = () => {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname
  const { user, signInWithGithub, signOut } = useAuth()

  const navLinks = [
    { to: '/', label: 'About', icon: User },
    { to: '/projects', label: 'Projects', icon: FolderGit2 },
    { to: '/hacks', label: 'Hacks', icon: Trophy },
    { to: '/certs', label: 'Certs', icon: Award },
    { to: '/database', label: 'DB', icon: Database },
  ]

  return (
    <nav className="fixed bottom-4 sm:bottom-auto sm:top-8 left-1/2 -translate-x-1/2 z-50 w-max max-w-[calc(100vw-1.5rem)]">
      <div className="yust-dock flex items-center gap-1 sm:gap-1.5 rounded-full p-1.5 shadow-2xl">
        
        {/* Navigation Tabs */}
        {navLinks.map((link) => {
          const Icon = link.icon
          const isActive = currentPath === link.to

          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-medium transition-all duration-200 group ${
                isActive
                  ? 'yust-dock-active'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
                isActive ? 'text-white' : 'text-zinc-400'
              }`} />
              <span className="text-[11px] sm:text-xs tracking-wide">{link.label}</span>
            </Link>
          )
        })}

        <div className="w-[1px] h-5 bg-white/10 mx-1" />

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
            <span className="hidden sm:inline text-[11px]">Auth</span>
          </button>
        )}

      </div>
    </nav>
  )
}
