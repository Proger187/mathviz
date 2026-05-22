import { MODES } from '@mathviz/shared'
import type { ModeId } from '@mathviz/shared'

import type { NavIconName } from '@/components/icons/NavIcons'

import { ROUTES } from './routes'

export type NavItem = {
  href: string
  labelKey: string
  icon: NavIconName
  match?: (pathname: string) => boolean
}

export const MAIN_NAV: NavItem[] = [
  {
    href: ROUTES.HOME,
    labelKey: 'nav.home',
    icon: 'home',
    match: (p) => p === '/',
  },
  {
    href: ROUTES.LEADERBOARD,
    labelKey: 'nav.leaderboard',
    icon: 'trophy',
    match: (p) => p.startsWith('/leaderboard'),
  },
]

export const CALCULATOR_NAV: NavItem[] = (Object.keys(MODES) as ModeId[]).map((id) => ({
  href: ROUTES.CALCULATOR(id),
  labelKey: `modes.${id}.label`,
  icon: id,
  match: (p: string) => p === ROUTES.CALCULATOR(id),
}))

export const QUIZ_NAV: NavItem[] = (Object.keys(MODES) as ModeId[]).map((id) => ({
  href: ROUTES.QUIZ(id),
  labelKey: `modes.${id}.label`,
  icon: id,
  match: (p: string) => p.startsWith(ROUTES.QUIZ(id)),
}))

export const ACCOUNT_NAV: NavItem[] = [
  {
    href: ROUTES.DASHBOARD,
    labelKey: 'nav.dashboard',
    icon: 'user',
    match: (p) => p.startsWith('/dashboard'),
  },
]

export function sectionHasActive(items: NavItem[], pathname: string): boolean {
  return items.some((item) => (item.match ? item.match(pathname) : pathname === item.href))
}
