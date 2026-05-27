'use client'

import { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Spinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/store/auth.store'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isAuthLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During auth check, show minimal layout with spinner
  if (!mounted || isAuthLoading) {
    return (
      <AppShell variant="minimal">
        <Spinner className="mx-auto my-24" />
      </AppShell>
    )
  }

  // Authenticated users see full sidebar, guests see minimal layout
  return <AppShell variant={isAuthenticated ? 'default' : 'minimal'}>{children}</AppShell>
}
