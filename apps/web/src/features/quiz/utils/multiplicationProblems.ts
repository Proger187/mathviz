import type { Difficulty, MultiplicationProblem } from '@mathviz/shared'

// Linear Congruential Generator constants (Numerical Recipes)
const LCG_A = 1664525
const LCG_C = 1013904223
const LCG_M = 2 ** 32

function lcgNext(seed: number): number {
  return (LCG_A * seed + LCG_C) % LCG_M
}

function randInt(
  min: number,
  max: number,
  seed: number,
): [value: number, nextSeed: number] {
  const next = lcgNext(seed)
  const value = min + (next % (max - min + 1))
  return [value, next]
}

/**
 * Generate a deterministic MultiplicationProblem for the given difficulty and seed.
 *
 * Easy:   a, b ∈ [2, 5]
 * Medium: a, b ∈ [2, 9]
 * Hard:   a ∈ [2, 12], b ∈ [2, 12]  (may produce partial-product problems)
 */
export function generateMultiplicationProblem(
  difficulty: Difficulty,
  seed: number,
): MultiplicationProblem {
  let s = Math.abs(Math.round(seed)) % LCG_M

  let a: number
  let b: number

  if (difficulty === 'easy') {
    ;[a, s] = randInt(2, 5, s)
    ;[b, s] = randInt(2, 5, s)
  } else if (difficulty === 'medium') {
    ;[a, s] = randInt(2, 9, s)
    ;[b, s] = randInt(2, 9, s)
  } else {
    // hard
    ;[a, s] = randInt(2, 12, s)
    ;[b, s] = randInt(2, 12, s)
  }

  return { a, b, expected: a * b }
}
