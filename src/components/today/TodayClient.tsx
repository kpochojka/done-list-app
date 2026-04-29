'use client'

import { useMemo, useState } from 'react'
import { useTranslations, useFormatter } from 'next-intl'
import { User } from 'lucide-react'
import { useToday } from '@/hooks/useToday'
import type { DailyEntry } from '@/types'
import { CategoryIcon } from '@/components/ui/Icon'
import { getCategoryDisplayName } from '@/components/tasks/categoryName'
import { FocusDayCard } from './FocusDayCard'
import { FocusDaySelector } from './FocusDaySelector'
import { AddEntryModal } from './AddEntryModal'
import { SuccessOverlay } from './SuccessOverlay'
import { LevelUpOverlay } from './LevelUpOverlay'
import { FocusCompletedOverlay } from './FocusCompletedOverlay'
import { LEVEL_THRESHOLDS } from '@/lib/constants'

interface TodayClientProps {
  userId: string
}

interface SuccessData {
  entry: DailyEntry
  pointsEarned: number
  todayPoints: number
}

interface FocusCompletedData {
  focusName: string
  todayPoints: number
}

const MOTIVATIONAL_COUNT = 4

/** Stable index from date string — avoids hydration mismatch from Math.random(). */
function motivationalIndexForDate(dateStr: string): number {
  let h = 0
  for (let i = 0; i < dateStr.length; i++) {
    h = Math.imul(31, h) + dateStr.charCodeAt(i)
  }
  return Math.abs(h) % MOTIVATIONAL_COUNT
}

export function TodayClient({ userId }: TodayClientProps) {
  const t = useTranslations('today')
  const tCommon = useTranslations('common')
  const tCat = useTranslations('categories')
  const format = useFormatter()

  const {
    entries,
    focusDay,
    stats,
    categories,
    tasks,
    todayPoints,
    loading,
    today,
    pendingLevelUp,
    clearLevelUp,
    addEntry,
    saveFocusDay,
    removeFocusDay,
    completeFocusDayAction,
  } = useToday(userId)

  const [focusSelectorOpen, setFocusSelectorOpen] = useState(false)
  const [addEntryOpen, setAddEntryOpen] = useState(false)
  const [successData, setSuccessData] = useState<SuccessData | null>(null)
  const [focusCompletedData, setFocusCompletedData] = useState<FocusCompletedData | null>(null)
  const [completingFocus, setCompletingFocus] = useState(false)

  const motivationalIndex = useMemo(
    () => motivationalIndexForDate(today),
    [today]
  )
  const motivationalKey = `motivational_${motivationalIndex}` as
    | 'motivational_0'
    | 'motivational_1'
    | 'motivational_2'
    | 'motivational_3'

  const todayDate = new Date(`${today}T00:00:00`)
  const dateDisplay = format.dateTime(todayDate, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const levelInfo = useMemo(() => {
    const level = stats?.currentLevel ?? 1
    const total = stats?.totalPoints ?? 0
    const threshold = LEVEL_THRESHOLDS.find((t) => t.level === level) ?? LEVEL_THRESHOLDS[0]
    const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === level + 1)

    if (!nextThreshold) {
      return { level, progress: 1, min: threshold.minPoints, max: threshold.maxPoints }
    }

    const progress = Math.min(
      1,
      (total - threshold.minPoints) / (nextThreshold.minPoints - threshold.minPoints)
    )
    return { level, progress, min: threshold.minPoints, max: nextThreshold.minPoints }
  }, [stats])

  const handleSuccess = (entry: DailyEntry, pointsEarned: number) => {
    setSuccessData({
      entry,
      pointsEarned,
      todayPoints: todayPoints + pointsEarned,
    })
  }

  // When SuccessOverlay is dismissed, show LevelUpOverlay if one is pending
  const handleDismissSuccess = () => {
    setSuccessData(null)
    // pendingLevelUp is already set in the hook; LevelUpOverlay will render
  }

  const handleCompleteFocus = async () => {
    if (!focusDay || focusDay.isCompleted || completingFocus) return
    setCompletingFocus(true)
    try {
      const cat = focusDay.category ?? categories.find((c) => c.id === focusDay.categoryId)
      const focusName = focusDay.customTitle
        ? focusDay.customTitle
        : cat
          ? getCategoryDisplayName(cat, tCat)
          : ''
      await completeFocusDayAction()
      setFocusCompletedData({ focusName, todayPoints })
    } finally {
      setCompletingFocus(false)
    }
  }

  return (
    <main style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>{t('title')}</h1>
          <p style={styles.dateLabel}>{dateDisplay}</p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.pointsBadge}>
            <span style={styles.pointsBadgeNum}>{todayPoints}</span>
            <span style={styles.pointsStar}>⭐</span>
          </div>
          <div style={styles.avatar}>
            <User size={18} strokeWidth={1.75} color="var(--color-primary)" />
          </div>
        </div>
      </header>

      {/* Focus Day Card */}
      <FocusDayCard
        focusDay={focusDay}
        categories={categories}
        onEdit={() => setFocusSelectorOpen(true)}
        onComplete={handleCompleteFocus}
      />

      {/* Points strip */}
      <div style={styles.pointsRow}>
        {/* Today points */}
        <div style={{ ...styles.pointsCard, flex: 1 }}>
          <span style={styles.pointsCardLabel}>{t('todayPoints')}</span>
          <div style={styles.pointsCardValue}>
            <span style={styles.pointsNum}>{todayPoints}</span>
            <span style={styles.pointsStarBig}>⭐</span>
          </div>
          <span style={styles.motivational}>{t(motivationalKey)}</span>
        </div>

        {/* Total points */}
        <div style={{ ...styles.pointsCard, flex: 1 }}>
          <span style={styles.pointsCardLabel}>{t('totalPoints')}</span>
          <div style={styles.pointsCardValue}>
            <span style={styles.pointsNum}>{stats?.totalPoints ?? 0}</span>
            <span style={styles.pointsStarBig}>⭐</span>
          </div>
          <span style={styles.levelLabel}>{tCommon('level')} {levelInfo.level}</span>
          <div style={styles.xpBar}>
            <div style={{ ...styles.xpFill, width: `${Math.round(levelInfo.progress * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Entries section */}
      <section style={styles.section}>
        <h2 style={styles.sectionLabel}>{t('sectionLabel')}</h2>

        {loading ? (
          <p style={styles.muted}>{tCommon('loading')}</p>
        ) : entries.length === 0 ? (
          <p style={styles.empty}>{t('noEntries')}</p>
        ) : (
          <div style={styles.list}>
            {entries.map((entry) => {
              const cat = entry.category ?? categories.find((c) => c.id === entry.categoryId)
              const catColor = cat?.color ?? 'var(--color-primary)'
              const entryTime = format.dateTime(new Date(entry.createdAt), {
                hour: '2-digit',
                minute: '2-digit',
              })
              const badgeStyle = entry.isFocus
                ? styles.pointsBadgeEntryFocus
                : styles.pointsBadgeEntry
              return (
                <div key={entry.id} style={styles.entryRow}>
                  <div style={{ ...styles.entryIcon, background: `color-mix(in oklab, ${catColor} 16%, var(--bg-surface))` }}>
                    {cat && <CategoryIcon name={cat.icon} size={17} strokeWidth={1.75} color={catColor} />}
                  </div>
                  <div style={styles.entryContent}>
                    <span style={styles.entryTitle}>{entry.title}</span>
                    <span style={styles.entryMeta}>
                      {cat ? getCategoryDisplayName(cat, tCat) : ''} · {entryTime}
                    </span>
                  </div>
                  <span style={badgeStyle}>+{entry.points}</span>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* Add entry CTA */}
      <button
        type="button"
        onClick={() => setAddEntryOpen(true)}
        style={styles.addButton}
      >
        {t('addButton')}
      </button>

      {/* Modals */}
      <FocusDaySelector
        open={focusSelectorOpen}
        focusDay={focusDay}
        categories={categories}
        onClose={() => setFocusSelectorOpen(false)}
        onSave={saveFocusDay}
        onRemove={removeFocusDay}
      />

      <AddEntryModal
        open={addEntryOpen}
        focusDay={focusDay}
        categories={categories}
        tasks={tasks}
        todayPoints={todayPoints}
        onClose={() => setAddEntryOpen(false)}
        onSubmit={addEntry}
        onSuccess={handleSuccess}
      />

      {/* Overlays — SuccessOverlay first, then LevelUpOverlay on dismiss */}
      <SuccessOverlay
        data={successData}
        onDismiss={handleDismissSuccess}
      />

      <FocusCompletedOverlay
        data={focusCompletedData}
        onDismiss={() => setFocusCompletedData(null)}
      />

      {/* LevelUpOverlay shows only when no other overlay is visible */}
      <LevelUpOverlay
        data={!successData && !focusCompletedData ? pendingLevelUp : null}
        onDismiss={clearLevelUp}
      />
    </main>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100dvh',
    background: 'transparent',
    padding: '24px 16px 100px',
    maxWidth: 560,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: 4,
    paddingBottom: 4,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: 'var(--text-primary)',
    letterSpacing: -0.025,
    lineHeight: 1.1,
  },
  dateLabel: {
    fontSize: 14,
    color: 'var(--text-secondary)',
    marginTop: 2,
    textTransform: 'capitalize',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  pointsBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    background: 'var(--color-primary-subtle)',
    borderRadius: 999,
    padding: '6px 12px',
  },
  pointsBadgeNum: {
    fontSize: 15,
    fontWeight: 800,
    color: 'var(--color-primary)',
  },
  pointsStar: {
    fontSize: 14,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 999,
    background: 'var(--color-primary-subtle)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  pointsRow: {
    display: 'flex',
    gap: 12,
  },
  pointsCard: {
    background: 'var(--bg-surface)',
    borderRadius: 18,
    padding: '16px 14px',
    boxShadow: 'var(--shadow-card)',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  pointsCardLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pointsCardValue: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  pointsNum: {
    fontSize: 28,
    fontWeight: 900,
    color: 'var(--color-primary)',
    lineHeight: 1,
    letterSpacing: -0.02,
  },
  pointsStarBig: {
    fontSize: 20,
  },
  motivational: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    lineHeight: 1.4,
  },
  levelLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-secondary)',
  },
  xpBar: {
    height: 5,
    borderRadius: 999,
    background: 'var(--bg-surface-3)',
    overflow: 'hidden',
    marginTop: 2,
  },
  xpFill: {
    height: '100%',
    borderRadius: 999,
    background: 'var(--gradient-primary, var(--color-primary))',
    transition: 'width 0.4s ease-out',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  entryRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'var(--bg-surface)',
    borderRadius: 14,
    padding: '12px 14px',
    boxShadow: 'var(--shadow-card)',
  },
  entryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  entryContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    minWidth: 0,
  },
  entryTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  entryMeta: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  pointsBadgeEntry: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--color-primary)',
    background: 'var(--color-primary-subtle)',
    borderRadius: 999,
    padding: '4px 11px',
    flexShrink: 0,
  },
  pointsBadgeEntryFocus: {
    fontSize: 13,
    fontWeight: 700,
    color: 'var(--color-warning)',
    background: 'rgba(245, 158, 11, 0.12)',
    borderRadius: 999,
    padding: '4px 11px',
    flexShrink: 0,
  },
  empty: {
    fontSize: 14,
    color: 'var(--text-muted)',
    background: 'var(--bg-surface)',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'var(--border-default)',
    padding: '24px 16px',
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 1.6,
    boxShadow: 'none',
  },
  muted: {
    fontSize: 14,
    color: 'var(--text-muted)',
    textAlign: 'center',
    padding: 20,
  },
  addButton: {
    width: '100%',
    padding: '16px',
    borderRadius: 16,
    border: 'none',
    background: 'var(--gradient-primary, var(--color-primary))',
    color: 'var(--text-inverse)',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    letterSpacing: 0.1,
    boxShadow: '0 4px 18px rgba(124, 58, 237, 0.28)',
    marginTop: 4,
  },
}
