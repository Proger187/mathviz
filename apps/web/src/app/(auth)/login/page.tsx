'use client'

import Link from 'next/link'

import { AuthCard } from '@/components/layout/AuthCard'
import { ROUTES } from '@/config/routes'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useTranslation } from '@/i18n/useTranslation'

export default function LoginPage() {
  const { t } = useTranslation()

  return (
    <AuthCard
      title={t('auth.loginTitle')}
      subtitle={t('auth.loginSubtitle')}
      footer={
        <>
          {t('auth.noAccount')}{' '}
          <Link href={ROUTES.REGISTER} className="font-semibold text-indigo-600 hover:underline">
            {t('auth.registerLink')}
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthCard>
  )
}
