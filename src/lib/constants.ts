export const POINTS = {
  DAILY_ENTRY: 1,
  FOCUS_ENTRY: 2,
  TASK_COMPLETED: 5,
  FOCUS_COMPLETED: 7,
} as const

export const LEVEL_THRESHOLDS = [
  { level: 1,  minPoints: 0,    maxPoints: 20   },
  { level: 2,  minPoints: 21,   maxPoints: 50   },
  { level: 3,  minPoints: 51,   maxPoints: 100  },
  { level: 4,  minPoints: 101,  maxPoints: 200  },
  { level: 5,  minPoints: 201,  maxPoints: 350  },
  { level: 6,  minPoints: 351,  maxPoints: 550  },
  { level: 7,  minPoints: 551,  maxPoints: 800  },
  { level: 8,  minPoints: 801,  maxPoints: 1100 },
  { level: 9,  minPoints: 1101, maxPoints: 1500 },
  { level: 10, minPoints: 1501, maxPoints: 2000 },
] as const
