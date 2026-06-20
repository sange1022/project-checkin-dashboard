import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

beforeEach(() => localStorage.clear())

test('renders the default editable page title', () => {
  render(<App />)
  expect(screen.getByText('项目进度')).toBeInTheDocument()
})

test('edits the title and creates a project', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByText('项目进度'))
  await user.clear(screen.getByRole('textbox', { name: '页面标题' }))
  await user.type(screen.getByRole('textbox', { name: '页面标题' }), '六月计划{Enter}')
  expect(screen.getByText('六月计划')).toBeVisible()

  await user.click(screen.getByRole('button', { name: '新项目' }))
  await user.type(screen.getByRole('textbox', { name: '项目名称' }), '官网重构')
  await user.click(screen.getByRole('button', { name: '创建' }))
  expect(screen.getByText('官网重构')).toBeVisible()
})

test('switches between daily weekly and monthly views', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: '每周' }))
  expect(screen.getAllByTestId('period-header')).toHaveLength(12)
  await user.click(screen.getByRole('button', { name: '每月' }))
  expect(screen.getAllByTestId('period-header')).toHaveLength(12)
})
