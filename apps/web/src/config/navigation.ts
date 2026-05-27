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

export type TopicNavItem = {
  id: ModeId
  labelKey: string
  icon: NavIconName
  children: NavItem[]
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

export const TOPICS_NAV: TopicNavItem[] = (Object.keys(MODES) as ModeId[]).map((id) => ({
  id,
  labelKey: `modes.${id}.label`,
  icon: id,
  children: [
    {
      href: ROUTES.CALCULATOR(id),
      labelKey: 'nav.learn',
      icon: 'calculator',
      match: (p: string) => p === ROUTES.CALCULATOR(id),
    },
    {
      href: ROUTES.QUIZ(id),
      labelKey: 'nav.quiz',
      icon: 'quiz',
      match: (p: string) => p.startsWith(ROUTES.QUIZ(id)),
    },
  ],
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

export function topicHasActive(items: TopicNavItem[], pathname: string): boolean {
  return items.some((topic) => sectionHasActive(topic.children, pathname))
}
