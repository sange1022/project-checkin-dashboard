import { render, screen } from '@testing-library/react'
import type { ViewMode } from '../domain/types'
import { ProjectGrid } from './ProjectGrid'

function renderGrid({
  view = 'day',
  anchor = new Date(2026, 5, 20),
  checkins = { p1: ['2026-05-31', '2026-06-01', '2026-06-20'] },
}: {
  view?: ViewMode
  anchor?: Date
  checkins?: Record<string, string[]>
} = {}) {
  render(
    <ProjectGrid
      view={view}
      anchor={anchor}
      today={new Date(2026, 5, 20)}
      projects={[{ id: 'p1', name: '官网重构', createdAt: '2026-05-01', archived: false }]}
      checkins={checkins}
      onToggle={() => undefined}
      onRename={() => undefined}
      onMove={() => undefined}
      onDelete={() => undefined}
    />,
  )
}

test('shows lifetime count before the name and selected-month count at row end', () => {
  renderGrid()
  expect(screen.getByLabelText('官网重构累计打卡')).toHaveTextContent('3')
  expect(screen.getByLabelText('官网重构本月打卡')).toHaveTextContent('2/30')
})

test.each(['week', 'month'] as const)('hides monthly count in %s view', (view) => {
  renderGrid({ view })
  expect(screen.getByLabelText('官网重构累计打卡')).toHaveTextContent('3')
  expect(screen.queryByLabelText('官网重构本月打卡')).not.toBeInTheDocument()
})
