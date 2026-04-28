'use client'

import { useTranslations } from 'next-intl'
import { Calendar, CheckSquare, Gift, ListTodo, Sun, type LucideIcon } from 'lucide-react'
import { Link, usePathname } from '@/i18n/navigation'

type NavHref = '/today' | '/tasks' | '/tree' | '/rewards' | '/history'
type NavKey = 'today' | 'tasks' | 'tree' | 'rewards' | 'history'

interface NavItem {
  href: NavHref
  labelKey: NavKey
  Icon: LucideIcon
}

const ITEMS: NavItem[] = [
  { href: '/today',   labelKey: 'today',   Icon: Sun },
  { href: '/tasks',   labelKey: 'tasks',   Icon: ListTodo },
  { href: '/tree',    labelKey: 'tree',    Icon: CheckSquare },
  { href: '/rewards', labelKey: 'rewards', Icon: Gift },
  { href: '/history', labelKey: 'history', Icon: Calendar },
]

export function BottomNav() {
  const t = useTranslations('nav')
  const pathname = usePathname()

  return (
    <nav style={styles.nav} aria-label="Main navigation">
      {ITEMS.map(({ href, labelKey, Icon }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            style={active ? styles.itemActive : styles.item}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} strokeWidth={active ? 2 : 1.6} />
            <span style={styles.label}>{t(labelKey)}</span>
          </Link>
        )
      })}
    </nav>
  )
}

const itemBase: React.CSSProperties = {
  flex: 1,
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  padding: '10px 6px',
  fontSize: 11,
  fontWeight: 500,
  textDecoration: 'none',
  color: 'var(--text-muted)',
  borderRadius: 10,
  transition: 'color 0.15s',
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 40,
    display: 'flex',
    gap: 2,
    padding: '6px 8px calc(6px + env(safe-area-inset-bottom))',
    background: 'var(--bg-surface)',
    borderTopWidth: 1,
    borderTopStyle: 'solid',
    borderTopColor: 'var(--border-default)',
    boxShadow: 'var(--shadow-modal)',
    maxWidth: 560,
    margin: '0 auto',
  },
  item: itemBase,
  itemActive: {
    ...itemBase,
    color: 'var(--color-primary)',
    background: 'var(--color-primary-subtle)',
    fontWeight: 600,
  },
  label: {
    fontSize: 11,
    letterSpacing: 0.1,
  },
}
