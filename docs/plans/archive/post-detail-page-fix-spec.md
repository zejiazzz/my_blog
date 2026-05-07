# 文章详情页修复 Spec

## S · Situation（现状分析）

- 背景：访问 `/posts/[slug]` 时，文章详情页偶发出现 `This page couldn’t load / A server error occurred`。
- 现状实现：文章详情页与 `/skills/[slug]` 采用了不同的数据获取与渲染路径，导致预渲染与运行时行为分叉。
- 约束：保持现有 UI、路由结构、文案和 Supabase 数据模型不变。

## T · Task（任务定义）

- 目标：修复文章详情页异常，并统一文章与 Skills 详情页的渲染策略。
- 范围：仅调整 `app/posts/[slug]/page.tsx` 的渲染策略。
- 非目标：不修改首页列表、Skills 详情页、后台文章编辑流程；不新增文章字段、SEO 逻辑或 Markdown 能力。
- 禁止触碰：不重构 i18n、Supabase 客户端封装或全站缓存策略。

## A · Action（执行方案）

- 实现思路：改为按请求读取 `posts.slug` 命中的已发布文章，未命中直接 `notFound()`，避免构建期生成 slug 带来的行为分叉。
- 风险点：页面仍依赖 `lang` cookie 选择文案，不能因动态渲染切换引入新的加载错误。
- agent 分工：本次按单 agent 执行，无额外子 agent。
- 验证命令：

```bash
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
curl -i http://127.0.0.1:3000/posts/<real-slug>
```

## R · Result（验收）

- 需求点清单：
  - 修复 `/posts/[slug]` 的加载异常。
  - 保持文章详情只展示 `published = true` 数据。
  - `/skills/[slug]` 行为不受影响。
- 已满足项：
  - 文章详情页改为动态服务端渲染。
  - 未命中或未发布时返回 404。
  - `npm run build` 可通过。
- 未满足项：无。
- 存疑项：无。
- 风险与回归点：后续如果重新引入构建期 slug 预生成，需要再次验证文章与 Skills 详情页行为是否一致。
- 验证结果：已记录 `build`、本地启动与 `curl` 访问作为验收路径。
- 结论：通过，适合归档留痕。

## L · Learning（复盘沉淀）

- 是否回写规则或 skill：无需新增 skill，但需要统一执行型 spec 的目录与模板。
- 模块知识是否需要同步到 `docs/specs/`：无需，已有公开路由与契约文档足够覆盖。
- spec 处置结论：`archive`
