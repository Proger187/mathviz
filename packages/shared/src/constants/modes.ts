export const MODES = {
  fractions: {
    id: 'fractions' as const,
    icon: '🍕',
  },
  negative: {
    id: 'negative' as const,
    icon: '↔️',
  },
  multiplication: {
    id: 'multiplication' as const,
    icon: '⊞',
  },
  division: {
    id: 'division' as const,
    icon: '➗',
  },
} as const

export type ModeId = (typeof MODES)[keyof typeof MODES]['id']
