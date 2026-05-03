import { cn } from '@/lib/cn'

export interface BadgeProps {
  label: string
  icon?: string
  variant?: 'earned' | 'locked'
}

export function Badge({ label, icon, variant = 'earned' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant === 'earned'
          ? 'bg-indigo-100 text-indigo-700'
          : 'bg-gray-100 text-gray-400',
      )}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {label}
    </span>
  )
}
