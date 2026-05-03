'use client'

import Link from 'next/link'

import type { ModeId } from '@mathviz/shared'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Spinner } from '@/components/ui/Spinner'
import { MODES } from '@/config/modes'
import { ROUTES } from '@/config/routes'
import { useProtectedRoute } from '@/features/auth/hooks/useProtectedRoute'
import { useBadges } from '@/hooks/useBadges'
import { useDashboard } from '@/hooks/useDashboard'
import { useQuizHistory } from '@/hooks/useQuizHistory'
import { useTranslation } from '@/i18n/useTranslation'



const LEVEL_XP_MAX: Record<number, number | null> = {
  1: 100,
  2: 300,
  3: 700,
  4: 1500,
  5: null,
}

function xpBarWidth(xp: number, level: number): string {
  const max = LEVEL_XP_MAX[level]
  if (max === null || max === undefined) return '100'
  const prev = LEVEL_XP_MAX[level - 1] ?? 0
  const range = max - prev
  const progress = xp - prev
  const pct = Math.min(100, Math.max(0, Math.round((progress / range) * 100)))
  return String(pct)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading: authLoading } = useProtectedRoute()
  const { data: profile, error: profileError, isLoading: profileLoading } = useDashboard()
  const { data: badges, error: badgesError, isLoading: badgesLoading } = useBadges()
  const { data: history, error: historyError, isLoading: historyLoading } = useQuizHistory()

  if (authLoading || !isAuthenticated) {
    return <Spinner className="m-auto mt-24" />
  }

  const isDataLoading = profileLoading || badgesLoading || historyLoading
  const hasError = profileError ?? badgesError ?? historyError

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.title')}</h1>

        {isDataLoading && <Spinner className="mt-12 block mx-auto" />}

        {!isDataLoading && hasError && (
          <div className="mt-8 rounded-md bg-red-50 p-4 text-red-700">
            <p>{t('common.error')}</p>
            <button
              className="mt-2 text-sm underline"
              onClick={() => window.location.reload()}
            >
              {t('common.retry')}
            </button>
          </div>
        )}

        {!isDataLoading && !hasError && profile && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {/* Level + XP card */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">
                {t('dashboard.levelLabel', { level: String(profile.level) })}
                {' '}— {profile.levelName}
              </p>
              <p className="mt-1 text-2xl font-bold text-indigo-600">{profile.xp} XP</p>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all"
                  style={{ width: `${xpBarWidth(profile.xp, profile.level)}%` }}
                  role="progressbar"
                  aria-valuenow={profile.xp}
                  aria-valuemin={0}
                  aria-valuemax={profile.xpToNextLevel ?? profile.xp}
                />
              </div>
              {profile.xpToNextLevel !== null && (
                <p className="mt-1 text-xs text-gray-400">
                  {t('dashboard.xpProgress', {
                    current: String(profile.xp),
                    next: String(profile.xpToNextLevel),
                  })}
                </p>
              )}
            </section>

            {/* Streak card */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500">{t('dashboard.streakLabel', { count: String(profile.streak) })}</p>
              <p className="mt-1 text-5xl">🔥</p>
              <p className="mt-2 text-4xl font-bold text-orange-500">{profile.streak}</p>
            </section>

            {/* Badges */}
            <section className="col-span-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.badgesTitle')}</h2>
              {!badges || badges.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">{t('dashboard.noBadgesYet')}</p>
              ) : (
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {badges.map((badge) => (
                    <li
                      key={badge.id}
                      className={`rounded-lg border p-3 text-center transition-opacity ${
                        badge.earnedAt ? 'border-indigo-200 bg-indigo-50' : 'border-gray-100 bg-gray-50 opacity-40'
                      }`}
                    >
                      <p className="text-2xl">{badge.iconUrl ?? '🏅'}</p>
                      <p className="mt-1 text-xs font-semibold text-gray-700">{badge.label}</p>
                      {badge.earnedAt && (
                        <p className="mt-0.5 text-xs text-gray-400">{formatDate(badge.earnedAt)}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Recent quiz history */}
            <section className="col-span-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.recentActivity')}</h2>
              {!history || history.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">{t('dashboard.noRecentActivity')}</p>
              ) : (
                <ul className="mt-4 divide-y divide-gray-100">
                  {history.map((session) => (
                    <li key={session.id} className="flex items-center justify-between py-3 text-sm">
                      <div>
                        <span className="font-medium capitalize">{session.mode}</span>
                        <span className="ml-2 text-gray-400">{formatDate(session.completedAt)}</span>
                      </div>
                      <div className="flex gap-4 text-right">
                        <span className="text-gray-600">{t('dashboard.score', { score: String(session.score) })}</span>
                        <span className="font-semibold text-indigo-600">{t('dashboard.xpEarned', { xp: String(session.xpEarned) })}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Quick start */}
            <section className="col-span-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.quickStart')}</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {(Object.keys(MODES) as ModeId[]).map((id) => {
                  const mode = MODES[id]
                  return (
                    <Link
                      key={id}
                      href={`${ROUTES.HOME}?mode=${id}`}
                      className="flex flex-col items-center gap-1 rounded-lg border border-gray-200 p-4 text-center hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                    >
                      <span className="text-3xl">{mode.icon}</span>
                      <span className="text-sm font-medium capitalize text-gray-700">{id}</span>
                    </Link>
                  )
                })}
              </div>
            </section>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
