export type ViewMode = 'day' | 'week' | 'month'

export type Project = {
  id: string
  name: string
  createdAt: string
  archived: boolean
}

export type RandomPromptItem = {
  id: string
  name: string
}

export type RandomCategory = {
  id: 'fitness' | 'modeling' | 'mind'
  name: string
  items: RandomPromptItem[]
}

export type RandomResult = {
  itemId: string
  name: string
}

export type StageProject = {
  id: string
  name: string
  stageIndex: number
  createdAt: string
}

export type AppState = {
  title: string
  view: ViewMode
  anchorDate: string
  projects: Project[]
  checkins: Record<string, string[]>
  randomCategories: RandomCategory[]
  dailyRandomResults: Record<string, Partial<Record<RandomCategory['id'], RandomResult>>>
  stageProjects: StageProject[]
}

export function createInitialState(): AppState {
  return {
    title: '项目进度',
    view: 'day',
    anchorDate: new Date().toISOString(),
    projects: [],
    checkins: {},
    randomCategories: [
      { id: 'fitness', name: '健身', items: [{ id: 'fitness-pushup', name: '俯卧撑' }, { id: 'fitness-squat', name: '深蹲' }, { id: 'fitness-walk', name: '走路' }] },
      { id: 'modeling', name: '建模', items: [{ id: 'modeling-art', name: '艺术史' }, { id: 'modeling-architecture', name: '建筑史' }, { id: 'modeling-interview', name: '访谈' }, { id: 'modeling-classical', name: '古典乐' }, { id: 'modeling-ai', name: 'AI' }, { id: 'modeling-food', name: '美食' }] },
      { id: 'mind', name: '建脑', items: [{ id: 'mind-history', name: '历史' }, { id: 'mind-philosophy', name: '哲学' }, { id: 'mind-humanity', name: '人性' }, { id: 'mind-biography', name: '传记' }, { id: 'mind-physics', name: '物理' }, { id: 'mind-literature', name: '文学' }] },
    ],
    dailyRandomResults: {},
    stageProjects: [],
  }
}
