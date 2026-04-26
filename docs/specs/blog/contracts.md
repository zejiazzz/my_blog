# Contracts

## posts

- `title`、`slug`、`content` 必填。
- `slug` 唯一。
- `published = true` 才能被匿名用户读取。
- 后台 authenticated 用户可以读取和管理全部文章。

## skills

- `title`、`slug`、`content` 必填。
- `slug` 唯一。
- `title_en`、`summary_en`、`content_en` 可为空字符串。
- `tags` 是字符串数组，默认空数组。
- `sort_order` 越小越靠前。
- `published = true` 才能被匿名用户读取。
- 后台 authenticated 用户可以读取和管理全部 Skills。

## 路由契约

- `/posts/[slug]` 使用 posts.slug。
- `/skills/[slug]` 使用 skills.slug。
- `/admin/skills/edit/[id]` 使用 skills.id。

## 脚本契约

- `check-type + lint + build` 是最小质量门槛。
- `verify:knowledge` 检查文档、路由、数据库脚本和 package scripts 是否一致。
