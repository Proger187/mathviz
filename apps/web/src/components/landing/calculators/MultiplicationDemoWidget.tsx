'use client'

import { useState } from 'react'

export function MultiplicationDemoWidget() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [showAnimation, setShowAnimation] = useState(false)

  const result = a * b

  return (
    <div className="space-y-4">
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600">Width</label>
          <input
            type="number"
            min="1"
            max="8"
            value={a}
            onChange={(e) => setA(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">Height</label>
          <input
            type="number"
            min="1"
            max="8"
            value={b}
            onChange={(e) => setB(Math.max(1, parseInt(e.target.value) || 1))}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Area Grid Visualization */}
      <div className="flex items-center justify-center bg-indigo-50 rounded-lg p-3 min-h-24">
        <svg
          width={Math.min(120, 30 * a)}
          height={Math.min(120, 30 * b)}
          viewBox={`0 0 ${Math.max(120, 30 * a)} ${Math.max(120, 30 * b)}`}
          className="drop-shadow-sm"
        >
          {Array.from({ length: a }).map((_, i) =>
            Array.from({ length: b }).map((_, j) => (
              <rect
                key={`${i}-${j}`}
                x={i * 25}
                y={j * 25}
                width="24"
                height="24"
                fill="#FCD34D"
                stroke="#FBBF24"
                strokeWidth="1"
              />
            )),
          )}
        </svg>
      </div>

      {/* Display */}
      <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-center">
        <p className="text-sm text-indigo-600">
          {a} × {b}
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
