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
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  letterSpacing: 0.1,
  transition: 'background 0.15s, color 0.15s, box-shadow 0.15s',
}

const styles: Record<string, React.CSSProperties> = {
  row: {
    display: 'flex',
    gap: 4,
    background: 'var(--bg-surface-2)',
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-subtle)',
  },
  tab: {
    ...tabBase,
    background: 'transparent',
    color: 'var(--text-secondary)',
  },
  tabActive: {
    ...tabBase,
    background: 'var(--gradient-primary, var(--color-primary))',
    color: 'var(--text-inverse)',
    fontWeight: 600,
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  },
}
