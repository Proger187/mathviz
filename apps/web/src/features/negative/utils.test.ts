import { describe, it, expect } from 'vitest'

import { addIntegers, subtractIntegers, numberLineRange } from './utils'

describe('addIntegers', () => {
  it('adds two positive integers', () => {
    expect(addIntegers(3, 4)).toBe(7)
  })

  it('adds a positive and a negative integer', () => {
    expect(addIntegers(5, -3)).toBe(2)
  })

  it('adds two negative integers', () => {
    expect(addIntegers(-4, -6)).toBe(-10)
  })

  it('result at boundary (50)', () => {
    expect(addIntegers(45, 5)).toBe(50)
  })

  it('result at negative boundary (-50)', () => {
    expect(addIntegers(-45, -5)).toBe(-50)
  })

  it('zero operand', () => {
    expect(addIntegers(0, 7)).toBe(7)
    expect(addIntegers(-7, 0)).toBe(-7)
  })
})

describe('subtractIntegers', () => {
  it('subtracts positive from positive', () => {
    expect(subtractIntegers(10, 3)).toBe(7)
  })

  it('subtracts to produce negative result', () => {
    expect(subtractIntegers(2, 8)).toBe(-6)
  })

  it('subtracts a negative integer (double negative)', () => {
    expect(subtractIntegers(-3, -5)).toBe(2)
  })

  it('result at boundary (50)', () => {
    expect(subtractIntegers(50, 0)).toBe(50)
  })

  it('result at negative boundary (-50)', () => {
    expect(subtractIntegers(-50, 0)).toBe(-50)
  })
})

describe('numberLineRange', () => {
  it('pads range around a and result', () => {
    const range = numberLineRange(3, 8, 2)
    expect(range.min).toBe(1)
    expect(range.max).toBe(10)
  })

  it('handles negative start with positive result', () => {
    const range = numberLineRange(-3, 5, 2)
    expect(range.min).toBe(-5)
    expect(range.max).toBe(7)
  })

  it('handles negative start and negative result', () => {
    const range = numberLineRange(-10, -3, 2)
    expect(range.min).toBe(-12)
    expect(range.max).toBe(-1)
  })

  it('uses default padding of 2', () => {
    const range = numberLineRange(0, 4)
    expect(range.min).toBe(-2)
    expect(range.max).toBe(6)
  })

  it('handles reversed range (a > result)', () => {
    const range = numberLineRange(5, 1, 2)
    expect(range.min).toBe(-1)
    expect(range.max).toBe(7)
  })
})
