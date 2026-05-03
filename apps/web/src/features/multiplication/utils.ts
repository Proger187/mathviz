import type { GridGeometry, PartialProduct } from './types'

/** Simple product. */
export function multiply(a: number, b: number): number {
  return a * b
}

/**
 * Compute cell size: shrinks for larger grids, max 40px.
 * Keeps the grid within 560px.
 */
export function cellSize(a: number, b: number): number {
  return Math.min(Math.floor(560 / Math.max(a, b)), 40)
}

/**
 * Compute all grid geometry values.
 * offsetX centres the grid within a 600px container.
 */
export function gridGeometry(a: number, b: number): GridGeometry {
  const cs = cellSize(a, b)
  const gridWidth = cs * b
  const gridHeight = cs * a
  const offsetX = Math.floor((600 - gridWidth) / 2)
  return { cellSize: cs, gridWidth, gridHeight, offsetX }
}

/**
 * Decompose factors into partial products at the tens boundary.
 * E.g. 12 × 14 → [10×10, 10×4, 2×10, 2×4].
 * For factors ≤ 9, returns a single entry covering the full product.
 */
export function partialProducts(a: number, b: number): PartialProduct[] {
  const aTens = Math.floor(a / 10) * 10
  const aUnits = a % 10
  const bTens = Math.floor(b / 10) * 10
  const bUnits = b % 10

  // Only split if at least one factor has a tens component
  if (aTens === 0 && bTens === 0) {
    return [{ rowFactor: a, colFactor: b, product: a * b, colorClass: 'bg-blue-300' }]
  }

  const parts: PartialProduct[] = []
  const components: Array<[number, number, string]> = []

  if (aTens > 0 && bTens > 0) components.push([aTens, bTens, 'bg-blue-800'])
  if (aTens > 0 && bUnits > 0) components.push([aTens, bUnits, 'bg-blue-600'])
  if (aUnits > 0 && bTens > 0) components.push([aUnits, bTens, 'bg-blue-400'])
  if (aUnits > 0 && bUnits > 0) components.push([aUnits, bUnits, 'bg-blue-300'])
  if (aUnits > 0 && bTens === 0) components.push([aUnits, b, 'bg-blue-400'])
  if (aTens > 0 && bTens === 0) components.push([aTens, b, 'bg-blue-600'])
  if (aTens === 0 && bTens > 0) components.push([a, bTens, 'bg-blue-600'])
  if (aTens === 0 && bUnits > 0 && bTens > 0) components.push([a, bUnits, 'bg-blue-300'])

  // Deduplicate and build PartialProduct array
  const seen = new Set<string>()
  for (const [rF, cF, cls] of components) {
    const key = `${rF}x${cF}`
    if (!seen.has(key)) {
      seen.add(key)
      parts.push({ rowFactor: rF, colFactor: cF, product: rF * cF, colorClass: cls })
    }
  }

  return parts.length > 0 ? parts : [{ rowFactor: a, colFactor: b, product: a * b, colorClass: 'bg-blue-300' }]
}
