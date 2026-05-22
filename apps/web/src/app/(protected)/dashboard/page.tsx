'use client'

import Link from 'next/link'

import type { ModeId } from '@mathviz/shared'

import { PageHeader } from '@/components/layout/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { MODES } from '@/config/modes'
import { ROUTES } from '@/config/routes'
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
  const { data: profile, error: profileError, isLoading: profileLoading } = useDashboard()
  const { data: badges, error: badgesError, isLoading: badgesLoading } = useBadges()
  const { data: history, error: historyError, isLoading: historyLoading } = useQuizHistory()

  const isDataLoading = profileLoading || badgesLoading || historyLoading
  const hasError = profileError ?? badgesError ?? historyError

  return (
    <>
      <PageHeader
        title={t('dashboard.title')}
        subtitle={
          profile ? t('dashboard.welcome', { username: profile.username }) : t('dashboard.subtitle')
        }
        icon="📊"
      />

      {isDataLoading && <Spinner className="mx-auto my-16 block" />}

      {!isDataLoading && hasError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
          <p>{t('common.error')}</p>
          <button
            type="button"
            className="mt-3 text-sm font-semibold underline"
            onClick={() => window.location.reload()}
          >
            {t('common.retry')}
          </button>
        </div>
      )}

      {!isDataLoading && !hasError && profile && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6">
              <p className="text-sm font-medium text-slate-500">
                {t('dashboard.levelLabel', { level: String(profile.level) })} — {profile.levelName}
              </p>
              <p className="mt-1 text-3xl font-bold text-indigo-600">{profile.xp} XP</p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
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
                <p className="mt-2 text-xs text-slate-500">
                  {t('dashboard.xpProgress', {
                    current: String(profile.xp),
                    next: String(profile.xpToNextLevel),
                  })}
                </p>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6">
              <p className="text-sm font-medium text-slate-500">
                {t('dashboard.streakLabel', { count: String(profile.streak) })}
              </p>
              <p className="mt-2 text-5xl" aria-hidden>
                🔥
              </p>
              <p className="text-4xl font-bold text-orange-500">{profile.streak}</p>
            </section>
          </div>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">{t('dashboard.quickStart')}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(Object.keys(MODES) as ModeId[]).map((id) => {
                const mode = MODES[id]
                return (
                  <Link
                    key={id}
                    href={ROUTES.CALCULATOR(id)}
                    className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-4 text-center transition hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    <span className="text-3xl">{mode.icon}</span>
                    <span className="text-xs font-semibold leading-tight text-slate-800">
                      {t(`modes.${id}.label`)}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">{t('dashboard.badgesTitle')}</h2>
            {!badges || badges.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">{t('dashboard.noBadgesYet')}</p>
            ) : (
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {badges.map((badge) => (
                  <li
                    key={badge.id}
                    className={`rounded-xl border p-3 text-center ${
                      badge.earnedAt
                        ? 'border-indigo-200 bg-indigo-50'
                        : 'border-slate-100 bg-slate-50 opacity-50'
                    }`}
                  >
                    <p className="text-2xl">{badge.iconUrl ?? '🏅'}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-700">{badge.label}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-card sm:p-6">
            <h2 className="text-lg font-semibold text-slate-900">
              {t('dashboard.recentActivity')}
            </h2>
            {!history || history.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">{t('dashboard.noRecentActivity')}</p>
            ) : (
              <ul className="mt-4 divide-y divide-slate-100">
                {history.map((session) => (
                  <li
                    key={session.id}
                    className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <span className="font-medium text-slate-900">
                        {t(`modes.${session.mode as ModeId}.label`)}
                      </span>
                      <span className="ml-2 text-slate-400">{formatDate(session.completedAt)}</span>
                    </div>
                    <div className="flex gap-4">
                      <span className="text-slate-600">
                        {t('dashboard.score', { score: String(session.score) })}
                      </span>
                      <span className="font-semibold text-indigo-600">
                        {t('dashboard.xpEarned', { xp: String(session.xpEarned) })}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </>
  )
}
