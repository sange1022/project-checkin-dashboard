import { getIntensity, getPeriodRatio } from './aggregation'

test.each([
  [0, 0],
  [0.1, 1],
  [0.5, 2],
  [0.75, 3],
  [1, 4],
])('maps %s ratio to intensity %s', (ratio, expected) => {
  expect(getIntensity(ratio)).toBe(expected)
})

test('current periods only count elapsed dates', () => {
  const ratio = getPeriodRatio(
    ['2026-06-19', '2026-06-20', '2026-06-21'],
    new Set(['2026-06-19']),
    new Date(2026, 5, 20),
  )
  expect(ratio).toBe(0.5)
})
