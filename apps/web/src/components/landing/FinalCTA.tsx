import Link from 'next/link'

import { ROUTES } from '@/config/routes'
import { useTranslation } from '@/i18n/useTranslation'

export function FinalCTA() {
  const { t } = useTranslation()
  return (
    <section className="px-4 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
          {t('landing.finalCtaTitle')}
        </h2>
        <p className="mt-6 text-lg text-slate-600">{t('landing.finalCtaDescription')}</p>
        <Link
          href={ROUTES.REGISTER}
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          {t('landing.finalCtaButton')}
        </Link>
      </div>
    </section>
  )
}
