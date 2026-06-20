import { createInitialState } from '../domain/types'
import { createLocalCheckinRepository } from './localCheckinRepository'

class MemoryStorage implements Storage {
  private values = new Map<string, string>()
  constructor(seed: Record<string, string> = {}) {
    Object.entries(seed).forEach(([key, value]) => this.values.set(key, value))
  }
  get length() { return this.values.size }
  clear() { this.values.clear() }
  getItem(key: string) { return this.values.get(key) ?? null }
  key(index: number) { return [...this.values.keys()][index] ?? null }
  removeItem(key: string) { this.values.delete(key) }
  setItem(key: string, value: string) { this.values.set(key, value) }
}

test('round-trips application state', () => {
  const storage = new MemoryStorage()
  const repository = createLocalCheckinRepository(storage)
  const state = createInitialState()
  state.title = '年度计划'
  repository.save(state)
  expect(repository.load()).toEqual(state)
})

test('backs up malformed data and returns initial state', () => {
  const storage = new MemoryStorage({ 'project-checkins': '{bad json' })
  const repository = createLocalCheckinRepository(storage)
  expect(repository.load()).toMatchObject({
    title: '项目进度',
    view: 'day',
    projects: [],
    checkins: {},
  })
  expect(storage.getItem('project-checkins:backup')).toBe('{bad json')
})
