import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'

import { I18nProvider } from '@/i18n/I18nProvider'

import { LanguageSwitcher } from './LanguageSwitcher'


function renderSwitcher() {
  return render(
    <I18nProvider>
      <LanguageSwitcher />
    </I18nProvider>,
  )
}

describe('LanguageSwitcher', () => {
  beforeEach(() => localStorage.clear())

  it('renders buttons for en, ru, kg', () => {
    renderSwitcher()
    expect(screen.getByText('EN')).toBeTruthy()
    expect(screen.getByText('RU')).toBeTruthy()
    expect(screen.getByText('КЫР')).toBeTruthy()
  })

  it('marks the active locale button as pressed', () => {
    renderSwitcher()
    const enBtn = screen.getByText('EN').closest('button') as HTMLButtonElement
    expect(enBtn.getAttribute('aria-pressed')).toBe('true')
    const ruBtn = screen.getByText('RU').closest('button') as HTMLButtonElement
    expect(ruBtn.getAttribute('aria-pressed')).toBe('false')
  })

  it('switching to ru updates aria-pressed state', () => {
    renderSwitcher()
    fireEvent.click(screen.getByText('RU'))
    const ruBtn = screen.getByText('RU').closest('button') as HTMLButtonElement
    expect(ruBtn.getAttribute('aria-pressed')).toBe('true')
    const enBtn = screen.getByText('EN').closest('button') as HTMLButtonElement
    expect(enBtn.getAttribute('aria-pressed')).toBe('false')
  })
})
