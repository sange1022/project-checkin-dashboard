import { createInitialState, type AppState } from '../domain/types'
import type { CheckinRepository } from './checkinRepository'

const STORAGE_KEY = 'project-checkins'
const BACKUP_KEY = `${STORAGE_KEY}:backup`

type PersistedEnvelope = {
  version: 1
  state: AppState
}

export function createLocalCheckinRepository(storage: Storage): CheckinRepository {
  return {
    load() {
      const raw = storage.getItem(STORAGE_KEY)
      if (!raw) return createInitialState()
      try {
        const envelope = JSON.parse(raw) as PersistedEnvelope
        if (envelope.version !== 1 || !envelope.state) throw new Error('Unsupported data')
        return envelope.state
      } catch {
        storage.setItem(BACKUP_KEY, raw)
        return createInitialState()
      }
    },
    save(state) {
      const envelope: PersistedEnvelope = { version: 1, state }
      storage.setItem(STORAGE_KEY, JSON.stringify(envelope))
    },
  }
}
