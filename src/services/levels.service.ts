import { LEVEL_THRESHOLDS } from '@/lib/constants'
import { getLevelForPoints, getPointsToNextLevel } from '@/lib/utils'

export function getCurrentLevel(totalPoints: number) {
  return getLevelForPoints(totalPoints)
}

export function getProgressToNextLevel(totalPoints: number): {
  currentLevel: number
  nextLevel: number
  pointsInCurrentLevel: number
  pointsNeededForLevel: number
  percentage: number
  pointsToNextLevel: number
} {
  const currentLevel = getLevelForPoints(totalPoints)
  const currentThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel)
  const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1)

  if (!currentThreshold || !nextThreshold) {
    return {
      currentLevel,
      nextLevel: currentLevel,
      pointsInCurrentLevel: 0,
      pointsNeededForLevel: 0,
      percentage: 100,
      pointsToNextLevel: 0,
    }
  }

  const pointsInCurrentLevel = totalPoints - currentThreshold.minPoints
  const pointsNeededForLevel = nextThreshold.minPoints - currentThreshold.minPoints
  const percentage = Math.min(100, Math.round((pointsInCurrentLevel / pointsNeededForLevel) * 100))

  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    pointsInCurrentLevel,
    pointsNeededForLevel,
    percentage,
    pointsToNextLevel: getPointsToNextLevel(totalPoints),
  }
}
