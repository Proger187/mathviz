'use client'

import { useState } from 'react'

export function FractionDemoWidget() {
  const [numerator, setNumerator] = useState(1)
  const [denominator, setDenominator] = useState(2)
  const [showAnimation, setShowAnimation] = useState(false)

  const slices = Array.from({ length: denominator }, (_, i) => i)

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600">Numerator</label>
          <input
            type="number"
            min="1"
            max="8"
            value={numerator}
            onChange={(e) => setNumerator(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">Denominator</label>
          <input
            type="number"
            min="2"
            max="8"
            value={denominator}
            onChange={(e) => setDenominator(Math.max(2, parseInt(e.target.value) || 2))}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Pizza Visualization */}
      <div className="flex h-24 items-center justify-center bg-indigo-50 rounded-lg">
        <svg width="120" height="120" viewBox="0 0 120 120" className="drop-shadow-sm">
          {slices.map((i) => {
            const angle = (i / denominator) * 360
            const nextAngle = ((i + 1) / denominator) * 360
            const isSelected = i < numerator

            const x1 = 60 + 50 * Math.cos((angle * Math.PI) / 180)
            const y1 = 60 + 50 * Math.sin((angle * Math.PI) / 180)
            const x2 = 60 + 50 * Math.cos((nextAngle * Math.PI) / 180)
            const y2 = 60 + 50 * Math.sin((nextAngle * Math.PI) / 180)

            const largeArc = nextAngle - angle > 180 ? 1 : 0
            const pathData = `M 60 60 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`

            return (
              <path
                key={i}
                d={pathData}
                fill={isSelected ? '#FCD34D' : '#E0E7FF'}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
            )
          })}
          <circle cx="60" cy="60" r="50" fill="none" stroke="#D1D5DB" strokeWidth="2" />
        </svg>
      </div>

      {/* Display */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-center">
        <p className="text-2xl font-bold text-indigo-700">
          {numerator}/{denominator}
        </p>
      </div>

      {/* Calculate Button */}
      <button
        onClick={() => setShowAnimation(!showAnimation)}
        className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        {showAnimation ? 'Reset' : 'Calculate'}
      </button>
    </div>
  )
}
