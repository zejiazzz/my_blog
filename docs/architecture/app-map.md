# App Map

## 目标

本项目是一个个人博客与技能库系统。文章和 Skills 是两个独立内容体系：文章用于时间线写作，Skills 用于沉淀可复用脚手架、架构方案和方法论。

## 技术栈

- Next.js App Router + React + TypeScript
- Tailwind CSS + 全局 CSS variables
- Supabase Postgres + Supabase Auth + RLS

## 路由地图

- `/`：公开文章列表。
- `/posts/[slug]`：公开文章详情。
- `/skills`：公开 Skills 列表。
- `/skills/[slug]`：公开 Skill 详情。
- `/about`：关于页面。
- `/mcp`：MCP 页面。
- `/login`：后台登录。
- `/admin`：文章后台列表。
- `/admin/new`：新建文章。
- `/admin/edit/[id]`：编辑文章。
- `/admin/skills`：Skills 后台列表。
- `/admin/skills/new`：新建 Skill。
- `/admin/skills/edit/[id]`：编辑 Skill。
- `/api/login`：Supabase 邮箱密码登录。
- `/api/logout`：Supabase 登出。

## 数据表

- `posts`：文章体系，使用 `slug` 作为公开 URL 标识。
- `skills`：技能体系，使用 `slug` 作为公开 URL 标识，支持分类、标签、排序和中英文内容。
- `about_page`：关于页单例内容。
- `mcp_page`：MCP 页单例内容。

## 状态与权限

- 公开页面由 Server Component 读取 Supabase。
- 后台页面由 Client Component 使用浏览器 Supabase 会话管理数据。
- `proxy.ts` 保护 `/admin/:path*`。
- RLS 控制匿名用户只能读取已发布文章和 Skills，登录用户可以管理内容。

## 标准命令

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run check-type`
- `npm run lint`
- `npm run verify:knowledge`
