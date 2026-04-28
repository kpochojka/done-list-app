'use client'

import { useTranslations } from 'next-intl'
import type { Task } from '@/types'
import { POINTS } from '@/lib/constants'
import { ProgressDots } from './ProgressDots'
import { getCategoryDisplayName } from './categoryName'
import { CategoryIcon } from '@/components/ui/Icon'

interface TaskCardProps {
  task: Task
  onComplete: (taskId: string) => void
  busy?: boolean
}

export function TaskCard({ task, onComplete, busy = false }: TaskCardProps) {
  const t = useTranslations('tasks')
  const tCat = useTranslations('categories')

  const categoryName = task.category
    ? getCategoryDisplayName(task.category, tCat)
    : ''
  const iconName = task.category?.icon ?? 'sparkles'
  const color = task.category?.color ?? 'var(--color-primary)'
  const entryCount = task.entryCount ?? 0

  return (
    <article style={styles.card}>
      <div style={{ ...styles.iconTile, background: tintFor(color) }}>
        <span style={{ ...styles.iconInk, color }}>
          <CategoryIcon name={iconName} size={22} strokeWidth={1.75} />
        </span>
      </div>

      <div style={styles.content}>
        <span style={styles.title}>{task.title}</span>
        {categoryName && (
          <span style={styles.categoryName}>{categoryName}</span>
        )}
        <div style={styles.progressRow}>
          <span style={styles.entryCountLabel}>
            {t('entryCount', { count: entryCount })}
          </span>
          <ProgressDots count={entryCount} max={5} color={color} />
        </div>
      </div>

      <button
        type="button"
        onClick={() => onComplete(task.id)}
        disabled={busy}
        style={busy ? styles.completeButtonDisabled : styles.completeButton}
      >
        {t('completeButton', { points: POINTS.TASK_COMPLETED })}
      </button>
    </article>
  )
}

/**
 * Soft tinted background for the icon tile — keeps the category color
 * recognizable without being loud. Falls back to the primary subtle if
 * the input is a CSS variable rather than a hex.
 */
function tintFor(color: string): string {
  if (color.startsWith('var(')) return 'var(--color-primary-subtle)'
  return `color-mix(in oklab, ${color} 16%, var(--bg-surface))`
}

const completeBase: React.CSSProperties = {
  flexShrink: 0,
  width: 96,
  padding: '10px 8px',
  borderRadius: 12,
  borderWidth: 1.5,
  borderStyle: 'solid',
  borderColor: 'var(--color-primary)',
  background: 'transparent',
  color: 'var(--color-primary)',
  fontSize: 11.5,
  fontWeight: 600,
  lineHeight: 1.25,
  letterSpacing: 0.1,
  cursor: 'pointer',
  textAlign: 'center',
  whiteSpace: 'normal',
  transition: 'background 0.15s, color 0.15s',
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'var(--bg-surface)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    borderRadius: 16,
    padding: 14,
    boxShadow: 'var(--shadow-card)',
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  iconInk: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: 1.35,
    wordBreak: 'break-word',
    letterSpacing: -0.01,
  },
  categoryName: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  progressRow: {
    marginTop: 6,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  entryCountLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  completeButton: completeBase,
  completeButtonDisabled: {
    ...completeBase,
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}
