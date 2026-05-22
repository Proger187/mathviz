'use client'

import Link from 'next/link'

import { AuthCard } from '@/components/layout/AuthCard'
import { ROUTES } from '@/config/routes'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { useTranslation } from '@/i18n/useTranslation'

export default function RegisterPage() {
  const { t } = useTranslation()

  return (
    <AuthCard
      title={t('auth.registerTitle')}
      subtitle={t('auth.registerSubtitle')}
      footer={
        <>
          {t('auth.alreadyHaveAccount')}{' '}
          <Link href={ROUTES.LOGIN} className="font-semibold text-indigo-600 hover:underline">
            {t('auth.loginLink')}
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthCard>
  )
}
