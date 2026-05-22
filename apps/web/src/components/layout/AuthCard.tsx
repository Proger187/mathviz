'use client'

import type { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center py-8">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-lg shadow-slate-200/50 sm:p-8">
        <div className="mb-6 text-center sm:text-left">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl sm:mx-0">
            📐
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm leading-relaxed text-slate-600">{subtitle}</p>}
        </div>
        {children}
        {footer && (
          <div className="mt-6 border-t border-slate-100 pt-4 text-center text-sm text-slate-600">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
