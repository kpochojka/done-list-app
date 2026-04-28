'use client'

import { useTranslations } from 'next-intl'
import { Check } from 'lucide-react'
import type { Task } from '@/types'
import { getCategoryDisplayName } from './categoryName'
import { CategoryIcon } from '@/components/ui/Icon'

interface CompletedTaskCardProps {
  task: Task
}

export function CompletedTaskCard({ task }: CompletedTaskCardProps) {
  const t = useTranslations('tasks')
  const tCat = useTranslations('categories')

  const categoryName = task.category
    ? getCategoryDisplayName(task.category, tCat)
    : ''
  const iconName = task.category?.icon ?? 'sparkles'

  return (
    <div style={styles.card}>
      <div style={styles.iconTile}>
        <CategoryIcon name={iconName} size={16} strokeWidth={1.6} />
      </div>
      <div style={styles.titleCol}>
        <span style={styles.title}>{task.title}</span>
        {categoryName && (
          <span style={styles.categoryName}>{categoryName}</span>
        )}
      </div>
      <span style={styles.badge}>
        <Check size={12} strokeWidth={2.25} />
        {t('completedBadge')}
      </span>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    gap: 12,
    alignItems: 'center',
    background: 'var(--bg-surface-2)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-subtle)',
    borderRadius: 14,
    padding: 14,
    opacity: 0.78,
  },
  iconTile: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: 'var(--text-muted)',
    background: 'var(--bg-surface-3)',
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
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textDecoration: 'line-through',
    lineHeight: 1.4,
    wordBreak: 'break-word',
    letterSpacing: -0.005,
  },
  categoryName: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  badge: {
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--color-success)',
    background: 'var(--color-success-subtle)',
    padding: '4px 10px',
    borderRadius: 999,
    whiteSpace: 'nowrap',
    letterSpacing: 0.2,
  },
}
