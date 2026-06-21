# 打卡网格悬停定位 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为每日打卡网格增加轻量的行列悬停定位。

**Architecture:** `ProjectGrid` 保存一个临时 `{ projectId, dateKey }` 状态。渲染日期表头、项目名称和格子时派生对应 CSS 类，鼠标离开网格后清除。

**Tech Stack:** React、TypeScript、Vitest、Testing Library、CSS

---

### Task 1: 悬停状态行为

**Files:**
- Modify: `src/components/ProjectGrid.tsx`
- Modify: `src/components/ProjectGrid.test.tsx`

- [ ] 写失败测试：悬停格子后当前格、同行格、同列表头和项目名称获得对应类。
- [ ] 写失败测试：鼠标离开后类全部清除，周视图不启用。
- [ ] 运行单组件测试并确认失败。
- [ ] 使用 `useState` 实现临时悬停坐标和派生类。
- [ ] 运行组件测试确认通过。

### Task 2: 极浅高亮视觉和发布

**Files:**
- Modify: `src/styles.css`

- [ ] 添加极浅行列底色、当前格描边和文字加深。
- [ ] 确保 `.checked` 黑色状态优先。
- [ ] 在 hover-capable 媒体查询内启用视觉效果。
- [ ] 运行 `npm test -- --run && npm run build`。
- [ ] 更新本地预览并推送 GitHub Pages。
