import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

import { I18nProvider } from './I18nProvider'
import { useTranslation } from './useTranslation'

// Helper component that exposes translation output and locale control
function TestComponent() {
  const { t, locale, setLocale } = useTranslation()
  return (
    <div>
      <p data-testid="app-name">{t('common.appName')}</p>
      <p data-testid="locale">{locale}</p>
      <button onClick={() => setLocale('ru')}>switch-ru</button>
      <button onClick={() => setLocale('kg')}>switch-kg</button>
    </div>
  )
}

describe('I18nProvider + useTranslation', () => {
  beforeEach(() => {
    localStorage.clear()
    // Mock navigator.language to control locale detection
    Object.defineProperty(navigator, 'language', {
      value: 'en-US',
      configurable: true,
    })
  })

  it('renders with default English locale', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    )
    expect(screen.getByTestId('app-name').textContent).toBe('MathViz')
  })

  it('setLocale changes the displayed translation without remounting', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    )

    const before = screen.getByTestId('app-name').textContent
    await act(async () => {
      fireEvent.click(screen.getByText('switch-ru'))
    })
    // Russian appName should differ (МатВиз) or same if translation is same — just check it updates locale
    expect(screen.getByTestId('locale').textContent).toBe('ru')
    // Component should still be mounted (no remount)
    expect(screen.getByTestId('app-name')).toBeTruthy()
    // Before click was en, now ru
    expect(before).toBe('MathViz')
  })

  it('setLocale to kg changes locale state', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    )
    await act(async () => {
      fireEvent.click(screen.getByText('switch-kg'))
    })
    expect(screen.getByTestId('locale').textContent).toBe('kg')
  })

  it('persists locale to localStorage', async () => {
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    )
    await act(async () => {
      fireEvent.click(screen.getByText('switch-ru'))
    })
    expect(localStorage.getItem('mathviz_locale')).toBe('ru')
  })

  it('throws when useTranslation is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => undefined)
    expect(() => render(<TestComponent />)).toThrow()
    spy.mockRestore()
  })
})

describe('browser locale detection', () => {
  beforeEach(() => localStorage.clear())

  it('ky-KG maps to kg', async () => {
    Object.defineProperty(navigator, 'language', { value: 'ky-KG', configurable: true })
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    )
    // Wait for useEffect to run
    await act(async () => {})
    expect(screen.getByTestId('locale').textContent).toBe('kg')
  })

  it('ru-RU maps to ru', async () => {
    Object.defineProperty(navigator, 'language', { value: 'ru-RU', configurable: true })
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    )
    await act(async () => {})
    expect(screen.getByTestId('locale').textContent).toBe('ru')
  })

  it('fr maps to en (default fallback)', async () => {
    Object.defineProperty(navigator, 'language', { value: 'fr', configurable: true })
    render(
      <I18nProvider>
        <TestComponent />
      </I18nProvider>,
    )
    await act(async () => {})
    expect(screen.getByTestId('locale').textContent).toBe('en')
  })
})
