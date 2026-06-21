# 项目每日打卡进度页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个宋体、极简、按项目横排展示完整自然月的本地项目打卡应用，并提供周/月灰度汇总、项目管理和搜索。

**Architecture:** 使用 React + TypeScript + Vite 构建单页应用。日期计算、汇总算法和浏览器本地仓储作为无 UI 的独立模块；React 组件通过仓储接口加载和保存状态。

**Tech Stack:** React 19、TypeScript、Vite、Vitest、Testing Library、CSS

---

## 文件结构

- `package.json`：脚本与依赖。
- `vite.config.ts`、`tsconfig*.json`、`index.html`：构建与测试配置。
- `src/domain/types.ts`：项目、打卡和应用状态类型。
- `src/domain/dateRanges.ts`：自然月、自然周和统计周期计算。
- `src/domain/aggregation.ts`：周/月打卡比例及五级灰度计算。
- `src/storage/checkinRepository.ts`：仓储接口。
- `src/storage/localCheckinRepository.ts`：版本化 localStorage 实现。
- `src/components/EditableText.tsx`：标题与项目名原地编辑。
- `src/components/ViewSwitcher.tsx`：每日、每周、每月切换。
- `src/components/PeriodNavigator.tsx`：自然月导航。
- `src/components/ProjectDialog.tsx`：新建项目。
- `src/components/ProjectRow.tsx`：项目行、打卡格和项目菜单。
- `src/components/ProjectGrid.tsx`：时间轴与项目列表。
- `src/App.tsx`：状态编排、搜索、归档入口与持久化。
- `src/styles.css`：已确认视觉系统与响应式布局。
- `src/**/*.test.ts(x)`：对应模块与交互测试。

### Task 1: 初始化 React + TypeScript 测试环境

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`

- [ ] **Step 1: 写一个失败的应用冒烟测试**

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the default editable page title', () => {
  render(<App />)
  expect(screen.getByText('项目进度')).toBeInTheDocument()
})
```

- [ ] **Step 2: 运行测试并确认因 `App` 不存在而失败**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL，提示无法解析 `./App`。

- [ ] **Step 3: 创建最小应用与工具链配置**

```tsx
export default function App() {
  return <main>项目进度</main>
}
```

配置 `npm test` 为 `vitest`，测试环境为 `jsdom`，并加载 `@testing-library/jest-dom/vitest`。

- [ ] **Step 4: 安装依赖并确认测试通过**

Run: `npm install && npm test -- --run src/App.test.tsx`

Expected: 1 test passed。

- [ ] **Step 5: 提交**

```bash
git add package.json package-lock.json index.html vite.config.ts tsconfig*.json src
git commit -m "chore: initialize project check-in app"
```

### Task 2: 日期范围与灰度汇总

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/dateRanges.ts`
- Create: `src/domain/dateRanges.test.ts`
- Create: `src/domain/aggregation.ts`
- Create: `src/domain/aggregation.test.ts`

- [ ] **Step 1: 写自然月与闰年失败测试**

```ts
import { getMonthDays } from './dateRanges'

test('returns every day in a leap-year February', () => {
  const days = getMonthDays(new Date(2024, 1, 12))
  expect(days).toHaveLength(29)
  expect(days[0].key).toBe('2024-02-01')
  expect(days[28].key).toBe('2024-02-29')
})
```

- [ ] **Step 2: 运行并确认缺少实现**

Run: `npm test -- --run src/domain/dateRanges.test.ts`

Expected: FAIL，提示 `getMonthDays` 不存在。

- [ ] **Step 3: 实现 ISO 本地日期键和完整自然月**

```ts
export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getMonthDays(anchor: Date) {
  const count = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate()
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(anchor.getFullYear(), anchor.getMonth(), index + 1)
    return { date, key: toDateKey(date) }
  })
}
```

- [ ] **Step 4: 写周/月比例失败测试**

```ts
import { getIntensity } from './aggregation'

test.each([
  [0, 0], [0.1, 1], [0.5, 2], [0.75, 3], [1, 4],
])('maps %s ratio to intensity %s', (ratio, expected) => {
  expect(getIntensity(ratio)).toBe(expected)
})
```

- [ ] **Step 5: 实现五级灰度映射和 12 周/12 月周期聚合**

```ts
export function getIntensity(ratio: number): 0 | 1 | 2 | 3 | 4 {
  if (ratio <= 0) return 0
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}
```

聚合函数必须只将今天之前（含今天）的日期计入当前周和当前月分母。

- [ ] **Step 6: 运行领域测试并提交**

Run: `npm test -- --run src/domain`

Expected: all domain tests passed。

```bash
git add src/domain
git commit -m "feat: add date ranges and check-in aggregation"
```

### Task 3: 版本化本地仓储

**Files:**
- Create: `src/storage/checkinRepository.ts`
- Create: `src/storage/localCheckinRepository.ts`
- Create: `src/storage/localCheckinRepository.test.ts`

- [ ] **Step 1: 写保存、读取和损坏数据回退测试**

```ts
test('round-trips application state', () => {
  const storage = new MemoryStorage()
  const repository = createLocalCheckinRepository(storage)
  repository.save(sampleState)
  expect(repository.load()).toEqual(sampleState)
})

test('backs up malformed data and returns initial state', () => {
  const storage = new MemoryStorage({ 'project-checkins': '{bad json' })
  const repository = createLocalCheckinRepository(storage)
  expect(repository.load()).toEqual(createInitialState())
  expect(storage.getItem('project-checkins:backup')).toBe('{bad json')
})
```

- [ ] **Step 2: 运行并确认仓储未实现**

Run: `npm test -- --run src/storage/localCheckinRepository.test.ts`

Expected: FAIL，提示工厂函数不存在。

- [ ] **Step 3: 实现接口和版本 1 数据格式**

```ts
export interface CheckinRepository {
  load(): AppState
  save(state: AppState): void
}

type PersistedEnvelope = {
  version: 1
  state: AppState
}
```

使用键名 `project-checkins`，解析失败时把原值写到 `project-checkins:backup`。

- [ ] **Step 4: 运行测试并提交**

Run: `npm test -- --run src/storage`

Expected: all storage tests passed。

```bash
git add src/storage src/domain/types.ts
git commit -m "feat: persist versioned check-in data locally"
```

### Task 4: 可编辑标题与项目管理

**Files:**
- Create: `src/components/EditableText.tsx`
- Create: `src/components/EditableText.test.tsx`
- Create: `src/components/ProjectDialog.tsx`
- Create: `src/components/ProjectMenu.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: 写标题回车保存和 Esc 取消测试**

```tsx
test('saves on Enter and cancels on Escape', async () => {
  const onSave = vi.fn()
  const user = userEvent.setup()
  render(<EditableText value="项目进度" onSave={onSave} />)
  await user.click(screen.getByText('项目进度'))
  await user.clear(screen.getByRole('textbox'))
  await user.type(screen.getByRole('textbox'), '年度计划{Enter}')
  expect(onSave).toHaveBeenCalledWith('年度计划')
})
```

- [ ] **Step 2: 运行并确认组件不存在**

Run: `npm test -- --run src/components/EditableText.test.tsx`

Expected: FAIL。

- [ ] **Step 3: 实现原地编辑**

空白名称不可保存；Enter 保存、Esc 取消、失焦保存，正常状态不展示边框。

- [ ] **Step 4: 写新增、归档、恢复、删除测试**

```tsx
test('adds, archives, restores and deletes a project', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: '新项目' }))
  await user.type(screen.getByRole('textbox', { name: '项目名称' }), '官网重构')
  await user.click(screen.getByRole('button', { name: '创建' }))
  expect(screen.getByText('官网重构')).toBeVisible()
})
```

后续断言通过行尾菜单归档、归档入口恢复，并在确认对话框后删除。

- [ ] **Step 5: 实现项目 CRUD 并运行测试**

Run: `npm test -- --run src/components src/App.test.tsx`

Expected: all component and app management tests passed。

- [ ] **Step 6: 提交**

```bash
git add src/components src/App.tsx src/App.test.tsx
git commit -m "feat: add editable titles and project management"
```

### Task 5: 每日完整自然月网格

**Files:**
- Create: `src/components/CheckinCell.tsx`
- Create: `src/components/ProjectRow.tsx`
- Create: `src/components/ProjectGrid.tsx`
- Create: `src/components/ProjectGrid.test.tsx`
- Create: `src/components/PeriodNavigator.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: 写完整月、未来日期禁用和打卡切换测试**

```tsx
test('renders all June days and disables future dates', async () => {
  render(<ProjectGrid view="day" anchor={new Date(2026, 5, 20)} today={new Date(2026, 5, 20)} projects={projects} checkins={{}} />)
  expect(screen.getAllByRole('columnheader')).toHaveLength(31)
  expect(screen.getByRole('button', { name: '官网重构 6月21日' })).toBeDisabled()
})
```

- [ ] **Step 2: 运行并确认网格不存在**

Run: `npm test -- --run src/components/ProjectGrid.test.tsx`

Expected: FAIL。

- [ ] **Step 3: 实现完整自然月和月份导航**

日期按钮使用可访问名称“项目名 M月D日”；点击过去或今天的格子切换布尔状态，未来日期禁用。

- [ ] **Step 4: 运行测试并提交**

Run: `npm test -- --run src/components/ProjectGrid.test.tsx`

Expected: all grid tests passed。

```bash
git add src/components src/App.tsx
git commit -m "feat: add full-month daily check-in grid"
```

### Task 6: 周/月视图、搜索和持久化编排

**Files:**
- Create: `src/components/ViewSwitcher.tsx`
- Create: `src/components/ProjectSearch.tsx`
- Modify: `src/components/ProjectGrid.tsx`
- Modify: `src/App.tsx`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: 写视图切换与搜索失败测试**

```tsx
test('switches to twelve-week intensity view and filters projects', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: '每周' }))
  expect(screen.getAllByTestId('period-header')).toHaveLength(12)
  await user.type(screen.getByRole('searchbox'), '英语')
  expect(screen.getByText('英语学习')).toBeVisible()
  expect(screen.queryByText('官网重构')).not.toBeInTheDocument()
})
```

- [ ] **Step 2: 运行并确认测试失败**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL，缺少周视图或搜索框。

- [ ] **Step 3: 实现 12 周、12 月灰度网格和即时搜索**

每个聚合格添加 `data-intensity="0..4"`；当前周期分母只统计已经发生的日期。

- [ ] **Step 4: 接入仓储并测试刷新后的状态恢复**

使用惰性初始化读取仓储；每次状态变化保存。测试卸载并重新渲染后标题、项目和打卡仍存在。

- [ ] **Step 5: 运行测试并提交**

Run: `npm test -- --run`

Expected: all tests passed。

```bash
git add src
git commit -m "feat: add aggregate views search and persistence"
```

### Task 7: 确认稿视觉、响应式和最终验收

**Files:**
- Create: `src/styles.css`
- Modify: `src/main.tsx`
- Modify: `src/App.tsx`
- Modify: `src/components/*.tsx`

- [ ] **Step 1: 实现视觉令牌和桌面布局**

```css
:root {
  font-family: "Songti SC", "STSong", "SimSun", serif;
  color: #1d1d1f;
  background: #f6f6f4;
}

.checkin-cell[data-state="checked"] {
  background: #292929;
  border-color: #292929;
}
```

匹配确认稿的白色画布、黑灰色阶、低对比分隔线、圆角格子和无侧栏结构。

- [ ] **Step 2: 实现窄屏滚动和固定项目列**

日期网格设置横向滚动，项目名称列使用 `position: sticky; left: 0`；移动端格子最小 24px，顶部栏换成两行。

- [ ] **Step 3: 运行自动化验证**

Run: `npm test -- --run && npm run build`

Expected: all tests passed；Vite build exit 0。

- [ ] **Step 4: 在浏览器完成可视和交互验收**

验证：

- 桌面端完整显示 30/31 天或可自然横向滚动。
- 宋体正确应用于标题、项目名和日期。
- 标题和项目名称可编辑。
- 新建、搜索、归档、恢复、删除可用。
- 日/周/月切换正确。
- 窄屏项目名固定且无页面级横向溢出。

- [ ] **Step 5: 对照确认稿修正视觉差异并重新验证**

重新运行 `npm test -- --run && npm run build`，并在桌面与移动视口截图检查。

- [ ] **Step 6: 提交**

```bash
git add src
git commit -m "style: match approved project progress design"
```
