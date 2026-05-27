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
 */

// Paths that never show the sidebar, regardless of auth state
const MINIMAL_PATHS = ['/login', '/register']

export function AppShellProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const isMinimalPath = MINIMAL_PATHS.some((p) => pathname.startsWith(p))
  const variant = isMinimalPath || !isAuthenticated ? 'minimal' : 'default'

  return <AppShell variant={variant}>{children}</AppShell>
}
