import { describe, it, expect } from 'vitest'

import { multiply, cellSize, gridGeometry, partialProducts } from './utils'

describe('multiply', () => {
  it('multiplies two positive integers', () => {
    expect(multiply(4, 6)).toBe(24)
  })

  it('handles 1×1', () => {
    expect(multiply(1, 1)).toBe(1)
  })

  it('handles 20×20', () => {
    expect(multiply(20, 20)).toBe(400)
  })
})

describe('cellSize', () => {
  it('returns 40 for 1×1 (max allowed)', () => {
    expect(cellSize(1, 1)).toBe(40)
  })

  it('returns correct size for 12×12', () => {
    // Math.min(floor(560/12), 40) = Math.min(46, 40) = 40
    expect(cellSize(12, 12)).toBe(40)
  })

  it('returns smaller size for 20×20', () => {
    // Math.min(floor(560/20), 40) = Math.min(28, 40) = 28
    expect(cellSize(20, 20)).toBe(28)
  })

  it('uses max of a and b for constraint', () => {
    // Math.min(floor(560/20), 40) = 28
    expect(cellSize(1, 20)).toBe(28)
    expect(cellSize(20, 1)).toBe(28)
  })
})

describe('gridGeometry', () => {
  it('computes geometry for 4×6', () => {
    const cs = cellSize(4, 6)
    const geo = gridGeometry(4, 6)
    expect(geo.cellSize).toBe(cs)
    expect(geo.gridWidth).toBe(cs * 6)
    expect(geo.gridHeight).toBe(cs * 4)
    // offsetX should centre in 600px
    expect(geo.offsetX).toBe(Math.floor((600 - geo.gridWidth) / 2))
  })

  it('centres a 20×20 grid correctly', () => {
    const cs = 28 // cellSize(20, 20)
    const geo = gridGeometry(20, 20)
    expect(geo.gridWidth).toBe(cs * 20) // 560
    expect(geo.offsetX).toBe(Math.floor((600 - 560) / 2)) // 20
  })

  it('centres a 1×1 grid correctly', () => {
    const geo = gridGeometry(1, 1)
    expect(geo.gridWidth).toBe(40)
    expect(geo.offsetX).toBe(Math.floor((600 - 40) / 2)) // 280
  })
})

describe('partialProducts for 12×14', () => {
  it('returns 4 partial product regions', () => {
    const parts = partialProducts(12, 14)
    expect(parts).toHaveLength(4)
    const products = parts.map((p) => p.product)
    expect(products).toContain(100) // 10×10
    expect(products).toContain(40)  // 10×4
    expect(products).toContain(20)  // 2×10
    expect(products).toContain(8)   // 2×4
  })

  it('sums to total product', () => {
    const parts = partialProducts(12, 14)
    const sum = parts.reduce((acc, p) => acc + p.product, 0)
    expect(sum).toBe(168)
  })

  it('returns single entry for factors ≤9', () => {
    const parts = partialProducts(3, 7)
    expect(parts).toHaveLength(1)
    expect((parts[0] as { product: number }).product).toBe(21)
  })
})
