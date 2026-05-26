'use client'

import Link from 'next/link'
import type { ModeId } from '@mathviz/shared'
import { ROUTES } from '@/config/routes'
import { useAuthStore } from '@/store/auth.store'
import { useTranslation } from '@/i18n/useTranslation'

interface QuizButtonClientProps {
  modeId: ModeId
}

export function QuizButtonClient({ modeId }: QuizButtonClientProps) {
  const { t } = useTranslation()
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  if (isAuthenticated) {
    return (
      <div className="mb-4 flex justify-end sm:mb-6">
        <Link
          href={ROUTES.QUIZ(modeId)}
          className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {t('quiz.start')} →
        </Link>
      </div>
    )
  }

  // For guests, show signup button with quiz context
  return (
    <div className="mb-4 flex justify-end sm:mb-6">
      <Link
        href={ROUTES.REGISTER}
        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        {t('quiz.signupToUnlock')} →
      </Link>
    </div>
  )
}
