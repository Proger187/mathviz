'use client'

import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { Spinner } from '@/components/ui/Spinner'
import { ROUTES } from '@/config/routes'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useGuestRoute } from '@/features/auth/hooks/useGuestRoute'
import { useTranslation } from '@/i18n/useTranslation'

export default function LoginPage() {
  const { t } = useTranslation()
  const { isLoading } = useGuestRoute()

  if (isLoading) {
    return <Spinner className="m-auto mt-24" />
  }

  return (
    <>
      <Header />
      <main id="main-content" className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('auth.loginTitle')}</h1>
          <LoginForm />
          <p className="mt-4 text-sm text-gray-500">
            {t('auth.noAccount')}{' '}
            <a href={ROUTES.REGISTER} className="text-indigo-600 hover:underline">
              {t('auth.registerLink')}
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
