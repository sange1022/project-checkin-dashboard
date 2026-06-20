# Firebase 跨设备云同步设计

日期：2026-06-21

## 目标

在不改变现有项目打卡页面主要结构和视觉的前提下，增加 Firebase 匿名登录、Cloud Firestore 跨设备同步与 GitHub Pages 部署能力。

同步采用本地优先模式：

- 所有用户操作先写入现有 `localStorage`，离线时页面完整可用。
- 联网且已连接同步码时，修改自动上传到 Firestore。
- 远端变化实时订阅并合并到本地。
- 同一同步码可在多个设备输入，从而共享全部项目、标题、排序和打卡数据。

## 用户界面

底部说明栏右侧保留现有“导入 / 导出”，在其左侧增加：

- 同步状态点。
- 状态文字。
- “云同步”文字按钮。

常驻状态仅占一小段底部空间，不改变主内容区。

点击“云同步”后弹出小型面板：

- 当前同步码及复制按钮。
- “生成新同步码”按钮。
- 输入已有同步码的输入框。
- “连接”按钮。
- “断开云同步”按钮，仅已连接时显示。

同步码固定为 24 位，只允许字符 `A-Z` 与 `0-9`。使用浏览器密码学随机数生成，不使用 `Math.random()`。

## 同步状态

页面支持以下状态：

- `仅本地`：未配置 Firebase、尚未连接同步码或用户主动断开。
- `连接中`：正在匿名登录或连接指定同步空间。
- `同步中`：本地存在待上传变更，或正在应用远端变更。
- `已同步`：本地与已知远端状态一致。
- `离线`：浏览器离线；本地修改继续保存并标记为待同步。
- `同步失败`：登录、读取、写入或权限校验失败。

状态点采用低饱和度颜色，文字保持小号和低对比度。错误状态允许点击同步入口查看简短错误说明。

## Firebase 初始化

使用 Firebase JavaScript SDK 模块：

- Firebase Authentication：`signInAnonymously`。
- Cloud Firestore：实时监听、事务或批量写入、IndexedDB 本地持久化。

网页配置通过 Vite 环境变量提供：

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

配置值属于 Firebase Web 公共客户端配置，不作为秘密保存。仓库提供 `.env.example`，实际本地 `.env.local` 被忽略。GitHub Pages 构建通过 GitHub Actions Variables 注入同名值。

如果环境变量不完整，应用正常运行并显示“仅本地”，不会白屏。

## Firestore 数据结构

同步空间根文档：

`syncSpaces/{syncCode}`

字段：

- `schemaVersion`
- `createdAt`
- `updatedAt`

子集合：

- `meta/current`：页面标题、当前视图、月份锚点及各字段更新时间。
- `projects/{projectId}`：名称、排序键、创建时间、删除标记及各字段更新时间。
- `checkins/{projectId_dateKey}`：项目 ID、日期、是否完成、更新时间。

每个可独立冲突的字段携带：

- `value`
- `updatedAt`
- `clientId`

`clientId` 在每个浏览器首次使用时随机生成并保存在本地。

项目删除使用墓碑记录，不立即物理删除，避免离线旧设备将已删除项目重新上传。墓碑保留在同步空间中。

## 合并规则

采用逐字段最后修改者生效：

1. 比较 `updatedAt`。
2. 时间较新的值胜出。
3. 时间完全相同则按 `clientId` 字典序稳定决胜，避免设备间反复覆盖。

打卡记录按项目与 ISO 日期独立合并，因此两个设备修改不同日期时不会互相覆盖。

项目顺序使用每个项目的 `order` 字段与独立更新时间。上移或下移后，受影响项目获得新的顺序值与更新时间。

应用远端数据时先合并内存状态，再写入 `localStorage`，避免刷新后回退。

## 时钟与待上传队列

客户端修改使用混合逻辑时间：

- 基础值为 `Date.now()`。
- 新时间戳至少比本地已知最大时间戳大 1。
- 接收到远端时间戳时更新本地最大值。

这样可减少设备时钟轻微不一致导致的错误覆盖。

本地保存：

- 当前合并后的应用数据。
- 字段元数据。
- 待上传变更队列。
- 当前同步码。
- 稳定客户端 ID。

离线修改追加到待上传队列。联网后按记录键合并队列，上传每个键的最新版本，避免重复写入。

## 连接同步码流程

### 生成

1. 完成匿名登录。
2. 生成 24 位高熵同步码。
3. 检查对应根文档是否存在。
4. 若碰撞则重新生成。
5. 创建同步空间并上传当前本地数据。
6. 保存同步码并开始实时订阅。

### 输入已有同步码

1. 将输入转为大写并删除空格。
2. 验证正则 `^[A-Z0-9]{24,}$`；第一版只接受 24 位。
3. 完成匿名登录。
4. 读取精确路径 `syncSpaces/{syncCode}`，不执行列表查询。
5. 若不存在，显示“同步码不存在”。
6. 若存在，读取远端数据并与本地逐项合并。
7. 合并结果写回本地，并上传本地更新项。
8. 开始实时订阅。

连接新同步码会先提示：本机数据将与该同步空间合并。不会静默清空本机数据。

## Authentication 与安全边界

每台设备使用 Firebase 匿名账号。Firestore Rules 要求 `request.auth != null`。

匿名身份不用于区分同步空间成员，因为跨设备输入同步码后必须立即访问同一数据。同步码本身是共享访问凭据：

- 24 位。
- 36 字符字母数字空间，约 124 位熵。
- 禁止使用可猜测短码。
- UI 明确提示不要公开同步码。

安全规则限制：

- 未登录用户无权访问。
- 已登录用户只能按已知文档路径 `get` 和读写子文档。
- 禁止对 `syncSpaces` 根集合执行 `list`，防止枚举同步空间。
- 文档大小、字段名和同步码格式在 Rules 中校验。

重要限制：只要某人获得同步码并匿名登录，就拥有该同步空间的读写权限。这是“持有码即可读写”需求的直接结果。

## Firestore Rules

仓库提供 `firestore.rules`。核心规则：

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }

    function validCode(code) {
      return code.matches('^[A-Z0-9]{24}$');
    }

    match /syncSpaces/{syncCode} {
      allow get: if signedIn() && validCode(syncCode);
      allow list: if false;
      allow create, update: if signedIn()
        && validCode(syncCode)
        && request.resource.data.keys().hasOnly([
          'schemaVersion', 'createdAt', 'updatedAt'
        ]);
      allow delete: if false;

      match /meta/{documentId} {
        allow get, list, create, update: if signedIn() && validCode(syncCode);
        allow delete: if false;
      }

      match /projects/{projectId} {
        allow get, list, create, update: if signedIn()
          && validCode(syncCode)
          && request.resource.data.keys().hasOnly([
            'id', 'name', 'nameUpdatedAt', 'order', 'orderUpdatedAt',
            'createdAt', 'deleted', 'deletedUpdatedAt', 'clientId'
          ]);
        allow delete: if false;
      }

      match /checkins/{checkinId} {
        allow get, list, create, update: if signedIn()
          && validCode(syncCode)
          && request.resource.data.keys().hasOnly([
            'projectId', 'dateKey', 'checked', 'updatedAt', 'clientId'
          ]);
        allow delete: if false;
      }
    }
  }
}
```

实现时将补充字段类型、字符串长度和数值范围校验，并使用 Firebase Emulator 测试允许与拒绝路径。

## GitHub Pages

Vite 配置根据仓库名设置 `base`。仓库增加：

- `.github/workflows/deploy-pages.yml`
- GitHub Pages 官方 Actions 部署流程。
- 构建前注入 Firebase 配置变量。
- SPA 使用单入口静态部署，不依赖服务端路由。

部署需要 GitHub 远端仓库和登录权限。若本地仓库尚无远端，创建仓库属于外部状态变更，将在执行前取得用户授权。

Firebase 项目创建、启用匿名登录、创建 Firestore、发布 Rules 同样属于外部状态变更。执行时使用 Firebase CLI 或 Firebase Console；若要求浏览器登录，将停在登录步骤让用户完成认证。

## 组件与模块

- `firebase/config.ts`：环境变量检查与 SDK 初始化。
- `firebase/auth.ts`：匿名登录。
- `sync/types.ts`：带字段版本信息的同步模型。
- `sync/code.ts`：安全同步码生成与校验。
- `sync/merge.ts`：逐字段确定性合并。
- `sync/queue.ts`：本地待上传队列。
- `sync/firestoreSync.ts`：上传、初次连接与实时订阅。
- `sync/useCloudSync.ts`：React 状态机与应用集成。
- `components/CloudSyncPanel.tsx`：底部入口、状态与面板。
- `firestore.rules`：生产安全规则。
- `firestore.rules.test.ts`：Emulator 规则测试。

## 错误处理

- Firebase 未配置：仅本地。
- 浏览器离线：离线。
- 匿名登录失败：同步失败，本地不受影响。
- 同步码不存在：保留本地数据并提示。
- 权限拒绝：同步失败，不清理本地队列。
- 上传中断：保留待上传队列，指数退避重试。
- Firestore 实时监听断开：切换离线或同步失败，恢复后重新监听。
- 无效远端文档：忽略该文档并记录错误，不覆盖有效本地数据。

## 测试

### 单元测试

- 24 位同步码格式、字符集和随机源。
- 字段合并、相同时间戳决胜。
- 项目删除墓碑。
- 离线队列去重与恢复。
- Firebase 缺少配置时本地模式。
- 同步状态机转换。

### Rules 测试

使用 Firebase Emulator：

- 未登录访问被拒绝。
- 已登录精确 `get` 被允许。
- 根集合 `list` 被拒绝。
- 无效同步码路径被拒绝。
- 非法字段与错误类型被拒绝。
- 合法项目和打卡文档允许写入。

### 两浏览器端到端测试

使用两个独立浏览器上下文：

1. 设备 A 生成同步码并新建项目。
2. 设备 B 输入同步码并看到项目。
3. A 与 B 修改不同日期，双方均收到合并结果。
4. 两端离线，各自修改不同记录。
5. 恢复联网后双方最终状态一致。
6. 同一字段冲突时验证最后修改者生效。
7. 刷新两端后 localStorage 与 Firestore 状态仍一致。

真实 Firebase 测试在开发项目上运行，自动化单元和 Rules 测试使用 Emulator，避免污染生产数据。

## 验收标准

- 现有本地功能、导入导出、排序和视觉均保持。
- 可生成符合规则的 24 位同步码。
- 第二台设备输入同码后能读取并实时同步全部数据。
- 所有修改先本地保存，离线可继续操作。
- 恢复联网后自动合并并上传，无需手动保存。
- 六种同步状态按实际情况显示。
- Firestore Rules 经 Emulator 测试。
- 两个独立浏览器上下文完成真实跨设备同步测试。
- GitHub Pages 部署成功并可访问。

