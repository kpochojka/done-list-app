'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { Lock, Check, Info } from 'lucide-react'
import { useTree } from '@/hooks/useTree'
import { LEVEL_THRESHOLDS } from '@/lib/constants'
import { LevelUpOverlay } from '@/components/today/LevelUpOverlay'
import type { TreeNode } from '@/hooks/useTree'

interface TreeClientProps {
  userId: string
}

// ── Layout constants ───────────────────────────────────────────────
const SVG_W = 390
const STEP = 130         // vertical gap between node centers
const Y0 = 65            // y of the topmost node
const LEFT_X = Math.round(SVG_W * 0.25)   // 97
const RIGHT_X = Math.round(SVG_W * 0.75)  // 292
const CIRCLE_D = 72      // diameter of the reward circle
const TOTAL_H = Y0 + 9 * STEP + Y0        // 1300

/** Build the smooth sinuous SVG path through all 10 nodes (top → bottom). */
function buildPathD(): string {
  const CTRL = STEP * 0.42
  let d = `M ${LEFT_X},${Y0}`
  for (let i = 0; i < 9; i++) {
    const fromX = i % 2 === 0 ? LEFT_X : RIGHT_X
    const toX   = i % 2 === 0 ? RIGHT_X : LEFT_X
    const fromY = Y0 + i * STEP
    const toY   = Y0 + (i + 1) * STEP
    d += ` C ${fromX},${fromY + CTRL} ${toX},${toY - CTRL} ${toX},${toY}`
  }
  return d
}

const PATH_D = buildPathD()

// ── Decorative plants — scattered around the winding path ─────────
const PLANTS = [
  { x: 14, y: 110, flip: false },
  { x: 348, y: 240, flip: true },
  { x: 12, y: 370, flip: false },
  { x: 350, y: 500, flip: true },
  { x: 14, y: 630, flip: false },
  { x: 349, y: 760, flip: true },
  { x: 13, y: 890, flip: false },
  { x: 348, y: 1020, flip: true },
  { x: 14, y: 1150, flip: false },
]

// ── Single reward node ─────────────────────────────────────────────
function RewardNode({
  node,
  index,
}: {
  node: TreeNode
  index: number
}) {
  const t = useTranslations('tree')
  const tCommon = useTranslations('common')
  const { reward, state, level, minPoints, maxPoints } = node
  const isLeft = index % 2 === 0
  const cx = isLeft ? LEFT_X : RIGHT_X
  const cy = Y0 + index * STEP

  // Point range label — last level shows "N+ pkt"
  const isLastLevel = level === LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].level
  const rangeLabel = isLastLevel
    ? `${minPoints}+ ${tCommon('points')}`
    : `${minPoints}–${maxPoints} ${tCommon('points')}`

  // Circle visual state
  const circleStyle: React.CSSProperties = {
    ...styles.circle,
    ...(state === 'current' ? styles.circleCurrent : {}),
    ...(state === 'locked'  ? styles.circleLocked  : {}),
    ...(state === 'claimed' ? styles.circleClaimed : {}),
  }

  // Text info box — opposite side from the circle
  const TEXT_MARGIN = CIRCLE_D / 2 + 12
  const textStyle: React.CSSProperties = isLeft
    ? { ...styles.textBox, left: cx + TEXT_MARGIN, right: 8 }
    : { ...styles.textBox, right: SVG_W - cx + TEXT_MARGIN, left: 8, textAlign: 'right' as const }

  return (
    <>
      {/* Text info */}
      <div
        style={{
          ...textStyle,
          top: cy,
          transform: 'translateY(-50%)',
          position: 'absolute',
        }}
      >
        <span style={styles.levelLabel}>{tCommon('level')} {level}</span>
        <span style={styles.rangeLabel}>{rangeLabel}</span>
        <span style={styles.rewardTitle}>
          {reward ? reward.title : t('noRewardSet')}
        </span>
      </div>

      {/* Reward circle */}
      <div
        style={{
          position: 'absolute',
          left: cx,
          top: cy,
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
        }}
      >
        <div style={circleStyle}>
          {/* Image or emoji */}
          {reward?.imageUrl ? (
            <img
              src={reward.imageUrl}
              alt={reward.title}
              style={styles.circleImg}
            />
          ) : (
            <span style={styles.circleEmoji}>
              {state === 'locked' ? '🎁' : state === 'claimed' ? '🎀' : '✨'}
            </span>
          )}

          {/* Lock overlay */}
          {state === 'locked' && (
            <div style={styles.lockOverlay}>
              <div style={styles.lockBadge}>
                <Lock size={14} strokeWidth={2.5} color="var(--text-inverse)" />
              </div>
            </div>
          )}

          {/* Claimed checkmark */}
          {state === 'claimed' && (
            <div style={styles.checkBadge}>
              <Check size={12} strokeWidth={3} color="var(--text-inverse)" />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────
export function TreeClient({ userId }: TreeClientProps) {
  const t = useTranslations('tree')
  const tCommon = useTranslations('common')
  const { nodes, stats, loading, pendingLevelUp, clearLevelUp } = useTree(userId)

  const levelInfo = useMemo(() => {
    const level = stats?.currentLevel ?? 1
    const total = stats?.totalPoints ?? 0
    const threshold = LEVEL_THRESHOLDS.find((t) => t.level === level) ?? LEVEL_THRESHOLDS[0]
    const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === level + 1)

    if (!nextThreshold) {
      return { level, total, progress: 1, nextLevel: level, remaining: 0, nextMin: threshold.maxPoints }
    }

    const progress = Math.min(
      1,
      (total - threshold.minPoints) / (nextThreshold.minPoints - threshold.minPoints)
    )
    return {
      level,
      total,
      progress,
      nextLevel: nextThreshold.level,
      remaining: nextThreshold.minPoints - total,
      nextMin: nextThreshold.minPoints,
    }
  }, [stats])

  // Render highest level at top, level 1 at bottom (aspirational top → achieved bottom)
  const orderedNodes = useMemo(() => [...nodes].reverse(), [nodes])

  return (
    <main style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.pageTitle}>{t('title')}</h1>
        <div style={styles.infoBtn} aria-label="info">
          <Info size={16} strokeWidth={1.75} color="var(--text-muted)" />
        </div>
      </header>

      {/* Summary card */}
      <div style={styles.summaryCard}>
        <div style={styles.summaryTop}>
          <div style={styles.summaryLeft}>
            <span style={styles.summaryPoints}>{t('pointsSummary', { points: levelInfo.total })}</span>
            <span style={styles.summaryLevel}>{tCommon('level')} {levelInfo.level}</span>
          </div>
          <div style={styles.summaryPlant}>🌱</div>
        </div>

        <div style={styles.progressRow}>
          <span style={styles.progressHint}>
            {levelInfo.remaining > 0
              ? t('nextLevel', { level: levelInfo.nextLevel, remaining: levelInfo.remaining })
              : t('nodeUnlocked')}
          </span>
          <span style={styles.progressFraction}>
            {levelInfo.total} / {levelInfo.nextMin} {tCommon('points')}
          </span>
        </div>

        <div style={styles.xpBar}>
          <div style={{ ...styles.xpFill, width: `${Math.round(levelInfo.progress * 100)}%` }} />
        </div>
      </div>

      {/* Tree section */}
      {loading ? (
        <p style={styles.muted}>{tCommon('loading')}</p>
      ) : (
        <div style={styles.treeOuter}>
          <div style={{ ...styles.treeContainer, height: TOTAL_H }}>
            {/* Winding path SVG */}
            <svg
              style={styles.svg}
              viewBox={`0 0 ${SVG_W} ${TOTAL_H}`}
              preserveAspectRatio="xMidYMin meet"
              aria-hidden="true"
            >
              {/* Path ribbon */}
              <path
                d={PATH_D}
                stroke="var(--tree-path)"
                strokeWidth={82}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Subtle inner highlight */}
              <path
                d={PATH_D}
                stroke="var(--tree-path-inner)"
                strokeWidth={58}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Decorative plants */}
              {PLANTS.map((p, i) => (
                <text
                  key={i}
                  x={p.x}
                  y={p.y}
                  fontSize="22"
                  textAnchor="middle"
                  style={{ transform: p.flip ? `scaleX(-1)` : undefined, transformOrigin: `${p.x}px ${p.y}px` }}
                >
                  🌿
                </text>
              ))}
            </svg>

            {/* Reward nodes */}
            {orderedNodes.map((node, i) => (
              <RewardNode key={node.level} node={node} index={i} />
            ))}
          </div>
        </div>
      )}

      <LevelUpOverlay data={pendingLevelUp} onDismiss={clearLevelUp} />
    </main>
  )
}

// ── Styles ─────────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    background: 'transparent',
    padding: '24px 0 100px',
    maxWidth: 560,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px 16px',
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: -0.025,
  },
  infoBtn: {
    width: 32,
    height: 32,
    borderRadius: 999,
    background: 'var(--bg-surface-2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ── Summary card ──
  summaryCard: {
    margin: '0 16px 20px',
    background: 'var(--bg-surface)',
    borderRadius: 20,
    padding: '18px 18px 14px',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  summaryTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  summaryLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
  },
  summaryPoints: {
    fontSize: 20,
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: -0.02,
  },
  summaryLevel: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  summaryPlant: {
    fontSize: 32,
    lineHeight: 1,
  },
  progressRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -2,
  },
  progressHint: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    fontWeight: 500,
  },
  progressFraction: {
    fontSize: 11,
    color: 'var(--text-muted)',
    fontWeight: 600,
  },
  xpBar: {
    height: 6,
    borderRadius: 999,
    background: 'var(--bg-surface-3)',
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    borderRadius: 999,
    background: 'var(--gradient-primary, var(--color-primary))',
    transition: 'width 0.5s ease-out',
  },
  // ── Tree ──
  treeOuter: {
    overflowX: 'hidden',
    width: '100%',
  },
  treeContainer: {
    position: 'relative',
    width: '100%',
    maxWidth: SVG_W,
    margin: '0 auto',
  },
  svg: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
  // ── Text box ──
  textBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    pointerEvents: 'none',
  },
  levelLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
  },
  rangeLabel: {
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--text-muted)',
    lineHeight: 1.2,
  },
  rewardTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-secondary)',
    lineHeight: 1.3,
  },
  // ── Circle ──
  circle: {
    width: CIRCLE_D,
    height: CIRCLE_D,
    borderRadius: 999,
    overflow: 'hidden',
    background: 'var(--bg-surface)',
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: 'var(--bg-app)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 3px 12px rgba(0,0,0,0.12)',
  },
  circleCurrent: {
    borderColor: 'var(--color-primary)',
    boxShadow: '0 0 0 4px var(--color-primary-subtle), 0 3px 14px rgba(124,58,237,0.25)',
  },
  circleLocked: {
    opacity: 0.7,
    filter: 'grayscale(40%)',
  },
  circleClaimed: {
    borderColor: 'var(--color-success)',
  },
  circleImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  circleEmoji: {
    fontSize: 30,
    lineHeight: 1,
  },
  lockOverlay: {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0,0,0,0.22)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    padding: 4,
  },
  lockBadge: {
    width: 22,
    height: 22,
    borderRadius: 999,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    width: 20,
    height: 20,
    borderRadius: 999,
    background: 'var(--color-success)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'var(--bg-app)',
  },
  muted: {
    fontSize: 14,
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: 40,
  },
}
