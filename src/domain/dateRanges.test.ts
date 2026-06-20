import { getMonthDays, getMonthPeriods, getWeekPeriods, toDateKey } from './dateRanges'

test('returns every day in a leap-year February', () => {
  const days = getMonthDays(new Date(2024, 1, 12))
  expect(days).toHaveLength(29)
  expect(days[0].key).toBe('2024-02-01')
  expect(days[28].key).toBe('2024-02-29')
})

test('uses local calendar values for date keys', () => {
  expect(toDateKey(new Date(2026, 5, 2))).toBe('2026-06-02')
})

test('returns twelve weekly and monthly periods', () => {
  expect(getWeekPeriods(new Date(2026, 5, 20))).toHaveLength(12)
  expect(getMonthPeriods(new Date(2026, 5, 20))).toHaveLength(12)
})
