import Link from 'next/link'
import { ROUTES } from '@/config/routes'
import en from '@/i18n/en.json'
import { getTranslation } from '@/i18n/getTranslation'

function t(key: string, params?: Record<string, string>): string {
  return getTranslation(en, en, key, params)
}

export function LandingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                ∑
              </span>
              <span>AiMath</span>
            </div>
            <p className="mt-2 text-sm text-slate-600">{t('landing.footerTagline')}</p>
          </div>

          {/* Learn Links */}
          <div>
            <h3 className="font-semibold text-slate-900">{t('landing.footerLearnTitle')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  href={ROUTES.CALCULATOR('fractions')}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  {t('landing.footerFractions')}
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CALCULATOR('negative')}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  {t('landing.footerNegative')}
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CALCULATOR('multiplication')}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  {t('landing.footerMultiplication')}
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.CALCULATOR('division')}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  {t('landing.footerDivision')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-semibold text-slate-900">{t('landing.footerAccountTitle')}</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href={ROUTES.LOGIN} className="text-sm text-slate-600 hover:text-slate-900">
                  {t('nav.login')}
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.REGISTER}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  {t('nav.register')}
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.LEADERBOARD}
                  className="text-sm text-slate-600 hover:text-slate-900"
                >
                  {t('nav.leaderboard')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 pt-8">
          <p className="text-center text-sm text-slate-600">
            © {year} AiMath — {t('landing.footerCopyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}
