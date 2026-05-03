'use client'

interface PizzaSliceProps {
  numerator: number
  denominator: number
  color?: string
  size?: number
}

function sectorPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
): string {
  const x1 = cx + r * Math.cos(startAngle)
  const y1 = cy + r * Math.sin(startAngle)
  const x2 = cx + r * Math.cos(endAngle)
  const y2 = cy + r * Math.sin(endAngle)
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
  return `M ${cx} ${cy} L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${r} ${r} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`
}

export function PizzaSlice({
  numerator,
  denominator,
  color = '#E8593C',
  size = 160,
}: PizzaSliceProps) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.44
  const ariaLabel = `Pizza showing ${numerator} of ${denominator} slices highlighted`

  // Full circle for denominator = 1
  if (denominator === 1) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill={numerator >= 1 ? color : '#F5F5F0'}
          stroke="#3A2F27"
          strokeWidth={2}
        />
      </svg>
    )
  }

  const sliceAngle = (2 * Math.PI) / denominator
  const startOffset = -Math.PI / 2 // 12 o'clock

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
    >
      {Array.from({ length: denominator }, (_, i) => {
        const start = startOffset + i * sliceAngle
        const end = start + sliceAngle
        const shaded = i < numerator
        return (
          <path
            key={i}
            d={sectorPath(cx, cy, r, start, end)}
            fill={shaded ? color : '#F5F5F0'}
            stroke="#3A2F27"
            strokeWidth={1.5}
          />
        )
      })}
      {/* Outer border rendered last so it sits on top of slice stroke edges */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#3A2F27" strokeWidth={2} />
    </svg>
  )
}
