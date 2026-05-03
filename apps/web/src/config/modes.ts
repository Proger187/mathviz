import type { ComponentType } from 'react'

import type { CalculatorMode, ModeId } from '@mathviz/shared'

import type { CalculatorProps } from '../features/calculators/types'

type WebCalculatorMode = CalculatorMode<ComponentType<CalculatorProps>>

export const MODES: Record<ModeId, WebCalculatorMode> = {
  fractions: {
    id: 'fractions',
    icon: '🍕',
    component: () => import('../features/fractions/components/FractionCalculator'),
  },
  negative: {
    id: 'negative',
    icon: '↔️',
    component: () => import('../features/negative/components/NegativeNumberCalculator'),
  },
  multiplication: {
    id: 'multiplication',
    icon: '⊞',
    component: () => import('../features/multiplication/components/MultiplicationCalculator'),
  },
  division: {
    id: 'division',
    icon: '➗',
    component: () => import('../features/division/components/DivisionCalculator'),
  },
}
