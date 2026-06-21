import { createInitialState, type AppState, type RandomCategory, type RandomPromptItem } from './types'

export function createDefaultRandomCategories(): RandomCategory[] {
  return createInitialState().randomCategories
}

export function pickRandomItem(items: RandomPromptItem[], random = Math.random) {
  return items[Math.min(items.length - 1, Math.floor(random() * items.length))]
}

export function normalizeRandomState(state: Partial<AppState>): AppState {
  const initial = createInitialState()
  return {
    ...initial,
    ...state,
    projects: state.projects ?? initial.projects,
    checkins: state.checkins ?? initial.checkins,
    randomCategories: state.randomCategories?.length ? state.randomCategories : initial.randomCategories,
    dailyRandomResults: state.dailyRandomResults ?? {},
    stageProjects: state.stageProjects ?? [],
    stageBoardTitle: state.stageBoardTitle ?? initial.stageBoardTitle,
    stageLabels: state.stageLabels?.length === 15 ? state.stageLabels : initial.stageLabels,
    theme: state.theme ?? 'system',
  }
}
