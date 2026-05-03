import type { Difficulty, NegativeProblem } from '@mathviz/shared'

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
 * Generate a deterministic NegativeProblem for the given difficulty and seed.
 *
 * Easy:   a ∈ [0, 10], b ∈ [1, 5],      addition only,       result positive
 * Medium: a ∈ [−10, 10], b ∈ [−5, 5],   addition or subtraction
 * Hard:   a ∈ [−20, 20], b ∈ [−20, 20], subtraction only
 */
export function generateNegativeProblem(difficulty: Difficulty, seed: number): NegativeProblem {
  let s = Math.abs(Math.round(seed)) % LCG_M

  let a: number
  let b: number
  let operation: '+' | '-'

  if (difficulty === 'easy') {
    ;[a, s] = randInt(0, 10, s)
    ;[b, s] = randInt(1, 5, s)
    operation = '+'
    // Ensure result is positive; retry if needed
    let attempts = 0
    while (a + b < 0 && attempts < 10) {
      ;[a, s] = randInt(0, 10, s)
      ;[b, s] = randInt(1, 5, s)
      attempts++
    }
  } else if (difficulty === 'medium') {
    ;[a, s] = randInt(-10, 10, s)
    ;[b, s] = randInt(-5, 5, s)
    let opPick: number
    ;[opPick, s] = randInt(0, 1, s)
    operation = opPick === 0 ? '+' : '-'
  } else {
    // hard
    ;[a, s] = randInt(-20, 20, s)
    ;[b, s] = randInt(-20, 20, s)
    operation = '-'
  }

  const expected = operation === '+' ? a + b : a - b

  return { a, b, operation, expected }
}
