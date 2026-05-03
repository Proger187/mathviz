import { describe, it, expect } from 'vitest'

import {
  gcd,
  lcm,
  simplify,
  addFractions,
  subtractFractions,
  toMixed,
  equivalentFraction,
} from './utils'

describe('gcd', () => {
  it('returns the larger value when one arg is 0', () => {
    expect(gcd(0, 5)).toBe(5)
    expect(gcd(5, 0)).toBe(5)
  })
  it('returns 1 for gcd(0, 0)', () => {
    expect(gcd(0, 0)).toBe(1)
  })
  it('returns the value for equal numbers', () => {
    expect(gcd(6, 6)).toBe(6)
  })
  it('returns 1 for coprime primes', () => {
    expect(gcd(7, 11)).toBe(1)
    expect(gcd(13, 17)).toBe(1)
  })
  it('finds the common factor', () => {
    expect(gcd(12, 8)).toBe(4)
    expect(gcd(18, 12)).toBe(6)
  })
  it('handles negative inputs', () => {
    expect(gcd(-12, 8)).toBe(4)
    expect(gcd(-6, -9)).toBe(3)
  })
})

describe('lcm', () => {
  it('finds lcm of coprime numbers', () => {
    expect(lcm(3, 4)).toBe(12)
    expect(lcm(2, 3)).toBe(6)
  })
  it('finds lcm when one divides the other', () => {
    expect(lcm(2, 6)).toBe(6)
    expect(lcm(4, 12)).toBe(12)
  })
  it('handles equal values', () => {
    expect(lcm(5, 5)).toBe(5)
  })
})

describe('simplify', () => {
  it('simplifies a fraction with a common factor', () => {
    expect(simplify(4, 6)).toEqual({ numerator: 2, denominator: 3 })
    expect(simplify(6, 9)).toEqual({ numerator: 2, denominator: 3 })
  })
  it('leaves an already-simplified fraction unchanged', () => {
    expect(simplify(3, 7)).toEqual({ numerator: 3, denominator: 7 })
  })
  it('simplifies numerator 0 to 0/1', () => {
    expect(simplify(0, 5)).toEqual({ numerator: 0, denominator: 1 })
  })
  it('throws on denominator 0', () => {
    expect(() => simplify(1, 0)).toThrow()
  })
  it('normalises a negative denominator into the numerator', () => {
    const f = simplify(3, -6)
    expect(f.denominator).toBeGreaterThan(0)
    expect(f.numerator).toBeLessThan(0)
  })
})

describe('addFractions', () => {
  it('adds fractions with unlike denominators', () => {
    expect(addFractions(1, 2, 1, 3)).toEqual({ numerator: 5, denominator: 6 })
  })
  it('produces an improper fraction when result > 1', () => {
    expect(addFractions(3, 4, 3, 4)).toEqual({ numerator: 3, denominator: 2 })
  })
  it('simplifies the result', () => {
    expect(addFractions(1, 4, 1, 4)).toEqual({ numerator: 1, denominator: 2 })
  })
  it('handles same denominators', () => {
    expect(addFractions(1, 5, 2, 5)).toEqual({ numerator: 3, denominator: 5 })
  })
})

describe('subtractFractions', () => {
  it('subtracts fractions with unlike denominators', () => {
    expect(subtractFractions(1, 2, 1, 3)).toEqual({ numerator: 1, denominator: 6 })
  })
  it('produces a negative result when second is larger', () => {
    const r = subtractFractions(1, 3, 1, 2)
    expect(r.numerator).toBe(-1)
    expect(r.denominator).toBe(6)
  })
  it('produces zero when fractions are equal', () => {
    expect(subtractFractions(1, 2, 1, 2)).toEqual({ numerator: 0, denominator: 1 })
  })
})

describe('toMixed', () => {
  it('returns null for a proper fraction', () => {
    expect(toMixed(1, 3)).toBeNull()
    expect(toMixed(2, 3)).toBeNull()
  })
  it('returns the correct mixed number for an improper fraction', () => {
    expect(toMixed(7, 3)).toEqual({ whole: 2, numerator: 1, denominator: 3 })
    expect(toMixed(5, 2)).toEqual({ whole: 2, numerator: 1, denominator: 2 })
  })
  it('returns null when the fraction is an exact whole number', () => {
    expect(toMixed(6, 3)).toBeNull()
    expect(toMixed(4, 2)).toBeNull()
  })
  it('throws on denominator 0', () => {
    expect(() => toMixed(1, 0)).toThrow()
  })
})

describe('equivalentFraction', () => {
  it('scales a fraction to the target denominator', () => {
    expect(equivalentFraction(1, 2, 6)).toEqual({ numerator: 3, denominator: 6 })
    expect(equivalentFraction(1, 3, 6)).toEqual({ numerator: 2, denominator: 6 })
  })
  it('throws on denominator 0', () => {
    expect(() => equivalentFraction(1, 0, 6)).toThrow()
  })
})
