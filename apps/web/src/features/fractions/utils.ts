import type { Fraction, MixedNumber } from './types'

/** Greatest common divisor (Euclidean algorithm). gcd(0,0) returns 1. */
export function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  if (a === 0 && b === 0) return 1
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

/** Least common multiple. */
export function lcm(a: number, b: number): number {
  const g = gcd(Math.abs(a), Math.abs(b))
  if (g === 0) return 0
  return Math.abs(a * b) / g
}

/** Reduce a fraction by its GCD. Normalises negative denominator to numerator. */
export function simplify(n: number, d: number): Fraction {
  if (d === 0) throw new Error('Denominator cannot be zero')
  const sign = d < 0 ? -1 : 1
  const g = gcd(Math.abs(n), Math.abs(d))
  return {
    numerator: (sign * n) / g,
    denominator: (sign * d) / g,
  }
}

/** Add two fractions a/b + c/d, returning the simplified result. */
export function addFractions(a: number, b: number, c: number, d: number): Fraction {
  const common = lcm(b, d)
  return simplify(a * (common / b) + c * (common / d), common)
}

/** Subtract two fractions a/b - c/d, returning the simplified result. */
export function subtractFractions(a: number, b: number, c: number, d: number): Fraction {
  return addFractions(a, b, -c, d)
}

/**
 * Convert an improper fraction to a mixed number.
 * Returns null if the fraction is proper (|n| < |d|) or divides exactly.
 */
export function toMixed(n: number, d: number): MixedNumber | null {
  if (d === 0) throw new Error('Denominator cannot be zero')
  if (Math.abs(n) < Math.abs(d)) return null
  const whole = Math.trunc(n / d)
  const remNumerator = Math.abs(n % d)
  if (remNumerator === 0) return null
  return { whole, numerator: remNumerator, denominator: Math.abs(d) }
}

/** Scale n/d so the denominator becomes targetDenominator. */
export function equivalentFraction(n: number, d: number, targetDenominator: number): Fraction {
  if (d === 0) throw new Error('Denominator cannot be zero')
  const factor = targetDenominator / d
  return { numerator: Math.round(n * factor), denominator: targetDenominator }
}
