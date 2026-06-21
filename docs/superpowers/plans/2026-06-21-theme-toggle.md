# 日夜主题切换 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 增加跟随系统且可持久化的白天/夜晚主题切换。

**Architecture:** `AppState.theme` 保存用户偏好，应用层派生实际主题并设置根元素 `data-theme`。CSS 将现有固定颜色收敛为主题变量，组件结构不变。

**Tech Stack:** React、TypeScript、Vitest、Testing Library、CSS

---

### Task 1: 主题状态和系统偏好

**Files:**
- Modify: `src/domain/types.ts`
- Modify: `src/domain/randomPrompts.ts`
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`

- [ ] 写失败测试：旧状态补 `system`，切换按钮改变 `data-theme` 并保存偏好。
- [ ] 实现 `ThemePreference` 与实际主题派生。
- [ ] 添加右上角太阳/月亮按钮。
- [ ] 运行应用测试。

### Task 2: 主题变量与完整夜间适配

**Files:**
- Modify: `src/styles.css`
- Modify: `src/storage/dataTransfer.test.ts`

- [ ] 将背景、画布、文字、次要文字、边框、格子、悬停、进度线和输入框颜色改为 CSS 变量。
- [ ] 添加 `data-theme="dark"` 变量覆盖。
- [ ] 添加 150ms 颜色过渡和减少动态处理。
- [ ] 测试 JSON 备份保留主题。
- [ ] 运行 `npm test -- --run && npm run build`。
- [ ] 提交本地预览版本，暂不推送。
