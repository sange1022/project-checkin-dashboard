# Firebase 跨设备云同步 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为现有项目打卡网页增加 Firebase 匿名登录、Firestore 本地优先实时同步、24 位同步码、安全规则与 GitHub Pages 自动部署。

**Architecture:** 保留现有 `localStorage` 作为即时主存储，在其上增加带字段版本的同步元数据和待上传队列。React 同步 Hook 负责认证、连接同步空间、实时监听、确定性逐项合并与状态展示；Firebase 配置缺失或网络不可用时应用继续保持纯本地模式。

**Tech Stack:** React 19、TypeScript、Vite、Firebase Web SDK、Cloud Firestore、Firebase Emulator、Vitest、GitHub Actions、GitHub Pages

---

### Task 1: Firebase 与部署基础配置

**Files:**
- Modify: `package.json`
- Modify: `.gitignore`
- Create: `.env.example`
- Create: `firebase.json`
- Create: `.firebaserc.example`
- Create: `src/firebase/config.ts`
- Create: `src/firebase/config.test.ts`

- [ ] **Step 1: 写 Firebase 配置缺失时的失败测试**

```ts
expect(readFirebaseConfig({})).toEqual({ configured: false })
```

- [ ] **Step 2: 运行测试，确认 `readFirebaseConfig` 不存在**

Run: `npm test -- --run src/firebase/config.test.ts`

Expected: FAIL。

- [ ] **Step 3: 安装 Firebase 与 Rules 测试依赖**

Run: `npm install firebase && npm install -D @firebase/rules-unit-testing firebase-tools`

- [ ] **Step 4: 实现环境变量读取与惰性初始化**

完整配置时返回 Firebase Web 配置；任一必需字段缺失时返回 `{ configured: false }`，不初始化 SDK。

- [ ] **Step 5: 增加环境变量示例和 Firebase Emulator 配置**

`.env.example` 列出六个 `VITE_FIREBASE_*` 变量；`.env.local` 加入忽略；`firebase.json` 配置 Firestore Rules 与 Emulator 端口。

- [ ] **Step 6: 运行测试并提交**

Run: `npm test -- --run src/firebase/config.test.ts`

Expected: PASS。

### Task 2: 同步码、版本时间与逐项合并

**Files:**
- Create: `src/sync/types.ts`
- Create: `src/sync/code.ts`
- Create: `src/sync/code.test.ts`
- Create: `src/sync/clock.ts`
- Create: `src/sync/merge.ts`
- Create: `src/sync/merge.test.ts`

- [ ] **Step 1: 写 24 位同步码测试**

```ts
expect(generateSyncCode()).toMatch(/^[A-Z0-9]{24}$/)
expect(isValidSyncCode('A'.repeat(24))).toBe(true)
expect(isValidSyncCode('abc')).toBe(false)
```

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/sync/code.test.ts`

- [ ] **Step 3: 用 `crypto.getRandomValues` 实现同步码**

采用拒绝采样避免取模偏差，字符集固定为 `ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`。

- [ ] **Step 4: 写逐字段合并与同时间戳决胜测试**

覆盖标题、项目名称、项目顺序、删除墓碑、打卡记录和 `clientId` 字典序决胜。

- [ ] **Step 5: 实现逻辑时钟与确定性合并**

每个字段存 `{ value, updatedAt, clientId }`；时间较新者胜，时间相同取较大 `clientId`。

- [ ] **Step 6: 运行同步领域测试并提交**

Run: `npm test -- --run src/sync`

Expected: PASS。

### Task 3: 本地同步元数据与待上传队列

**Files:**
- Create: `src/sync/localSyncStore.ts`
- Create: `src/sync/localSyncStore.test.ts`
- Modify: `src/storage/localCheckinRepository.ts`
- Modify: `src/domain/types.ts`

- [ ] **Step 1: 写客户端 ID、同步码和队列持久化测试**

验证刷新后读取相同 `clientId`，队列按记录键保留最新变更，断开同步只清除同步码而不删除业务数据。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/sync/localSyncStore.test.ts`

- [ ] **Step 3: 实现版本化同步存储**

使用独立键 `project-checkins:sync`，包含 `clientId`、`syncCode`、逻辑时钟、同步模型和待上传记录。

- [ ] **Step 4: 为现有应用操作产生字段级变更**

标题、项目名称、顺序、删除与打卡切换都通过纯函数更新业务状态和同步元数据。

- [ ] **Step 5: 运行全部本地测试并提交**

Run: `npm test -- --run`

Expected: PASS。

### Task 4: Firestore 适配器与认证

**Files:**
- Create: `src/firebase/auth.ts`
- Create: `src/sync/firestoreSync.ts`
- Create: `src/sync/firestoreSync.test.ts`

- [ ] **Step 1: 写适配器接口测试**

使用内存假实现验证：生成空间会上传当前快照；连接空间会合并初始远端数据；实时事件会触发本地合并；断线写入保留队列。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/sync/firestoreSync.test.ts`

- [ ] **Step 3: 实现匿名登录**

复用已有匿名用户；无用户时调用 `signInAnonymously`。

- [ ] **Step 4: 实现 Firestore 本地持久化、精确路径读取和监听**

使用持久化本地缓存；仅访问 `syncSpaces/{code}` 及其已知子集合，不查询根集合。

- [ ] **Step 5: 实现批量上传和待上传重试**

联网时按记录键上传队列最新值；成功后仅删除对应版本的队列项，避免删除上传期间产生的新变更。

- [ ] **Step 6: 运行测试并提交**

Run: `npm test -- --run src/sync/firestoreSync.test.ts`

Expected: PASS。

### Task 5: React 同步状态机与 UI

**Files:**
- Create: `src/sync/useCloudSync.ts`
- Create: `src/components/CloudSyncPanel.tsx`
- Create: `src/components/CloudSyncPanel.test.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `src/App.test.tsx`

- [ ] **Step 1: 写六种状态和面板交互测试**

验证“仅本地、连接中、同步中、已同步、离线、同步失败”，以及生成、复制、输入连接和断开。

- [ ] **Step 2: 运行测试并确认失败**

Run: `npm test -- --run src/components/CloudSyncPanel.test.tsx`

- [ ] **Step 3: 实现同步 Hook 状态机**

监听 `online/offline`；Firebase 未配置时保持仅本地；连接后自动上传、订阅和合并。

- [ ] **Step 4: 实现底部低调入口**

状态点和文字位于导入/导出左侧；面板使用现有宋体、灰阶和圆角，不改变主网格。

- [ ] **Step 5: 接入现有业务修改**

所有现有修改仍先更新 React 状态和 `localStorage`，随后进入同步队列。

- [ ] **Step 6: 运行组件和全套测试并提交**

Run: `npm test -- --run`

Expected: PASS。

### Task 6: Firestore Rules 与 Emulator 测试

**Files:**
- Create: `firestore.rules`
- Create: `test/firestore.rules.test.ts`
- Modify: `package.json`

- [ ] **Step 1: 写拒绝和允许路径测试**

覆盖未登录拒绝、精确读取允许、根集合 list 拒绝、无效同步码拒绝、非法字段拒绝和合法项目/打卡允许。

- [ ] **Step 2: 运行 Emulator 测试并确认当前规则缺失**

Run: `npm run test:rules`

Expected: FAIL。

- [ ] **Step 3: 实现严格 Rules**

要求 `request.auth != null`、24 位码、字段白名单、类型和长度限制；禁止物理删除与根集合枚举。

- [ ] **Step 4: 运行 Rules 测试并提交**

Run: `npm run test:rules`

Expected: PASS。

### Task 7: GitHub Pages 工作流

**Files:**
- Modify: `vite.config.ts`
- Create: `.github/workflows/deploy-pages.yml`
- Create: `README.md`

- [ ] **Step 1: 配置动态 Pages base**

开发环境使用 `/`；Actions 中使用 `/${GITHUB_REPOSITORY#*/}/`。

- [ ] **Step 2: 创建官方 Pages Actions 工作流**

工作流执行 `npm ci`、测试、构建、上传 `dist`、部署 Pages，并从 Repository Variables 注入 Firebase Web 配置。

- [ ] **Step 3: 记录 Firebase 与 GitHub 配置步骤**

README 包含本地运行、Firebase 项目初始化、Rules 发布、GitHub Variables 和 Pages 启用。

- [ ] **Step 4: 运行生产构建并提交**

Run: `npm test -- --run && npm run build`

Expected: PASS。

### Task 8: 真实 Firebase、双浏览器和部署验证

**Files:**
- Modify: `.firebaserc`（本地项目 ID；若适合提交）
- No source changes unless verification exposes defects.

- [ ] **Step 1: 创建 Firebase 项目并启用服务**

通过 Firebase CLI/Console 创建项目、启用匿名登录、创建 Native Firestore、发布 Rules，并写入 `.env.local`。

- [ ] **Step 2: 用两个独立浏览器上下文验证真实同步**

执行生成码、第二设备连接、双向修改、离线修改、恢复合并、冲突决胜与刷新持久化。

- [ ] **Step 3: 创建或连接 GitHub 仓库**

若无远端，使用 GitHub CLI 创建仓库并推送；设置六个 Repository Variables；启用 Pages Actions。

- [ ] **Step 4: 部署并验证公开 URL**

检查 Actions 成功、页面加载、Firebase 配置生效、移动视口布局和控制台无相关错误。

- [ ] **Step 5: 最终验证**

Run: `npm test -- --run && npm run test:rules && npm run build`

Expected: 全部通过。

