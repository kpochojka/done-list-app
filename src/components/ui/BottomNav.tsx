'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'

type NavItem = {
  href: '/today' | '/tasks' | '/tree' | '/rewards' | '/history'
  labelKey: 'today' | 'tasks' | 'tree' | 'rewards' | 'history'
  icon: string
}

const ITEMS: NavItem[] = [
  { href: '/today',   labelKey: 'today',   icon: '☀️' },
  { href: '/tasks',   labelKey: 'tasks',   icon: '✅' },
  { href: '/tree',    labelKey: 'tree',    icon: '🌳' },
  { href: '/rewards', labelKey: 'rewards', icon: '🎁' },
  { href: '/history', labelKey: 'history', icon: '📅' },
]

export function BottomNav() {
  const t = useTranslations('nav')
  const pathname = usePathname()

  return (
    <nav style={styles.nav} aria-label="Main navigation">
      {ITEMS.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            style={active ? styles.itemActive : styles.item}
            aria-current={active ? 'page' : undefined}
          >
            <span aria-hidden style={styles.icon}>{item.icon}</span>
            <span style={styles.label}>{t(item.labelKey)}</span>
          </Link>
        )
      })}
    </nav>
  )
}

const itemBase: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 2,
  padding: '8px 6px',
  fontSize: 11,
  fontWeight: 600,
  textDecoration: 'none',
  color: 'var(--text-muted)',
  borderRadius: 12,
  transition: 'color 0.15s, background 0.15s',
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    display: 'flex',
    gap: 4,
    padding: '8px 8px calc(8px + env(safe-area-inset-bottom))',
    background: 'var(--bg-surface)',
    borderTop: '1px solid var(--border-default)',
    boxShadow: 'var(--shadow-modal)',
    maxWidth: 560,
    margin: '0 auto',
  },
  item: itemBase,
  itemActive: {
    ...itemBase,
    color: 'var(--color-primary)',
    background: 'var(--color-primary-subtle)',
    fontWeight: 700,
  },
  icon: {
    fontSize: 20,
    lineHeight: 1,
  },
  label: {
    fontSize: 11,
  },
}
