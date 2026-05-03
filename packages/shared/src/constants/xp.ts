export const BASE_XP = 10

export const CORRECTNESS_MULTIPLIER = {
  correctFirstTry: 1.0,
  correctAfterHint: 0.5,
  wrong: 0.0,
} as const

export type CorrectnessKey = keyof typeof CORRECTNESS_MULTIPLIER

export const SPEED_BONUS_THRESHOLDS = [
  { maxRatio: 0.25, multiplier: 1.5 },
  { maxRatio: 0.5, multiplier: 1.2 },
  { maxRatio: 0.75, multiplier: 1.0 },
  { maxRatio: Infinity, multiplier: 0.8 },
] as const

/**
 * Returns the XP threshold required to reach level n.
 * level_threshold(n) = 100 * n^1.5
 */
export function levelThreshold(n: number): number {
  return Math.round(100 * Math.pow(n, 1.5))
}
