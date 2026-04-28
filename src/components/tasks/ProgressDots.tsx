'use client'

interface ProgressDotsProps {
  count: number
  max?: number
  /** Optional accent color (e.g. category hex). Falls back to --color-primary. */
  color?: string
}

/**
 * Renders up to `max` dots — filled for `count` entries made,
 * hollow for the rest. Overflow (count > max) is shown as `+N`.
 */
export function ProgressDots({ count, max = 5, color }: ProgressDotsProps) {
  const filled = Math.min(count, max)
  const hollow = Math.max(0, max - filled)
  const overflow = Math.max(0, count - max)

  const filledColor = color ?? 'var(--color-primary)'

  return (
    <div style={styles.row} aria-label={`${count} / ${max}`}>
      {Array.from({ length: filled }).map((_, i) => (
        <span
          key={`f-${i}`}
          style={{ ...styles.filled, background: filledColor }}
        />
      ))}
      {Array.from({ length: hollow }).map((_, i) => (
        <span key={`h-${i}`} style={styles.hollow} />
      ))}
      {overflow > 0 && (
        <span style={{ ...styles.overflow, color: filledColor }}>+{overflow}</span>
      )}
    </div>
  )
}

const dotBase: React.CSSProperties = {
  width: 7,
  height: 7,
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
  },
  hollow: {
    ...dotBase,
    background: 'transparent',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'var(--border-default)',
  },
  overflow: {
    fontSize: 11,
    fontWeight: 600,
    marginLeft: 4,
    letterSpacing: 0.2,
  },
}
