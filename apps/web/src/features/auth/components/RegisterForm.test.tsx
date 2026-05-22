import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { I18nProvider } from '@/i18n/I18nProvider'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
}))

vi.mock('@/store/auth.store', () => ({
  useAuthStore: (selector: (s: { signIn: () => void }) => unknown) => selector({ signIn: vi.fn() }),
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

function renderForm() {
  return render(
    <I18nProvider>
      <RegisterForm />
    </I18nProvider>,
  )
}

describe('RegisterForm', () => {
  beforeEach(() => mockFetch.mockReset())

  it('renders email, username, password fields and submit button', () => {
    renderForm()
    expect(screen.getByLabelText(/email/i)).toBeTruthy()
    expect(screen.getByLabelText(/display name/i)).toBeTruthy()
    expect(screen.getByLabelText(/password/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /create account/i })).toBeTruthy()
  })

  it('submits registration + auto-login on valid input', async () => {
    const user = { id: '1', email: 'a@b.com', username: 'alice', xp: 0, level: 1, streak: 0 }
    // First call: register, second: login
    mockFetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ user }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ user, accessToken: 'tok' }),
      })

    const ua = userEvent.setup()
    renderForm()

    await ua.type(screen.getByLabelText(/email/i), 'a@b.com')
    await ua.type(screen.getByLabelText(/display name/i), 'alice')
    await ua.type(screen.getByLabelText(/password/i), 'password1')
    await ua.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2))
    const registerBody = JSON.parse(
      (mockFetch.mock.calls[0] as [string, RequestInit])[1].body as string,
    ) as Record<string, unknown>
    expect(registerBody.email).toBe('a@b.com')
    expect(registerBody.username).toBe('alice')
  })

  it('shows error when registration fails with AUTH_EMAIL_TAKEN', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 409,
      statusText: 'Conflict',
      json: async () => ({ code: 'AUTH_EMAIL_TAKEN', message: 'Email already registered' }),
    })

    const ua = userEvent.setup()
    renderForm()

    await ua.type(screen.getByLabelText(/email/i), 'taken@b.com')
    await ua.type(screen.getByLabelText(/display name/i), 'bob')
    await ua.type(screen.getByLabelText(/password/i), 'password1')
    await ua.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toMatch(
        /this email address is already registered/i,
      ),
    )
  })
})
