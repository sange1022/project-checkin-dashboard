import { render, screen } from '@testing-library/react'
import { DailyRandomPanel } from './DailyRandomPanel'
import '../styles.css'

test('keeps locked random results out of the browser disabled-text color path', () => {
  document.documentElement.dataset.theme = 'dark'
  render(
    <DailyRandomPanel
      categories={[{ id: 'fitness', name: '健身', items: [{ id: 'walk', name: '走路' }] }]}
      results={{ fitness: { itemId: 'walk', name: '走路' } }}
      onResult={() => undefined}
    />,
  )

  const button = screen.getByRole('button', { name: '健身 走路' })
  expect(button).toHaveAttribute('aria-disabled', 'true')
  expect(button).not.toBeDisabled()
  expect(button).toHaveClass('locked')
  delete document.documentElement.dataset.theme
})
