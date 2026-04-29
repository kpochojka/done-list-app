'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { X, Check } from 'lucide-react'
import type { Category, FocusDay } from '@/types'
import { CategoryIcon } from '@/components/ui/Icon'
import { getCategoryDisplayName } from '@/components/tasks/categoryName'
import { POINTS } from '@/lib/constants'

interface FocusDaySelectorProps {
  open: boolean
  focusDay: FocusDay | null
  categories: Category[]
  onClose: () => void
  onSave: (payload: {
    categoryId: string
    customTitle?: string | null
  }) => Promise<void>
  onRemove: () => Promise<void>
}

type Mode = 'category' | 'custom'

export function FocusDaySelector({
  open,
  focusDay,
  categories,
  onClose,
  onSave,
  onRemove,
}: FocusDaySelectorProps) {
  const t = useTranslations('focusDay')
  const tCat = useTranslations('categories')
  const tCommon = useTranslations('common')

  const [mode, setMode] = useState<Mode>('category')
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null)
  const [customTitle, setCustomTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [removing, setRemoving] = useState(false)

  useEffect(() => {
    if (open) {
      setMode('category')
      setSelectedCategoryId(focusDay?.categoryId ?? null)
      setCustomTitle(focusDay?.customTitle ?? '')
      setSubmitting(false)
      setRemoving(false)
    }
  }, [open, focusDay])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  const canSave =
    !submitting &&
    (mode === 'category' ? selectedCategoryId !== null : customTitle.trim().length > 0)

  const handleSave = async () => {
    if (!canSave) return
    setSubmitting(true)
    try {
      if (mode === 'category' && selectedCategoryId) {
        await onSave({ categoryId: selectedCategoryId })
      } else if (mode === 'custom') {
        const fallbackCategoryId = categories[0]?.id ?? ''
        await onSave({ categoryId: fallbackCategoryId, customTitle: customTitle.trim() })
      }
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await onRemove()
      onClose()
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div style={styles.backdrop} onClick={onClose} role="dialog" aria-modal>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.handle} aria-hidden />

        <div style={styles.header}>
          <h2 style={styles.title}>{t('selectorTitle')}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {focusDay && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={removing}
                style={styles.removeButton}
              >
                {removing ? '...' : t('removeButton')}
              </button>
            )}
            <button type="button" onClick={onClose} style={styles.closeButton} aria-label={tCommon('cancel')}>
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        <p style={styles.subtitle}>{t('selectorSubtitle')}</p>

        <div style={styles.list}>
          {categories.map((cat) => {
            const isSelected = mode === 'category' && selectedCategoryId === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => { setMode('category'); setSelectedCategoryId(cat.id) }}
                style={isSelected ? { ...styles.categoryRow, ...styles.categoryRowSelected } : styles.categoryRow}
              >
                <div style={{ ...styles.catIconTile, background: `color-mix(in oklab, ${cat.color} 16%, var(--bg-surface))` }}>
                  <CategoryIcon name={cat.icon} size={18} strokeWidth={1.75} color={cat.color} />
                </div>
                <span style={styles.catLabel}>{getCategoryDisplayName(cat, tCat)}</span>
                {isSelected && (
                  <span style={styles.checkIcon}>
                    <Check size={16} strokeWidth={2.5} color="var(--color-success)" />
                  </span>
                )}
              </button>
            )
          })}

          <button
            type="button"
            onClick={() => { setMode('custom'); setSelectedCategoryId(null) }}
            style={mode === 'custom' ? { ...styles.categoryRow, ...styles.categoryRowSelected } : styles.categoryRow}
          >
            <div style={{ ...styles.catIconTile, background: 'var(--bg-surface-2)' }}>
              <span style={{ fontSize: 16 }}>✏️</span>
            </div>
            <span style={styles.catLabel}>{t('customOption')}</span>
            {mode === 'custom' && (
              <span style={styles.checkIcon}>
                <Check size={16} strokeWidth={2.5} color="var(--color-success)" />
              </span>
            )}
          </button>
        </div>

        {mode === 'custom' && (
          <input
            autoFocus
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder={t('customOption')}
            style={styles.customInput}
            maxLength={100}
          />
        )}

        <div style={styles.reminderBox}>
          <span style={styles.reminderText}>
            {t('reminder', { entry: POINTS.FOCUS_ENTRY, complete: POINTS.FOCUS_COMPLETED })}
          </span>
        </div>

        <button
          type="button"
          disabled={!canSave}
          onClick={handleSave}
          style={canSave ? styles.saveButton : styles.saveButtonDisabled}
        >
          {submitting ? tCommon('loading') : t('saveButton')}
        </button>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'var(--bg-overlay)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    zIndex: 60,
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    background: 'var(--bg-surface)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: '12px 20px 32px',
    boxShadow: 'var(--shadow-modal)',
    maxHeight: '85vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    background: 'var(--border-default)',
    margin: '0 auto 4px',
    flexShrink: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--text-primary)',
    letterSpacing: -0.018,
  },
  removeButton: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--color-health, #ef4444)',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 0',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    border: 'none',
    background: 'var(--bg-surface-2)',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
    marginTop: -8,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  categoryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '12px 14px',
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    background: 'var(--bg-surface)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.15s, background 0.15s',
  },
  categoryRowSelected: {
    borderColor: 'var(--color-success)',
    background: 'var(--color-success-subtle)',
  },
  catIconTile: {
    width: 40,
    height: 40,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  catLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  checkIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
  customInput: {
    padding: '14px 16px',
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    background: 'var(--bg-surface-2)',
    color: 'var(--text-primary)',
    fontSize: 15,
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    marginTop: -4,
  },
  reminderBox: {
    background: 'var(--color-warning-subtle)',
    borderRadius: 12,
    padding: '12px 14px',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--color-focus-border)',
  },
  reminderText: {
    fontSize: 13,
    color: 'var(--color-warning)',
    fontWeight: 500,
    lineHeight: 1.5,
  },
  saveButton: {
    width: '100%',
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    background: 'var(--gradient-primary, var(--color-primary))',
    color: 'var(--text-inverse)',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 0.1,
    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.22)',
  },
  saveButtonDisabled: {
    width: '100%',
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    background: 'var(--bg-surface-3)',
    color: 'var(--text-muted)',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'not-allowed',
  },
}
