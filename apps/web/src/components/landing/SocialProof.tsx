'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import en from '@/i18n/en.json'
import { getTranslation } from '@/i18n/getTranslation'

function t(key: string, params?: Record<string, string>): string {
  return getTranslation(en, en, key, params)
}

function CountUpStat({ target, label }: { target: number; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!inView) return

    let current = 0
    const increment = Math.ceil(target / 50)
    const interval = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(interval)
      } else {
        setCount(current)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [inView, target])

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm"
    >
      <p className="text-4xl font-bold text-indigo-600">
        {count.toLocaleString()}
        {target >= 1000 ? '+' : ''}
      </p>
      <p className="text-center text-sm font-medium text-slate-600">{label}</p>
    </div>
  )
}

export function SocialProof() {
  return (
    <section className="bg-slate-100/50 px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {t('landing.proofTitle')}
          </h2>
          <p className="mt-4 text-lg text-slate-600">{t('landing.proofSubtitle')}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <CountUpStat target={50000} label={t('landing.proofXpLabel')} />
          <CountUpStat target={2500} label={t('landing.proofStudentsLabel')} />
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
            <div className="flex gap-3">
              <span className="text-2xl">🇬🇧</span>
              <span className="text-2xl">🇷🇺</span>
              <span className="text-2xl">🇰🇬</span>
            </div>
            <p className="text-center text-sm font-medium text-slate-600">
              {t('landing.proofLanguagesLabel')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
