export interface SpinnerProps {
  label?: string
  className?: string
}

export function Spinner({ label = 'Loading...', className }: SpinnerProps) {
  return (
    <span role="status" aria-label={label} className={className}>
      <span
        aria-hidden="true"
        className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600"
      />
      <span className="sr-only">{label}</span>
    </span>
  )
}
