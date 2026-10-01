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

// Root layout with exact yust.dev style floating dock, noise texture, and focused container
const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#0c0c0c] text-zinc-300 font-sans antialiased relative selection:bg-white/10 selection:text-white flex flex-col justify-between">
      
      {/* Background noise texture */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.015]">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* yust.dev Floating Pill Dock */}
      <Dock />

      {/* Main Page Container */}
      <main className="relative z-10 w-full max-w-2xl mx-auto px-4 pt-8 sm:pt-28 pb-24 sm:pb-16 flex-1">
        <Outlet />
      </main>

      {/* Minimalist yust.dev style footer */}
      <footer className="relative z-10 w-full max-w-2xl mx-auto px-4 pb-8 pt-4 text-center text-xs text-zinc-600 font-mono flex items-center justify-between border-t border-white/5">
        <span>Mostafa Shabara &bull; HUE</span>
        <span>&copy; {new Date().getFullYear()}</span>
      </footer>

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
