export interface GroupDistribution {
  groups: number
  itemsPerGroup: number
  remainder: number
  totalItems: number
}

/**
 * Integer quotient (floor division).
 * Throws RangeError if groups === 0.
 */
export function divide(total: number, groups: number): number {
  if (groups === 0) throw new RangeError('Cannot divide by zero')
  return Math.floor(total / groups)
}

/** Remainder after integer division. */
export function remainder(total: number, groups: number): number {
  if (groups === 0) throw new RangeError('Cannot divide by zero')
  return total % groups
}

/**
 * Full distribution descriptor used by the visual component and the quiz.
 */
export function groupItems(total: number, groups: number): GroupDistribution {
  return {
    groups,
    itemsPerGroup: divide(total, groups),
    remainder: remainder(total, groups),
    totalItems: total,
  }
}
