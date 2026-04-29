'use client'

import { useTranslations } from 'next-intl'
import type { LevelUpData } from '@/hooks/useToday'

interface LevelUpOverlayProps {
  data: LevelUpData | null
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

export function LevelUpOverlay({ data, onDismiss }: LevelUpOverlayProps) {
  const t = useTranslations('tree')

  if (!data) return null

  const { newLevel, reward } = data
  const title = reward ? t('unlockTitle') : t('levelUpTitle')

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
        <div style={styles.emoji}>🎁</div>

        <h2 style={styles.title}>{title}</h2>
        <p style={styles.subtitle}>{t('unlockSubtitle', { level: newLevel })}</p>

        {reward && (
          <div style={styles.rewardCard}>
            {reward.imageUrl ? (
              <img src={reward.imageUrl} alt={reward.title} style={styles.rewardImage} />
            ) : (
              <div style={styles.rewardEmoji}>🎀</div>
            )}
            <div style={styles.rewardInfo}>
              <span style={styles.rewardTitle}>{reward.title}</span>
              {reward.description && (
                <span style={styles.rewardDesc}>{reward.description}</span>
              )}
            </div>
          </div>
        )}

        <button type="button" onClick={onDismiss} style={styles.dismissButton}>
          {t('unlockDismiss')}
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
    zIndex: 110,
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
    fontSize: 56,
    lineHeight: 1,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    color: 'var(--text-primary)',
    textAlign: 'center',
    letterSpacing: -0.02,
    lineHeight: 1.25,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--color-primary)',
    textAlign: 'center',
  },
  rewardCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'var(--bg-surface-2)',
    borderRadius: 14,
    padding: '12px 16px',
    width: '100%',
    marginTop: 4,
  },
  rewardImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    objectFit: 'cover',
    flexShrink: 0,
  },
  rewardEmoji: {
    fontSize: 40,
    lineHeight: 1,
    flexShrink: 0,
  },
  rewardInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    flex: 1,
    minWidth: 0,
  },
  rewardTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  rewardDesc: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
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
