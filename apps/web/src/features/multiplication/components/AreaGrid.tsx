'use client'

import type { GridGeometry } from '../types'

const SVG_WIDTH = 600
const CELL_BORDER = '#1E40AF'
const COLOR_ODD_ROW = '#3B82F6'
const COLOR_EVEN_ROW = '#93C5FD'
const COLOR_UNFILLED = '#F1F5F9'

interface AreaGridProps {
  a: number
  b: number
  filledRows: number
  showPartialProducts: boolean
}

export function AreaGrid({ a, b, filledRows, showPartialProducts }: AreaGridProps) {
  const cs = Math.min(Math.floor(560 / Math.max(a, b)), 40)
  const gridWidth = cs * b
  const gridHeight = cs * a
  const offsetX = Math.floor((SVG_WIDTH - gridWidth) / 2)
  const geo: GridGeometry = { cellSize: cs, gridWidth, gridHeight, offsetX }

  const total = a * b
  const filled = Math.min(filledRows * b, total)

  const ariaLabel = `${a} by ${b} multiplication grid. ${filled} of ${total} squares filled.`

  return (
    <div>
      <svg
        width={SVG_WIDTH}
        height={gridHeight + 40}
        viewBox={`0 0 ${SVG_WIDTH} ${gridHeight + 40}`}
        role="img"
        aria-label={ariaLabel}
        className="w-full max-w-full"
      >
        {/* Grid cells */}
        {Array.from({ length: a }, (_, row) =>
          Array.from({ length: b }, (_, col) => {
            const isFilled = row < filledRows
            const fill = isFilled
              ? row % 2 === 0
                ? COLOR_ODD_ROW
                : COLOR_EVEN_ROW
              : COLOR_UNFILLED

            return (
              <rect
                key={`${row}-${col}`}
                x={geo.offsetX + col * cs}
                y={row * cs}
                width={cs}
                height={cs}
                fill={fill}
                stroke={CELL_BORDER}
                strokeWidth={0.5}
                style={
                  isFilled
                    ? {
                        transitionProperty: 'fill',
                        transitionDelay: `${col * 30}ms`,
                        transitionDuration: '150ms',
                      }
                    : undefined
                }
              />
            )
          }),
        )}

        {/* Partial product region labels (advanced mode) */}
        {showPartialProducts && a > 9 && b > 9 && (() => {
          const aTens = Math.floor(a / 10) * 10
          const aUnits = a % 10
          const bTens = Math.floor(b / 10) * 10
          const bUnits = b % 10

          const regions = [
            {
              rows: aTens / cs,
              cols: bTens / cs,
              rowOffset: 0,
              colOffset: 0,
              label: `${aTens}×${bTens}=${aTens * bTens}`,
              color: '#1E40AF',
            },
            {
              rows: aTens / cs,
              cols: bUnits / cs,
              rowOffset: 0,
              colOffset: bTens,
              label: `${aTens}×${bUnits}=${aTens * bUnits}`,
              color: '#3B82F6',
            },
            {
              rows: aUnits / cs,
              cols: bTens / cs,
              rowOffset: aTens,
              colOffset: 0,
              label: `${aUnits}×${bTens}=${aUnits * bTens}`,
              color: '#60A5FA',
            },
            {
              rows: aUnits / cs,
              cols: bUnits / cs,
              rowOffset: aTens,
              colOffset: bTens,
              label: `${aUnits}×${bUnits}=${aUnits * bUnits}`,
              color: '#93C5FD',
            },
          ]

          return regions
            .filter((r) => r.rows > 0 && r.cols > 0)
            .map((r, i) => (
              <text
                key={i}
                x={geo.offsetX + r.colOffset * cs + (r.cols * cs) / 2}
                y={r.rowOffset * cs + (r.rows * cs) / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fill={i < 2 ? '#fff' : '#1E40AF'}
                fontWeight="600"
              >
                {r.label}
              </text>
            ))
        })()}

        {/* Running counter */}
        <text
          x={SVG_WIDTH / 2}
          y={gridHeight + 26}
          textAnchor="middle"
          fontSize={14}
          fill="#374151"
          fontWeight="600"
        >
          {filled} / {total}
        </text>
      </svg>
    </div>
  )
}
