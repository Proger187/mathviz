import type { Difficulty, DivisionProblem } from '@mathviz/shared'

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
 * Generate a deterministic DivisionProblem for the given difficulty and seed.
 *
 * Easy:   groups [2, 4], no remainder, quotient [2, 5]
 * Medium: groups [2, 6], remainder allowed, quotient [2, 9]
 * Hard:   groups [2, 10], remainder always present, quotient [2, 12]
 */
export function generateDivisionProblem(difficulty: Difficulty, seed: number): DivisionProblem {
  let s = Math.abs(Math.round(seed)) % LCG_M

  let groups: number
  let quotient: number
  let rem: number

  if (difficulty === 'easy') {
    ;[groups, s] = randInt(2, 4, s)
    ;[quotient, s] = randInt(2, 5, s)
    rem = 0
  } else if (difficulty === 'medium') {
    ;[groups, s] = randInt(2, 6, s)
    ;[quotient, s] = randInt(2, 9, s)
    let remPick: number
    ;[remPick, s] = randInt(0, groups - 1, s)
    rem = remPick
  } else {
    // hard — remainder always present
    ;[groups, s] = randInt(2, 10, s)
    ;[quotient, s] = randInt(2, 12, s)
    ;[rem, s] = randInt(1, groups - 1, s)
  }

  const dividend = groups * quotient + rem

  return {
    dividend,
    divisor: groups,
    expectedQuotient: quotient,
    expectedRemainder: rem,
  }
}
