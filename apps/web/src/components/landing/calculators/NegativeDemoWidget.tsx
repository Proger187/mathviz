'use client'

import { useState } from 'react'
import { useTranslation } from '@/i18n/useTranslation'

export function NegativeDemoWidget() {
  const { t } = useTranslation()
  const [a, setA] = useState(-2)
  const [b, setB] = useState(3)
  const [showAnimation, setShowAnimation] = useState(false)

  const result = a + b

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600">First number</label>
          <input
            type="number"
            min="-5"
            max="5"
            value={a}
            onChange={(e) => setA(parseInt(e.target.value) || 0)}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">Second number</label>
          <input
            type="number"
            min="-5"
            max="5"
            value={b}
            onChange={(e) => setB(parseInt(e.target.value) || 0)}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Number Line Visualization */}
      <div className="flex flex-col items-center gap-3 bg-indigo-50 rounded-lg p-4 h-24 justify-center">
        <svg width="100%" height="60" viewBox="0 0 200 60" className="drop-shadow-sm">
          {/* Number line */}
          <line x1="20" y1="30" x2="180" y2="30" stroke="#D1D5DB" strokeWidth="2" />

          {/* Tick marks and labels */}
          {[-5, -3, -1, 1, 3, 5].map((num) => {
            const x = 20 + ((num + 5) / 10) * 160
            return (
              <g key={num}>
                <line x1={x} y1="25" x2={x} y2="35" stroke="#D1D5DB" strokeWidth="1" />
                <text x={x} y="50" textAnchor="middle" fontSize="10" fill="#6B7280">
                  {num}
                </text>
              </g>
            )
          })}

          {/* Position marker for result */}
          <circle cx={20 + ((result + 5) / 10) * 160} cy="30" r="6" fill="#6366F1" opacity="0.7" />
        </svg>
      </div>

      {/* Display */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-center">
        <p className="text-sm text-indigo-600">
          {a} + {b}
        </p>
        <p className="text-2xl font-bold text-indigo-700">{result}</p>
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
