import en from '@/i18n/en.json'
import { getTranslation } from '@/i18n/getTranslation'

function t(key: string, params?: Record<string, string>): string {
  return getTranslation(en, en, key, params)
}

export function HowItWorks() {
  const steps = [
    {
      icon: '🔍',
      titleKey: 'landing.howStep1Title',
      descriptionKey: 'landing.howStep1Description',
    },
    {
      icon: '✏️',
      titleKey: 'landing.howStep2Title',
      descriptionKey: 'landing.howStep2Description',
    },
    {
      icon: '🚀',
      titleKey: 'landing.howStep3Title',
      descriptionKey: 'landing.howStep3Description',
    },
  ]

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">{t('landing.howTitle')}</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Step Number */}
              <div className="absolute -top-3 left-6 inline-block rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white">
                {idx + 1}
              </div>

              {/* Icon */}
              <div className="text-4xl">{step.icon}</div>

              {/* Title */}
              <h3 className="mt-2 text-xl font-semibold text-slate-900">{t(step.titleKey)}</h3>

              {/* Description */}
              <p className="text-slate-600">{t(step.descriptionKey)}</p>

              {/* Connector (hidden on last item) */}
              {idx < steps.length - 1 && (
                <div className="absolute -right-4 top-1/2 hidden w-8 -translate-y-1/2 md:flex items-center justify-center">
                  <div className="h-1 w-full bg-gradient-to-r from-indigo-300 to-transparent" />
                  <div className="absolute right-0 h-3 w-3 rounded-full bg-indigo-300" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
