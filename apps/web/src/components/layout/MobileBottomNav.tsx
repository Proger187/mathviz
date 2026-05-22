'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NavIcon, type NavIconName } from '@/components/icons/NavIcons'
import { ROUTES } from '@/config/routes'
import { useTranslation } from '@/i18n/useTranslation'
import { cn } from '@/lib/cn'

interface MobileBottomNavProps {
  onOpenMenu: () => void
}

export function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  const { t } = useTranslation()
  const pathname = usePathname()

  const items: {
    href: string
    labelKey: string
    icon: NavIconName
    match: (p: string) => boolean
  }[] = [
    { href: ROUTES.HOME, labelKey: 'nav.home', icon: 'home', match: (p) => p === '/' },
    {
      href: ROUTES.CALCULATOR('fractions'),
      labelKey: 'nav.calculators',
      icon: 'calculator',
      match: (p) => p.startsWith('/calculators'),
    },
    {
      href: ROUTES.LEADERBOARD,
      labelKey: 'nav.leaderboard',
      icon: 'trophy',
      match: (p) => p.startsWith('/leaderboard'),
    },
  ]

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden"
      aria-label={t('nav.quickNavigation')}
    >
      <ul className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const active = item.match(pathname)
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium leading-tight',
                  active ? 'text-indigo-600' : 'text-slate-600',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <NavIcon name={item.icon} className={cn('h-5 w-5', active && 'text-indigo-600')} />
                {t(item.labelKey)}
              </Link>
            </li>
          )
        })}
        <li>
          <button
            type="button"
            onClick={onOpenMenu}
            className="flex w-full flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium leading-tight text-slate-600 hover:text-indigo-600"
            aria-controls="app-sidebar"
          >
            <NavIcon name="menu" className="h-5 w-5" />
            {t('nav.menu')}
          </button>
        </li>
      </ul>
    </nav>
  )
}
