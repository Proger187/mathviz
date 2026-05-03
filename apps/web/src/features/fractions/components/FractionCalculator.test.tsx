import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import type { FractionProblem } from '@mathviz/shared'

import { I18nProvider } from '@/i18n/I18nProvider'

// Framer-motion animations don't work in jsdom — stub it out
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement> & { children?: React.ReactNode }) => <div {...props}>{children}</div>,
    g: ({ children, ...props }: React.SVGAttributes<SVGGElement> & { children?: React.ReactNode }) => <g {...props}>{children}</g>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAnimation: () => ({ start: vi.fn() }),
  useReducedMotion: () => false,
}))

// Lazy import — the component uses dynamic import in the mode registry
// but here we import it directly for testing

import FractionCalculator from './FractionCalculator'

function renderCalculator(props?: Partial<React.ComponentProps<typeof FractionCalculator>>) {
  return render(
    <I18nProvider>
      <FractionCalculator {...props} />
    </I18nProvider>,
  )
}

describe('FractionCalculator', () => {
  beforeEach(() => localStorage.clear())

  it('renders two pizza SVG elements on mount', () => {
    renderCalculator()
    // PizzaSlice renders SVG elements — check for at least 2 pizza containers
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBeGreaterThanOrEqual(2)
  })

  it('renders calculate button in free-play mode', () => {
    renderCalculator()
    expect(screen.getByRole('button', { name: /calculate/i })).toBeTruthy()
  })

  it('renders reveal button in quiz mode (hideResult=true)', () => {
    const problem: FractionProblem = {
      numeratorA: 1,
      denominatorA: 2,
      numeratorB: 1,
      denominatorB: 3,
      operation: '+',
      expectedNumerator: 5,
      expectedDenominator: 6,
    }
    renderCalculator({ problem, hideResult: true })
    expect(screen.getByRole('button', { name: /reveal/i })).toBeTruthy()
  })

  it('narration region updates when stepping through', () => {
    renderCalculator()
    // Click calculate to populate steps
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }))
    // Step narration live region should exist
    const liveRegion = document.querySelector('[aria-live="polite"]')
    expect(liveRegion).toBeTruthy()
  })

  it('calls onAnswer with fraction string when calculate clicked', () => {
    const onAnswer = vi.fn()
    renderCalculator({ onAnswer })
    fireEvent.click(screen.getByRole('button', { name: /calculate/i }))
    // Default values are 1/2 + 1/3 = 5/6
    expect(onAnswer).toHaveBeenCalledWith('5/6')
  })

  it('quiz mode hides result until reveal is clicked', () => {
    const problem: FractionProblem = {
      numeratorA: 1,
      denominatorA: 2,
      numeratorB: 1,
      denominatorB: 3,
      operation: '+',
      expectedNumerator: 5,
      expectedDenominator: 6,
    }
    const { container } = renderCalculator({ problem, hideResult: true })
    // Should not show the answer text until revealed
    // The reveal placeholder should be visible
    expect(container.textContent).not.toContain('5/6')
  })
})
