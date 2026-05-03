import type { Difficulty, FractionProblem } from '@mathviz/shared'

import { addFractions, subtractFractions } from '../../fractions/utils'

// Simple Linear Congruential Generator (Numerical Recipes constants)
const LCG_A = 1664525
const LCG_C = 1013904223
const LCG_M = 2 ** 32

function lcgNext(seed: number): number {
  return (LCG_A * seed + LCG_C) % LCG_M
}

/**
 * Returns a pseudo-random integer in [min, max] and the updated seed.
 * Distribution is uniform for small ranges relative to LCG_M.
 */
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
 * Generate a deterministic FractionProblem for the given difficulty and seed.
 *
 * Easy:   denominators 2–4,  addition only,    result ≤ 1
 * Medium: denominators 2–6,  addition only,    result may be improper
 * Hard:   denominators 2–12, subtraction 50 %, result may be negative
 */
export function generateFractionProblem(difficulty: Difficulty, seed: number): FractionProblem {
  let s = Math.abs(Math.round(seed)) % LCG_M

  const maxDen = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 12

  // Decide operation
  let useSubtraction = false
  if (difficulty === 'hard') {
    let pick: number
    ;[pick, s] = randInt(0, 1, s)
    useSubtraction = pick === 1
  }
  const operation: '+' | '-' = useSubtraction ? '-' : '+'

  // Generate denominators
  // These are declared with let because they are set via destructuring assignment below
  let denA: number
  let denB: number
  // eslint-disable-next-line prefer-const
  ;[denA, s] = randInt(2, maxDen, s)
  // eslint-disable-next-line prefer-const
  ;[denB, s] = randInt(2, maxDen, s)

  // Generate numerators (always < denominator for proper fractions by default)
  let numA: number
  let numB: number
  ;[numA, s] = randInt(1, denA - 1, s)
  ;[numB, s] = randInt(1, denB - 1, s)

  // Easy: retry until result ≤ 1
  if (difficulty === 'easy') {
    let attempts = 0
    while (attempts < 20) {
      const r = addFractions(numA, denA, numB, denB)
      if (r.numerator <= r.denominator) break
      ;[numA, s] = randInt(1, Math.max(1, Math.floor(denA / 2)), s)
      ;[numB, s] = randInt(1, Math.max(1, Math.floor(denB / 2)), s)
      attempts++
    }
  }

  const result =
    operation === '+'
      ? addFractions(numA, denA, numB, denB)
      : subtractFractions(numA, denA, numB, denB)

  return {
    numeratorA: numA,
    denominatorA: denA,
    numeratorB: numB,
    denominatorB: denB,
    operation,
    expectedNumerator: result.numerator,
    expectedDenominator: result.denominator,
  }
}
