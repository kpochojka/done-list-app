'use client'

import { useTranslations } from 'next-intl'
import { Info, Target, Check } from 'lucide-react'
import type { Category, FocusDay } from '@/types'
import { getCategoryDisplayName } from '@/components/tasks/categoryName'
import { POINTS } from '@/lib/constants'

interface FocusDayCardProps {
  focusDay: FocusDay | null
  categories: Category[]
  onEdit: () => void
  onComplete?: () => void
}

export function FocusDayCard({ focusDay, categories, onEdit, onComplete }: FocusDayCardProps) {
  const t = useTranslations('focusDay')
  const tCat = useTranslations('categories')

  if (!focusDay) {
    return (
      <button type="button" onClick={onEdit} style={styles.unsetCard}>
        <Target size={16} strokeWidth={1.75} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        <span style={styles.unsetText}>{t('setPrompt')}</span>
      </button>
    )
  }

  const cat = focusDay.category ?? categories.find((c) => c.id === focusDay.categoryId)
  const focusName = focusDay.customTitle
    ? focusDay.customTitle
    : cat
      ? getCategoryDisplayName(cat, tCat)
      : ''

  return (
    <div
      style={styles.setCard}
      onClick={onEdit}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onEdit() }}
    >
      <div style={styles.cardInner}>
        {/* Left: text content */}
        <div style={styles.textSide}>
          <div style={styles.labelRow}>
            <span style={styles.label}>{t('label')}</span>
            <Info size={13} strokeWidth={1.75} style={{ color: 'var(--text-muted)', marginLeft: 4, flexShrink: 0 }} />
          </div>

          <span style={styles.focusName}>{focusName}</span>
          <span style={styles.priorityLabel}>{t('priorityLabel')}</span>

          <div style={styles.pills}>
            <span style={styles.pill}>{t('bonusEntry', { points: POINTS.FOCUS_ENTRY })}</span>
            <span style={styles.pill}>{t('bonusComplete', { points: POINTS.FOCUS_COMPLETED })}</span>
          </div>
        </div>

        {/* Right: decorative illustration */}
        <div style={styles.illustration} aria-hidden>
          🎯
        </div>
      </div>

      {/* Complete button or completed badge */}
      {focusDay.isCompleted ? (
        <div style={styles.completedBadge}>
          <Check size={14} strokeWidth={2.5} style={{ color: 'var(--color-success)' }} />
          <span style={styles.completedBadgeText}>{t('completedBadge')}</span>
        </div>
      ) : (
        onComplete && (
          <button
            type="button"
            style={styles.completeButton}
            onClick={(e) => {
              e.stopPropagation()
              onComplete()
            }}
          >
            <Check size={14} strokeWidth={2.5} />
            {t('completeButton')}
          </button>
        )
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  unsetCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '14px 16px',
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'var(--border-default)',
    background: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
  },
  unsetText: {
    fontSize: 14,
    color: 'var(--text-muted)',
    fontWeight: 500,
  },
  setCard: {
    width: '100%',
    padding: '16px 18px',
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    background: 'var(--bg-surface)',
    cursor: 'pointer',
    textAlign: 'left',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  cardInner: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  textSide: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  labelRow: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: 0.2,
  },
  focusName: {
    fontSize: 20,
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: -0.02,
    lineHeight: 1.2,
  },
  priorityLabel: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    marginBottom: 8,
  },
  pills: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
  },
  pill: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--color-warning)',
    background: 'rgba(245, 158, 11, 0.12)',
    borderRadius: 999,
    padding: '4px 10px',
    whiteSpace: 'nowrap',
  },
  illustration: {
    fontSize: 56,
    lineHeight: 1,
    flexShrink: 0,
    marginBottom: -4,
    filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.10))',
    userSelect: 'none',
  },
  completeButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: '100%',
    padding: '10px 16px',
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: 'var(--color-success)',
    background: 'var(--color-success-subtle)',
    color: 'var(--color-success)',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },
  completedBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 12,
    background: 'var(--color-success-subtle)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  completedBadgeText: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--color-success)',
  },
}
