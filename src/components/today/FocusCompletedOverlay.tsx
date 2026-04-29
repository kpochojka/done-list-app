'use client'

import { useTranslations } from 'next-intl'
import { POINTS } from '@/lib/constants'

interface FocusCompletedData {
  focusName: string
  todayPoints: number
}

interface FocusCompletedOverlayProps {
  data: FocusCompletedData | null
  onDismiss: () => void
}

const CONFETTI_COLORS = [
  '#f59e0b', '#fbbf24', '#7c3aed', '#a78bfa', '#10b981', '#34d399',
  '#3b82f6', '#60a5fa', '#ef4444', '#f87171', '#c4b5fd', '#86efac',
]

function ConfettiPiece({ color, left, delay, duration }: {
  color: string; left: number; delay: number; duration: number
}) {
  return (
    <div
      className="confetti-piece"
      style={{
        left: `${left}%`,
        top: 0,
        background: color,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    />
  )
}

export function FocusCompletedOverlay({ data, onDismiss }: FocusCompletedOverlayProps) {
  const t = useTranslations('focusDay')
  const tEntry = useTranslations('addEntry')

  if (!data) return null

  return (
    <div style={styles.backdrop} onClick={onDismiss}>
      {CONFETTI_COLORS.map((color, i) => (
        <ConfettiPiece
          key={i}
          color={color}
          left={5 + (i * 8.2) % 90}
          delay={i * 0.06}
          duration={0.9 + (i % 4) * 0.15}
        />
      ))}

      <div className="success-card" style={styles.card} onClick={(e) => e.stopPropagation()}>
        <div style={styles.emoji}>🎯</div>

        <h2 style={styles.title}>{t('completedTitle')}</h2>
        <p style={styles.subtitle}>{t('completedSubtitle')}</p>

        <div style={styles.focusChip}>
          <span style={styles.focusName}>{data.focusName}</span>
        </div>

        <p style={styles.pointsBadge}>
          {t('completedPoints', { points: POINTS.FOCUS_COMPLETED })}
        </p>

        <p style={styles.dayPoints}>
          {tEntry('successDayPoints', { total: data.todayPoints })}
        </p>

        <button type="button" onClick={onDismiss} style={styles.dismissButton}>
          {t('dismissButton')}
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
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 105,
    padding: '24px 20px',
    overflow: 'hidden',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    background: 'var(--bg-surface)',
    borderRadius: 24,
    padding: '32px 24px',
    boxShadow: 'var(--shadow-modal)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
    zIndex: 1,
  },
  emoji: {
    fontSize: 52,
    lineHeight: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text-primary)',
    textAlign: 'center',
    letterSpacing: -0.02,
  },
  subtitle: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    textAlign: 'center',
  },
  focusChip: {
    background: 'var(--color-warning-subtle)',
    borderRadius: 12,
    padding: '10px 18px',
    width: '100%',
    textAlign: 'center',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  focusName: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--color-warning)',
  },
  pointsBadge: {
    fontSize: 18,
    fontWeight: 800,
    color: 'var(--color-warning)',
    background: 'rgba(245, 158, 11, 0.12)',
    borderRadius: 999,
    padding: '8px 20px',
  },
  dayPoints: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    textAlign: 'center',
  },
  dismissButton: {
    marginTop: 8,
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
    boxShadow: '0 4px 14px rgba(124, 58, 237, 0.28)',
  },
}
