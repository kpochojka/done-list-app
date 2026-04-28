import { LEVEL_THRESHOLDS } from './constants'
import type { Level } from '@/types'

export function getLevelForPoints(totalPoints: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalPoints >= LEVEL_THRESHOLDS[i].minPoints) {
      return LEVEL_THRESHOLDS[i].level
    }
  }
  return 1
}

export function getPointsToNextLevel(totalPoints: number): number {
  const currentLevel = getLevelForPoints(totalPoints)
  const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1)
  if (!nextThreshold) return 0
  return nextThreshold.minPoints - totalPoints
}

export function getLevelThreshold(level: number): Level | undefined {
  const t = LEVEL_THRESHOLDS.find((t) => t.level === level)
  if (!t) return undefined
  return { level: t.level, minPoints: t.minPoints, maxPoints: t.maxPoints }
}
