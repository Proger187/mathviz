import type { Metadata } from 'next'

import { ProtectedContentGuard } from './ProtectedLayoutClient'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your XP, streaks, badges, and quiz history on MathViz.',
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // AppShell lives at the root level (providers.tsx) and persists across navigation.
  // This layout only adds the auth guard — it does not create its own shell.
  return <ProtectedContentGuard>{children}</ProtectedContentGuard>
}
