'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { Category } from '@/types'
import { getCategoryDisplayName } from './categoryName'

interface AddTaskModalProps {
  open: boolean
  categories: Category[]
  onClose: () => void
  onSubmit: (payload: { title: string; categoryId: string }) => Promise<void>
}

export function AddTaskModal({
  open,
  categories,
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  const t = useTranslations('tasks')
  const tCommon = useTranslations('common')
  const tCat = useTranslations('categories')

  const [title, setTitle] = useState('')
  const [categoryId, setCategoryId] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle('')
      setCategoryId(categories[0]?.id ?? '')
      setSubmitting(false)
    }
  }, [open, categories])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const canSubmit =
    title.trim().length > 0 && categoryId.length > 0 && !submitting

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return
    setSubmitting(true)
    try {
      await onSubmit({ title: title.trim(), categoryId })
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.backdrop} onClick={onClose} role="dialog" aria-modal>
      <div style={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div style={styles.handle} aria-hidden />
        <div style={styles.header}>
          <h2 style={styles.title}>{t('addTitle')}</h2>
          <button
            type="button"
            onClick={onClose}
            style={styles.closeButton}
            aria-label={tCommon('cancel')}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('titlePlaceholder')}
              style={styles.input}
              maxLength={140}
            />
          </div>

          <div style={styles.field}>
            <span style={styles.label}>{t('categoryLabel')}</span>
            <div style={styles.categoryGrid}>
              {categories.map((c) => {
                const active = categoryId === c.id
                return (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategoryId(c.id)}
                    style={
                      active
                        ? {
                            ...styles.categoryChip,
                            ...styles.categoryChipActive,
                            borderColor: c.color,
                            background: c.color,
                          }
                        : styles.categoryChip
                    }
                  >
                    <span aria-hidden style={styles.catIcon}>{c.icon}</span>
                    <span>{getCategoryDisplayName(c, tCat)}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
            >
              {tCommon('cancel')}
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              style={canSubmit ? styles.saveButton : styles.saveButtonDisabled}
            >
              {submitting ? tCommon('loading') : tCommon('save')}
            </button>
          </div>
        </form>
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
    zIndex: 50,
    animation: 'fadeIn 0.2s ease-out',
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    background: 'var(--bg-surface)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: '12px 20px 24px',
    boxShadow: 'var(--shadow-modal)',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    background: 'var(--border-default)',
    margin: '0 auto 16px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: 800,
    color: 'var(--text-primary)',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    border: 'none',
    background: 'var(--bg-surface-2)',
    color: 'var(--text-secondary)',
    fontSize: 16,
    cursor: 'pointer',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  input: {
    padding: '14px 16px',
    borderRadius: 14,
    border: '1.5px solid var(--border-default)',
    background: 'var(--bg-surface-2)',
    color: 'var(--text-primary)',
    fontSize: 15,
    outline: 'none',
    width: '100%',
  },
  categoryGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 14px',
    borderRadius: 999,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    background: 'var(--bg-surface-2)',
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
  },
  categoryChipActive: {
    color: 'var(--text-inverse)',
  },
  catIcon: {
    fontSize: 14,
    lineHeight: 1,
  },
  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 6,
  },
  cancelButton: {
    flex: 1,
    padding: '14px',
    borderRadius: 14,
    border: '1.5px solid var(--border-default)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  saveButton: {
    flex: 2,
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    background: 'var(--color-primary)',
    color: 'var(--text-inverse)',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
  },
  saveButtonDisabled: {
    flex: 2,
    padding: '14px',
    borderRadius: 14,
    border: 'none',
    background: 'var(--color-primary-light)',
    color: 'var(--text-inverse)',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'not-allowed',
    opacity: 0.6,
  },
}
