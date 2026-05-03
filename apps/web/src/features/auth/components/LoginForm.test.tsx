import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { LoginForm } from '@/features/auth/components/LoginForm'
import { I18nProvider } from '@/i18n/I18nProvider'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

// Mock Zustand store
vi.mock('@/store/auth.store', () => ({
  useAuthStore: (selector: (s: { signIn: () => void }) => unknown) =>
    selector({ signIn: vi.fn() }),
}))

// Global fetch mock
const mockFetch = vi.fn()
global.fetch = mockFetch

function renderForm() {
  return render(
    <I18nProvider>
      <LoginForm />
    </I18nProvider>,
  )
}

describe('LoginForm', () => {
  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('renders email, password inputs and submit button', () => {
    renderForm()
    expect(screen.getByLabelText(/email/i)).toBeTruthy()
    expect(screen.getByLabelText(/password/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /log in/i })).toBeTruthy()
  })

  it('submits the correct payload to /api/v1/auth/login', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { id: '1', email: 'a@b.com', username: 'alice', xp: 0, level: 1, streak: 0 },
        accessToken: 'tok',
      }),
    })

    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'password1')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => expect(mockFetch).toHaveBeenCalledOnce())
    const [, opts] = mockFetch.mock.calls[0] as [string, RequestInit]
    const body = JSON.parse(opts.body as string) as Record<string, unknown>
    expect(body.email).toBe('a@b.com')
    expect(body.password).toBe('password1')
  })

  it('displays translated error message on AUTH_INVALID_CREDENTIALS', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ code: 'AUTH_INVALID_CREDENTIALS', message: 'Incorrect email or password' }),
    })

    const user = userEvent.setup()
    renderForm()

    await user.type(screen.getByLabelText(/email/i), 'a@b.com')
    await user.type(screen.getByLabelText(/password/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toMatch(/incorrect email or password/i),
    )
  })
})
