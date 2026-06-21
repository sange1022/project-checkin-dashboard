import type { StageProject } from './types'

export const PROJECT_STAGES = [
  { name: '第一次沟通', percent: 10 },
  { name: '交付设计定金', percent: 20 },
  { name: '现场量尺', percent: 30 },
  { name: '平面方案设计', percent: 40 },
  { name: '第一次方案沟通', percent: 50 },
  { name: 'SU建模方案设计中', percent: 60 },
  { name: '第二次方案沟通', percent: 65 },
  { name: '效果图制作中', percent: 70 },
  { name: '效果图沟通', percent: 75 },
  { name: '施工图纸制作中', percent: 80 },
  { name: '对接施工图纸', percent: 85 },
  { name: '软装搭配PPT制作中', percent: 90 },
  { name: '软装PPT交付', percent: 95 },
  { name: '现场施工中', percent: 96 },
  { name: '设计跟踪服务完结', percent: 100 },
] as const

export function createStageProject(name: string, id: string): StageProject {
  return { id, name, stageIndex: 0, createdAt: new Date().toISOString() }
}
