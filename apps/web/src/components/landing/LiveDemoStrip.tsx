'use client'

import { useTranslation } from '@/i18n/useTranslation'

import { FractionDemoWidget } from './calculators/FractionDemoWidget'
import { MultiplicationDemoWidget } from './calculators/MultiplicationDemoWidget'
import { NegativeDemoWidget } from './calculators/NegativeDemoWidget'

export function LiveDemoStrip() {
  const { t } = useTranslation()
  return (
    <section className="border-t border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold text-indigo-600">{t('landing.demoCaption')}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            {t('landing.demoTitle')}
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Fractions Widget */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-slate-900">{t('landing.demoFractions')}</h3>
            <FractionDemoWidget />
          </div>

          {/* Negative Numbers Widget */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-slate-900">{t('landing.demoNegative')}</h3>
            <NegativeDemoWidget />
          </div>

          {/* Multiplication Widget */}
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <h3 className="font-semibold text-slate-900">{t('landing.demoMultiplication')}</h3>
            <MultiplicationDemoWidget />
          </div>
        </div>
      </div>
    </section>
  )
}
