import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('shows selected-month count before the name and lifetime count at row end', () => {
  renderGrid()
  expect(screen.getByLabelText('官网重构累计打卡')).toHaveTextContent('3')
  expect(screen.getByLabelText('官网重构本月打卡')).toHaveTextContent('2/30')
  const row = screen.getByTestId('project-row')
  const monthly = screen.getByLabelText('官网重构本月打卡')
  const name = screen.getByTestId('project-name')
  const lifetime = screen.getByLabelText('官网重构累计打卡')
  expect(monthly.compareDocumentPosition(name) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(name.compareDocumentPosition(lifetime) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  expect(row).toContainElement(monthly)
})

test.each(['week', 'month'] as const)('hides monthly count in %s view', (view) => {
  renderGrid({ view })
  expect(screen.getByLabelText('官网重构累计打卡')).toHaveTextContent('3')
  expect(screen.queryByLabelText('官网重构本月打卡')).not.toBeInTheDocument()
})

test('highlights the hovered daily row and column then clears on leave', async () => {
  const user = userEvent.setup()
  renderGrid()
  const target = screen.getByRole('button', { name: '官网重构 6月2日' })

  await user.hover(target)

  expect(target).toHaveClass('hover-current')
  expect(screen.getByTestId('project-name-cell')).toHaveClass('hover-row')
  expect(screen.getByTestId('day-header-2026-06-02')).toHaveClass('hover-column')

  await user.unhover(target)

  expect(target).not.toHaveClass('hover-current')
  expect(screen.getByTestId('project-name-cell')).not.toHaveClass('hover-row')
})
