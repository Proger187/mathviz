'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { useAuthStore } from '@/store/auth.store'

import { AppShell } from './AppShell'

/**
 * Lives at the root (inside <Providers>), so it's a single persistent instance
 * shared across every route. This prevents the sidebar from ever remounting
 * during page navigation — it just re-renders in place.
 *
 * Auth/login pages always use the minimal (no-sidebar) variant.
 * Every other page uses `default` (with sidebar) when the user is authenticated,
 * and `minimal` when they're not.
 *
 * Pages that ship their own complete layout (header + footer) opt out entirely
 * by being listed in RAW_PATHS — AppShell is not rendered for those routes.
 */

// These pages have their own full layout (TopNav, LandingFooter, etc.)
// and must not be wrapped by AppShell at all.
const RAW_PATHS = ['/']

// Paths that use AppShell but always in the minimal (no-sidebar) variant
const MINIMAL_PATHS = ['/login', '/register']

export function AppShellProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  // Landing page (and any future full-custom pages) — render bare
  if (RAW_PATHS.includes(pathname)) {
    return <>{children}</>
  }

  const isMinimalPath = MINIMAL_PATHS.some((p) => pathname.startsWith(p))
  const variant = isMinimalPath || !isAuthenticated ? 'minimal' : 'default'

  return <AppShell variant={variant}>{children}</AppShell>
}
