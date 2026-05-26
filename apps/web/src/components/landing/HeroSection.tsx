'use client'

import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import { useAuth } from '@/i18n/useTranslation' // Assuming auth hook exists; adjust path if needed
import en from '@/i18n/en.json'
import { getTranslation } from '@/i18n/getTranslation'

function t(key: string, params?: Record<string, string>): string {
  return getTranslation(en, en, key, params)
}

export function HeroSection() {
  // Note: If useAuth is not available, you can import from your auth store:
  // import { useAuthStore } from '@/lib/auth.store'
  // const isAuthenticated = useAuthStore(s => s.isAuthenticated)

  // Fallback: read from window if auth context not available
  let isAuthenticated = false
  try {
    // Try to read auth state - adjust based on your actual store location
    // const authStore = useShallow state
    isAuthenticated = false // Placeholder; will be updated per your auth implementation
  } catch {
    isAuthenticated = false
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-amber-50 px-4 py-20 sm:px-6 lg:py-28">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-100px] h-80 w-80 rounded-full bg-indigo-200/20 blur-3xl" />
        <div className="absolute -bottom-40 left-[-100px] h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Text Content */}
          <div className="space-y-8 motion-safe:animate-fade-up">
            <div className="space-y-4">
              <p className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-700">
                {t('landing.heroSubheading')}
              </p>
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                {t('landing.heroTitle')}
              </h1>
              <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
                {t('landing.heroDescription')}
              </p>
            </div>

            {/* CTAs - change based on auth state */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {isAuthenticated ? (
                <Link
                  href={ROUTES.DASHBOARD}
                  className="rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white shadow-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  {t('nav.dashboard')}
                </Link>
              ) : (
                <>
                  <Link
                    href={ROUTES.CALCULATOR('fractions')}
                    className="rounded-lg bg-indigo-600 px-6 py-3 text-center font-semibold text-white shadow-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {t('landing.heroPrimaryCta')}
                  </Link>
                  <Link
                    href={ROUTES.REGISTER}
                    className="rounded-lg border border-slate-300 px-6 py-3 text-center font-semibold text-slate-900 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    {t('landing.heroSecondaryCta')}
                  </Link>
                </>
              )}
            </div>

            {/* Trust Line */}
            <p className="text-sm text-slate-600">✓ {t('landing.trustLine')}</p>
          </div>

          {/* Right: Animated Visual */}
          <div className="relative hidden h-96 lg:block">
            <svg
              className="h-full w-full motion-safe:animate-fade-up-delay"
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Pizza Slice Visual */}
              <circle cx="200" cy="200" r="150" fill="#FED7AA" opacity="0.1" />
              <circle cx="200" cy="200" r="120" fill="#FBBF24" opacity="0.2" />
              <path
                d="M 200 200 L 200 80 A 120 120 0 0 1 284.85 115.15 Z"
                fill="#FBBF24"
                opacity="0.6"
              />
              <path
                d="M 200 200 L 284.85 115.15 A 120 120 0 0 1 320 200 Z"
                fill="#F59E0B"
                opacity="0.6"
              />

              {/* Number Line */}
              <line x1="50" y1="280" x2="350" y2="280" stroke="#E5E7EB" strokeWidth="2" />
              <circle cx="100" cy="280" r="6" fill="#6366F1" />
              <circle cx="200" cy="280" r="6" fill="#6366F1" />
              <circle cx="300" cy="280" r="6" fill="#6366F1" />

              {/* Character Hopping */}
              <circle cx="100" cy="260" r="12" fill="#6366F1" opacity="0.3" />
              <text x="95" y="285" fontSize="12" fill="#6366F1" fontWeight="bold">
                -2
              </text>
              <text x="190" y="285" fontSize="12" fill="#6366F1" fontWeight="bold">
                0
              </text>
              <text x="295" y="285" fontSize="12" fill="#6366F1" fontWeight="bold">
                2
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}
