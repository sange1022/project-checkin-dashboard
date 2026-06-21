import { PROJECT_STAGES, createStageProject } from './projectStages'

test('defines the fixed fifteen stages and percentages', () => {
  expect(PROJECT_STAGES).toHaveLength(15)
  expect(PROJECT_STAGES.map((stage) => stage.percent)).toEqual([10, 20, 30, 40, 50, 60, 65, 70, 75, 80, 85, 90, 95, 96, 100])
  expect(PROJECT_STAGES.at(-1)?.name).toBe('设计跟踪服务完结')
})

test('creates projects at the first stage', () => {
  const project = createStageProject('住宅设计', 'stage-1')
  expect(project.name).toBe('住宅设计')
  expect(project.stageIndex).toBe(0)
})
