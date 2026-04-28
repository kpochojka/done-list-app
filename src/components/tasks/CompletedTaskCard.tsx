'use client'

import { useTranslations } from 'next-intl'
import type { Task } from '@/types'
import { getCategoryDisplayName } from './categoryName'

interface CompletedTaskCardProps {
  task: Task
}

export function CompletedTaskCard({ task }: CompletedTaskCardProps) {
  const t = useTranslations('tasks')
  const tCat = useTranslations('categories')

  const categoryName = task.category
    ? getCategoryDisplayName(task.category, tCat)
    : ''
  const icon = task.category?.icon ?? '✨'
  const color = task.category?.color ?? 'var(--text-muted)'

  return (
    <div style={styles.card}>
      <div style={{ ...styles.iconTile, background: color }}>
        <span aria-hidden style={styles.iconGlyph}>{icon}</span>
      </div>
      <div style={styles.titleCol}>
        <span style={styles.title}>{task.title}</span>
        {categoryName && (
          <span style={styles.categoryName}>{categoryName}</span>
        )}
      </div>
      <span style={styles.badge}>{t('completedBadge')}</span>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    background: 'var(--bg-surface-2)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 18,
    padding: 14,
    opacity: 0.75,
  },
  iconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    flexShrink: 0,
    filter: 'grayscale(0.4)',
  },
  iconGlyph: {
    opacity: 0.85,
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textDecoration: 'line-through',
    lineHeight: 1.35,
    wordBreak: 'break-word',
  },
  categoryName: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  badge: {
    flexShrink: 0,
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--color-success)',
    background: 'var(--color-success-subtle)',
    padding: '4px 10px',
    borderRadius: 999,
    whiteSpace: 'nowrap',
  },
}
