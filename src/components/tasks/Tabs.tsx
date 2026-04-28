'use client'

export type TaskTab = 'all' | 'active' | 'done'

interface TabsProps {
  value: TaskTab
  onChange: (tab: TaskTab) => void
  labels: Record<TaskTab, string>
}

const ORDER: TaskTab[] = ['all', 'active', 'done']

export function Tabs({ value, onChange, labels }: TabsProps) {
  return (
    <div style={styles.row} role="tablist">
      {ORDER.map((tab) => {
        const active = tab === value
        return (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab)}
            style={active ? styles.tabActive : styles.tab}
          >
            {labels[tab]}
          </button>
        )
      })}
    </div>
  )
}

const tabBase: React.CSSProperties = {
  flex: 1,
  padding: '10px 0',
  border: 'none',
  borderRadius: 10,
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'background 0.15s, color 0.15s',
}

const styles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    gap: 4,
    background: 'var(--bg-surface-2)',
    borderRadius: 14,
    padding: 4,
  },
  tab: {
    ...tabBase,
    background: 'transparent',
    color: 'var(--text-secondary)',
  },
  tabActive: {
    ...tabBase,
    background: 'var(--bg-surface)',
    color: 'var(--color-primary)',
    fontWeight: 700,
    boxShadow: 'var(--shadow-card)',
  },
}
