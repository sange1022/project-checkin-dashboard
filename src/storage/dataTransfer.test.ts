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
