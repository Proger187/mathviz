'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Spinner } from '@/components/ui/Spinner'
import { useProtectedRoute } from '@/features/auth/hooks/useProtectedRoute'

export function ProtectedLayoutClient({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useProtectedRoute()

  if (isLoading || !isAuthenticated) {
    return (
      <AppShell variant="minimal">
        <Spinner className="mx-auto my-24" />
      </AppShell>
    )
  }

  return <AppShell>{children}</AppShell>
}
