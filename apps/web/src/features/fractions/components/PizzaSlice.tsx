'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface PizzaSliceProps {
  numerator: number
  denominator: number
  /** Highlight color for shaded parts */
  color?: string
  size?: number
  label?: string
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

const EMPTY = '#ffffff'
const STROKE = '#9aa4b2'
const DEFAULT_FILL = '#5ec0ea'

export function PizzaSlice({
  numerator,
  denominator,
  color = DEFAULT_FILL,
  size = 168,
  label,
}: PizzaSliceProps) {
  const reducedMotion = useReducedMotion()
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.42
  const safeNumerator = Math.max(0, numerator)
  const safeDenominator = Math.max(1, denominator)
  const wholeCount = Math.floor(safeNumerator / safeDenominator)
  const remainder = safeNumerator % safeDenominator
  const pieSegments = [
    ...Array.from({ length: wholeCount }, () => safeDenominator),
    ...(remainder > 0 || safeNumerator === 0 ? [remainder] : []),
  ]
  const ariaLabel =
    label ?? `${safeNumerator} of ${safeDenominator} equal parts shaded, with whole parts shown`

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const }

  if (safeDenominator === 1) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {Array.from({ length: safeNumerator || 1 }, (_, i) => (
            <motion.svg
              key={`whole-${i}`}
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              role={i === 0 ? 'img' : undefined}
              aria-label={i === 0 ? ariaLabel : undefined}
              initial={false}
            >
              <motion.circle
                cx={cx}
                cy={cy}
                r={r}
                animate={{ fill: safeNumerator >= 1 ? color : EMPTY }}
                transition={transition}
                stroke={STROKE}
                strokeWidth={2}
              />
            </motion.svg>
          ))}
        </div>
        {label && <span className="font-mono text-sm font-semibold text-slate-700">{label}</span>}
      </div>
    )
  }

  const sliceAngle = (2 * Math.PI) / safeDenominator
  const startOffset = -Math.PI / 2

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {pieSegments.map((filled, pieIndex) => (
          <svg
            key={`${safeDenominator}-${filled}-${pieIndex}`}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role={pieIndex === 0 ? 'img' : undefined}
            aria-label={pieIndex === 0 ? ariaLabel : undefined}
            className="drop-shadow-sm"
          >
            <defs>
              <filter
                id={`fraction-shadow-${safeDenominator}-${pieIndex}`}
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
              >
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
              </filter>
            </defs>
            <g filter={`url(#fraction-shadow-${safeDenominator}-${pieIndex})`}>
              {Array.from({ length: safeDenominator }, (_, i) => {
                const start = startOffset + i * sliceAngle
                const end = start + sliceAngle
                const shaded = i < filled
                return (
                  <motion.path
                    key={`${safeDenominator}-${pieIndex}-${i}`}
                    d={sectorPath(cx, cy, r, start, end)}
                    initial={false}
                    animate={{
                      fill: shaded ? color : EMPTY,
                      opacity: shaded ? 1 : 0.85,
                    }}
                    transition={{ ...transition, delay: reducedMotion ? 0 : i * 0.03 }}
                    stroke={STROKE}
                    strokeWidth={1.25}
                    strokeLinejoin="round"
                  />
                )
              })}
              <circle cx={cx} cy={cy} r={r} fill="none" stroke={STROKE} strokeWidth={2} />
              <circle cx={cx} cy={cy} r={r * 0.08} fill={STROKE} opacity={0.35} />
            </g>
          </svg>
        ))}
      </div>
      {label && (
        <motion.span
          key={label}
          initial={reducedMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-sm font-semibold text-slate-700"
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}
