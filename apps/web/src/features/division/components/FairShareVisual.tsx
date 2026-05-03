'use client'

const DOT_COLOR_POOL = '#3B82F6'
const DOT_COLOR_PLACED = '#1D4ED8'
const DOT_COLOR_REMAINDER = '#F59E0B'
const BOX_BORDER = '#1E40AF'
const BOX_BG = '#EFF6FF'
const REMAINDER_LABEL_COLOR = '#B45309'
const SVG_PADDING = 16
const MAX_ITEMS_PER_ROW_IN_BOX = 5

/** Return box width/height based on divisor count (from spec). */
function boxDimensions(groups: number): { w: number; h: number } {
  if (groups <= 5) return { w: 120, h: 160 }
  if (groups <= 10) return { w: 90, h: 140 }
  return { w: 70, h: 120 }
}

/** Dot radius scales with box size. */
function dotRadius(groups: number): number {
  if (groups <= 5) return 9
  if (groups <= 10) return 7
  return 5
}

interface FairShareVisualProps {
  total: number
  groups: number
  distributedSoFar: number
  remainder: number
}

export function FairShareVisual({ total, groups, distributedSoFar, remainder }: FairShareVisualProps) {
  const { w: boxW, h: boxH } = boxDimensions(groups)
  const dr = dotRadius(groups)
  const boxGap = 12
  const totalBoxWidth = groups * boxW + (groups - 1) * boxGap

  // Pool area: dots in a row above group boxes
  const poolDots = total - distributedSoFar - remainder
  const POOL_DOT_SPACING = 22
  const POOL_Y = SVG_PADDING + dr + 4
  const BOXES_Y = POOL_Y + dr * 2 + 32

  const svgWidth = Math.max(totalBoxWidth + SVG_PADDING * 2, 360)
  const svgHeight = BOXES_Y + boxH + 60

  const boxesOffsetX = Math.floor((svgWidth - totalBoxWidth) / 2)

  // Compute items per group from distributed so far
  const itemsPerGroupSoFar = distributedSoFar > 0 ? Math.floor(distributedSoFar / groups) : 0
  const itemsInLastRound = distributedSoFar > 0 ? distributedSoFar % groups : 0

  const ariaLabel =
    `Fair share diagram: ${total} items being divided into ${groups} groups. ` +
    `${distributedSoFar} of ${total - remainder} items distributed. ` +
    `${itemsPerGroupSoFar} item${itemsPerGroupSoFar !== 1 ? 's' : ''} in each group so far.`

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      role="img"
      aria-label={ariaLabel}
      className="w-full max-w-full"
    >
      {/* Pool dots */}
      {Array.from({ length: poolDots }, (_, i) => (
        <circle
          key={`pool-${i}`}
          cx={SVG_PADDING + dr + i * POOL_DOT_SPACING}
          cy={POOL_Y}
          r={dr}
          fill={DOT_COLOR_POOL}
          opacity={0.85}
        />
      ))}

      {/* Remainder pile (after distribution) */}
      {remainder > 0 && distributedSoFar >= total - remainder && (
        <>
          {/* Dashed divider */}
          <line
            x1={SVG_PADDING + (total - remainder) * POOL_DOT_SPACING + dr}
            y1={POOL_Y - dr - 4}
            x2={SVG_PADDING + (total - remainder) * POOL_DOT_SPACING + dr}
            y2={POOL_Y + dr + 4}
            stroke={REMAINDER_LABEL_COLOR}
            strokeWidth={1.5}
            strokeDasharray="3 3"
          />
          {Array.from({ length: remainder }, (_, i) => (
            <circle
              key={`rem-${i}`}
              cx={SVG_PADDING + dr + (total - remainder + i) * POOL_DOT_SPACING}
              cy={POOL_Y}
              r={dr}
              fill={DOT_COLOR_REMAINDER}
            />
          ))}
          <text
            x={SVG_PADDING + dr + (total - remainder + Math.floor(remainder / 2)) * POOL_DOT_SPACING}
            y={POOL_Y + dr + 16}
            textAnchor="middle"
            fontSize={11}
            fill={REMAINDER_LABEL_COLOR}
            fontWeight="600"
            aria-label={`Remainder: ${remainder} items could not be shared equally.`}
          >
            Remainder: {remainder}
          </text>
        </>
      )}

      {/* Group boxes */}
      {Array.from({ length: groups }, (_, g) => {
        const bx = boxesOffsetX + g * (boxW + boxGap)
        const itemsInThisBox = itemsPerGroupSoFar + (g < itemsInLastRound ? 1 : 0)

        return (
          <g key={`group-${g}`}>
            <rect
              x={bx}
              y={BOXES_Y}
              width={boxW}
              height={boxH}
              fill={BOX_BG}
              stroke={BOX_BORDER}
              strokeWidth={1.5}
              rx={6}
            />
            {/* Group label */}
            <text
              x={bx + boxW / 2}
              y={BOXES_Y + boxH + 18}
              textAnchor="middle"
              fontSize={12}
              fill="#6B7280"
            >
              {g + 1}
            </text>
            {/* Placed dots inside the box */}
            {Array.from({ length: itemsInThisBox }, (_, idx) => {
              const col = idx % MAX_ITEMS_PER_ROW_IN_BOX
              const row = Math.floor(idx / MAX_ITEMS_PER_ROW_IN_BOX)
              const xPad = (boxW - MAX_ITEMS_PER_ROW_IN_BOX * (dr * 2 + 4)) / 2 + dr
              return (
                <circle
                  key={idx}
                  cx={bx + xPad + col * (dr * 2 + 4)}
                  cy={BOXES_Y + 16 + dr + row * (dr * 2 + 4)}
                  r={dr}
                  fill={DOT_COLOR_PLACED}
                />
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}
