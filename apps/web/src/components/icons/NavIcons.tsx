import type { ReactNode } from 'react'

import type { ModeId } from '@mathviz/shared'

import { cn } from '@/lib/cn'

export type NavIconName =
  | 'home'
  | 'trophy'
  | 'user'
  | 'calculator'
  | 'quiz'
  | 'chevron'
  | 'logout'
  | 'menu'
  | ModeId

const iconClass = 'h-5 w-5 shrink-0'

function Svg({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(iconClass, className)}
      aria-hidden
    >
      {children}
    </svg>
  )
}

export function NavIcon({
  name,
  className,
}: {
  name: NavIconName
  className?: string | undefined
}) {
  switch (name) {
    case 'home':
      return (
        <Svg className={className}>
          <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z" />
        </Svg>
      )
    case 'trophy':
      return (
        <Svg className={className}>
          <path d="M8 21h8M12 17v4M7 4h10v3a5 5 0 0 1-10 0V4zM5 4H3v1a3 3 0 0 0 3 3M19 4h2v1a3 3 0 0 1-3 3" />
        </Svg>
      )
    case 'user':
      return (
        <Svg className={className}>
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
        </Svg>
      )
    case 'calculator':
      return (
        <Svg className={className}>
          <rect x="5" y="3" width="14" height="18" rx="2" />
          <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0" />
        </Svg>
      )
    case 'quiz':
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9a2.5 2.5 0 1 1 4.2 1.8c-.8.7-1.2 1.2-1.2 2.2M12 17h.01" />
        </Svg>
      )
    case 'fractions':
      return (
        <Svg className={className}>
          <circle cx="8" cy="8" r="3" />
          <circle cx="16" cy="16" r="3" />
          <path d="M11 11l2 2" />
        </Svg>
      )
    case 'negative':
      return (
        <Svg className={className}>
          <path d="M4 12h16" />
          <path d="M8 8v8M16 6v12" />
        </Svg>
      )
    case 'multiplication':
      return (
        <Svg className={className}>
          <rect x="5" y="5" width="6" height="6" rx="1" />
          <rect x="13" y="5" width="6" height="6" rx="1" />
          <rect x="5" y="13" width="6" height="6" rx="1" />
          <rect x="13" y="13" width="6" height="6" rx="1" />
        </Svg>
      )
    case 'division':
      return (
        <Svg className={className}>
          <circle cx="12" cy="6" r="1.5" fill="currentColor" stroke="none" />
          <path d="M5 12h14" />
          <circle cx="12" cy="18" r="1.5" fill="currentColor" stroke="none" />
        </Svg>
      )
    case 'chevron':
      return (
        <Svg className={className}>
          <path d="M9 6l6 6-6 6" />
        </Svg>
      )
    case 'logout':
      return (
        <Svg className={className}>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
        </Svg>
      )
    case 'menu':
      return (
        <Svg className={className}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </Svg>
      )
    default:
      return (
        <Svg className={className}>
          <circle cx="12" cy="12" r="8" />
        </Svg>
      )
  }
}
