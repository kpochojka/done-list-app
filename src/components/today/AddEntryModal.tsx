'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import type { Category, DailyEntry, FocusDay, Task } from '@/types'
import { CategoryIcon } from '@/components/ui/Icon'
import { getCategoryDisplayName } from '@/components/tasks/categoryName'
import { POINTS } from '@/lib/constants'

type Tab = 'list' | 'custom'

interface AddEntryModalProps {
  open: boolean
  focusDay: FocusDay | null
  categories: Category[]
  tasks: Task[]
  todayPoints: number
  onClose: () => void
  onSubmit: (payload: {
    taskId: string | null
    categoryId: string
    title: string
  }) => Promise<DailyEntry>
  onSuccess: (entry: DailyEntry, pointsEarned: number) => void
}

export function AddEntryModal({
  open,
  focusDay,
  categories,
  tasks,
  todayPoints,
  onClose,
  onSubmit,
  onSuccess,
}: AddEntryModalProps) {
  const t = useTranslations('addEntry')
  const tCommon = useTranslations('common')
  const tTasks = useTranslations('tasks')
  const tCat = useTranslations('categories')

  const [tab, setTab] = useState<Tab>('list')
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [customCategoryId, setCustomCategoryId] = useState<string>('')
  const [customText, setCustomText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) {
      setTab('list')
      setCategoryFilter(null)
      setSelectedTaskId(null)
      setDescription('')
      setCustomCategoryId(categories[0]?.id ?? '')
      setCustomText('')
      setSubmitting(false)
    }
  }, [open, categories])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  const filteredTasks = useMemo(
    () => (categoryFilter ? tasks.filter((t) => t.categoryId === categoryFilter) : tasks),
    [tasks, categoryFilter]
  )

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null

  const isListFocus =
    focusDay !== null && selectedTask !== null && selectedTask.categoryId === focusDay.categoryId
  const isCustomFocus = focusDay !== null && customCategoryId === focusDay.categoryId

  const listPoints = isListFocus ? POINTS.FOCUS_ENTRY : POINTS.DAILY_ENTRY
  const customPoints = isCustomFocus ? POINTS.FOCUS_ENTRY : POINTS.DAILY_ENTRY

  const canSubmitList = selectedTaskId !== null && description.trim().length > 0 && !submitting
  const canSubmitCustom = customText.trim().length > 0 && customCategoryId !== '' && !submitting

  if (!open) return null

  const handleListSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmitList || !selectedTask) return
    setSubmitting(true)
    try {
      const entry = await onSubmit({
        taskId: selectedTask.id,
        categoryId: selectedTask.categoryId,
        title: description.trim(),
      })
      onSuccess(entry, listPoints)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmitCustom) return
    setSubmitting(true)
    try {
      const entry = await onSubmit({
        taskId: null,
        categoryId: customCategoryId,
        title: customText.trim(),
      })
      onSuccess(entry, customPoints)
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
          <h2 style={styles.title}>{t('title')}</h2>
          <button type="button" onClick={onClose} style={styles.closeButton} aria-label={tCommon('cancel')}>
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            type="button"
            onClick={() => setTab('list')}
            style={tab === 'list' ? { ...styles.tabBtn, ...styles.tabBtnActive } : styles.tabBtn}
          >
            {t('tabFromList')}
          </button>
          <button
            type="button"
            onClick={() => setTab('custom')}
            style={tab === 'custom' ? { ...styles.tabBtn, ...styles.tabBtnActive } : styles.tabBtn}
          >
            {t('tabCustom')}
          </button>
        </div>

        {tab === 'list' ? (
          <form onSubmit={handleListSubmit} style={styles.form}>
            {/* Category filter chips */}
            <div style={styles.filterRow}>
              <button
                type="button"
                onClick={() => { setCategoryFilter(null); setSelectedTaskId(null) }}
                style={categoryFilter === null ? { ...styles.filterChip, ...styles.filterChipActive } : styles.filterChip}
              >
                {tTasks('filterAll')}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => { setCategoryFilter(cat.id); setSelectedTaskId(null) }}
                  style={
                    categoryFilter === cat.id
                      ? { ...styles.filterChip, ...styles.filterChipActive, borderColor: cat.color, background: cat.color, color: '#fff' }
                      : styles.filterChip
                  }
                >
                  <CategoryIcon name={cat.icon} size={13} strokeWidth={1.75} />
                  <span>{getCategoryDisplayName(cat, tCat)}</span>
                </button>
              ))}
            </div>

            {/* Task list */}
            <div style={styles.taskList}>
              {filteredTasks.length === 0 ? (
                <p style={styles.emptyTasks}>{tTasks('emptyActive')}</p>
              ) : (
                filteredTasks.map((task) => {
                  const cat = task.category ?? categories.find((c) => c.id === task.categoryId)
                  const isFocusTask = focusDay !== null && task.categoryId === focusDay.categoryId
                  const isSelected = selectedTaskId === task.id
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => setSelectedTaskId(task.id)}
                      style={isSelected ? { ...styles.taskRow, ...styles.taskRowSelected } : styles.taskRow}
                    >
                      {cat && (
                        <div style={{ ...styles.taskIconTile, background: `color-mix(in oklab, ${cat.color} 16%, var(--bg-surface))` }}>
                          <CategoryIcon name={cat.icon} size={16} strokeWidth={1.75} color={cat.color} />
                        </div>
                      )}
                      <div style={styles.taskInfo}>
                        <span style={styles.taskTitle}>{task.title}</span>
                        {cat && <span style={styles.taskCat}>{getCategoryDisplayName(cat, tCat)}</span>}
                      </div>
                      {isFocusTask && (
                        <span style={styles.focusBadge}>{t('focusBadge', { points: POINTS.FOCUS_ENTRY })}</span>
                      )}
                    </button>
                  )
                })
              )}
            </div>

            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('descriptionPlaceholder')}
              style={styles.input}
              maxLength={200}
            />

            <p style={styles.reminder}>{t('reminder')}</p>

            <button
              type="submit"
              disabled={!canSubmitList}
              style={canSubmitList ? styles.submitButton : styles.submitButtonDisabled}
            >
              {submitting ? tCommon('loading') : t('submitButton')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCustomSubmit} style={styles.form}>
            <span style={styles.fieldLabel}>{t('categoryLabel')}</span>
            <div style={styles.categoryGrid}>
              {categories.map((cat) => {
                const isActive = customCategoryId === cat.id
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCustomCategoryId(cat.id)}
                    style={
                      isActive
                        ? { ...styles.catChip, borderColor: cat.color, background: cat.color }
                        : styles.catChip
                    }
                  >
                    <CategoryIcon
                      name={cat.icon}
                      size={14}
                      strokeWidth={1.75}
                      color={isActive ? '#fff' : cat.color}
                    />
                    <span style={{ color: isActive ? '#fff' : 'var(--text-secondary)' }}>
                      {getCategoryDisplayName(cat, tCat)}
                    </span>
                  </button>
                )
              })}
            </div>

            {isCustomFocus && (
              <span style={styles.focusBadgeCustom}>{t('focusBadge', { points: POINTS.FOCUS_ENTRY })}</span>
            )}

            <input
              autoFocus={tab === 'custom'}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder={t('customPlaceholder')}
              style={styles.input}
              maxLength={200}
            />

            <p style={styles.reminder}>{t('reminder')}</p>

            <button
              type="submit"
              disabled={!canSubmitCustom}
              style={canSubmitCustom ? styles.submitButton : styles.submitButtonDisabled}
            >
              {submitting ? tCommon('loading') : t('submitButton')}
            </button>
          </form>
        )}
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
    zIndex: 70,
  },
  sheet: {
    width: '100%',
    maxWidth: 480,
    background: 'var(--bg-surface)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: '12px 20px 32px',
    boxShadow: 'var(--shadow-modal)',
    maxHeight: '90vh',
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
  tabs: {
    display: 'flex',
    background: 'var(--bg-surface-2)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    padding: '10px 8px',
    borderRadius: 9,
    border: 'none',
    background: 'transparent',
    color: 'var(--text-secondary)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.15s, color 0.15s',
  },
  tabBtnActive: {
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    boxShadow: 'var(--shadow-card)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  filterRow: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 2,
    scrollbarWidth: 'none',
  },
  filterChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '6px 12px',
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    background: 'var(--bg-surface-2)',
    color: 'var(--text-secondary)',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  filterChipActive: {
    background: 'var(--color-primary-subtle)',
    borderColor: 'var(--color-primary-light)',
    color: 'var(--color-primary)',
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    maxHeight: 240,
    overflowY: 'auto',
    scrollbarWidth: 'none',
  },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 12px',
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    background: 'var(--bg-surface)',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'border-color 0.12s, background 0.12s',
  },
  taskRowSelected: {
    borderColor: 'var(--color-primary)',
    background: 'var(--color-primary-subtle)',
  },
  taskIconTile: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  taskInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  taskCat: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  focusBadge: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--color-warning)',
    background: 'rgba(245, 158, 11, 0.12)',
    borderRadius: 999,
    padding: '3px 8px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  focusBadgeCustom: {
    alignSelf: 'flex-start',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--color-warning)',
    background: 'rgba(245, 158, 11, 0.12)',
    borderRadius: 999,
    padding: '4px 12px',
  },
  emptyTasks: {
    fontSize: 13,
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: '20px 0',
  },
  input: {
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
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  categoryGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    padding: '8px 14px',
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
    background: 'var(--bg-surface-2)',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'background 0.15s, border-color 0.15s',
  },
  reminder: {
    fontSize: 12,
    color: 'var(--text-muted)',
    textAlign: 'center',
    lineHeight: 1.5,
  },
  submitButton: {
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
  submitButtonDisabled: {
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
