'use client'

import { useTranslations } from 'next-intl'
import type { DailyEntry } from '@/types'

interface SuccessData {
  entry: DailyEntry
  pointsEarned: number
  todayPoints: number
}

interface SuccessOverlayProps {
  data: SuccessData | null
  onDismiss: () => void
}

const CONFETTI_COLORS = [
  '#7c3aed', '#a78bfa', '#f59e0b', '#10b981', '#3b82f6', '#ef4444',
  '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#c4b5fd', '#86efac',
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

export function SuccessOverlay({ data, onDismiss }: SuccessOverlayProps) {
  const t = useTranslations('addEntry')

  if (!data) return null

  const { entry, pointsEarned, todayPoints } = data
  const catColor = entry.category?.color ?? 'var(--color-primary)'

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
        <div style={styles.emoji}>🌟</div>

        <h2 style={styles.title}>{t('successTitle')}</h2>

        <p style={styles.pointsBadge}>
          {t('successPoints', { points: pointsEarned })}
        </p>

        <div style={styles.entryChip}>
          {entry.category && (
            <span style={{ ...styles.colorDot, background: catColor }} />
          )}
          <span style={styles.entryTitle}>{entry.title}</span>
          {entry.isFocus && <span style={styles.focusStar}>⭐</span>}
        </div>

        <p style={styles.dayPoints}>
          {t('successDayPoints', { total: todayPoints })}
        </p>

        <button type="button" onClick={onDismiss} style={styles.dismissButton}>
          {t('successDismiss')}
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
    zIndex: 100,
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
    fontSize: 24,
    fontWeight: 800,
    color: 'var(--text-primary)',
    textAlign: 'center',
    letterSpacing: -0.02,
  },
  pointsBadge: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--color-primary)',
    background: 'var(--color-primary-subtle)',
    borderRadius: 999,
    padding: '6px 18px',
  },
  entryChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'var(--bg-surface-2)',
    borderRadius: 12,
    padding: '10px 14px',
    width: '100%',
    justifyContent: 'center',
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    flexShrink: 0,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-primary)',
    textAlign: 'center',
  },
  focusStar: {
    fontSize: 14,
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
