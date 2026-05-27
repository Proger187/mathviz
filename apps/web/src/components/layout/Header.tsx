'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

import { MODES } from '@mathviz/shared'

import { ROUTES } from '@/config/routes'
import { useTranslation } from '@/i18n/useTranslation'

import { LanguageSwitcher } from './LanguageSwitcher'

export function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  // Focus trap inside mobile menu
  useEffect(() => {
    if (!menuOpen) return
    const el = menuRef.current
    if (!el) return
    const focusable = el.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    function trapTab(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    el.addEventListener('keydown', trapTab)
    return () => el.removeEventListener('keydown', trapTab)
  }, [menuOpen])

  const navLinks = (
    <>
      {Object.values(MODES).map((mode) => (
        <Link
          key={mode.id}
          href={ROUTES.CALCULATOR(mode.id)}
          className="flex items-center gap-1.5 hover:text-gray-900"
          onClick={() => setMenuOpen(false)}
        >
          <span>{mode.icon}</span>
          <span className="capitalize">{mode.id}</span>
        </Link>
      ))}
      <Link
        href={ROUTES.LEADERBOARD}
        className="hover:text-gray-900"
        onClick={() => setMenuOpen(false)}
      >
        {t('nav.leaderboard')}
      </Link>
      <Link
        href={ROUTES.DASHBOARD}
        className="hover:text-gray-900"
        onClick={() => setMenuOpen(false)}
      >
        {t('nav.dashboard')}
      </Link>
    </>
  )

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        {/* Logo */}
        <Link href={ROUTES.HOME} className="text-lg font-bold text-indigo-600">
          {t('common.appName')}
        </Link>

        {/* Desktop nav */}
        <nav
          aria-label={t('nav.mainNavigation')}
          className="hidden items-center gap-5 text-sm font-medium text-gray-600 md:flex"
        >
          {navLinks}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href={ROUTES.LOGIN}
            className="hidden rounded-md border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 md:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {t('nav.login')}
          </Link>
          <Link
            href={ROUTES.REGISTER}
            className="hidden rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-indigo-700 md:block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            {t('nav.register')}
          </Link>

          {/* Hamburger button — visible on mobile only */}
          <button
            ref={triggerRef}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? (
              // X icon
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M2 2L16 16M16 2L2 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path
                  d="M2 4h14M2 9h14M2 14h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div
          id="mobile-nav"
          ref={menuRef}
          role="dialog"
          aria-label={t('nav.openMenu')}
          className="border-t border-gray-100 bg-white px-4 py-4 md:hidden"
        >
          <nav
            className="flex flex-col gap-4 text-sm font-medium text-gray-600"
            aria-label={t('nav.openMenu')}
          >
            {navLinks}
            <div className="flex gap-3 border-t border-gray-100 pt-4">
              <Link
                href={ROUTES.LOGIN}
                className="flex-1 rounded-md border border-gray-200 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
              <Link
                href={ROUTES.REGISTER}
                className="flex-1 rounded-md bg-indigo-600 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                onClick={() => setMenuOpen(false)}
              >
                {t('nav.register')}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
