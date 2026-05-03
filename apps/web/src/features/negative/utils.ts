/** Add two integers. */
export function addIntegers(a: number, b: number): number {
  return a + b
}

/** Subtract two integers. */
export function subtractIntegers(a: number, b: number): number {
  return a - b
}

/**
 * Compute the min/max range needed to show both `a` and `result`
 * with at least `padding` units of space on each side.
 */
export function numberLineRange(
  a: number,
  result: number,
  padding = 2,
): { min: number; max: number } {
  return {
    min: Math.min(a, result) - padding,
    max: Math.max(a, result) + padding,
  }
}
