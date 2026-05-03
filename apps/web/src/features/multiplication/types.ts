export interface MultiplicationProblem {
  a: number
  b: number
  expected: number
}

export interface GridGeometry {
  cellSize: number
  gridWidth: number
  gridHeight: number
  offsetX: number
}

export interface PartialProduct {
  rowFactor: number
  colFactor: number
  product: number
  colorClass: string
}
