'use client'

import type { Category } from '@/types'
import { getCategoryDisplayName } from './categoryName'
import { useTranslations } from 'next-intl'
import { CategoryIcon } from '@/components/ui/Icon'
import { LayoutGrid } from 'lucide-react'

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

  return (
    <div style={styles.scroll} role="tablist">
      <CategoryButton
        active={selectedId === null}
        label={t('filterAll')}
        color="var(--color-primary)"
        onClick={() => onSelect(null)}
        icon={<LayoutGrid size={18} strokeWidth={1.75} />}
        useThemePrimary
      />

      {categories.map((c) => (
        <CategoryButton
          key={c.id}
          active={selectedId === c.id}
          label={getCategoryDisplayName(c, tCat)}
          color={c.color}
          onClick={() => onSelect(c.id)}
          icon={<CategoryIcon name={c.icon} size={18} strokeWidth={1.75} />}
        />
      ))}
    </div>
  )
}

interface CategoryButtonProps {
  active: boolean
  label: string
  color: string
  onClick: () => void
  icon: React.ReactNode
  /** True for the "All" chip — uses theme primary tokens directly. */
  useThemePrimary?: boolean
}

function CategoryButton({
  active,
  label,
  color,
  onClick,
  icon,
  useThemePrimary = false,
}: CategoryButtonProps) {
  const tileBg = useThemePrimary
    ? active
      ? 'var(--gradient-primary, var(--color-primary))'
      : 'var(--color-primary-subtle)'
    : active
      ? color
      : `color-mix(in oklab, ${color} 14%, var(--bg-surface))`

  const iconColor = useThemePrimary
    ? active
      ? 'var(--text-inverse)'
      : 'var(--color-primary)'
    : active
      ? 'var(--text-inverse)'
      : color

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      style={styles.button}
    >
      <span
        style={{
          ...styles.iconTile,
          background: tileBg,
          color: iconColor,
          boxShadow: active
            ? `0 4px 12px color-mix(in oklab, ${useThemePrimary ? '#7c3aed' : color} 28%, transparent)`
            : 'none',
        }}
      >
        {icon}
      </span>
      <span
        style={{
          ...styles.label,
          color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
          fontWeight: active ? 600 : 500,
        }}
      >
        {label}
      </span>
    </button>
  )
}

const styles: Record<string, React.CSSProperties> = {
  scroll: {
    display: 'flex',
    gap: 14,
    overflowX: 'auto',
    margin: '0 -16px',
    padding: '4px 16px 8px',
    scrollbarWidth: 'none',
    WebkitOverflowScrolling: 'touch',
  },
  button: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: 0,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    width: 64,
  },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
  },
  label: {
    fontSize: 11,
    lineHeight: 1.2,
    letterSpacing: 0.05,
    textAlign: 'center',
    transition: 'color 0.15s',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },
}
