'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ROUTES } from '@/config/routes'
import { useTranslation } from '@/i18n/useTranslation'
import { apiFetch, ApiResponseError } from '@/lib/api-client'
import { useAuthStore } from '@/store/auth.store'
import type { User } from '@/store/auth.store'

interface RegisterResponse {
  user: User
}

interface LoginResponse {
  user: User
  accessToken: string
}

export function RegisterForm() {
  const { t } = useTranslation()
  const router = useRouter()
  const signIn = useAuthStore((s) => s.signIn)

  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | undefined>()
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(undefined)
    setIsLoading(true)

    try {
      await apiFetch<RegisterResponse>('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, username, password }),
      })

      // Auto-login after registration
      const loginData = await apiFetch<LoginResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      signIn(loginData.user, loginData.accessToken)
      // Keep isLoading = true: button stays spinning during navigation.
      // Component unmounts when navigation completes, so no reset needed.
      router.push(ROUTES.DASHBOARD)
    } catch (err) {
      if (err instanceof ApiResponseError) {
        setError(t(`errors.${err.code}`))
      } else {
        setError(t('errors.INTERNAL_ERROR'))
      }
      // Only stop loading on failure
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <Input
        id="register-email"
        label={t('auth.email')}
        type="email"
        autoComplete="email"
        placeholder={t('auth.emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        id="register-username"
        label={t('auth.username')}
        type="text"
        autoComplete="username"
        placeholder={t('auth.usernamePlaceholder')}
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        id="register-password"
        label={t('auth.password')}
        type="password"
        autoComplete="new-password"
        placeholder={t('auth.passwordPlaceholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" isLoading={isLoading} className="w-full">
        {t('auth.registerButton')}
      </Button>
    </form>
  )
}
