import { describe, it, expect } from 'vitest'

import { divide, remainder, groupItems } from './utils'

describe('divide', () => {
  it('exact division', () => {
    expect(divide(12, 3)).toBe(4)
    expect(divide(20, 4)).toBe(5)
  })

  it('division with remainder (floors result)', () => {
    expect(divide(17, 5)).toBe(3)
    expect(divide(7, 2)).toBe(3)
  })

  it('dividend of 1', () => {
    expect(divide(1, 1)).toBe(1)
    expect(divide(1, 3)).toBe(0)
  })

  it('boundary: 100 ÷ 20', () => {
    expect(divide(100, 20)).toBe(5)
  })

  it('throws on zero divisor', () => {
    expect(() => divide(10, 0)).toThrow(RangeError)
    expect(() => divide(10, 0)).toThrow('Cannot divide by zero')
  })
})

describe('remainder', () => {
  it('exact division has zero remainder', () => {
    expect(remainder(12, 3)).toBe(0)
    expect(remainder(20, 4)).toBe(0)
  })

  it('remainder with leftover', () => {
    expect(remainder(17, 5)).toBe(2)
    expect(remainder(7, 2)).toBe(1)
  })

  it('remainder when quotient is 0', () => {
    expect(remainder(1, 3)).toBe(1)
  })

  it('throws on zero divisor', () => {
    expect(() => remainder(10, 0)).toThrow(RangeError)
  })
})

describe('groupItems', () => {
  it('exact division — no remainder', () => {
    const g = groupItems(12, 3)
    expect(g.groups).toBe(3)
    expect(g.itemsPerGroup).toBe(4)
    expect(g.remainder).toBe(0)
    expect(g.totalItems).toBe(12)
  })

  it('division with remainder', () => {
    const g = groupItems(17, 5)
    expect(g.itemsPerGroup).toBe(3)
    expect(g.remainder).toBe(2)
    expect(g.totalItems).toBe(17)
  })

  it('single group', () => {
    const g = groupItems(7, 1)
    expect(g.itemsPerGroup).toBe(7)
    expect(g.remainder).toBe(0)
  })

  it('more groups than items', () => {
    const g = groupItems(3, 5)
    expect(g.itemsPerGroup).toBe(0)
    expect(g.remainder).toBe(3)
  })

  it('boundary: 100 ÷ 20', () => {
    const g = groupItems(100, 20)
    expect(g.itemsPerGroup).toBe(5)
    expect(g.remainder).toBe(0)
    expect(g.groups).toBe(20)
  })
})
