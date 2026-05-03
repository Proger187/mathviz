'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth.store'

/**
 * Call at the top of login/register pages.
 * Redirects already-authenticated users away to /dashboard.
 */
export function useGuestRoute() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(ROUTES.DASHBOARD)
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}
