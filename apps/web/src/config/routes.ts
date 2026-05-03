import type { ModeId } from '@mathviz/shared'

export const ROUTES = {
  HOME: '/',
  CALCULATOR: (modeId: ModeId) => `/calculators/${modeId}`,
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  QUIZ: (modeId: ModeId) => `/quiz/${modeId}`,
  LEADERBOARD: '/leaderboard',
} as const
