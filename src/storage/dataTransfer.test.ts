import { createInitialState } from '../domain/types'
import { exportState, importState } from './dataTransfer'

test('exports and imports a valid local backup', () => {
  const state = createInitialState()
  state.title = '年度项目'
  const restored = importState(exportState(state))
  expect(restored).toEqual(state)
})

test('rejects invalid backup data', () => {
  expect(() => importState('{"hello":"world"}')).toThrow('备份文件格式不正确')
})

test('includes random candidates and daily results in backups', () => {
  const state = createInitialState()
  state.randomCategories[0].items.push({ id: 'fitness-run', name: '跑步' })
  state.dailyRandomResults['2026-06-21'] = {
    fitness: { itemId: 'fitness-run', name: '跑步' },
  }

  const restored = importState(exportState(state))

  expect(restored.randomCategories[0].items.at(-1)?.name).toBe('跑步')
  expect(restored.dailyRandomResults['2026-06-21'].fitness?.name).toBe('跑步')
})
