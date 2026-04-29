'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Category, DailyEntry, FocusDay, Reward, Task, UserStats } from '@/types'
import { getEntriesForDate, createEntry } from '@/services/entries.service'
import { getFocusDay, upsertFocusDay, deleteFocusDay, completeFocusDay } from '@/services/focusday.service'
import { getUserStats, addPoints } from '@/services/points.service'
import { getRewardAtLevel } from '@/services/rewards.service'
import { getCategories } from '@/services/categories.service'
import { getTasks } from '@/services/tasks.service'
import { POINTS } from '@/lib/constants'

function getLocalDateString(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export interface LevelUpData {
  newLevel: number
  reward: Reward | null
}

export interface UseTodayResult {
  entries: DailyEntry[]
  focusDay: FocusDay | null
  stats: UserStats | null
  categories: Category[]
  tasks: Task[]
  todayPoints: number
  loading: boolean
  today: string
  pendingLevelUp: LevelUpData | null
  clearLevelUp: () => void
  addEntry: (payload: {
    taskId: string | null
    categoryId: string
    title: string
  }) => Promise<DailyEntry>
  saveFocusDay: (payload: {
    categoryId: string
    taskId?: string | null
    customTitle?: string | null
  }) => Promise<void>
  removeFocusDay: () => Promise<void>
  completeFocusDayAction: () => Promise<void>
}

export function useToday(userId: string | null): UseTodayResult {
  const today = getLocalDateString()

  const [entries, setEntries] = useState<DailyEntry[]>([])
  const [focusDay, setFocusDayState] = useState<FocusDay | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingLevelUp, setPendingLevelUp] = useState<LevelUpData | null>(null)

  const todayPoints = entries.reduce((sum, e) => sum + e.points, 0)

  const clearLevelUp = useCallback(() => setPendingLevelUp(null), [])

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const [entriesData, focusDayData, statsData, categoriesData, tasksData] = await Promise.all([
        getEntriesForDate(userId, today),
        getFocusDay(userId, today),
        getUserStats(userId),
        getCategories(userId),
        getTasks(userId),
      ])
      setEntries(entriesData)
      setFocusDayState(focusDayData)
      setStats(statsData)
      setCategories(categoriesData)
      setTasks(tasksData.filter((t) => !t.isCompleted))
    } finally {
      setLoading(false)
    }
  }, [userId, today])

  useEffect(() => {
    void refresh()
  }, [refresh])

  /** Fire-and-forget level-up check after any addPoints call. */
  const checkLevelUp = useCallback(
    (newLevel: number, currentUserId: string) => {
      void getRewardAtLevel(currentUserId, newLevel).then((reward) => {
        setPendingLevelUp({ newLevel, reward })
      })
    },
    []
  )

  const addEntry = useCallback(
    async (payload: {
      taskId: string | null
      categoryId: string
      title: string
    }): Promise<DailyEntry> => {
      if (!userId) throw new Error('Not authenticated')

      const isFocus = focusDay !== null && payload.categoryId === focusDay.categoryId
      const points = isFocus ? POINTS.FOCUS_ENTRY : POINTS.DAILY_ENTRY

      const entry = await createEntry(userId, {
        taskId: payload.taskId,
        categoryId: payload.categoryId,
        title: payload.title,
        points,
        isFocus,
        date: today,
      })

      setEntries((prev) => [entry, ...prev])

      const result = await addPoints(userId, points)
      setStats(result.stats)
      if (result.leveledUp) checkLevelUp(result.stats.currentLevel, userId)

      return entry
    },
    [userId, today, focusDay, checkLevelUp]
  )

  const saveFocusDay = useCallback(
    async (payload: {
      categoryId: string
      taskId?: string | null
      customTitle?: string | null
    }): Promise<void> => {
      if (!userId) return
      const fd = await upsertFocusDay(userId, { date: today, ...payload })
      setFocusDayState(fd)
    },
    [userId, today]
  )

  const removeFocusDay = useCallback(async (): Promise<void> => {
    if (!userId) return
    await deleteFocusDay(userId, today)
    setFocusDayState(null)
  }, [userId, today])

  const completeFocusDayAction = useCallback(async (): Promise<void> => {
    if (!userId || !focusDay || focusDay.isCompleted) return
    const updated = await completeFocusDay(userId, today)
    setFocusDayState(updated)
    const result = await addPoints(userId, POINTS.FOCUS_COMPLETED)
    setStats(result.stats)
    if (result.leveledUp) checkLevelUp(result.stats.currentLevel, userId)
  }, [userId, today, focusDay, checkLevelUp])

  return {
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
  }
}
