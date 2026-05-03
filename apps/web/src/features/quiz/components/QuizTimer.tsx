'use client'

import { useEffect, useRef, useState } from 'react'

interface QuizTimerProps {
  /** Total duration in seconds */
  durationSeconds: number
  /** Called when the timer reaches zero */
  onExpire?: () => void
}

/**
 * Countdown timer for quiz questions.
 * - Visual countdown displayed in a progress-bar style.
 * - Screen reader announcements every 10 seconds via aria-live="assertive",
 *   plus a final "Time's up!" announcement when the timer expires.
 * - Meets WCAG 2.1 AA: timer changes are not only visual.
 */
export function QuizTimer({ durationSeconds, onExpire }: QuizTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds)
  const lastAnnouncedRef = useRef<number | null>(null)
  const [announcement, setAnnouncement] = useState('')
  const expiredRef = useRef(false)

  useEffect(() => {
    setSecondsLeft(durationSeconds)
    lastAnnouncedRef.current = null
    expiredRef.current = false
    setAnnouncement('')
  }, [durationSeconds])

  useEffect(() => {
    if (secondsLeft <= 0) return

    const id = setInterval(() => {
      setSecondsLeft((s) => {
        const next = s - 1
        if (next <= 0 && !expiredRef.current) {
          expiredRef.current = true
          setAnnouncement("Time's up!")
          onExpire?.()
        }
        return next
      })
    }, 1000)

    return () => clearInterval(id)
  }, [secondsLeft, onExpire])

  // Announce at every 10-second interval
  useEffect(() => {
    if (secondsLeft <= 0) return
    if (secondsLeft % 10 === 0 && lastAnnouncedRef.current !== secondsLeft) {
      lastAnnouncedRef.current = secondsLeft
      setAnnouncement(`${secondsLeft} seconds remaining`)
    }
  }, [secondsLeft])

  const pct = Math.max(0, (secondsLeft / durationSeconds) * 100)
  const isWarning = secondsLeft <= 10
  const isDanger = secondsLeft <= 5

  return (
    <div className="flex flex-col gap-1" aria-label={`Quiz timer: ${secondsLeft} seconds remaining`}>
      {/* Visual bar */}
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200" role="none">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isDanger
              ? 'bg-red-500'
              : isWarning
                ? 'bg-amber-400'
                : 'bg-indigo-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Numeric countdown — visually shown */}
      <p className={`text-right text-xs tabular-nums font-medium ${isDanger ? 'text-red-600' : 'text-gray-500'}`}>
        {secondsLeft}s
      </p>

      {/* Screen-reader live region — announces every 10 s and on expiry */}
      <span
        role="timer"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </span>
    </div>
  )
}
