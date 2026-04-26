# Frontend Standard Exceptions

## Next.js 替代 Vite

- 原因：项目需要 App Router、Server Component、Route Handler 和 Proxy。
- 影响：目录不使用 `src/pages` 和 `src/router`，而使用 Next.js `app/` 文件路由。
- 类型：长期例外。
- 退出条件：除非项目改为纯 SPA，否则不迁移到 Vite。

## Tailwind 与全局 CSS variables 替代 Less / CSS Modules

- 原因：现有 UI 已基于 Tailwind、全局设计 token 和少量组件类名。
- 影响：组件样式不按 `Component.module.less` 组织。
- 类型：长期例外。
- 退出条件：当项目需要多人维护的大规模组件库时，再评估 CSS Modules。

## 不引入 Ant Design

- 原因：当前后台是轻量内容管理，不需要完整企业级组件库。
- 影响：表单、表格和按钮由本地样式实现。
- 类型：长期例外。
- 退出条件：后台复杂度明显提升，出现大量表格、筛选、批量操作和弹窗编排。

## 保留 npm

- 原因：项目已有 `package-lock.json`。
- 影响：不使用统一标准默认推荐的 pnpm。
- 类型：长期例外。
- 退出条件：团队统一切换包管理器并完成锁文件迁移。
