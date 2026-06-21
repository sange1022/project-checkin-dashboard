# 项目阶段进度视图 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 增加独立维护的项目阶段看板，用固定 15 阶段和百分比展示横向进度线。

**Architecture:** 固定阶段定义放在纯领域模块，项目阶段状态保存在 `AppState.stageProjects`。`ProjectStageBoard` 负责新增、原地改名、删除和阶段点击，应用层只更新状态。

**Tech Stack:** React、TypeScript、Vitest、Testing Library、CSS

---

### Task 1: 阶段定义和旧数据补全

**Files:**
- Create: `src/domain/projectStages.ts`
- Create: `src/domain/projectStages.test.ts`
- Modify: `src/domain/types.ts`
- Modify: `src/domain/randomPrompts.ts`

- [ ] 写失败测试：15 个阶段顺序和百分比准确，新项目默认阶段索引为 0。
- [ ] 写失败测试：旧状态补 `stageProjects: []`。
- [ ] 实现固定阶段和 `StageProject` 类型。
- [ ] 运行领域及仓储测试。

### Task 2: 阶段看板交互

**Files:**
- Create: `src/components/ProjectStageBoard.tsx`
- Create: `src/components/ProjectStageBoard.test.tsx`
- Modify: `src/App.tsx`

- [ ] 写失败测试：新增项目默认 10%，点击阶段更新为对应百分比。
- [ ] 写失败测试：项目名称可修改、项目可删除。
- [ ] 实现折叠区和状态回调。
- [ ] 将组件放在现有最下方折叠区之后。

### Task 3: 横向进度视觉和预览

**Files:**
- Modify: `src/styles.css`
- Modify: `src/storage/dataTransfer.test.ts`

- [ ] 实现固定项目列、横向滚动、粗进度线、阶段节点和行末百分比。
- [ ] 测试 JSON 备份保留 `stageProjects`。
- [ ] 运行 `npm test -- --run && npm run build`。
- [ ] 提交本地预览版本，暂不推送 GitHub。
