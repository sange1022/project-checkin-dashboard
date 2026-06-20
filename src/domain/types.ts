export type ViewMode = 'day' | 'week' | 'month'

export type Project = {
  id: string
  name: string
  createdAt: string
  archived: boolean
}

export type AppState = {
  title: string
  view: ViewMode
  anchorDate: string
  projects: Project[]
  checkins: Record<string, string[]>
}

export function createInitialState(): AppState {
  return {
    title: '项目进度',
    view: 'day',
    anchorDate: new Date().toISOString(),
    projects: [],
    checkins: {},
  }
}
