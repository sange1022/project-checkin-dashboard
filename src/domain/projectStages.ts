import type { StageProject } from './types'

export const PROJECT_STAGES = [
  { name: '第一次沟通', shortName: '初次沟通', percent: 10 },
  { name: '交付设计定金', shortName: '设计定金', percent: 20 },
  { name: '现场量尺', shortName: '现场量尺', percent: 30 },
  { name: '平面方案设计', shortName: '平面方案', percent: 40 },
  { name: '第一次方案沟通', shortName: '一次方案', percent: 50 },
  { name: 'SU建模方案设计中', shortName: 'SU建模', percent: 60 },
  { name: '第二次方案沟通', shortName: '二次方案', percent: 65 },
  { name: '效果图制作中', shortName: '效果图制作', percent: 70 },
  { name: '效果图沟通', shortName: '效果图沟通', percent: 75 },
  { name: '施工图纸制作中', shortName: '施工图制作', percent: 80 },
  { name: '对接施工图纸', shortName: '图纸对接', percent: 85 },
  { name: '软装搭配PPT制作中', shortName: '软装搭配', percent: 90 },
  { name: '软装PPT交付', shortName: '软装交付', percent: 95 },
  { name: '现场施工中', shortName: '现场施工', percent: 96 },
  { name: '设计跟踪服务完结', shortName: '服务完结', percent: 100 },
] as const

export function createStageProject(name: string, id: string): StageProject {
  return { id, name, stageIndex: 0, createdAt: new Date().toISOString() }
}
