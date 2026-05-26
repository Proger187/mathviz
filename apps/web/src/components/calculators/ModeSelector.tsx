import Link from 'next/link'
import { MODES } from '@mathviz/shared'
import type { ModeId } from '@mathviz/shared'
import { ROUTES } from '@/config/routes'
import en from '@/i18n/en.json'
import { getTranslation } from '@/i18n/getTranslation'

function t(key: string): string {
  return getTranslation(en, en, key)
}

interface ModeSelectorProps {
  activeModeId: ModeId
}

export function ModeSelector({ activeModeId }: ModeSelectorProps) {
  const modes = Object.entries(MODES) as Array<[ModeId, { icon: string }]>

  return (
    <div className="mb-8">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {t('nav.sectionCalculators')}
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {modes.map(([modeId, mode]) => {
          const isActive = modeId === activeModeId
          return (
            <Link
              key={modeId}
              href={ROUTES.CALCULATOR(modeId)}
              className={`group relative overflow-hidden rounded-xl border-2 p-4 transition-all ${
                isActive
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/30'
              }`}
            >
              <div className="flex flex-col items-start gap-2">
                <span className="text-3xl">{mode.icon}</span>
                <div>
                  <p className={`font-semibold ${isActive ? 'text-indigo-900' : 'text-slate-900'}`}>
                    {t(`modes.${modeId}.label`)}
                  </p>
                  <p className="mt-1 text-xs text-slate-600">{t(`modes.${modeId}.shortHint`)}</p>
                </div>
              </div>
              {isActive && (
                <div className="absolute inset-0 border-2 border-indigo-600 rounded-xl" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
