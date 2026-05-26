'use client'

import { useEffect, useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { useAuthStore } from '@/store/auth.store'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isAuthLoading = useAuthStore((s) => s.isLoading)

  useEffect(() => {
    setIsLoading(isAuthLoading)
  }, [isAuthLoading])

  // While checking auth state, show minimal layout
  if (isLoading) {
    return <AppShell variant="minimal">{children}</AppShell>
  }

  // Guests see minimal layout (no sidebar), authenticated users see full sidebar
  return <AppShell variant={isAuthenticated ? 'default' : 'minimal'}>{children}</AppShell>
}
