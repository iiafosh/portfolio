import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router'
import { Dock } from '@/components/Dock'
import { AboutPage } from '@/pages/AboutPage'
import { ProjectsPage } from '@/pages/ProjectsPage'
import { HacksPage } from '@/pages/HacksPage'
import { CertsPage } from '@/pages/CertsPage'
import { DatabasePage } from '@/pages/DatabasePage'
import { AuthCallback } from '@/pages/AuthCallback'
import { NotFound } from '@/pages/NotFound'

import { StatusFooter } from '@/components/StatusFooter'

import { SlimeMascot } from '@/components/SlimeMascot'

// Root layout with exact yust.dev style floating dock, ambient glows, noise texture, and focused container
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#07080e] text-zinc-300 font-sans antialiased relative selection:bg-cyan-500/20 selection:text-cyan-200 flex flex-col justify-between overflow-x-hidden">
      
      {/* Interactive Blue Slime Cursor Mascot */}
      <SlimeMascot />

      {/* Ambient chromatic light spotlights */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Top-center electric cyan spotlight */}
        <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/15 blur-[130px] rounded-full pointer-events-none" />
        {/* Top-right cyber violet spotlight */}
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/12 blur-[150px] rounded-full pointer-events-none" />
        {/* Mid-left neon emerald spotlight */}
        <div className="absolute top-[45%] left-[-15%] w-[450px] h-[450px] bg-emerald-500/10 blur-[140px] rounded-full pointer-events-none" />
        {/* Bottom-right amber warm glow */}
        <div className="absolute bottom-[5%] right-[-5%] w-[400px] h-[400px] bg-amber-500/8 blur-[140px] rounded-full pointer-events-none" />
      </div>

      {/* Cyber Grid Pattern Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_75%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Background noise texture */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.025]">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Floating Metallic Pill Dock */}
      <Dock />

      {/* Main Page Container */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-28 pb-20 flex-1">
        <Outlet />
        <StatusFooter />
      </main>

    </div>
  ),
  notFoundComponent: NotFound,
})

// Route: About (Home)
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AboutPage,
})

// Route: Projects
const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: ProjectsPage,
})

// Route: Hacks
const hacksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hacks',
  component: HacksPage,
})

// Route: Certs
const certsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/certs',
  component: CertsPage,
})

// Route: Database Playground
const databaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/database',
  component: DatabasePage,
})

// Route: Auth Callback
const authCallbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/auth/callback',
  component: AuthCallback,
})

// Build Route Tree
const routeTree = rootRoute.addChildren([
  aboutRoute,
  projectsRoute,
  hacksRoute,
  certsRoute,
  databaseRoute,
  authCallbackRoute,
])

// Create TanStack Router
export const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,
})

// Register type-safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
