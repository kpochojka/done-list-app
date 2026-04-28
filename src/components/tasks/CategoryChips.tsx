'use client'

import type { Category } from '@/types'
import { getCategoryDisplayName } from './categoryName'
import { useTranslations } from 'next-intl'

interface CategoryChipsProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (id: string | null) => void
}

const ALL_CHIP_ID = '__all__'

export function CategoryChips({
  categories,
  selectedId,
  onSelect,
}: CategoryChipsProps) {
  const t = useTranslations('tasks')
  const tCat = useTranslations('categories')

  const chips: Array<{ id: string; label: string; icon: string | null; color: string | null }> = [
    { id: ALL_CHIP_ID, label: t('filterAll'), icon: null, color: null },
    ...categories.map((c) => ({
      id: c.id,
      label: getCategoryDisplayName(c, tCat),
      icon: c.icon,
      color: c.color,
    })),
  ]

  return (
    <div style={styles.scroll} role="tablist">
      {chips.map((chip) => {
        const active =
          chip.id === ALL_CHIP_ID ? selectedId === null : selectedId === chip.id
        return (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onSelect(chip.id === ALL_CHIP_ID ? null : chip.id)}
            style={active ? styles.chipActive : styles.chip}
          >
            {chip.icon && (
              <span aria-hidden style={styles.chipIcon}>
                {chip.icon}
              </span>
            )}
            <span>{chip.label}</span>
          </button>
        )
      })}
    </div>
  )
}

const chipBase: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '8px 14px',
  borderRadius: 999,
  borderWidth: 1.5,
  borderStyle: 'solid',
  borderColor: 'var(--border-default)',
  background: 'var(--bg-surface)',
  color: 'var(--text-secondary)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  flexShrink: 0,
  transition: 'all 0.15s',
}

const styles: Record<string, React.CSSProperties> = {
  scroll: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    paddingBottom: 4,
    margin: '0 -16px',
    padding: '4px 16px',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  chip: chipBase,
  chipActive: {
    ...chipBase,
    background: 'var(--color-primary)',
    color: 'var(--text-inverse)',
    borderColor: 'var(--color-primary)',
  },
  chipIcon: {
    fontSize: 14,
    lineHeight: 1,
  },
}
