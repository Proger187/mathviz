import type { Metadata } from 'next'

import { AuthLayoutClient } from './AuthLayoutClient'

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Log in or create an account to track your progress on MathViz.',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayoutClient>{children}</AuthLayoutClient>
}
