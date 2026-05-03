'use client'

import { clsx } from 'clsx'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Spinner } from '@/components/ui/Spinner'
import { useLeaderboard } from '@/hooks/useLeaderboard'
import { useTranslation } from '@/i18n/useTranslation'
import { useAuthStore } from '@/store/auth.store'


export default function LeaderboardPage() {
  const { t } = useTranslation()
  const { data, error, isLoading } = useLeaderboard()
  const currentUserId = useAuthStore((s) => s.user?.id)

  return (
    <>
      <Header />
      <main id="main-content" className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900">{t('leaderboard.title')}</h1>
        <p className="mt-2 text-gray-500">{t('leaderboard.subtitle')}</p>

        {isLoading && <Spinner className="mt-12 block mx-auto" />}

        {!isLoading && error && (
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

        {!isLoading && !error && (!data || data.length === 0) && (
          <p className="mt-8 text-gray-500">{t('leaderboard.empty')}</p>
        )}

        {!isLoading && !error && data && data.length > 0 && (
          <table className="mt-8 w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="pb-3 pr-4 w-12">{t('leaderboard.rank')}</th>
                <th className="pb-3 pr-4">{t('leaderboard.player')}</th>
                <th className="pb-3 text-right">{t('leaderboard.weeklyXp')}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((entry) => {
                const isCurrentUser = entry.userId === currentUserId
                return (
                  <tr
                    key={entry.userId}
                    className={clsx(
                      'border-b border-gray-100 transition-colors',
                      isCurrentUser
                        ? 'bg-indigo-50 font-semibold'
                        : 'hover:bg-gray-50',
                    )}
                  >
                    <td className="py-3 pr-4 text-gray-500">
                      {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                    </td>
                    <td className="py-3 pr-4 text-gray-900">
                      {entry.username}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs text-indigo-500">({t('leaderboard.you')})</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-mono text-indigo-600">{entry.weeklyXp}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </main>
      <Footer />
    </>
  )
}
