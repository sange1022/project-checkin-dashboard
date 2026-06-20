import { toDateKey } from './dateRanges'

export function getIntensity(ratio: number): 0 | 1 | 2 | 3 | 4 {
  if (ratio <= 0) return 0
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

export function getPeriodRatio(dateKeys: string[], checked: Set<string>, today: Date) {
  const todayKey = toDateKey(today)
  const elapsed = dateKeys.filter((key) => key <= todayKey)
  if (!elapsed.length) return 0
  return elapsed.filter((key) => checked.has(key)).length / elapsed.length
}
