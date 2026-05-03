import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'View your XP, streaks, badges, and quiz history on MathViz.',
}

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
