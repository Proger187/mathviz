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

const EMPTY = '#f1f5f9'
const STROKE = '#94a3b8'
const DEFAULT_FILL = '#6366f1'

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
  const safeNum = Math.max(0, Math.min(numerator, denominator))
  const ariaLabel = label ?? `${safeNum} of ${denominator} equal parts shaded`

  const transition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const }

  if (denominator === 1) {
    return (
      <div className="flex flex-col items-center gap-2">
        <motion.svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={ariaLabel}
          initial={false}
        >
          <motion.circle
            cx={cx}
            cy={cy}
            r={r}
            animate={{ fill: safeNum >= 1 ? color : EMPTY }}
            transition={transition}
            stroke={STROKE}
            strokeWidth={2}
          />
        </motion.svg>
        {label && <span className="font-mono text-sm font-semibold text-slate-700">{label}</span>}
      </div>
    )
  }

  const sliceAngle = (2 * Math.PI) / denominator
  const startOffset = -Math.PI / 2

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
        className="drop-shadow-sm"
      >
        <defs>
          <filter id="fraction-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
          </filter>
        </defs>
        <g filter="url(#fraction-shadow)">
          {Array.from({ length: denominator }, (_, i) => {
            const start = startOffset + i * sliceAngle
            const end = start + sliceAngle
            const shaded = i < safeNum
            return (
              <motion.path
                key={`${denominator}-${i}`}
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
