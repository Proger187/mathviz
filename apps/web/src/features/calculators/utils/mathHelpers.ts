/** Clamp a value between min and max (inclusive). */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Generate an inclusive integer range from `from` to `to`. */
export function range(from: number, to: number): number[] {
  const result: number[] = []
  for (let i = from; i <= to; i++) {
    result.push(i)
  }
  return result
}

/** Round a number to a fixed number of decimal places. */
export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals)
  return Math.round(value * factor) / factor
}
