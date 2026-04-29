'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Category, Reward, Task } from '@/types'
import {
  completeTask as completeTaskService,
  createTask as createTaskService,
  getTaskEntryCounts,
  getTasks,
} from '@/services/tasks.service'
import { getCategories } from '@/services/categories.service'
import { addPoints } from '@/services/points.service'
import { getRewardAtLevel } from '@/services/rewards.service'
import { POINTS } from '@/lib/constants'

export interface LevelUpData {
  newLevel: number
  reward: Reward | null
}

export interface UseTasksResult {
  tasks: Task[]
  categories: Category[]
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  createTask: (payload: { title: string; categoryId: string }) => Promise<void>
  completeTask: (taskId: string) => Promise<void>
  pendingLevelUp: LevelUpData | null
  clearLevelUp: () => void
}

export function useTasks(userId: string | null): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [pendingLevelUp, setPendingLevelUp] = useState<LevelUpData | null>(null)

  const clearLevelUp = useCallback(() => setPendingLevelUp(null), [])

  const refresh = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const [tasksData, categoriesData, counts] = await Promise.all([
        getTasks(userId),
        getCategories(userId),
        getTaskEntryCounts(userId),
      ])
      setTasks(
        tasksData.map((t) => ({ ...t, entryCount: counts[t.id] ?? 0 }))
      )
      setCategories(categoriesData)
      setError(null)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const createTask = useCallback(
    async ({ title, categoryId }: { title: string; categoryId: string }) => {
      if (!userId) return
      const created = await createTaskService(userId, { title, categoryId })
      setTasks((prev) => [{ ...created, entryCount: 0 }, ...prev])
    },
    [userId]
  )

  const completeTask = useCallback(async (taskId: string) => {
    await completeTaskService(taskId)
    const completedAt = new Date().toISOString()
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, isCompleted: true, completedAt } : t
      )
    )
    if (!userId) return
    try {
      const result = await addPoints(userId, POINTS.TASK_COMPLETED)
      if (result.leveledUp) {
        void getRewardAtLevel(userId, result.stats.currentLevel).then((reward) => {
          setPendingLevelUp({ newLevel: result.stats.currentLevel, reward })
        })
      }
    } catch {
      // Don't fail task completion if points update fails
    }
  }, [userId])

  return { tasks, categories, loading, error, refresh, createTask, completeTask, pendingLevelUp, clearLevelUp }
}
