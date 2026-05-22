'use client'

import { clsx } from 'clsx'

import { PageHeader } from '@/components/layout/PageHeader'
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
      <PageHeader title={t('leaderboard.title')} subtitle={t('leaderboard.subtitle')} icon="🏆" />

      {isLoading && <Spinner className="mx-auto my-16 block" />}

      {!isLoading && error && (
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

      {!isLoading && !error && (!data || data.length === 0) && (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-slate-500">
          {t('leaderboard.empty')}
        </p>
      )}

      {!isLoading && !error && data && data.length > 0 && (
        <>
          <div className="space-y-3 md:hidden">
            {data.map((entry) => {
              const isCurrentUser = entry.userId === currentUserId
              return (
                <article
                  key={entry.userId}
                  className={clsx(
                    'flex items-center gap-4 rounded-2xl border p-4 shadow-card',
                    isCurrentUser
                      ? 'border-indigo-200 bg-indigo-50'
                      : 'border-slate-200/80 bg-white',
                  )}
                >
                  <span className="w-10 text-center text-xl font-bold text-slate-500">
                    {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900">
                      {entry.username}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs font-medium text-indigo-600">
                          ({t('leaderboard.you')})
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">{t('leaderboard.weeklyXp')}</p>
                  </div>
                  <p className="font-mono text-lg font-bold text-indigo-600">{entry.weeklyXp}</p>
                </article>
              )
            })}
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-card md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4 w-16">{t('leaderboard.rank')}</th>
                  <th className="px-5 py-4">{t('leaderboard.player')}</th>
                  <th className="px-5 py-4 text-right">{t('leaderboard.weeklyXp')}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry) => {
                  const isCurrentUser = entry.userId === currentUserId
                  return (
                    <tr
                      key={entry.userId}
                      className={clsx(
                        'border-b border-slate-50',
                        isCurrentUser ? 'bg-indigo-50 font-semibold' : 'hover:bg-slate-50',
                      )}
                    >
                      <td className="px-5 py-4 text-slate-500">
                        {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                      </td>
                      <td className="px-5 py-4 text-slate-900">
                        {entry.username}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-indigo-600">
                            ({t('leaderboard.you')})
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-indigo-600">
                        {entry.weeklyXp}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
