'use client'

const SVG_WIDTH = 680
const SVG_HEIGHT = 160
const LINE_Y = 80
const HORIZONTAL_PADDING = 40
const TICK_HALF_HEIGHT = 8
const DOT_RADIUS = 7

/**
 * Create a function that converts an integer to an x-coordinate on the number line.
 * Exported so other modules (e.g., the animation hook) can share the same geometry.
 */
export function createOriginMapper(min: number, max: number): (n: number) => number {
  const unitPx = (SVG_WIDTH - 2 * HORIZONTAL_PADDING) / (max - min)
  return (n: number) => HORIZONTAL_PADDING + (n - min) * unitPx
}

interface NumberLineProps {
  a: number
  b: number
  operation: '+' | '-'
  currentPosition: number
  showEndDot: boolean
}

export function NumberLine({ a, b, operation, currentPosition, showEndDot }: NumberLineProps) {
  const result = operation === '+' ? a + b : a - b
  const { min, max } = {
    min: Math.min(a, result) - 2,
    max: Math.max(a, result) + 2,
  }
  const origin = createOriginMapper(min, max)

  const ticks: number[] = []
  for (let i = min; i <= max; i++) {
    ticks.push(i)
  }

  // Journey block: from a toward currentPosition
  const jLeft = origin(Math.min(a, currentPosition))
  const jRight = origin(Math.max(a, currentPosition))
  const journeyWidth = jRight - jLeft

  const ariaLabel = `Number line from ${min} to ${max}, showing a journey from ${a} to ${result} by ${operation} ${b}`

  return (
    <svg
      width={SVG_WIDTH}
      height={SVG_HEIGHT}
      viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
      role="img"
      aria-label={ariaLabel}
      className="w-full max-w-full"
    >
      {/* Track */}
      <line
        x1={HORIZONTAL_PADDING}
        y1={LINE_Y}
        x2={SVG_WIDTH - HORIZONTAL_PADDING}
        y2={LINE_Y}
        stroke="#6B7280"
        strokeWidth={2}
      />

      {/* Ticks and labels */}
      {ticks.map((n) => (
        <g key={n}>
          <line
            x1={origin(n)}
            y1={LINE_Y - TICK_HALF_HEIGHT}
            x2={origin(n)}
            y2={LINE_Y + TICK_HALF_HEIGHT}
            stroke={n === 0 ? '#1F2937' : '#9CA3AF'}
            strokeWidth={n === 0 ? 2 : 1}
          />
          <text
            x={origin(n)}
            y={LINE_Y + TICK_HALF_HEIGHT + 16}
            textAnchor="middle"
            fontSize={10}
            fill={n === 0 ? '#1F2937' : '#6B7280'}
          >
            {n}
          </text>
        </g>
      ))}

      {/* Journey block */}
      {journeyWidth > 0 && (
        <rect
          x={jLeft}
          y={LINE_Y - 6}
          width={journeyWidth}
          height={12}
          fill="#E8593C"
          stroke="#B03A22"
          strokeWidth={1}
          rx={3}
          style={{ transition: 'all 0.05s linear' }}
        />
      )}

      {/* Start dot */}
      <circle cx={origin(a)} cy={LINE_Y} r={DOT_RADIUS} fill="#3A2F27" />

      {/* End dot — visible at final step */}
      {showEndDot && (
        <circle cx={origin(result)} cy={LINE_Y} r={DOT_RADIUS} fill="#27AE60" />
      )}
    </svg>
  )
}
