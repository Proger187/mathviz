import { cn } from '@/lib/cn'

interface FractionDisplayProps {
  numerator: number
  denominator: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: { num: 'text-base', line: 'border-t', den: 'text-base' },
  md: { num: 'text-xl', line: 'border-t-2', den: 'text-xl' },
  lg: { num: 'text-3xl', line: 'border-t-2', den: 'text-3xl' },
}

export function FractionDisplay({
  numerator,
  denominator,
  className,
  size = 'md',
}: FractionDisplayProps) {
  const s = sizeClasses[size]
  return (
    <span
      className={cn(
        'inline-flex min-w-[2ch] flex-col items-center font-mono leading-none',
        className,
      )}
      aria-label={`${numerator} over ${denominator}`}
    >
      <span className={cn('font-bold text-slate-900', s.num)}>{numerator}</span>
      <span className={cn('my-0.5 w-full border-slate-400', s.line)} aria-hidden />
      <span className={cn('font-bold text-slate-900', s.den)}>{denominator}</span>
    </span>
  )
}
