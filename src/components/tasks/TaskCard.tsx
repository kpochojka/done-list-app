'use client'

import { useTranslations } from 'next-intl'
import type { Task } from '@/types'
import { POINTS } from '@/lib/constants'
import { ProgressDots } from './ProgressDots'
import { getCategoryDisplayName } from './categoryName'

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
  const icon = task.category?.icon ?? '✨'
  const color = task.category?.color ?? 'var(--color-primary)'
  const entryCount = task.entryCount ?? 0

  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <div style={{ ...styles.iconTile, background: color }}>
          <span aria-hidden>{icon}</span>
        </div>
        <div style={styles.titleCol}>
          <span style={styles.title}>{task.title}</span>
          {categoryName && (
            <span style={styles.categoryName}>{categoryName}</span>
          )}
          <div style={styles.dotsRow}>
            <ProgressDots count={entryCount} max={5} />
          </div>
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
    </div>
  )
}

const completeBase: React.CSSProperties = {
  marginTop: 14,
  width: '100%',
  padding: '10px 14px',
  borderRadius: 12,
  border: '1.5px solid var(--color-primary)',
  background: 'transparent',
  color: 'var(--color-primary)',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'background 0.15s, color 0.15s',
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border-default)',
    borderRadius: 18,
    padding: 16,
    boxShadow: 'var(--shadow-card)',
  },
  row: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-start',
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
    flexShrink: 0,
  },
  titleCol: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.35,
    wordBreak: 'break-word',
  },
  categoryName: {
    fontSize: 12,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  dotsRow: {
    marginTop: 6,
  },
  completeButton: completeBase,
  completeButtonDisabled: {
    ...completeBase,
    opacity: 0.5,
    cursor: 'not-allowed',
  },
}
