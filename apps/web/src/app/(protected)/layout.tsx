import type { Metadata } from 'next'

import { AppShell } from '@/components/layout/AppShell'
import { ProtectedContentGuard } from './ProtectedLayoutClient'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your XP, streaks, badges, and quiz history on MathViz.',
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <ProtectedContentGuard>{children}</ProtectedContentGuard>
    </AppShell>
  )
}
