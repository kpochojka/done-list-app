'use client'

interface ProgressDotsProps {
  count: number
  max?: number
}

/**
 * Renders up to `max` dots — filled for `count` entries made,
 * hollow for the rest. Overflow (count > max) is shown as `+N`.
 */
export function ProgressDots({ count, max = 5 }: ProgressDotsProps) {
  const filled = Math.min(count, max)
  const hollow = Math.max(0, max - filled)
  const overflow = Math.max(0, count - max)

  return (
    <div style={styles.row} aria-label={`${count} / ${max}`}>
      {Array.from({ length: filled }).map((_, i) => (
        <span key={`f-${i}`} style={styles.filled} />
      ))}
      {Array.from({ length: hollow }).map((_, i) => (
        <span key={`h-${i}`} style={styles.hollow} />
      ))}
      {overflow > 0 && (
        <span style={styles.overflow}>+{overflow}</span>
      )}
    </div>
  )
}

const dotBase: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: '50%',
  display: 'inline-block',
}

const styles: Record<string, React.CSSProperties> = {
  row: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
  },
  filled: {
    ...dotBase,
    background: 'var(--color-primary)',
  },
  hollow: {
    ...dotBase,
    background: 'transparent',
    border: '1.5px solid var(--border-default)',
  },
  overflow: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--color-primary)',
    marginLeft: 4,
  },
}
