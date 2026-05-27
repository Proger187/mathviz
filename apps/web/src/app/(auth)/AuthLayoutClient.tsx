'use client'

import { useGuestRoute } from '@/features/auth/hooks/useGuestRoute'

// AppShell lives at the root level (providers.tsx).
// This component only runs the guest-route guard (redirect if already logged in).
export function AuthLayoutClient({ children }: { children: React.ReactNode }) {
  useGuestRoute()
  return <>{children}</>
}
