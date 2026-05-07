# 文章详情页修复 Spec

## 目标

- 修复访问 `/posts/[slug]` 时偶发出现的 `This page couldn’t load / A server error occurred`。
- 让文章详情页与 `/skills/[slug]` 采用一致的数据获取与渲染策略，降低运行时分叉。

## 范围

- 仅调整文章详情页 `app/posts/[slug]/page.tsx` 的渲染策略。
- 保持现有 UI、路由结构、文案和 Supabase 数据模型不变。

## 非目标

- 不改首页列表、Skills 详情页、后台文章编辑流程。
- 不重构 i18n、Supabase 客户端封装或全站缓存策略。
- 不新增新的文章字段、SEO 逻辑或 Markdown 渲染能力。

## 入口与流程

1. 用户从首页点击文章卡片，或直接访问 `/posts/[slug]`。
2. 服务端按请求读取 `posts` 表中 `slug` 命中的已发布文章。
3. 命中数据时返回文章详情页；未命中时返回 404。

## 接口契约

- 路由参数：`slug` 必须来自 `posts.slug`。
- 数据约束：仅展示 `published = true` 的文章。
- 返回行为：
  - 存在且已发布：返回 200 并渲染文章。
  - 不存在或未发布：调用 `notFound()` 返回 404。

## 状态约束

- 文章详情页必须使用动态服务端渲染，不依赖构建期静态参数生成。
- 页面渲染仍依赖 `lang` cookie 选择文案，但不能因为预渲染链路差异导致页面加载失败。

## 异常分支

- Supabase 查询未命中：返回 404。
- 构建期或运行时不再额外发起文章 slug 预生成查询，避免文章页与 Skills 页出现不同的渲染行为。
- 如果外部数据源异常，问题应收敛在文章查询本身，而不是静态参数生成阶段。

## 验收标准

- `npm run build` 通过。
- `npm run start` 后，直接访问真实文章 slug 能正常返回 200 并展示标题与正文。
- 从首页点击文章卡片可以进入详情页，不出现 `This page couldn’t load`。
- `/skills/[slug]` 行为不受影响。

## 验证命令

```bash
npm run build
npm run start -- --hostname 127.0.0.1 --port 3000
curl -i http://127.0.0.1:3000/posts/<real-slug>
```
