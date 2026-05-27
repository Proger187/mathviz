'use client'

import type { ReactNode } from 'react'

import { AppShellProvider } from '@/components/layout/AppShellProvider'
import { I18nProvider } from '@/i18n/I18nProvider'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      {/* Single AppShell instance for the whole app — never remounts on nav */}
      <AppShellProvider>{children}</AppShellProvider>
    </I18nProvider>
  )
}
