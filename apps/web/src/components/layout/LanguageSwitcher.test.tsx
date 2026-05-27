import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'

import { I18nProvider } from '@/i18n/I18nProvider'

import { LanguageSwitcher } from './LanguageSwitcher'

function renderSwitcher(variant?: 'pill' | 'compact') {
  return render(
    <I18nProvider>
      <LanguageSwitcher variant={variant} />
    </I18nProvider>,
  )
}

describe('LanguageSwitcher', () => {
  beforeEach(() => localStorage.clear())

  it('renders buttons with native language names', () => {
    renderSwitcher()
    // Native names are always shown regardless of the active locale
    expect(screen.getByText('English')).toBeTruthy()
    expect(screen.getByText('Русский')).toBeTruthy()
    expect(screen.getByText('Кыргызча')).toBeTruthy()
  })

  it('marks the active locale button as pressed', () => {
    renderSwitcher()
    const enBtn = screen.getByText('English').closest('button') as HTMLButtonElement
    expect(enBtn.getAttribute('aria-pressed')).toBe('true')
    const ruBtn = screen.getByText('Русский').closest('button') as HTMLButtonElement
    expect(ruBtn.getAttribute('aria-pressed')).toBe('false')
  })

  it('switching to ru updates aria-pressed state', () => {
    renderSwitcher()
    fireEvent.click(screen.getByText('Русский'))
    const ruBtn = screen.getByText('Русский').closest('button') as HTMLButtonElement
    expect(ruBtn.getAttribute('aria-pressed')).toBe('true')
    const enBtn = screen.getByText('English').closest('button') as HTMLButtonElement
    expect(enBtn.getAttribute('aria-pressed')).toBe('false')
  })

  it('renders compact variant without pill padding', () => {
    const { container } = renderSwitcher('compact')
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('rounded-lg')
    expect(wrapper.className).not.toContain('gap-1')
  })
})
