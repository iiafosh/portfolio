import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { SiteShell } from '@/components/layout/SiteShell'
import { HomePage } from '@/pages/HomePage'
import { ResumePage } from '@/pages/ResumePage'
import { NotFound } from '@/pages/NotFound'

const rootRoute = createRootRoute({
  component: () => (
    <SiteShell>
      <Outlet />
    </SiteShell>
  ),
  notFoundComponent: NotFound,
})

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: HomePage })
const resumeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/resume', component: ResumePage })

const routeTree = rootRoute.addChildren([homeRoute, resumeRoute])

export const router = createRouter({ routeTree, defaultNotFoundComponent: NotFound })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
