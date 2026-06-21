# 每日随机内容 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在时间切换器下增加健身、建模、建脑三个每日一次随机入口，并提供本地候选管理和历史记录。

**Architecture:** 随机候选和结果进入现有 `AppState`，由版本化本地仓储负责旧数据补全。随机规则放在纯函数模块中，动画状态仅保留在 `DailyRandomPanel` 内，最终结果通过回调写入应用状态。

**Tech Stack:** React、TypeScript、Vitest、Testing Library、CSS

---

### Task 1: 数据结构、默认候选和旧数据补全

**Files:**
- Modify: `src/domain/types.ts`
- Create: `src/domain/randomPrompts.ts`
- Create: `src/domain/randomPrompts.test.ts`
- Modify: `src/storage/localCheckinRepository.ts`
- Modify: `src/storage/localCheckinRepository.test.ts`

- [ ] 写失败测试：默认三类候选、同日已有结果不能再次抽取、历史结果保存名称快照。
- [ ] 运行 `npm test -- --run src/domain/randomPrompts.test.ts src/storage/localCheckinRepository.test.ts` 确认失败。
- [ ] 添加 `RandomCategory`、`RandomPromptItem`、`DailyRandomResult` 类型和默认数据。
- [ ] 增加旧状态规范化函数，缺失随机字段时补默认值，不修改项目和打卡数据。
- [ ] 运行测试确认通过。

### Task 2: 三列随机入口和 2 秒动画

**Files:**
- Create: `src/components/DailyRandomPanel.tsx`
- Create: `src/components/DailyRandomPanel.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] 写失败测试：未抽取显示“点击随机”，2 秒后保存固定结果，同分类当天锁定。
- [ ] 使用 fake timers 验证动画结束前不保存、结束时只保存一次。
- [ ] 实现三个独立按钮和局部动画状态，避免整个页面频繁重渲染。
- [ ] 将面板放在顶部栏和工作区之间，视觉与现有白色开放布局一致。
- [ ] 运行组件及应用测试。

### Task 3: 候选管理和随机记录

**Files:**
- Create: `src/components/RandomPromptManager.tsx`
- Create: `src/components/RandomHistory.tsx`
- Create: `src/components/RandomPromptManager.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] 写失败测试：添加候选、原地修改、删除候选、禁止删除最后一项。
- [ ] 实现最下方原生 `details` 折叠区“管理随机内容”。
- [ ] 实现“随机记录”，按日期倒序显示三类结果。
- [ ] 测试历史名称不因候选改名而变化。

### Task 4: 导入导出、全量验证和本地预览

**Files:**
- Modify: `src/storage/dataTransfer.test.ts`
- Modify: `src/App.test.tsx`

- [ ] 测试 JSON 导入导出保留随机候选和历史。
- [ ] 运行 `npm test -- --run && npm run build`。
- [ ] 启动本地开发服务器，检查桌面和窄屏布局、2 秒动画、当天锁定、编辑和折叠历史。
- [ ] 只提交本地预览版本，不推送 GitHub，等待用户确认。
