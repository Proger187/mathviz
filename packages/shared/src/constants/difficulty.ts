export const DIFFICULTY = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
} as const

export type Difficulty = (typeof DIFFICULTY)[keyof typeof DIFFICULTY]
