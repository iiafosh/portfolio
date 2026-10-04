import React, { Suspense, lazy } from 'react'
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { SiteShell } from '@/components/layout/SiteShell'
import { HomePage } from '@/pages/HomePage'
import { ResumePage } from '@/pages/ResumePage'
import { AuthCallback } from '@/pages/AuthCallback'
import { NotFound } from '@/pages/NotFound'

const rootRoute = createRootRoute({
  component: () => (
    <SiteShell>
      <Outlet />
    </SiteShell>
  ),
  notFoundComponent: NotFound,
})

// The owner-only editor is loaded on demand so visitors don't download it.
const AdminPage = lazy(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })))
const LazyAdmin: React.FC = () => (
  <Suspense fallback={<p className="py-24 text-center font-mono text-sm text-fg-muted">Loading editor…</p>}>
    <AdminPage />
  </Suspense>
)

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage })
const resumeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/resume', component: ResumePage })
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: LazyAdmin })
const authCallbackRoute = createRoute({ getParentRoute: () => rootRoute, path: '/auth/callback', component: AuthCallback })

const routeTree = rootRoute.addChildren([homeRoute, resumeRoute, adminRoute, authCallbackRoute])

export const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
