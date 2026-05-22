'use client'

import { AppShell } from '@/components/layout/AppShell'
import { Spinner } from '@/components/ui/Spinner'
import { useGuestRoute } from '@/features/auth/hooks/useGuestRoute'

export function AuthLayoutClient({ children }: { children: React.ReactNode }) {
  const { isLoading } = useGuestRoute()

  if (isLoading) {
    return (
      <AppShell variant="minimal">
        <Spinner className="mx-auto my-24" />
      </AppShell>
    )
  }

  return <AppShell variant="minimal">{children}</AppShell>
}
