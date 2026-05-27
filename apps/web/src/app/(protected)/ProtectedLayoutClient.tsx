'use client'

import { Spinner } from '@/components/ui/Spinner'
import { useProtectedRoute } from '@/features/auth/hooks/useProtectedRoute'

export function ProtectedContentGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useProtectedRoute()

  if (isLoading || !isAuthenticated) {
    return <Spinner className="mx-auto my-24" />
  }

  return children
}
