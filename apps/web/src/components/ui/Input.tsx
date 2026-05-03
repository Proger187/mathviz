import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ label, error, id, className, ...rest }: InputProps) {
  const descId = error ? `${id}-error` : undefined

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={descId}
        aria-invalid={error !== undefined}
        className={cn(
          'rounded-lg border px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1',
          error ? 'border-red-500' : 'border-gray-300',
          className,
        )}
        {...rest}
      />
      {error && (
        <p id={descId} className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
