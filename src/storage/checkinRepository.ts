import type { AppState } from '../domain/types'

export interface CheckinRepository {
  load(): AppState
  save(state: AppState): void
}
