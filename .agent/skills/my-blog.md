---
name: my-blog
description: Next.js 16 + Supabase 博客与 Skills 知识库项目架构和开发流程指南
trigger: 当用户需要扩展博客功能、维护 Skills 模块、添加后台页面、调整 Supabase 表结构或理解项目架构时使用
---

# My Blog 项目架构指南

## 项目概述

这是一个基于 Next.js 16 App Router、Supabase、TypeScript 和 Tailwind CSS 的个人内容系统。项目把文章和 Skills 拆成两个独立内容体系：

- `posts`：时间线文章。
- `skills`：可复用脚手架、方法论和架构蓝图。

当前范围不包含 OpenAI、RSS 或定时生成任务，内容由后台人工维护。

## 技术栈

| 层级 | 技术 | 用途 |
| --- | --- | --- |
| 框架 | Next.js 16 App Router | 页面、Route Handler、Proxy |
| 语言 | TypeScript | 类型安全 |
| 数据库 | Supabase Postgres | 内容存储 |
| 认证 | Supabase Auth | 后台登录 |
| 样式 | Tailwind CSS + CSS variables | 主题和界面样式 |
| 部署 | GitHub + Vercel | 推送触发部署 |

## 核心目录

- `app/`：Next.js App Router 页面和 API。
- `components/`：复用 UI 和表单组件。
- `lib/`：Supabase client、i18n、类型。
- `supabase/setup.sql`：数据库表结构、RLS、seed。
- `docs/architecture/`：仓库基线和标准例外。
- `docs/specs/blog/`：博客与 Skills 领域规格。
- `tests/harness/`：knowledge/contracts/journeys 验证层入口。

## 关键路由

- `/`：文章列表。
- `/posts/[slug]`：文章详情。
- `/skills`：Skills 列表。
- `/skills/[slug]`：Skill 详情。
- `/login`：后台登录。
- `/admin`：文章后台。
- `/admin/skills`：Skills 后台。
- `/admin/skills/new`：新建 Skill。
- `/admin/skills/edit/[id]`：编辑 Skill。

## 数据模型

### posts

文章表，字段包括 `title`、`slug`、`content`、`excerpt`、`published`、`created_at`、`updated_at`。

### skills

Skills 表，字段包括 `title`、`title_en`、`slug`、`summary`、`summary_en`、`content`、`content_en`、`category`、`tags`、`published`、`sort_order`、`created_at`、`updated_at`。

Skills 不复用 `posts`，也不保留旧的单页 Skills 表。

## 认证与权限

- `proxy.ts` 保护 `/admin/:path*`。
- 匿名用户只能读取已发布的文章和 Skills。
- authenticated 用户可以管理文章、Skills、About 和 MCP 内容。
- 目前没有细分管理员角色；如果变成多人后台，需要新增角色模型。

## 标准命令

- `npm run dev`
- `npm run check-type`
- `npm run lint`
- `npm run verify:knowledge`
- `npm run build`

## 开发约束

- 新增内容体系优先建独立表，不要塞进文章表。
- 更新代码时同步更新 `docs/specs/blog/*` 和 `docs/architecture/app-map.md`。
- 数据库变更先改 `supabase/setup.sql`，再执行 SQL 到 Supabase。
- 推送前至少运行 `check-type`、`lint`、`verify:knowledge` 和 `build`。
