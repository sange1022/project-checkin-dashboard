# 项目打卡计数 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在每日视图项目名前显示所选月份打卡数与月天数，并在行末显示累计打卡数。

**Architecture:** 计数直接从现有项目打卡日期数组派生，不新增持久化字段。`ProjectGrid` 负责按全部日期和所选月份计算数字，CSS 只增加两个无装饰的数字位置。

**Tech Stack:** React、TypeScript、Vitest、Testing Library、CSS

---

### Task 1: 添加计数行为测试

**Files:**
- Create: `src/components/ProjectGrid.test.tsx`

- [ ] **Step 1: 写累计数与月度合计测试**

```tsx
test('shows lifetime count before the name and selected-month count at row end', () => {
  renderGrid({
    view: 'day',
    anchor: new Date(2026, 5, 20),
    checkins: { p1: ['2026-05-31', '2026-06-01', '2026-06-20'] },
  })
  expect(screen.getByLabelText('官网重构累计打卡')).toHaveTextContent('3')
  expect(screen.getByLabelText('官网重构本月打卡')).toHaveTextContent('2/30')
})
```

- [ ] **Step 2: 写周/月隐藏月度合计测试**

```tsx
test.each(['week', 'month'] as const)('hides monthly count in %s view', (view) => {
  renderGrid({ view })
  expect(screen.queryByLabelText('官网重构本月打卡')).not.toBeInTheDocument()
})
```

- [ ] **Step 3: 运行测试并确认失败**

Run: `npm test -- --run src/components/ProjectGrid.test.tsx`

Expected: FAIL，找不到累计和本月计数元素。

### Task 2: 实现计数和极简布局

**Files:**
- Modify: `src/components/ProjectGrid.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: 计算累计和所选月份计数**

```ts
const lifetimeCount = checked.size
const monthCount = days.filter(({ key }) => checked.has(key)).length
```

- [ ] **Step 2: 在项目名前渲染累计数字**

```tsx
<span className="lifetime-count" aria-label={`${project.name}累计打卡`}>
  {lifetimeCount}
</span>
```

- [ ] **Step 3: 在每日视图操作区前渲染月度数字**

```tsx
{view === 'day' && (
  <span className="month-count" aria-label={`${project.name}本月打卡`}>
    {monthCount}/{days.length}
  </span>
)}
```

- [ ] **Step 4: 添加无边框、无背景样式**

累计数字和月度合计使用 `ui-monospace`，小号深灰字；扩宽行尾列以容纳 `31/31` 和现有操作按钮。

- [ ] **Step 5: 运行测试和构建**

Run: `npm test -- --run && npm run build`

Expected: 全部测试通过，构建退出码为 0。

- [ ] **Step 6: 提交并发布**

```bash
git add src/components/ProjectGrid.tsx src/components/ProjectGrid.test.tsx src/styles.css
git commit -m "feat: show lifetime and monthly check-in counts"
git push origin HEAD:main
```
