'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth.store'

/**
 * Call at the top of every protected page.
 * Redirects unauthenticated users to /login.
 */
export function useProtectedRoute() {
  const router = useRouter()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.LOGIN)
    }
  }, [isAuthenticated, isLoading, router])

  return { isAuthenticated, isLoading }
}
